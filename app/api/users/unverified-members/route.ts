import { NextRequest, NextResponse } from "next/server";
import ApiError from "../../utils/ApiError";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    new ApiError(501, "Verification features are not implemented in this schema"),
    { status: 501 }
  );
}
