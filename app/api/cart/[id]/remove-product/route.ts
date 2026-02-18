import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/app/api/utils/ApiError";
import ApiResponse from "@/app/api/utils/ApiResponse";
import generateToken, { getTokenData } from "@/app/api/utils/Token";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    let cartTokenData: any = {};
    try {
        const cookieValue = req.cookies.get("cartToken")?.value;
        if (!cookieValue) {
            return NextResponse.json(new ApiResponse(200, {}, "Cart is already empty"), { status: 200 });
        }
        cartTokenData = getTokenData(cookieValue);
    } catch (error: any) {
        return NextResponse.json(new ApiError(402, error.message, error), {
            status: 402,
        });
    }

    if (cartTokenData?.productId && cartTokenData.productId?.length > 0) {
        delete cartTokenData.exp;
        delete cartTokenData.iat;

        const existIndex = cartTokenData.productId.findIndex(
            (cartId: string) => cartId === id
        );

        if (existIndex >= 0) {
            // Remove item from all parallel arrays
            cartTokenData.productId.splice(existIndex, 1);
            cartTokenData.productName.splice(existIndex, 1);
            cartTokenData.productPrice.splice(existIndex, 1);
            cartTokenData.productQuantity.splice(existIndex, 1);
        } else {
            return NextResponse.json(new ApiError(404, "Product not found in cart"), { status: 404 });
        }
    } else {
        return NextResponse.json(new ApiResponse(200, {}, "Cart is already empty"), { status: 200 });
    }

    const cartToken = generateToken(cartTokenData);

    const res = NextResponse.json(
        new ApiResponse(200, cartTokenData, "Product removed from cart"),
        {
            status: 200,
        }
    );
    res.cookies.set("cartToken", cartToken);

    return res;
}
