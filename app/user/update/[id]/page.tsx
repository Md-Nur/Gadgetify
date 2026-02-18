import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import UpdateUserForm from "./UpdateUserForm";
import { prisma } from "@/lib/prisma";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Authorization check
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";
  let userAuth: any = null;
  if (token) {
    try {
      userAuth = jwt.verify(token, process.env.JWT_SECRET_TOKEN!);
    } catch (e) {
      console.error("JWT verification failed:", e);
    }
  }

  // Auth check: User can only update their own profile
  if (!userAuth || userAuth.id !== id) {
    redirect(`/user/profile/${userAuth?.id || ""}`);
  }

  // Fetch user data directly from Prisma
  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching user for update:", error);
  }

  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center text-3xl font-bold">
        User not found
      </div>
    );
  }

  // Convert Prisma user to the shape UpdateUserForm expects (UUID string Ids)
  const formattedUser = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    address: user.address,
    images: user.images, // Pass images if needed by form
  };

  return (
    <main className="min-h-screen bg-base-200 py-10 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <UpdateUserForm id={id} initialUser={formattedUser} />
      </div>
    </main>
  );
};

export default Page;
