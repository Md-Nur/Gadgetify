"use client";
import React from "react";
import { FaShippingFast, FaLock, FaHeadset, FaTag } from "react-icons/fa";

const Features = () => {
    const features = [
        {
            icon: <FaShippingFast className="w-8 h-8" />,
            title: "Fast Shipping",
            description: "Get your gadgets delivered within 24-48 hours nationwide.",
            color: "from-blue-500 to-cyan-400",
        },
        {
            icon: <FaLock className="w-8 h-8" />,
            title: "Secure Payment",
            description: "Multiple secure payment options with SSL encryption.",
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: <FaHeadset className="w-8 h-8" />,
            title: "24/7 Support",
            description: "Our tech experts are always here to help you out.",
            color: "from-emerald-500 to-teal-400",
        },
        {
            icon: <FaTag className="w-8 h-8" />,
            title: "Best Prices",
            description: "Guaranteed best market prices for all original products.",
            color: "from-orange-500 to-yellow-400",
        },
    ];

    return (
        <section className="py-20 px-4 md:px-8 bg-base-200/50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 bg-base-100 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/5 hover:border-primary/20 hover:-translate-y-2"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-extrabold mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-base-content/60 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
