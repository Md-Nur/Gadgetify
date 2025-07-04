import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { deleteFiles, fileToUrl } from "../../utils/files";
import { userSchema } from "../route";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../../utils/GenerateToken";

interface Props {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Props) {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: Number(params.id) },
    });
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(401, error.message || "Can't find details")
    );
  }
  if (!user || user === null)
    return NextResponse.json(new ApiError(404, "User not found"), {
      status: 404,
    });

  return NextResponse.json(
    new ApiResponse(200, {
      id: user.id,
      fullname: user.fullname,
      rollNo: user.rollNo,
      session: user.session,
      year: user.year,
      phone: user.phone,
      email: user.email,
      interests: user.interests,
      images: user.images,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      membershipFee: user.membershipFee,
      membershipValidity: user.membershipValidity,
      membershipType: user.membershipType,
      memberId: user.memberId,
    }),
    { status: 200 }
  );
}

export async function PUT(req: NextRequest, { params }: Props) {
  const data = await req.formData();
  const file: any = data.get("images");

  const prevData = await prisma.user.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (prevData?.phone !== String(data.get("phone") || "")) {
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
  if (prevData?.rollNo !== String(data.get("rollNo") || "")) {
    let user = await prisma.user.findFirst({
      where: {
        rollNo: String(data.get("rollNo") || ""),
      },
    });
    if (user) {
      return NextResponse.json(
        new ApiError(400, "User already exist with this Roll number"),
        { status: 400 }
      );
    }
  }

  let image: string = prevData?.images!;

  if (file.size > 1) {
    try {
      await deleteFiles(image, "users"); // deleting the previous files
    } catch (e: any) {
      return NextResponse.json(
        new ApiError(
          420,
          e.message || "There have a problem to delete previous images"
        ),
        { status: 420 }
      );
    }
    try {
      image = await fileToUrl(file, "users");
    } catch (e: any) {
      return NextResponse.json(
        new ApiError(420, e.message || "There have a problem to upload avatar"),
        { status: 420 }
      );
    }
  }
  let body: any = {
    fullname: data.get("fullname"),
    rollNo: data.get("rollNo") || "",
    session: data.get("session"),
    year: data.get("year") || "",
    phone: data.get("phone"),
    email: data.get("email") || "",
    interests: data.get("interests"),
    password: data.get("password") || "",
    images: image,
  };
  if (!body.phone)
    return NextResponse.json(new ApiError(404, "Phone number can't be blank"), {
      status: 404,
    });
  else if (body.rollNo.length !== 10) {
    return NextResponse.json(
      new ApiError(402, "Roll Number must have 10 digits"),
      { status: 402 }
    );
  } else if (body.phone.length !== 11) {
    return NextResponse.json(
      new ApiError(402, "Phone number must be 11 digits"),
      { status: 402 }
    );
  } else if (body.phone[0] !== "0" || body.phone[1] !== "1") {
    return NextResponse.json(
      new ApiError(402, "Phone number must be start with 01"),
      { status: 402 }
    );
  }

  const validatedData: any = userSchema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json(
      new ApiError(
        400,
        validatedData.error.errors[0].message || "Invalid Input",
        validatedData.error
      ),
      {
        status: 400,
      }
    );
  }

  if (body.password === "") {
    delete validatedData.data.password;
  } else {
    const salt = await bcryptjs.genSalt(10);
    validatedData.data.password = await bcryptjs.hash(
      validatedData.data.password,
      salt
    );
  }

  let updatedUser;
  try {
    updatedUser = await prisma.user.update({
      where: { id: Number(params.id) },
      data: validatedData.data,
    });
  } catch (e: any) {
    return NextResponse.json(
      new ApiError(404, e.message || "User data did not update"),
      { status: 404 }
    );
  }

  //create token data
  const tokenData = {
    id: updatedUser.id,
    images: updatedUser.images,
    isAdmin: updatedUser.isAdmin,
  };

  const token = generateToken(tokenData);

  const res = NextResponse.json(
    new ApiResponse(202, updatedUser, "User details updated Successfully"),
    {
      status: 202,
    }
  );

  res.cookies.set("token", token, {
    httpOnly: true,
  });
  return res;
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const prevData = await prisma.user.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });

  let image: string = prevData?.images!;
  try {
    await deleteFiles(image, "users");
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(420, error.message || "Can't delete images")
    );
  } // deleting the previous files

  const user = await prisma.user.delete({
    where: { id: Number(params.id) },
  });

  if (!user || !prevData) {
    return NextResponse.json(new ApiError(400, "User can't be deleted"), {
      status: 400,
    });
  }

  return NextResponse.json(
    new ApiResponse(202, "", "User deleted successfully"),
    { status: 202 }
  );
}
