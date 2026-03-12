import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendOrderToSteadfast } from "@/lib/steadfast";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Verify admin authentication
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET_TOKEN || "secret");

        if (!decoded.isAdmin) {
            return NextResponse.json(
                { success: false, message: "Admin access required" },
                { status: 403 }
            );
        }

        // Fetch order details
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        // Prepare Steadfast order data
        const steadfastData = {
            invoice: order.id.slice(0, 8).toUpperCase(),
            recipient_name: order.customerName,
            recipient_phone: order.customerPhone,
            recipient_address: order.customerAddress,
            cod_amount: order.totalAmount,
            note: `Order from Gadgetify. Items: ${order.orderItems.map(item => `${item.product.name} (x${item.quantity})`).join(", ")}`,
        };

        // Send to Steadfast
        const result = await sendOrderToSteadfast(steadfastData);

        if (result.status === 200) {
            // Update order status in database
            await prisma.order.update({
                where: { id },
                data: {
                    status: "Processing",
                    // We don't have a trackingCode field in the schema yet, but we could update it.
                    // For now, let's just update the status.
                },
            });

            return NextResponse.json({
                success: true,
                message: "Order successfully sent to Steadfast",
                data: result.order,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: result.message || "Failed to send order to Steadfast",
                errors: result.errors,
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Steadfast integration error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to process Steadfast integration", error: error.message },
            { status: 500 }
        );
    }
}
