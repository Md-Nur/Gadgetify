import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const orderSchema = z.object({
  name: z.string(),
  phone: z.string(),
  isDhaka: z.boolean(),
  address: z.string(),
});

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const body = {
    name: data.get("name"),
    phone: data.get("phone"),
    isDhaka: data.get("isDhaka") === "1",
    address: data.get("address"),
  };
  const validation = orderSchema.safeParse(body);
  if (!validation.success) {
    throw new ApiError(400, "Please give valid data types", [
      validation.error.errors,
    ]);
  }

  return NextResponse.json(
    new ApiResponse(201, validation.data, "Order send successfully"),
    { status: 201 }
  );
}
