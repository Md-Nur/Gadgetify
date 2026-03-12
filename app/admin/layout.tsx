import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import AdminSidebar from "./components/AdminSidebar";

interface DecodedToken {
    id: string;
    isAdmin: boolean;
    exp: number;
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies(); // Await cookies() in Next.js 15+
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/user/login");
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_TOKEN!
        ) as DecodedToken;

        if (!decoded.isAdmin) {
            redirect("/"); // Or show a 403 unauthorized page/message
        }
    } catch (error) {
        // Token verification failed or expired
        console.error("Admin layout token verification failed:", error);
        redirect("/user/login");
    }

    return (
        <div className="min-h-screen bg-base-100 flex flex-col lg:flex-row">
            <AdminSidebar />
            <main className="flex-1 lg:ml-64 min-h-screen">
                <div className="p-4 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
