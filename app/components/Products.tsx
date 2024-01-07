"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import DeleteProductButton from "./DeleteProductButton";

const Products = () => {
  // interface Props {
  //   id: string;
  // }
  const [products, setProducts]: [
    {
      id: number;
      name: string;
      price: number;
      description: string;
      images: string[];
      brand: string;
      category: string;
      stockQuantity: number;
    }[],
    any
  ] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => data.reverse())
      .then((data) => setProducts(data))
      .catch((err) => setError(err));
  }, [error, products]);
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-9">Products</h1>
      <div className="flex flex-wrap justify-around items-center">
        {products.length < 1
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-4 h-[500px] w-[90vw] max-w-md shadow"
              >
                <div className="skeleton h-72 w-full"></div>
                <div className="skeleton h-4 w-44 ml-5"></div>
                <div className="skeleton h-4 w-44 ml-5"></div>
                <div className="skeleton h-10 w-44 ml-7 md:ml-48"></div>
              </div>
            ))
          : products.map((product) => (
              <div
                className="card w-[95vw] max-w-md h-[500px] m-1 md:m-5 bg-base-100 shadow-xl"
                key={product.id}
              >
                <figure>
                  <Link
                    href={`/products/${product.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}/${product.id}`}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.images[0]}
                      width={500}
                      height={500}
                    />
                  </Link>
                </figure>
                <div className="card-body">
                  <Link
                    href={`/products/${product.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}/${product.id}`}
                  >
                    <h2 className="card-title">{product.name}</h2>
                  </Link>
                  <p>
                    Tk. {product.price}{" "}
                    <del className="text--400">
                      {product.price + product.price / 10}
                    </del>
                  </p>

                  <div className="card-actions justify-end">
                    <Link href="/order-form" className="btn btn-primary">
                      Add to Cart
                    </Link>
                    <Link href="/order-form" className="btn btn-success">
                      Order Now
                    </Link>
                    {/* <DeleteProductButton {...{ id: product.id }} />
                    <Link
                      href={`/admin/update-product/${product.id}`}
                      className="btn btn-info"
                    >
                      Update
                    </Link> */}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default Products;
