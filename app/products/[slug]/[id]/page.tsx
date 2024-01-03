"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Product {
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
  const { id, slug } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => setError(err));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Loading...</div>;
  console.log(product.images);
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="w-full lg:w-1/2"
          >
            {product.images.map((image: string) => (
              <SwiperSlide>
                <Image
                  key={image}
                  src={image.slice(8)}
                  alt={image.slice(8)}
                  height={500}
                  width={500}
                  className="object-cover max-h-[600px]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div>
            <h1 className="text-5xl font-bold">Box Office News!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
