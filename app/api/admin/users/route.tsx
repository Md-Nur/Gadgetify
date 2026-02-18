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
        console.log("Decoded Token Data:", decoded); // Debug logging

        if (!decoded.isAdmin) {
            return NextResponse.json(
                { success: false, message: "Admin access required" },
                { status: 403 }
            );
        }

        // Fetch all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isAdmin: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: users,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Fetch users error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch users", error: error.message },
            { status: 500 }
        );
    }
}
