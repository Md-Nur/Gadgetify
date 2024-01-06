import { NextRequest, NextResponse } from "next/server";
import { string, z } from "zod";
import prisma from "@/prisma/client";
import { fileToUrl } from "@/app/utils/files";
import ApiError from "@/app/utils/ApiError";
import ApiResponse from "@/app/utils/ApiResponse";

export const productSchema: any = z.object({
  name: z.string(),
  price: z.number().min(1),
  description: z.string().max(1000),
  images: z.array(z.string()),
  stockQuantity: z.number(),
  brand: z.string(),
  category: z.string(),
});

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const files: any = data.getAll("images");
  const images = await fileToUrl(files);
  if (!images || images.length < 1) {
    throw new ApiError(400, "Images are required");
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
    throw new ApiError(400, "plase give valid data types", [
      validatedData.error.errors,
    ]);
  }
  const product = await prisma.product.create({ data: validatedData.data });

  if (!product) {
    throw new ApiError(
      500,
      "There have some porblem to create this product in database"
    );
  }

  // return NextResponse.json(product, { status: 201 });
  return NextResponse.json(
    new ApiResponse(201, "", "Product added successfully"),
    {
      status: 201,
    }
  );
}

export async function GET() {
  const products = await prisma.product.findMany({});

  return NextResponse.json(products);
}
