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
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusColors: { [key: string]: string } = {
            Pending: "badge-warning",
            Processing: "badge-info",
            Shipped: "badge-primary",
            Delivered: "badge-success",
            Cancelled: "badge-error",
        };
        return `badge ${statusColors[status] || "badge-neutral"}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
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
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col gap-2">
                    <Link href="/admin" className="btn btn-sm btn-ghost w-fit gap-2 pl-0 hover:bg-transparent">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Orders Management</h1>
                </div>
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Orders</div>
                        <div className="stat-value text-primary">{orders.length}</div>
                    </div>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
                    <p className="text-base-content/70">Orders will appear here when customers place them.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-base-100 rounded-3xl shadow-sm border border-primary/5">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50">
                            <tr>
                                <th className="py-4">ID</th>
                                <th className="py-4">Customer</th>
                                <th className="py-4 hidden lg:table-cell">Phone</th>
                                <th className="py-4 hidden sm:table-cell">Items</th>
                                <th className="py-4">Total</th>
                                <th className="py-4">Status</th>
                                <th className="py-4 hidden xl:table-cell">Date</th>
                                <th className="py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-base-200/30 transition-colors">
                                    <td className="font-mono text-xs opacity-50">{order.id.slice(0, 6)}</td>
                                    <td className="font-bold">{order.customerName}</td>
                                    <td className="hidden lg:table-cell">{order.customerPhone}</td>
                                    <td className="hidden sm:table-cell">{order.orderItems.length} items</td>
                                    <td className="font-black text-primary">৳{order.totalAmount}</td>
                                    <td>
                                        <span className={`${getStatusBadge(order.status)} font-bold`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="hidden xl:table-cell opacity-50 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="text-right">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary transition-all"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
