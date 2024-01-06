"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
  brand: string;
  category: string;
  stockQuantity: number;
}

const SingleProduct = ({
  params,
}: {
  params: { id: string; slug: string };
}) => {
  const { id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => setError(err));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!product) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-wrap justify-evenly items-center bg-base-200 rounded m-1 p-1 sm:m-3 sm:p-3 md:m-6 md:p-6 lg:m-8 lg:p-8">
        <div>
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={50}
            slidesPerView={1}
            autoplay
            loop={true}
            className="max-w-[84vw] md:max-w-[42vw]"
          >
            {product.images.map((image: string, index) => (
              <SwiperSlide className="my-auto" key={index}>
                <div className="flex w-full h-full items-center justify-center">
                  <Image
                    key={image}
                    src={image.slice(8)}
                    alt={image.slice(8)}
                    height={500}
                    width={500}
                    className="object-cover rounded-lg max-h-[600px]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="min-w-64 sm:min-w-96 p-3 md:max-w-[42vw]">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <span className="text-sm">Code:{product.id}</span>

          <p className="py-6">
            <h3 className="text-2xl font-bold">
              <del className="text-gray-400">
                ৳{product.price + product.price / 10}
                {"  "}
              </del>
              ৳{product.price}
            </h3>
            <h4 className="font-bold my-5">
              <Link href="tel:01982741706" className="text-xl ">
                01982741706
              </Link>
            </h4>
            Delivery Charge: Inside Dhaka : 60 Tk. / Outside Dhaka : 130 Tk.
          </p>
          <div className="flex flex-wrap items-center justify-evenly w-full">
            <Link href="/order-form" className="btn btn-primary my-3">
              Add to cart
            </Link>
            <Link href="/order-form" className="btn btn-success my-3">
              Order Now
            </Link>
            <DeleteProductButton id={params.id} />
            <Link
              href={`/admin/update-product/${params.id}`}
              className="btn btn-info my-3"
            >
              Update
            </Link>
          </div>
          <p className="my-2">
            নোট : পণ্যের ছবি এবং বিবরণীর সাথে মিল থাকা সত্ত্বেও পণ্য গ্রহণ করতে
            না চাইলে ডেলিভারি চার্জ প্রদান করতে হবে।
          </p>
        </div>
      </div>
      <div className="bg-base-200 rounded m-3 p-3 md:m-6 md:p-6 lg:m-8 lg:p-8">
        <h3 className="text-2xl font-bold pt-3">Description: </h3>
        <p className="">{product.description}</p>
      </div>
    </div>
  );
};
export default SingleProduct;
