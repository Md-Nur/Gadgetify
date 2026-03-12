import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const AdminProductsPage = async () => {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">পণ্য তালিকা</h1>
                    <p className="text-base-content/60">আপনার দোকানের সকল পণ্যের তালিকা এখানে দেখুন।</p>
                </div>
                <Link 
                    href="/admin/add-product" 
                    className="btn btn-primary shadow-lg"
                >
                    <FaPlus className="w-4 h-4 mr-2" />
                    নতুন পণ্য যোগ করুন
                </Link>
            </div>

            <div className="card bg-base-200 border border-base-300 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        {/* head */}
                        <thead className="bg-base-300/50">
                            <tr>
                                <th>ছবি</th>
                                <th>নাম</th>
                                <th>ক্যাটাগরি</th>
                                <th>মূল্য</th>
                                <th>স্টক</th>
                                <th className="text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-base-content/50">
                                        কোনো পণ্য পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-base-300/30 transition-colors">
                                        <td>
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12 relative">
                                                    <Image
                                                        src={product.images[0] || "/placeholder.png"}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-bold">{product.name}</div>
                                            <div className="text-xs opacity-50">#{product.code}</div>
                                        </td>
                                        <td>
                                            <div className="badge badge-ghost badge-sm">{product.category}</div>
                                        </td>
                                        <td className="font-medium">৳{product.price.toLocaleString()}</td>
                                        <td>
                                            <div className={`badge badge-sm ${product.stockQuantity > 0 ? 'badge-success' : 'badge-error'}`}>
                                                {product.stockQuantity} টি
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link 
                                                    href={`/admin/update-product/${product.id}`}
                                                    className="btn btn-square btn-sm btn-ghost hover:bg-primary hover:text-white"
                                                    title="সম্পাদনা করুন"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </Link>
                                                {/* Delete functionality would ideally be a Client Component or a Server Action */}
                                                <button 
                                                    className="btn btn-square btn-sm btn-ghost hover:bg-error hover:text-white text-error"
                                                    title="মুছে ফেলুন"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProductsPage;
