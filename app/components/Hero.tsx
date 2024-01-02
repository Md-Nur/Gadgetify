import React from "react";
import Carousel from "./Carousel";

const Hero = () => {
  return (
    <div className="hero min-h-3/4 bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <Carousel />
        <div>
          <h1 className="text-5xl font-bold">Gadgetify</h1>
          <p className="py-6">
            Grab your favourite gadgets at the best price available in the market.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
