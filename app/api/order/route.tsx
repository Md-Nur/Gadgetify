import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { customerName, customerPhone, customerAddress, isDhaka, cartItems, userId } = body;

        // Validate required fields
        if (!customerName || !customerPhone || !customerAddress || !cartItems || cartItems.length === 0) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Calculate delivery charge
        const deliveryCharge = isDhaka ? 60 : 130;

        // Calculate subtotal from cart items
        let subtotal = 0;
        const orderItemsData = [];

        for (const item of cartItems) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                return NextResponse.json(
                    { success: false, message: `Product ${item.productId} not found` },
                    { status: 404 }
                );
            }

            if (product.stockQuantity < item.quantity) {
                return NextResponse.json(
                    { success: false, message: `Insufficient stock for ${product.name}` },
                    { status: 400 }
                );
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
            });
        }

        const totalAmount = subtotal + deliveryCharge;

        // Create order with order items
        const order = await prisma.order.create({
            data: {
                customerName,
                customerPhone,
                customerAddress,
                isDhaka: isDhaka || false,
                deliveryCharge,
                totalAmount,
                userId: userId || null,
                orderItems: {
                    create: orderItemsData,
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Update product stock quantities
        for (const item of cartItems) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stockQuantity: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Order placed successfully",
                data: order,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create order", error: error.message },
            { status: 500 }
        );
    }
}
