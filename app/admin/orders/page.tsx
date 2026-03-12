"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        price: number;
    };
}

interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    orderItems: OrderItem[];
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/admin/orders");
            const result = await response.json();

            if (result.success) {
                setOrders(result.data);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("অর্ডার তথ্য আনতে ব্যর্থ হয়েছে");
        } finally {
            setLoading(false);
        }
    };

    const statusMap: { [key: string]: { label: string; color: string } } = {
        Pending: { label: "অপেক্ষমান", color: "badge-warning" },
        Processing: { label: "প্রক্রিয়াধীন", color: "badge-info" },
        Shipped: { label: "পাঠানো হয়েছে", color: "badge-primary" },
        Delivered: { label: "পৌঁছেছে", color: "badge-success" },
        Cancelled: { label: "বাতিল", color: "badge-error" },
    };

    const getStatusInfo = (status: string) => {
        return statusMap[status] || { label: status, color: "badge-neutral" };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">অর্ডার ব্যবস্থাপনা</h1>
                    <p className="text-base-content/60 mt-1">সব গ্রাহকের অর্ডার এখানে দেখুন।</p>
                </div>
                <div className="stats shadow bg-base-200">
                    <div className="stat px-8">
                        <div className="stat-title text-base-content/60">মোট অর্ডার</div>
                        <div className="stat-value text-primary">{orders.length}</div>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
                    <h2 className="text-2xl font-semibold mb-2">এখনও কোন অর্ডার নেই</h2>
                    <p className="text-base-content/60">গ্রাহকরা অর্ডার করলে এখানে দেখা যাবে।</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-3xl shadow-sm border border-base-300">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50">
                            <tr>
                                <th className="py-5 pl-6">আইডি</th>
                                <th className="py-5">গ্রাহক</th>
                                <th className="py-5 hidden lg:table-cell">ফোন</th>
                                <th className="py-5 hidden sm:table-cell text-center">আইটেম</th>
                                <th className="py-5 text-center">মোট</th>
                                <th className="py-5 text-center">অবস্থা</th>
                                <th className="py-5 hidden xl:table-cell">তারিখ</th>
                                <th className="py-5 text-right pr-6">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const statusInfo = getStatusInfo(order.status);
                                return (
                                    <tr key={order.id} className="hover:bg-base-200/30 transition-colors group">
                                        <td className="pl-6 font-mono text-xs opacity-50">{order.id.slice(0, 6)}</td>
                                        <td>
                                            <div className="font-bold">{order.customerName}</div>
                                        </td>
                                        <td className="hidden lg:table-cell">{order.customerPhone}</td>
                                        <td className="hidden sm:table-cell text-center">
                                            <span className="badge badge-ghost">{order.orderItems.length} টি</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="font-bold text-primary">৳{order.totalAmount.toLocaleString()}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${statusInfo.color} badge-sm sm:badge-md font-bold`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="hidden xl:table-cell opacity-50 text-sm">{new Date(order.createdAt).toLocaleDateString("bn-BD")}</td>
                                        <td className="text-right pr-6">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                                            >
                                                দেখুন
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
