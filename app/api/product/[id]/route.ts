import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "../route";
import prisma from "@/prisma/client";
import { deleteFiles, fileToUrl } from "../../../utils/files";

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

  let images: string[] | boolean = prevData?.images!;

  if (files[0] && files) {
    deleteFiles(images); // deleting the previous files
    images = await fileToUrl(files);
    if (!images) images = prevData?.images!;
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

  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data: validatedData.data,
  });

  if (!product) {
    return NextResponse.json({ message: "Product not found" });
  }

  return NextResponse.json(product);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.delete({
    where: { id: Number(params.id) },
  });

  if (!product) {
    return NextResponse.next();
  }

  return NextResponse.json(product);
}
