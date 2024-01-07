import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "../route";
import prisma from "@/prisma/client";
import { deleteFiles, fileToUrl } from "../../utils/files";
import ApiError from "@/app/api/utils/ApiError";
import ApiResponse from "@/app/api/utils/ApiResponse";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  });

  if (!product) {
    return NextResponse.json({ message: "No product is found with this Id!!" });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.formData();
  const files: any = data.getAll("images");

  const prevData = await prisma.product.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  let images: string[] = prevData?.images!;

  if (files[0] && files && files[0].size > 1) {
    try {
      await deleteFiles(images); // deleting the previous files
    } catch {
      throw new ApiError(420, "There have a problem to delete previous images");
    }
    try {
      images = await fileToUrl(files);
    } catch {
      throw new ApiError(404, "There have a problem to upload on cloudinary");
    }
  }
  const body = {
    name: data.get("name"),
    price: Number(data.get("price")),
    description: data.get("description"),
    images: images,
    brand: data.get("brand") || "",
    category: data.get("category") || "",
    stockQuantity: Number(data.get("stockQuantity")),
  };

  const validatedData = productSchema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json(validatedData.error.errors, { status: 400 });
  }

  try {
    await prisma.product.update({
      where: { id: Number(params.id) },
      data: validatedData.data,
    });
  } catch {
    throw new ApiError(404, "Product not found");
  }

  return NextResponse.json(
    new ApiResponse(202, "", "Product details update successfully")
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const prevData = await prisma.product.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });

  let images: string[] = prevData?.images!;

  await deleteFiles(images); // deleting the previous files

  const product = await prisma.product.delete({
    where: { id: Number(params.id) },
  });

  if (!product || !prevData) {
    throw new ApiError(400, "Your product can't be deleted");
  }

  return NextResponse.json(
    new ApiResponse(202, "", "Product deleted successfully")
  );
}
