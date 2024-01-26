import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import { fileToUrl } from "@/app/api/utils/files";
import ApiError from "@/app/api/utils/ApiError";
import ApiResponse from "@/app/api/utils/ApiResponse";

export const productSchema: any = z.object({
  name: z.string(),
  price: z.number().min(1),
  description: z.string().max(1000),
  images: z.array(z.string()),
  stockQuantity: z.number(),
  code: z.number(),
  category: z.string(),
});

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const files: any = data.getAll("images");
  const images = await fileToUrl(files);

  if (!images || images.length < 1) {
    return NextResponse.json(new ApiError(404, "Images are required"), {
      status: 404,
    });
  }

  if (!data.get("code")) {
    return NextResponse.json(new ApiError(404, "Product code is required"), {
      status: 404,
    });
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

  // check the product code is already in the database
  const prevProduct = await prisma.product.findFirst({
    where: {
      code: body.code,
    },
  });
  if (prevProduct) {
    return NextResponse.json(new ApiError(400, "Product code already exists"), {
      status: 400,
    });
  }

  const validatedData = productSchema.safeParse(body);
  if (!validatedData.success) {
    return NextResponse.json(
      new ApiError(
        400,
        "Plase give valid data types",
        validatedData.error.errors
      ),
      { status: 400 }
    );
  }
  let product;
  try {
    product = await prisma.product.create({ data: validatedData.data });
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }
  if (!product) {
    return NextResponse.json(
      new ApiError(
        500,
        "There have some porblem to create this product in database"
      ),
      { status: 500 }
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
  if (!products)
    return NextResponse.json(new ApiError(404, "There have no products"), {
      status: 404,
    });
  return NextResponse.json(new ApiResponse(200, products), { status: 200 });
}
