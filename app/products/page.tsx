"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Products from "../components/Products";

const ProductsContent = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || undefined;
    const query = searchParams.get("q") || undefined;

    return (
        <div className="flex flex-col gap-4">
            {(category || query) && (
                <div className="flex items-center gap-2 text-sm breadcrumbs opacity-70">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Products</a></li>
                        <li className="font-semibold text-primary">{category || `Search: ${query}`}</li>
                    </ul>
                </div>
            )}
            {/* key={category || query} forces the component to remount and re-fetch when either changes */}
            <Products key={category || query} category={category} query={query} />
        </div>
    );
};

const ProductsPage = () => {
    return (
        <main className="container mx-auto px-4 py-8">
            <Suspense fallback={
                <div className="flex justify-center items-center min-h-[400px]">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            }>
                <ProductsContent />
            </Suspense>
        </main>
    );
};

export default ProductsPage;
