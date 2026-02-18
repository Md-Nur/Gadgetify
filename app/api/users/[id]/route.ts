import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ApiError from "@/app/api/utils/ApiError";
import ApiResponse from "@/app/api/utils/ApiResponse";
import { z } from "zod";
import bcryptjs from "bcryptjs";

const userSchema = z.object({
  name: z.string().optional(),
  phone: z.string().startsWith("01").length(11),
  password: z.string().optional(),
  address: z.string(),
});

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Props) {
  const { id } = await params;
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id },
    });
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(401, error.message || "Can't find details"),
      { status: 401 }
    );
  }
  if (!user)
    return NextResponse.json(new ApiError(404, "User not found"), {
      status: 404,
    });

  return NextResponse.json(
    new ApiResponse(200, {
      id: user.id,
      name: user.name,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
    }),
    { status: 200 }
  );
}

export async function PUT(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const data = await req.formData();

  const prevData = await prisma.user.findUnique({
    where: { id },
  });

  if (!prevData) {
    return NextResponse.json(new ApiError(404, "User not found"), { status: 404 });
  }

  if (prevData.phone !== String(data.get("phone") || "")) {
    let user = await prisma.user.findFirst({
      where: {
        phone: String(data.get("phone") || ""),
      },
    });
    if (user) {
      return NextResponse.json(
        new ApiError(400, "User already exist with this phone number"),
        { status: 400 }
      );
    }
  }

  let body: any = {
    name: data.get("name"),
    phone: data.get("phone"),
    address: data.get("address"),
    password: data.get("password") || "",
  };

  const validation = userSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      new ApiError(
        400,
        validation.error.issues[0].message || "Invalid Input",
        validation.error.issues
      ),
      { status: 400 }
    );
  }

  const updateData: any = {
    name: validation.data.name,
    phone: validation.data.phone,
    address: validation.data.address,
  };

  if (validation.data.password) {
    const salt = await bcryptjs.genSalt(10);
    updateData.password = await bcryptjs.hash(validation.data.password, salt);
  }

  let updatedUser;
  try {
    updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
  } catch (e: any) {
    return NextResponse.json(
      new ApiError(500, e.message || "User data did not update"),
      { status: 500 }
    );
  }

  return NextResponse.json(
    new ApiResponse(202, updatedUser, "User details updated Successfully"),
    { status: 202 }
  );
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { id } = await params;

  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json(
      new ApiResponse(202, "", "User deleted successfully"),
      { status: 202 }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(400, error.message || "User can't be deleted"),
      { status: 400 }
    );
  }
}
