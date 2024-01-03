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
    const extention = file.name.split(".").pop();

    if (!extention || !["jpg", "jpeg", "png"].includes(extention)) {
      return false;
    }
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);
    const path = `./public/images/products/${Date.now()}.${extention}`;
    try {
      await writeFile(path, buffer);

      images.push(path);
    } catch (e) {
      return false;
    }
  }
  return images;
};

export async function POST(req: NextRequest) {
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
