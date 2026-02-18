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
        const { isAdmin } = body;

        if (typeof isAdmin !== "boolean") {
            return NextResponse.json(
                { success: false, message: "isAdmin must be a boolean" },
                { status: 400 }
            );
        }

        // If demoting, check if this is the last admin
        if (!isAdmin) {
            const currentUser = await prisma.user.findUnique({
                where: { id },
                select: { isAdmin: true },
            });

            if (currentUser?.isAdmin) {
                const adminCount = await prisma.user.count({
                    where: { isAdmin: true },
                });

                if (adminCount <= 1) {
                    return NextResponse.json(
                        { success: false, message: "Cannot demote the last admin" },
                        { status: 400 }
                    );
                }
            }
        }

        const user = await prisma.user.update({
            where: { id },
            data: { isAdmin },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isAdmin: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: `User ${isAdmin ? "promoted to" : "demoted from"} admin successfully`,
                data: user,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update user role error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update user role", error: error.message },
            { status: 500 }
        );
    }
}
