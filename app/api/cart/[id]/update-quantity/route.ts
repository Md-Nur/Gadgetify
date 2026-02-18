import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/app/api/utils/ApiError";
import ApiResponse from "@/app/api/utils/ApiResponse";
import generateToken, { getTokenData } from "@/app/api/utils/Token";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get("action"); // 'inc' or 'dec'

    if (!action || (action !== 'inc' && action !== 'dec')) {
        return NextResponse.json(new ApiError(400, "Action must be 'inc' or 'dec'"), { status: 400 });
    }

    let cartTokenData: any = {};
    try {
        const cookieValue = req.cookies.get("cartToken")?.value;
        if (!cookieValue) {
            return NextResponse.json(new ApiError(404, "Cart not found"), { status: 404 });
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
            if (action === 'inc') {
                cartTokenData.productQuantity[existIndex] += 1;
            } else if (action === 'dec') {
                if (cartTokenData.productQuantity[existIndex] > 1) {
                    cartTokenData.productQuantity[existIndex] -= 1;
                } else {
                    // If quantity is 1 and decrementing, we could either stop at 1 or remove the item
                    // Standard e-commerce practice is often to stop at 1 or have a separate remove button
                    // Let's stop at 1 for this specific API, removal is a separate action
                    return NextResponse.json(new ApiResponse(200, cartTokenData, "Minimum quantity reached"), { status: 200 });
                }
            }
        } else {
            return NextResponse.json(new ApiError(404, "Product not found in cart"), { status: 404 });
        }
    } else {
        return NextResponse.json(new ApiError(404, "Cart is empty"), { status: 404 });
    }

    const cartToken = generateToken(cartTokenData);

    const res = NextResponse.json(
        new ApiResponse(200, cartTokenData, `Product quantity ${action === 'inc' ? 'increased' : 'decreased'}`),
        {
            status: 200,
        }
    );
    res.cookies.set("cartToken", cartToken);

    return res;
}
