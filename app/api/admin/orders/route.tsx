import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
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

        // Fetch all orders with order items and products
        const orders = await prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: orders,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Fetch orders error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch orders", error: error.message },
            { status: 500 }
        );
    }
}
