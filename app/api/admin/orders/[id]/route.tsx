import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PATCH(
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

        const body = await req.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { success: false, message: "Status is required" },
                { status: 400 }
            );
        }

        // Valid statuses
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, message: "Invalid status" },
                { status: 400 }
            );
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order status updated successfully",
                data: order,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update order status error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update order status", error: error.message },
            { status: 500 }
        );
    }
}
