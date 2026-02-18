import { NextRequest, NextResponse } from "next/server";
import ApiError from "../../utils/ApiError";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    new ApiError(501, "Admin features are not implemented in this schema"),
    { status: 501 }
  );
}
