import prisma from "@/prisma/client";
import bcryptjs from "bcryptjs";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { NextRequest, NextResponse } from "next/server";
import { fileToUrl } from "../../utils/files.js";
import { userSchema } from "../route";
import generateToken from "@/app/api/utils/GenerateToken.js";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: any = data.get("images");

    let user = await prisma.user.findFirst({
      where: {
        phone: String(data.get("phone") || ""),
      },
    });
    if (user) {
      return NextResponse.json(
        new ApiError(400, "User already exist with this phone number"),
        { status: 400 }
      );
    }
    user = await prisma.user.findFirst({
      where: {
        rollNo: String(data.get("rollNo") || ""),
      },
    });
    if (user) {
      return NextResponse.json(
        new ApiError(400, "User already exist with this Roll number"),
        { status: 400 }
      );
    }

    let image: string = "";
    if (file.size > 1)
      try {
        image = await fileToUrl(file, "users");
      } catch (error: any) {
        return NextResponse.json(
          new ApiError(420, error.message || "Upload avatar failed")
        );
      }
    let body: any = {
      fullname: data.get("fullname"),
      rollNo: data.get("rollNo") || "",
      session: data.get("session"),
      year: data.get("year") || "",
      phone: data.get("phone"),
      email: data.get("email") || "",
      interests: data.get("interests") || "",
      password: data.get("password") || "",
      images: image,
    };

    if (!body.phone || !body.password)
      return NextResponse.json(
        new ApiError(404, "Phone number and password is required"),
        { status: 404 }
      );
    else if (body.rollNo.length !== 10) {
      return NextResponse.json(
        new ApiError(402, "Roll Number must have 10 digits"),
        { status: 402 }
      );
    } else if (body.phone.length !== 11) {
      return NextResponse.json(
        new ApiError(402, "Phone number must be 11 digits"),
        { status: 402 }
      );
    } else if (body.phone[0] !== "0" || body.phone[1] !== "1") {
      return NextResponse.json(
        new ApiError(402, "Phone number must be start with 01"),
        { status: 402 }
      );
    }
    const validatedData: any = userSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        new ApiError(400, "Invalid type", validatedData.error),
        {
          status: 400,
        }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    validatedData.data.password = await bcryptjs.hash(
      validatedData.data.password,
      salt
    );

    let newUser = await prisma.user.create({
      data: validatedData.data,
    });

    if (!newUser)
      return NextResponse.json(new ApiError(400, "User did not created!"), {
        status: 400,
      });

    if (newUser.id === 1) {
      try {
        newUser = await prisma.user.update({
          where: { id: 1 },
          data: { isAdmin: true },
        });
      } catch (error: any) {
        return NextResponse.json(new ApiError(500, error.message, error));
      }
    }
    //create token data
    const tokenData = {
      id: newUser.id,
      images: newUser.images,
      isAdmin: newUser.isAdmin,
    };
    const token = generateToken(tokenData);
    // password checking
    const res = NextResponse.json(
      new ApiResponse(201, newUser, "User created successfully"),
      { status: 201 }
    );
    res.cookies.set("token", token, {
      httpOnly: true,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json(new ApiError(500, e.message), { status: 500 });
  }
}
