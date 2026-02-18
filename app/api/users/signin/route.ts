import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import generateToken, { getTokenData } from "@/app/api/utils/Token";
import uploadOnImgBB from "../../utils/imgbb";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().startsWith("01").length(11),
  password: z.string().min(6),
  address: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const body: any = {
      name: data.get("name"),
      email: data.get("email") || undefined,
      phone: data.get("phone"),
      password: data.get("password"),
      address: data.get("address"),
    };

    if (!body.name || !body.phone || !body.password || !body.address) {
      return NextResponse.json(
        new ApiError(400, "Name, phone, password and address are required"),
        { status: 400 }
      );
    }

    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      const errorMessages = validation.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

      return NextResponse.json(
        new ApiError(400, `Invalid input data: ${errorMessages}`, validation.error.issues),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        phone: validation.data.phone,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        new ApiError(400, "User already exists with this phone number"),
        { status: 400 }
      );
    }

    // Check if this is the first user
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(validation.data.password, salt);

    // Handle image upload
    let imageUrl: string | undefined = undefined;

    // Check if images is provided as a URL string
    const imageString = data.get("images");
    if (typeof imageString === 'string' && imageString.startsWith('http')) {
      imageUrl = imageString;
    } else {
      const imageFile = data.get("images") as File | null;
      if (imageFile && imageFile.size > 0) {
        try {
          const arrayBuffer = await imageFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const uploadedUrl = await uploadOnImgBB(buffer);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          }
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      }
    }

    // Merge Cart Logic
    const guestCartToken = req.cookies.get("cartToken")?.value;
    let finalCart: any = null;

    if (guestCartToken) {
      try {
        const guestCart = getTokenData(guestCartToken);
        const { mergeCarts } = await import("../../utils/cartRegistry");
        finalCart = mergeCarts(null, guestCart); // Merge guest cart with an empty new user cart
      } catch (e) {
        console.error("Cart merge error during signin:", e);
      }
    }

    const newUser = await prisma.user.create({
      data: {
        name: validation.data.name,
        email: validation.data.email || undefined,
        phone: validation.data.phone,
        password: hashedPassword,
        address: validation.data.address,
        images: imageUrl,
        isAdmin: isFirstUser, // First user becomes admin
        cart: finalCart, // Add the merged cart data
      },
    });

    if (!newUser) {
      return NextResponse.json(new ApiError(400, "User could not be created"), {
        status: 400,
      });
    }

    const tokenData = {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      address: newUser.address,
      isAdmin: newUser.isAdmin,
    };
    const token = generateToken(tokenData);

    const res = NextResponse.json(
      new ApiResponse(
        201,
        {
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          address: newUser.address,
          isAdmin: newUser.isAdmin,
        },
        isFirstUser
          ? "Admin and User registration successful"
          : "User registration successful"
      ),
      { status: 201 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    if (finalCart) {
      const cToken = generateToken(finalCart);
      res.cookies.set("cartToken", cToken, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return res;
  } catch (e: any) {
    return NextResponse.json(new ApiError(500, e.message), { status: 500 });
  }
}
