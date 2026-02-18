"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaBox, FaTruck, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";

const TrackOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) {
            toast.error("Please enter a valid Order ID");
            return;
        }

        setIsSearching(true);
        // Redirect to the order confirmation page which acts as the order view
        router.push(`/order-confirmation/${orderId.trim()}`);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-secondary/5 via-base-100 to-primary/5">
            <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
                <div className="space-y-4">
                    <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-2 text-primary">
                        <FaBox className="w-10 h-10 animate-bounce" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        Track Your <span className="text-gradient">Order</span>
                    </h1>
                    <p className="text-lg text-base-content/60 max-w-md mx-auto">
                        Stay updated on your gadget delivery. Enter your Order ID below to see the current status.
                    </p>
                </div>

                <div className="card bg-base-100 shadow-2xl border border-primary/10 rounded-[2.5rem] overflow-hidden">
                    <div className="card-body p-8 md:p-12">
                        <form onSubmit={handleTrack} className="space-y-6">
                            <div className="form-control relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity">
                                    <FaSearch className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Order ID (e.g. 123e4567...)"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="input input-lg input-bordered w-full pl-14 py-8 rounded-2xl bg-base-200/50 focus:bg-base-100 border-primary/10 focus:input-primary transition-all text-lg font-medium shadow-inner"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-black text-lg gap-3"
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    <>
                                        Track Progress
                                        <FaChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-primary/5 flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
                            <FaTruck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold">Real-time Tracking</h3>
                            <p className="text-sm opacity-60">Get instant updates from warehouse to doorstep.</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-primary/5 flex items-start gap-4 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success shrink-0">
                            <FaSearch className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold">Where is my ID?</h3>
                            <p className="text-sm opacity-60">Check your email or order confirmation page.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
