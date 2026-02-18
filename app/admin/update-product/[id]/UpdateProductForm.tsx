"use client";
import Forms from "@/app/components/Forms";
import { useState } from "react";
import { Product } from "@/app/products/[slug]/[id]/SingleProduct";

const UpdateProductForm = ({ id, initialProduct }: { id: string, initialProduct: Product }) => {
    const Props: any = {
        headingName: "Update Product",
        method: "PUT",
        apiUrl: `/api/product/${id}`,
        submitName: "Update product",
    };
    const [product, setProduct] = useState<Product>(initialProduct);

    return (
        <Forms {...Props}>
            <input
                type="text"
                placeholder="Product Name"
                name="name"
                className="input input-bordered w-full"
                value={product?.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
            <textarea
                className="textarea textarea-bordered w-full h-52"
                name="description"
                placeholder="Product Description"
                value={product?.description}
                onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                }
            />
            <input
                type="number"
                placeholder="Price"
                name="price"
                className="input input-bordered w-full"
                value={product?.price}
                onChange={(e) =>
                    setProduct({ ...product, price: Number(e.target.value) })
                }
            />
            <label
                htmlFor="img"
                className="flex items-center justify-between w-full px-1 md:px-4 py-1 border rounded"
            >
                <span className="hidden md:inline text-xs">
                    Images: (If you don&apos;t want to update image remain this field
                    blank){" "}
                </span>
                <input
                    type="file"
                    name="images"
                    className="file-input w-full mx-5 rounded max-h-10"
                    accept="image/png, image/jpeg"
                    id="img"
                    multiple
                />
            </label>

            <select
                name="category"
                className="select select-bordered w-full"
                value={product?.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                required
            >
                <option value="" disabled>Select a category</option>
                {[
                    "Power Banks",
                    "Cables & Adapters",
                    "Cases & Covers",
                    "Smartwatches",
                    "Audio",
                    "Accessories",
                    "Gaming",
                    "Others",
                ].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Product Code"
                name="code"
                className="input input-bordered w-full"
                value={product?.code}
                onChange={(e) =>
                    setProduct({ ...product, code: Number(e.target.value) })
                }
            />
            <input
                type="number"
                placeholder="Number of stocks"
                name="stockQuantity"
                className="input input-bordered w-full"
                value={product?.stockQuantity}
                onChange={(e) =>
                    setProduct({ ...product, stockQuantity: Number(e.target.value) })
                }
            />
        </Forms>
    );
};

export default UpdateProductForm;
