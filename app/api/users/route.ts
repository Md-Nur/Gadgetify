import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { z } from "zod";

export const userSchema = z.object({
  // id: z.number(),
  fullname: z.string(),
  rollNo: z.string().length(10),
  session: z.string(),
  year: z.string(),
  phone: z.string().startsWith("01").length(11),
  email: z.string(),
  interests: z.string(),
  password: z.string(),
  images: z.string(),
});

export async function GET(req: NextRequest) {
  let data;
  try {
    data = await prisma.user.findMany();
    return NextResponse.json(new ApiResponse(200, data), {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(new ApiError(404, error.message, data), {
      status: 404,
    });
  }
}
