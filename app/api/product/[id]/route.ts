import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { productSchema } from "../route";
import prisma from "@/prisma/client";
import { fileToUrl } from "../route";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  });

  if (!product) {
    return NextResponse.next();
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.formData();
  const files: any = data.getAll("images");
  const images = await fileToUrl(files);
  if (!images) {
    return NextResponse.json({ error: "Images are required" }, { status: 400 });
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
    return NextResponse.next();
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
