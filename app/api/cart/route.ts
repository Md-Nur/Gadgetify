import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getTokenData, default as generateToken } from "../utils/Token";

export async function GET(req: NextRequest) {
  const cartToken = req.cookies.get("cartToken")?.value;
  if (!cartToken) {
    // If no cart cookie, check if user is logged in and has a saved cart in DB
    const userToken = req.cookies.get("token")?.value;
    if (userToken) {
      try {
        const decodedUser: any = jwt.verify(userToken, process.env.JWT_SECRET_TOKEN!);
        if (decodedUser && decodedUser.id) {
          const user = await prisma.user.findUnique({
            where: { id: decodedUser.id },
            select: { cart: true }
          });

          if (user && user.cart) {
            const newToken = generateToken(user.cart);
            const res = NextResponse.json(new ApiResponse(200, user.cart, "Cart loaded from profile"), { status: 200 });
            res.cookies.set("cartToken", newToken, {
              httpOnly: false,
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
            });
            return res;
          }
        }
      } catch (e) {
        console.error("Cart DB fallback error:", e);
      }
    }
    return NextResponse.json(new ApiError(402, "Cart is Empty"), { status: 201 });
  }

  let data: any;
  try {
    data = getTokenData(cartToken);
  } catch (error: any) {
    return NextResponse.json(new ApiError(403, error.message), { status: 403 });
  }

  return NextResponse.json(new ApiResponse(200, data), { status: 200 });
}
