import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { deleteFiles, fileToUrl } from "../../utils/files";
import ApiError from "@/app/api/utils/ApiError";
import ApiResponse from "@/app/api/utils/ApiResponse";

const productSchema: any = z.object({
  name: z.string(),
  price: z.number().min(1),
  description: z.string().max(1000),
  images: z.array(z.string()),
  stockQuantity: z.number(),
  code: z.number(),
  category: z.string(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return NextResponse.json(new ApiError(404, "Product not found"), {
      status: 404,
    });
  }

  return NextResponse.json(new ApiResponse(200, product), { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.formData();
  const files: any = data.getAll("images");

  const prevData = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  let images: string[] = prevData?.images!;

  if (files[0] && files && files[0].size > 1) {
    try {
      await deleteFiles(images); // deleting the previous files
    } catch (e: any) {
      return NextResponse.json(
        new ApiError(420, e.message || "There have a problem to delete previous images"),
        { status: 420 }
      );
    }
    try {
      images = await fileToUrl(files);
    } catch (e: any) {
      return NextResponse.json(
        new ApiError(404, e.message || "There have a problem to upload on cloudinary"),
        { status: 404 }
      );
    }
  }
  const body = {
    name: data.get("name"),
    price: Number(data.get("price")),
    description: data.get("description"),
    images: images,
    code: Number(data.get("code")),
    category: data.get("category") || "",
    stockQuantity: Number(data.get("stockQuantity")),
  };

  const validatedData = productSchema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json(validatedData.error.errors, { status: 400 });
  }

  try {
    await prisma.product.update({
      where: { id },
      data: validatedData.data,
    });
  } catch (e: any) {
    return NextResponse.json(new ApiError(404, e.message || "Product not found"), {
      status: 404,
    });
  }

  return NextResponse.json(
    new ApiResponse(202, "", "Product details update successfully")
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prevData = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  let images: string[] = prevData?.images!;

  await deleteFiles(images); // deleting the previous files

  const product = await prisma.product.delete({
    where: { id },
  });

  if (!product || !prevData) {
    return NextResponse.json(new ApiError(400, "Your product can't be deleted"), {
      status: 400,
    });
  }

  return NextResponse.json(
    new ApiResponse(202, "", "Product deleted successfully")
  );
}
