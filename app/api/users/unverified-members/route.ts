import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";

export async function GET(req: NextRequest) {
  let data: any[];
  try {
    data = await prisma.user
      .findMany
      // {
      // where: {
      //   isVerified: false,
      // },
      // }
      ();
    if (data.length == 0)
      return NextResponse.json(new ApiError(404, "No user found", data), {
        status: 404,
      });

    return NextResponse.json(new ApiResponse(200, data), {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(404, error.message), { status: 404 });
  }
}
