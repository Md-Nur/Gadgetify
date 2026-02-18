"use client";
import React from "react";

const Stats = () => {
    const stats = [
        { label: "Happy Customers", value: "50K+" },
        { label: "Gadgets Sold", value: "120K+" },
        { label: "Global Brands", value: "45+" },
        { label: "Service Centers", value: "15+" },
    ];

    return (
        <section className="py-20 relative overflow-hidden bg-neutral text-neutral-content">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <span className="text-4xl md:text-6xl font-black text-gradient">
                                {stat.value}
                            </span>
                            <span className="text-sm md:text-lg font-bold uppercase tracking-widest opacity-60">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
