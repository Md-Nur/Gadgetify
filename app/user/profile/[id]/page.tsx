import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  address: string;
  images: string | null;
  createdAt: Date;
}

const Profile = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Get session from token
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

  // Fetch user data directly from Prisma
  let user: User | null = null;
  let error: string | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id },
    });
  } catch (err: any) {
    error = err.message || "Failed to fetch user";
  }

  if (error)
    return (
      <div className="text-center text-error text-5xl py-52">
        {error}
      </div>
    );

  if (!user)
    return (
      <div className="h-screen flex items-center justify-center text-3xl font-bold">
        User not found
      </div>
    );

  return (
    <main className="min-h-screen bg-base-200 py-10 px-4">
      {/* Profile Container */}
      <div className="max-w-4xl mx-auto">
        {/* Cover Photo & Profile Header */}
        <div className="relative mb-24">
          <div className="h-64 w-full bg-gradient-to-r from-primary to-secondary rounded-b-3xl shadow-lg opacity-90"></div>

          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full border-4 border-base-100 shadow-2xl overflow-hidden bg-base-100 flex items-center justify-center text-6xl font-bold bg-gradient-to-br from-base-100 to-base-300">
              {user.images ? (
                <Image src={user.images} alt={user.name || "User"} width={160} height={160} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary">{user.name ? user.name[0].toUpperCase() : "U"}</span>
              )}
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">{user.name || "Unnamed User"}</h1>
          <p className="text-base-content/60 font-medium">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Info Card */}
          <div className="card bg-base-100 shadow-xl col-span-1 md:col-span-1 h-fit">
            <div className="card-body">
              <h2 className="card-title text-lg border-b border-base-200 pb-2 mb-4">Contact Info</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-base-content/50 uppercase font-semibold">Phone</p>
                  <p className="font-medium text-lg">{user.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-base-content/50 uppercase font-semibold">Email</p>
                  <p className="font-medium text-lg">{user.email || "N/A"}</p>
                </div>

                <div>
                  <p className="text-xs text-base-content/50 uppercase font-semibold">Address</p>
                  <p className="font-medium text-lg leading-relaxed">{user.address}</p>
                </div>
              </div>

              {userAuth?.id === user.id && (
                <div className="card-actions mt-6">
                  <Link href={`/user/update/${user.id}`} className="btn btn-primary btn-outline btn-block">
                    Edit Profile
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats / Recent Activity (Placeholder) */}
          <div className="card bg-base-100 shadow-xl col-span-1 md:col-span-2">
            <div className="card-body">
              <h2 className="card-title text-lg border-b border-base-200 pb-2 mb-4">Order History</h2>

              <div className="flex flex-col items-center justify-center py-10 text-base-content/40 space-y-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p>No recent orders found.</p>
                <Link href="/" className="btn btn-sm btn-ghost">Start Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
