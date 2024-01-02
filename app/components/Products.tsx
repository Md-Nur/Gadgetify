"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-9">Products</h1>
      <div className="flex flex-wrap justify-around items-center">
        {products.map((product) => (
          <div
            className="card w-64 sm:w-96 h-[500px] m-5 bg-base-100 shadow-xl"
            key={product.id}
          >
            <figure>
              <Image
                src={product.images[0].slice(8)}
                alt={product.images[0].slice(8)}
                width={500}
                height={500}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p>
                Tk. {product.price} {" "}
                <del className="text-red-500">
                  {product.price + product.price / 10}
                </del>
              </p>

              <div className="card-actions justify-end">
                <button className="btn btn-primary">Add to Cart</button>
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;
