import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getTokenData } from "../../utils/Token";

export async function GET(req: NextRequest) {
  const userToken = req.cookies.get("token")?.value;
  if (!userToken) {
    return NextResponse.json(new ApiError(402, "You are already logged out!"), {
      status: 402,
    });
  }

  try {
    // 1. Get current cart from cookie
    const cartToken = req.cookies.get("cartToken")?.value;
    let cartData = null;
    if (cartToken) {
      try {
        const decodedCart: any = getTokenData(cartToken);
        // Clean up exp/iat to avoid saving them
        if (decodedCart) {
          cartData = { ...decodedCart };
          delete cartData.exp;
          delete cartData.iat;
        }
      } catch (e) {
        console.error("Error parsing cart token on logout:", e);
      }
    }

    // 2. Identify user and save cart to DB
    try {
      const decodedUser: any = jwt.verify(userToken, process.env.JWT_SECRET_TOKEN!);
      if (decodedUser && decodedUser.id && cartData) {
        await prisma.user.update({
          where: { id: decodedUser.id },
          data: { cart: cartData }
        });
      }
    } catch (authError) {
      console.error("Auth error on logout cart sync:", authError);
    }

    const res = NextResponse.json(
      new ApiResponse(200, "", "Logout successfully")
    );

    // 3. Clear both cookies
    res.cookies.set("token", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    res.cookies.set("cartToken", "", {
      httpOnly: false, // Cart token is usually accessible to client if needed
      maxAge: 0,
      path: "/",
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message));
  }
}
