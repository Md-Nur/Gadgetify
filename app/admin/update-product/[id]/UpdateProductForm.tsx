"use client";
import Forms from "@/app/components/Forms";
import { useState } from "react";
import { Product } from "@/app/products/[slug]/[id]/SingleProduct";

const UpdateProductForm = ({ id, initialProduct }: { id: string, initialProduct: Product }) => {
    const categories = [
        { value: "Power Banks", label: "পাওয়ার ব্যাংক" },
        { value: "Cables & Adapters", label: "ক্যাবল ও অ্যাডাপ্টার" },
        { value: "Cases & Covers", label: "কেস ও কভার" },
        { value: "Smartwatches", label: "স্মার্টওয়াচ" },
        { value: "Audio", label: "অডিও" },
        { value: "Accessories", label: "অ্যাকসেসরিস" },
        { value: "Gaming", label: "গেমিং" },
        { value: "Others", label: "অন্যান্য" },
    ];

    const Props: any = {
        headingName: "পণ্য আপডেট করুন",
        method: "PUT",
        apiUrl: `/api/product/${id}`,
        submitName: "আপডেট করুন",
        className: "grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl bg-base-100 p-8 rounded-3xl shadow-xl mt-4",
    };
    const [product, setProduct] = useState<Product>(initialProduct);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-0">
                <h1 className="text-3xl font-bold">পণ্য আপডেট</h1>
                <p className="text-base-content/60 mt-1">পণ্যের তথ্য পরিবর্তন করুন।</p>
            </div>

            <Forms {...Props}>
                <div className="form-control md:col-span-2">
                    <label className="label">
                        <span className="label-text font-bold text-base">পণ্যের নাম</span>
                    </label>
                    <input
                        type="text"
                        placeholder="পণ্যের নাম লিখুন"
                        name="name"
                        className="input input-bordered w-full focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
                        value={product?.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        required
                    />
                </div>

                <div className="form-control md:col-span-2">
                    <label className="label">
                        <span className="label-text font-bold text-base">পণ্যের বর্ণনা</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered w-full h-40 focus:textarea-primary transition-all rounded-3xl resize-none p-6 bg-base-200/50"
                        name="description"
                        placeholder="পণ্যের বিস্তারিত বর্ণনা"
                        value={product?.description}
                        onChange={(e) =>
                            setProduct({ ...product, description: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-bold text-base">মূল্য (টাকা)</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">৳</span>
                        <input
                            type="number"
                            placeholder="০.০০"
                            name="price"
                            className="input input-bordered w-full pl-10 focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
                            value={product?.price}
                            onChange={(e) =>
                                setProduct({ ...product, price: Number(e.target.value) })
                            }
                            required
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-bold text-base">ক্যাটাগরি</span>
                    </label>
                    <select
                        name="category"
                        className="select select-bordered w-full focus:select-primary transition-all rounded-2xl h-14 bg-base-200/50"
                        value={product?.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        required
                    >
                        <option value="" disabled>একটি ক্যাটাগরি নির্বাচন করুন</option>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-bold text-base">পণ্যের কোড</span>
                    </label>
                    <input
                        type="number"
                        placeholder="পণ্যের কোড"
                        name="code"
                        className="input input-bordered w-full focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
                        value={product?.code}
                        onChange={(e) =>
                            setProduct({ ...product, code: Number(e.target.value) })
                        }
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-bold text-base">স্টকের পরিমাণ</span>
                    </label>
                    <input
                        type="number"
                        placeholder="সংখ্যা লিখুন"
                        name="stockQuantity"
                        className="input input-bordered w-full focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
                        value={product?.stockQuantity}
                        onChange={(e) =>
                            setProduct({ ...product, stockQuantity: Number(e.target.value) })
                        }
                        required
                    />
                </div>

                <div className="form-control md:col-span-2">
                    <label className="label">
                        <span className="label-text font-bold text-base text-primary">পণ্যের ছবি</span>
                    </label>
                    <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-base-300 rounded-2xl bg-base-200/30">
                        <span className="text-xs opacity-60">
                            (যদি ছবি পরিবর্তন করতে না চান তবে এই ঘরটি ফাঁকা রাখুন)
                        </span>
                        <input
                            type="file"
                            name="images"
                            className="file-input file-input-bordered file-input-primary w-full rounded-xl"
                            accept="image/png, image/jpeg"
                            id="img"
                            multiple
                        />
                    </div>
                </div>
            </Forms>
        </div>
    );
};

export default UpdateProductForm;
