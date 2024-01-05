"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getFiles } from "../utils/files";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Carousel = () => {
  const [fileNames, setFileNames] = useState([""]);
  useEffect(() => {
    getFiles("./public/images/carousel")
      .then((data) => setFileNames(data))
      .catch((e) => console.error(e));
  }, []);
  // if (!fileNames[0]) {
  //   return <div className="skeleton w-screen h-[600px]"></div>;
  // }
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
      {fileNames.map((fileName: string, index) => (
        <SwiperSlide key={index}>
          <Image
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
