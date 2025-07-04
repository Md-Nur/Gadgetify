import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import ApiResponse from "../../../utils/ApiResponse";
import ApiError from "../../../utils/ApiError";
import jwt from "jsonwebtoken";
import { z } from "zod";
import generateToken from "@/app/api/utils/GenerateToken";

const adminSchema = z.object({
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  membershipFee: z.number(),
  membershipValidity: z.string(),
  membershipType: z.string(),
  memberId: z.number(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.formData();

    let body: any = {
      isVerified: data.get("isVerified") === "Verified",
      isAdmin: data.get("isAdmin") === "Admin",
      membershipFee: Number(data.get("membershipFee") || 0),
      membershipValidity: data.get("membershipValidity") || "",
      membershipType: data.get("membershipType") || "",
      memberId: Number(data.get("memberId") || 0),
    };

    const validatedData: any = adminSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        new ApiError(
          400,
          validatedData.error.errors[0].message || "Invalid Input"
        ),
        {
          status: 400,
        }
      );
    }
    let updatedData;
    try {
      updatedData = await prisma.user.update({
        where: { id: Number(params.id) },
        data: validatedData.data,
      });
    } catch (error: any) {
      return NextResponse.json(new ApiError(500, error.message, error));
    }

    // update token if the admin edit his own data
    const ownData = req.cookies.get("token")?.value || "";
    if (!ownData)
      return NextResponse.json(
        new ApiError(450, "Only Admin can perform this operation"),
        { status: 450 }
      );
    const decodedData: any = jwt.verify(ownData, process.env.JWT_SECRET_TOKEN!);

    let res = NextResponse.json(
      new ApiResponse(200, updatedData, "Update Admin details successfully"),
      { status: 200 }
    );
    if (decodedData.id === Number(params.id)) {
      generateToken({
        id: updatedData.id,
        images: updatedData.images,
        isAdmin: updatedData.isAdmin,
      });
    }
    return res;
  } catch (e: any) {
    return NextResponse.json(
      new ApiError(420, e.message || "Can't update this user's admin details"),
      { status: 402 }
    );
  }
}
