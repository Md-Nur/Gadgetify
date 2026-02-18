import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });
    return NextResponse.json(new ApiResponse(200, data), {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
