import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const OrderConfirmation = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <Link href="/" className="btn btn-primary">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success text-success-content rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
                <p className="text-base-content/70">Thank you for your order. We'll contact you soon.</p>
            </div>

            <div className="bg-base-200 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-base-content/70">Order ID</p>
                        <p className="font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-base-content/70">Order Date</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-base-content/70">Status</p>
                        <p className="badge badge-warning">{order.status}</p>
                    </div>
                    <div>
                        <p className="text-sm text-base-content/70">Payment Method</p>
                        <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                </div>
            </div>

            <div className="bg-base-200 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {order.customerName}</p>
                    <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                    <p><span className="font-medium">Address:</span> {order.customerAddress}</p>
                    <p><span className="font-medium">Area:</span> {order.isDhaka ? "Inside Dhaka" : "Outside Dhaka"}</p>
                </div>
            </div>

            <div className="bg-base-200 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>
                <div className="space-y-4">
                    {order.orderItems.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
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
                                <p className="text-sm text-base-content/70">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">৳{item.product.price * item.quantity}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-base-200 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>৳{order.totalAmount - order.deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Charge:</span>
                        <span>৳{order.deliveryCharge}</span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total:</span>
                        <span className="text-primary">৳{order.totalAmount}</span>
                    </div>
                </div>
            </div>

            <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <h3 className="font-bold">What's Next?</h3>
                    <div className="text-sm">
                        <p>• We'll call you to confirm your order</p>
                        <p>• Your order will be delivered within 2-5 business days</p>
                        <p>• Pay cash when you receive your order</p>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <Link href="/" className="btn btn-primary">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
