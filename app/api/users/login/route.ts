import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import bcryptjs from "bcryptjs";
import generateToken, { getTokenData } from "@/app/api/utils/Token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier || ""); // Can be phone or email
    const password = String(body.password || "");

    if (!identifier || !password) {
      return NextResponse.json(new ApiError(400, "Phone/Email and password are required"), { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { email: identifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        new ApiError(400, "User not found"),
        { status: 400 }
      );
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        new ApiError(401, "Invalid password"),
        { status: 401 }
      );
    }

    // Generate JWT
    const tokenData = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      isAdmin: user.isAdmin,
    };

    const token = generateToken(tokenData);

    // Merge Cart Logic
    const guestCartToken = req.cookies.get("cartToken")?.value;
    let finalCart = user.cart; // Saved in DB

    if (guestCartToken) {
      try {
        const guestCart = getTokenData(guestCartToken);
        const { mergeCarts } = await import("../../utils/cartRegistry");
        finalCart = mergeCarts(finalCart, guestCart);

        // Save merged cart back to DB
        await prisma.user.update({
          where: { id: user.id },
          data: { cart: finalCart as any }
        });
      } catch (e) {
        console.error("Cart merge error during login:", e);
      }
    }

    const res = NextResponse.json(
      new ApiResponse(200, tokenData, "Login Successful"),
      { status: 200 }
    );

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Set merged cart token
    if (finalCart) {
      const cartToken = generateToken(finalCart);
      res.cookies.set("cartToken", cartToken, {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return res;
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
