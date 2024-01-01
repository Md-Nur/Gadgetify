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

const Carousel = () => {
  const [fileNames, setFileNames] = useState(["./public/images/logo.png"]);
  useEffect(() => {
    fetch("./api/files")
      .then((res) => res.json())
      .then((data) => setFileNames(data.carousel))
      .catch((err) => console.log(err));
  }, []);
  return (
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
    >
      {fileNames.map((fileName: string) => (
        <SwiperSlide>
          <Image
            key={fileName}
            src={fileName.slice(8)}
            alt={fileName.slice(8)}
            height={600}
            width={2500}
            className="object-cover max-h-[600px]"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
