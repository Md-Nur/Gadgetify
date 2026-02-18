"use client";
import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const Newsletter = () => {
    return (
        <section className="py-24 px-4 md:px-8 bg-base-100">
            <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[3rem] p-8 md:p-16 glass shadow-2xl border border-primary/20">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                        Stay in the <span className="text-gradient">Loop</span>
                    </h2>
                    <p className="text-lg md:text-xl text-base-content/70 mb-10 leading-relaxed text-pretty">
                        Join 20,000+ tech enthusiasts. Get early access to new gadget drops,
                        exclusive deals, and tech news curated for you.
                    </p>

                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex-1 relative group">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="input input-lg w-full rounded-2xl border-primary/20 focus:border-primary transition-all pr-12 group-hover:shadow-lg"
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary opacity-50">
                                @
                            </div>
                        </div>
                        <button className="btn btn-primary btn-lg rounded-2xl px-8 shadow-lg hover:shadow-primary/30 transition-all gap-2 group">
                            Subscribe
                            <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-base-content/40">
                        No spam. Unsubscribe at any time. Read our <span className="underline cursor-pointer hover:text-primary">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
