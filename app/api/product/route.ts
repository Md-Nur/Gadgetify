import { NextRequest, NextResponse } from "next/server";
import { string, z } from "zod";
import prisma from "@/prisma/client";
import { writeFile } from "fs/promises";

export const productSchema = z.object({
  name: z.string(),
  price: z.number().min(1),
  description: z.string().max(1000),
  images: z.array(z.string()),
  stockQuantity: z.number(),
  brand: z.string(),
  category: z.string(),
});

export const fileToUrl = async (files: any) => {
  if (files.length < 1) {
    return NextResponse.json(
      { message: "Please upload at least one image" },
      { status: 400 }
    );
  }

  let images: string[] = [];

  for (const file of files) {
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const extention = file.name.split(".").pop();
    const path = `./public/images/products/${Date.now()}.${extention}`;
    await writeFile(path, buffer);
    images.push(path);
  }
  return images;
};

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const files: any = data.getAll("images");
  const images = await fileToUrl(files);
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
  const product = await prisma.product.create({ data: validatedData.data });

  if (!product) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }

  // return NextResponse.json(product, { status: 201 });
  return NextResponse.json(
    { message: "Product created successfully" },
    { status: 201 }
  );
}

export async function GET() {
  const products = await prisma.product.findMany({});

  return NextResponse.json(products);
}
