import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";

export async function GET(req: NextRequest) {
  const data = req.cookies.get("token")?.value || "";
  if (!data) {
    return NextResponse.json(new ApiError(404), { status: 420 });
  }
  let decodedData: any;
  try {
    decodedData = jwt.verify(data, process.env.JWT_SECRET_TOKEN!);
  } catch (error: any) {
    return NextResponse.json(new ApiError(450, error.message), { status: 425 });
  }
  return NextResponse.json(new ApiResponse(200, decodedData), { status: 200 });
}
