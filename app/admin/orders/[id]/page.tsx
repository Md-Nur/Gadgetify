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
    const [sendingToSteadfast, setSendingToSteadfast] = useState(false);

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
            toast.error("অর্ডারের বিস্তারিত আনতে সমস্যা হয়েছে");
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
                toast.success("অর্ডারের অবস্থা সফলভাবে আপডেট হয়েছে");
                setOrder((prev: Order | null) => prev ? { ...prev, status: newStatus } : null);
            } else {
                toast.error(result.message || "অবস্থা আপডেট করতে ব্যর্থ হয়েছে");
            }
        } catch (err) {
            toast.error("অবস্থা আপডেট করার সময় একটি ভুল হয়েছে");
        } finally {
            setUpdating(false);
        }
    };

    const handleSendToSteadfast = async () => {
        if (!confirm("আপনি কি নিশ্চিত যে আপনি এই অর্ডারটি Steadfast Courier-এ পাঠাতে চান?")) return;

        setSendingToSteadfast(true);
        try {
            const response = await fetch(`/api/admin/orders/${id}/steadfast`, {
                method: "POST",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("অর্ডারটি সফলভাবে Steadfast-এ পাঠানো হয়েছে!");
                fetchOrderDetails();
            } else {
                toast.error(result.message || "Steadfast-এ পাঠাতে ব্যর্থ হয়েছে");
            }
        } catch (err) {
            toast.error("Steadfast-এর সাথে সংযোগ করার সময় একটি ভুল হয়েছে");
        } finally {
            setSendingToSteadfast(false);
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
                toast.success("লিঙ্কটি ক্লিপবোর্ডে কপি করা হয়েছে!");
            } catch (err) {
                toast.error("লিঙ্ক কপি করতে ব্যর্থ হয়েছে");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
                <h1 className="text-3xl font-bold">অর্ডার খুঁজে পাওয়া যায়নি</h1>
                <Link href="/admin/orders" className="btn btn-primary">
                    অর্ডারে ফিরে যান
                </Link>
            </div>
        );
    }

    const statuses = [
        { value: "Pending", label: "অপেক্ষমান" },
        { value: "Processing", label: "প্রক্রিয়াধীন" },
        { value: "Shipped", label: "পাঠানো হয়েছে" },
        { value: "Delivered", label: "পৌঁছেছে" },
        { value: "Cancelled", label: "বাতিল" },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">অর্ডারের বিবরণ</h1>
                    <p className="text-base-content/60 mt-1">অর্ডার আইডি: <span className="font-mono text-primary font-bold">#{order.id.slice(0, 8).toUpperCase()}</span></p>
                </div>
                <Link href="/admin/orders" className="btn btn-ghost border-base-300">
                    ← অর্ডারে ফিরে যান
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Info */}
                    <div className="bg-base-200/50 p-6 rounded-3xl border border-base-300">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            অর্ডারের তথ্য
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-base-content/50 uppercase tracking-wider font-semibold">অর্ডারের তারিখ</p>
                                <p className="font-medium mt-1">{new Date(order.createdAt).toLocaleString("bn-BD")}</p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/50 uppercase tracking-wider font-semibold">পেমেন্ট পদ্ধতি</p>
                                <p className="font-medium mt-1 badge badge-outline">{order.paymentMethod === "COD" ? "ক্যাশ অন ডেলিভারি" : order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm text-base-content/50 uppercase tracking-wider font-semibold">ডেলিভারি এলাকা</p>
                                <p className="font-medium mt-1">{order.isDhaka ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-base-200/50 p-6 rounded-3xl border border-base-300">
                        <h2 className="text-xl font-bold mb-6">গ্রাহকের তথ্য</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="font-bold w-20 text-base-content/60">নাম:</span>
                                <span>{order.customerName}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="font-bold w-20 text-base-content/60">ফোন:</span>
                                <a href={`tel:${order.customerPhone}`} className="text-primary font-bold hover:underline">{order.customerPhone}</a>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="font-bold w-20 text-base-content/60">ঠিকানা:</span>
                                <span className="leading-relaxed">{order.customerAddress}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="bg-base-200/50 p-6 rounded-3xl border border-base-300">
                        <h2 className="text-xl font-bold mb-6">অর্ডার করা পণ্যসমূহ</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center p-4 bg-base-100 rounded-2xl border border-base-300 shadow-sm">
                                    {item.product.images[0] && (
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-base-200 flex-shrink-0">
                                            <Image
                                                src={item.product.images[0][1] === "/" ? item.product.images[0].slice(8) : item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg truncate">{item.product.name}</h3>
                                        <p className="text-primary font-semibold">৳{item.product.price.toLocaleString()} × {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-xl text-primary whitespace-nowrap">৳{(item.product.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Order Status */}
                    <div className="bg-base-200/50 p-6 rounded-3xl border border-base-300">
                        <h2 className="text-xl font-bold mb-6">অর্ডারের অবস্থা</h2>
                        <select
                            className="select select-bordered select-lg w-full mb-4 bg-base-100 rounded-2xl"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(e.target.value)}
                            disabled={updating}
                        >
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        {updating && (
                            <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                <span className="loading loading-spinner loading-xs"></span>
                                আপডেট হচ্ছে...
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-primary text-primary-content p-6 rounded-3xl shadow-xl shadow-primary/20">
                        <h2 className="text-xl font-bold mb-6">অর্ডারের সারাংশ</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between font-medium opacity-90">
                                <span>পণ্যের দাম:</span>
                                <span>৳{(order.totalAmount - order.deliveryCharge).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-medium opacity-90">
                                <span>ডেলিভারি চার্জ:</span>
                                <span>৳{order.deliveryCharge.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-primary-content/20 my-4"></div>
                            <div className="flex justify-between text-2xl font-black">
                                <span>মোট:</span>
                                <span>৳{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-base-200/50 p-6 rounded-3xl border border-base-300 space-y-4">
                        <h2 className="text-xl font-bold mb-2">অ্যাকশন</h2>
                        <button
                            className="btn btn-outline border-base-300 w-full rounded-2xl h-14"
                            onClick={() => window.print()}
                        >
                            ইনভয়েস প্রিন্ট করুন
                        </button>
                        <button
                            className="btn btn-primary w-full rounded-2xl h-14"
                            onClick={handleShare}
                        >
                            ইনভয়েস শেয়ার করুন
                        </button>
                        <div className="divider opacity-50 font-bold text-xs uppercase tracking-widest text-base-content/50">কুরিয়ার</div>
                        <button
                            className={`btn btn-secondary w-full rounded-2xl h-14 ${sendingToSteadfast ? 'loading' : ''}`}
                            onClick={handleSendToSteadfast}
                            disabled={sendingToSteadfast || order.status === "Delivered" || order.status === "Cancelled"}
                        >
                            {sendingToSteadfast ? 'পাঠানো হচ্ছে...' : 'Steadfast-এ পাঠান'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
