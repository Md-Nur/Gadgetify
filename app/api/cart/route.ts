import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/app/api/utils/ApiError.js";
import ApiResponse from "@/app/api/utils/ApiResponse.js";
import generateToken, { getTokenData } from "@/app/api/utils/Token.js";

export async function GET(req: NextRequest) {
  let cartTokenData: any = {};
  try {
    cartTokenData = getTokenData(req.cookies.get("cartToken")?.value);
  } catch (error: any) {
    return NextResponse.json(new ApiError(402, error.message, error), {
      status: 402,
    });
  }
  return NextResponse.json(new ApiResponse(200, cartTokenData), {
    status: 200,
  });
}
