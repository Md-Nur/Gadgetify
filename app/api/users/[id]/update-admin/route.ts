import { NextRequest, NextResponse } from "next/server";
import ApiError from "../../../utils/ApiError";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    new ApiError(501, "Admin features are not implemented in this schema"),
    { status: 501 }
  );
}
