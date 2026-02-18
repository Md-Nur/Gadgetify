"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddCartButton from "./AddCartButton";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  brand: string;
  category: string;
  stockQuantity: number;
}

const Products = ({
  initialProducts,
  category,
  query
}: {
  initialProducts?: Product[],
  category?: string,
  query?: string
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!initialProducts);

  useEffect(() => {
    // If category or query changes, we should always fetch
    if (initialProducts && !category && !query && products.length > 0) return;

    setLoading(true);

    let url = "/api/product";
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (query) params.append("q", query);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    fetch(url)
      .then((res) => res.json())
      .then((jData) => {
        if (jData.success) {
          setProducts(jData.data.reverse());
        } else {
          setProducts([]); // Clear products if none found or error
          if (jData.status !== 404) setError(jData.errors);
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [category, query]); // Depend on category to refetch when it changes

  if (error) return <div className="text-center text-error my-10">Error: {error}</div>;

  return (
    <section id="products" className="py-16 px-4 md:px-8 bg-base-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tight">
            {query ? "Search" : category ? "Category" : "Featured"}{" "}
            <span className="text-gradient">{query ? "Results" : category ? "Collection" : "Innovations"}</span>
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          {(category || query) && (
            <p className="mt-4 text-xl text-base-content/60 font-medium">
              Browsing {category ? <span className="text-primary">{category}</span> : query ? <>results for &quot;<span className="text-primary">{query}</span>&quot;</> : null}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-4 h-[520px] w-full max-w-sm rounded-3xl bg-base-200/50 p-6 animate-pulse"
              >
                <div className="skeleton h-64 w-full rounded-2xl"></div>
                <div className="skeleton h-8 w-3/4 mt-4"></div>
                <div className="skeleton h-6 w-1/2"></div>
                <div className="skeleton h-12 w-full mt-auto"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div
                className="group card w-full max-w-sm bg-base-100 shadow-xl border border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-[2.5rem] overflow-hidden"
                key={product.id}
              >
                <figure className="relative h-64 overflow-hidden bg-base-200">
                  <Link
                    href={`/products/${product.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}/${product.id}`}
                    className="w-full h-full block"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                  <div className="absolute top-4 right-4 badge badge-primary font-bold px-3 py-3 border-none shadow-md">
                    New
                  </div>
                </figure>
                <div className="card-body p-8">
                  <Link
                    href={`/products/${product.name
                      .replace(/\s+/g, "-")
                      .toLowerCase()}/${product.id}`}
                  >
                    <h2 className="card-title text-2xl font-bold group-hover:text-primary transition-colors mb-2">
                      {product.name}
                    </h2>
                  </Link>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl font-black text-primary">Tk. {product.price}</span>
                    <del className="text-base-content/40 text-sm">
                      Tk. {Math.round(product.price * 1.1)}
                    </del>
                  </div>

                  <div className="card-actions grid grid-cols-2 gap-3 mt-auto">
                    <AddCartButton
                      productId={product.id}
                      name={product.name}
                      price={product.price}
                      className="w-full"
                    />
                    <Link href="/order-form" className="btn btn-secondary btn-outline hover:btn-secondary rounded-btn font-bold w-full">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 px-4 glass rounded-3xl w-full">
              <h2 className="text-3xl font-bold text-base-content/40 mb-2">No Products Found</h2>
              <p className="text-base-content/50 text-lg">Check back later for our latest gadget drops!</p>
            </div>
          )}
        </div>
      </div>
    </section>

  );
};

export default Products;
