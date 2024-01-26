"use client";
import Forms from "@/app/components/Forms";
import { useEffect, useState } from "react";
import { Product } from "@/app/products/[slug]/[id]/SingleProduct";

const UpdateProduct = ({ params }: { params: { id: string } }) => {
  const Props: any = {
    headingName: "Update Product",
    method: "PUT",
    apiUrl: `/api/product/${params.id}`,
    submitName: "Update product",
  };
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(`/api/product/${params.id}`)
      .then((res) => res.json())
      .then((jdata) => {
        jdata.success ? setProduct(jdata.data) : setError(jdata.errors);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error || !product)
    return (
      <div className="h-screen flex justify-center items-center">
        <span className=" loading loading-bars loading-lg"></span>
      </div>
    );

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

      <input
        type="text"
        placeholder="Category"
        name="category"
        className="input input-bordered w-full"
        value={product?.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
      />
      <input
        type="number"
        placeholder="Product Code"
        name="code"
        className="input input-bordered w-full"
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

export default UpdateProduct;
