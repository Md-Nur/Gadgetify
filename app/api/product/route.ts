import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fileToUrl } from "@/app/api/utils/files";
import ApiError from "@/app/api/utils/ApiError";
import ApiResponse from "@/app/api/utils/ApiResponse";

const productSchema: any = z.object({
  name: z.string(),
  price: z.number().min(1),
  description: z.string().max(1000),
  images: z.array(z.string()),
  stockQuantity: z.number(),
  category: z.string(),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const data = await req.formData();

  // Handle pre-uploaded image URLs from frontend
  const imageUrls = data.getAll("imageUrls") as string[];
  let images: string[] = [];

  if (imageUrls && imageUrls.length > 0) {
    images = imageUrls;
  } else {
    // Fallback to manual file upload if no URLs provided
    const files: any = data.getAll("images");
    if (files && files.length > 0) {
      images = await fileToUrl(files);
    }
  }

  if (images.length < 1) {
    return NextResponse.json(new ApiError(404, "At least one image is required"), {
      status: 404,
    });
  }

  const body = {
    name: data.get("name"),
    price: Number(data.get("price")),
    description: data.get("description"),
    images: images,
    category: data.get("category") || "",
    subCategory: data.get("subCategory") || "",
    brand: data.get("brand") || "",
    stockQuantity: Number(data.get("stockQuantity")),
  };

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q");

  let products;
  try {
    if (category) {
      products = await prisma.product.findMany({
        where: { category: category },
      });
    } else if (query) {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
      });
    } else {
      products = await prisma.product.findMany({});
    }
  } catch (error: any) {
    return NextResponse.json(new ApiError(500, error.message), { status: 500 });
  }

  if (!products || products.length === 0) {
    return NextResponse.json(new ApiError(404, "No products found"), {
      status: 404,
    });
  }
  return NextResponse.json(new ApiResponse(200, products), { status: 200 });
}
