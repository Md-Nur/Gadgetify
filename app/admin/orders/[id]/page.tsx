"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

interface Product {
    name: string;
    price: number;
    images: string[];
}

interface OrderItem {
    id: string;
    quantity: number;
    product: Product;
}

interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    isDhaka: boolean;
    deliveryCharge: number;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    orderItems: OrderItem[];
}

const OrderDetails = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/admin/orders`);
            const result = await response.json();

            if (result.success) {
                const foundOrder = result.data.find((o: Order) => o.id === id);
                if (foundOrder) {
                    setOrder(foundOrder);
                }
            }
        } catch (err) {
            console.error("Failed to fetch order details:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (newStatus: string) => {
        setUpdating(true);
        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Order status updated successfully");
                setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
            } else {
                toast.error(result.message || "Failed to update status");
            }
        } catch (err) {
            toast.error("An error occurred while updating status");
        } finally {
            setUpdating(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Invoice for Order #${id.slice(0, 8).toUpperCase()}`,
            text: `View the invoice for order #${id.slice(0, 8).toUpperCase()} on Gadgetify.`,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            } catch (err) {
                toast.error("Failed to copy link");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <Link href="/admin/orders" className="btn btn-primary">
                    Back to Orders
                </Link>
            </div>
        );
    }

    const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <Link href="/admin/orders" className="btn btn-ghost">
                    ← Back to Orders
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Info */}
                    <div className="bg-base-200 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-base-content/70">Order ID</p>
                                <p className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/70">Order Date</p>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/70">Payment Method</p>
                                <p className="font-medium">{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/70">Delivery Area</p>
                                <p className="font-medium">{order.isDhaka ? "Inside Dhaka" : "Outside Dhaka"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-base-200 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Name:</span> {order.customerName}</p>
                            <p><span className="font-medium">Phone:</span> <a href={`tel:${order.customerPhone}`} className="link link-primary">{order.customerPhone}</a></p>
                            <p><span className="font-medium">Address:</span> {order.customerAddress}</p>
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="bg-base-200 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center p-4 bg-base-100 rounded-lg">
                                    {item.product.images[0] && (
                                        <Image
                                            src={item.product.images[0][1] === "/" ? item.product.images[0].slice(8) : item.product.images[0]}
                                            alt={item.product.name}
                                            width={80}
                                            height={80}
                                            className="rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.product.name}</h3>
                                        <p className="text-sm text-base-content/70">৳{item.product.price} × {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-lg">৳{item.product.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-base-200 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                        <select
                            className="select select-bordered w-full mb-4"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(e.target.value)}
                            disabled={updating}
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {updating && <p className="text-sm text-base-content/70">Updating...</p>}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-base-200 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>৳{order.totalAmount - order.deliveryCharge}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span>৳{order.deliveryCharge}</span>
                            </div>
                            <div className="divider my-2"></div>
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total:</span>
                                <span className="text-primary">৳{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-base-200 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Actions</h2>
                        <button
                            className="btn btn-outline w-full"
                            onClick={() => window.print()}
                        >
                            Print Invoice
                        </button>
                        <button
                            className="btn btn-primary w-full mt-3"
                            onClick={handleShare}
                        >
                            Share Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
