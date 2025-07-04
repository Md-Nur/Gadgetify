import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

export async function GET(req: NextRequest) {
  const data = req.cookies.get("token")?.value;
  if (!data) {
    return NextResponse.json(new ApiError(420, "You are already logged out!"), {
      status: 420,
    });
  }
  try {
    const res = NextResponse.json(
      new ApiResponse(200, "", "Logout successfully")
    );

    res.cookies.set("token", "", {
      httpOnly: true,
    });
    return res;
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message));
  }
}
