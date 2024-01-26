import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/app/api/utils/ApiError.js";
import ApiResponse from "@/app/api/utils/ApiResponse.js";
import generateToken, { getTokenData } from "@/app/api/utils/Token.js";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = req.nextUrl.searchParams;
  const name = searchParams.get("name");
  const price = searchParams.get("price");

  let cartTokenData: any = {};
  try {
    cartTokenData = getTokenData(req.cookies.get("cartToken")?.value);
  } catch (error: any) {
    return NextResponse.json(new ApiError(402, error.message, error), {
      status: 402,
    });
  }
  if (cartTokenData?.productId && cartTokenData.productId?.length > 0) {
    delete cartTokenData.exp;
    const existIndex = await cartTokenData.productId.findIndex(
      (cartId: string) => cartId === params.id
    );
    if (existIndex >= 0) {
      cartTokenData.productQuantity[existIndex] += 1;
    } else {
      cartTokenData.productId.push(params.id);
      cartTokenData.productName.push(name);
      cartTokenData.productPrice.push(price);
      cartTokenData.productQuantity.push(1);
    }
  } else {
    cartTokenData = {
      productId: [params.id],
      productName: [name],
      productPrice: [price],
      productQuantity: [1],
    };
  }

  const cartToken = generateToken(cartTokenData);

  const res = NextResponse.json(
    new ApiResponse(200, cartTokenData, "Product added to cart"),
    {
      status: 200,
    }
  );
  res.cookies.set("cartToken", cartToken);

  return res;
}
