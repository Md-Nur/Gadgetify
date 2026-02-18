"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddCartButton from "@/app/components/AddCartButton";
import { useUserAuth } from "@/app/context/userContext";

import DeleteProductButton from "@/app/components/DeleteProductButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  code: number;
  category: string;
  stockQuantity: number;
}

const SingleProduct = ({
  params,
  initialProduct,
}: {
  params: { id: string; slug: string };
  initialProduct?: Product | null;
}) => {
  const { id } = params;
  const { userAuth } = useUserAuth();

  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialProduct) return;
    fetch(`/api/product/${id}`)
      .then((res) => res.json())
      .then((jData) => {
        jData.success ? setProduct(jData.data) : setError(jData.errors);
      })
      .catch((err) => setError(err));
  }, [id, initialProduct]);

  if (error) return <div>Error: {error}</div>;
  if (!product) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 md:px-8 bg-base-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start bg-base-200/30 rounded-[3rem] p-6 md:p-12 border border-primary/5 shadow-2xl">
        <div className="w-full relative group">
          <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <Swiper
            key={product.id}
            modules={[Autoplay, Navigation, Pagination]}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={product.images.length > 1}
            className="rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden bg-base-100"
          >
            {product.images.map((image: string, index) => (
              <SwiperSlide key={index}>
                <div className="flex w-full aspect-square md:aspect-[4/3] items-center justify-center p-4">
                  <Image
                    src={image[1] === "/" ? image.slice(8) : image}
                    alt={`${product.name} - image ${index + 1}`}
                    height={800}
                    width={800}
                    className="object-contain w-full h-full rounded-2xl"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex flex-col h-full justify-center">
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <span className="badge badge-primary badge-outline font-bold">Code: {product.code}</span>
              <span className="badge badge-secondary badge-outline font-bold">{product.category}</span>
            </div>
          </div>

          <div className="bg-base-100/50 p-6 rounded-3xl border border-primary/10 mb-8 backdrop-blur-sm">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl md:text-5xl font-black text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.2)]">৳{product.price}</span>
              <del className="text-xl text-base-content/40 mb-1">
                ৳{Math.round(product.price * 1.1)}
              </del>
            </div>
            <p className="text-sm opacity-60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              In Stock: {product.stockQuantity} items
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <AddCartButton
              productId={id}
              name={product.name}
              price={product.price}
              className="btn-lg w-full rounded-2xl shadow-lg border-none"
            />
            <Link href="/order-form" className="btn btn-secondary btn-lg rounded-2xl shadow-lg font-black w-full">
              Order Now
            </Link>

            {userAuth.isAdmin && (
              <div className="col-span-1 sm:col-span-2 flex gap-3 mt-2">
                <Link
                  href={`/admin/update-product/${params.id}`}
                  className="btn btn-outline btn-info flex-1 rounded-xl"
                >
                  Update Product
                </Link>
                <DeleteProductButton id={params.id} />
              </div>
            )}
          </div>

          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-xs md:text-sm text-base-content/70 italic text-pretty">
            <span className="font-bold text-error">নোট :</span> পণ্যের ছবি এবং বিবরণীর সাথে মিল থাকা সত্ত্বেও পণ্য গ্রহণ করতে না চাইলে ডেলিভারি চার্জ (ঢাকা: ৬০৳, ঢাকার বাইরে: ১৩০৳) প্রদান করতে হবে।
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-20">
        <h3 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3">
          Product <span className="text-gradient">Description</span>
          <div className="h-1 flex-1 bg-gradient-to-r from-primary/20 to-transparent rounded-full"></div>
        </h3>
        <div className="bg-base-200/50 rounded-[2.5rem] p-8 md:p-12 border border-primary/5 shadow-xl leading-relaxed text-pretty text-lg text-base-content/80">
          {product.description}
        </div>
      </div>
    </div>
  );
};
export default SingleProduct;
