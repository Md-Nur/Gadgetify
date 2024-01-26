"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddCartButton from "@/app/components/AddCartButton";

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
}: {
  params: { id: string; slug: string };
}) => {
  const { id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/product/${id}`)
      .then((res) => res.json())
      .then((jData) => {
        jData.success ? setProduct(jData.data) : setError(jData.errors);
      })
      .catch((err) => setError(err));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!product) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="flex flex-col lg:flex-row justify-evenly items-center bg-base-200 rounded p-5 gap-5">
        <div className="w-full lg:w-1/2">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={50}
            slidesPerView={1}
            autoplay
            loop={true}
            className=""
          >
            {product.images.map((image: string, index) => (
              <SwiperSlide className="my-auto" key={index}>
                <div className="flex w-full h-full items-center justify-center">
                  <Image
                    key={image}
                    src={image[1] === "/" ? image.slice(8) : image}
                    alt={image.slice(8)}
                    height={600}
                    width={1000}
                    className="object-cover rounded-lg max-h-[600px]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <span className="text-sm">Code:{product.code}</span>

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
            <AddCartButton
              productId={id}
              name={product.name}
              price={product.price}
            />

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
      <div className="bg-base-200 rounded my-10 p-3">
        <h3 className="text-2xl font-bold pt-3">Description: </h3>
        <p className="">{product.description}</p>
      </div>
    </div>
  );
};
export default SingleProduct;
