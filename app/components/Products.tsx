"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Products = () => {
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
                className="flex flex-col gap-4 h-[500px] w-64 md:w-96 m-5 shadow"
              >
                <div className="skeleton h-72 w-full"></div>
                <div className="skeleton h-4 w-44 ml-5"></div>
                <div className="skeleton h-4 w-44 ml-5"></div>
                <div className="skeleton h-10 w-44 ml-48"></div>
              </div>
            ))
          : products.map((product) => (
              <div
                className="card w-64 sm:w-96 h-[500px] m-5 bg-base-100 shadow-xl"
                key={product.id}
              >
                <figure>
                  <Link
                    href={`/products/${product.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}/${product.id}`}
                  >
                    <Image
                      src={product.images[0].slice(8)}
                      alt={product.images[0].slice(8)}
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
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
};

export default Products;
