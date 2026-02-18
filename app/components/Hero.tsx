import Logo from "@/public/images/logo2.png";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <header className="hero min-h-[90vh] bg-base-200 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 pointer-events-none"></div>
      <div className="hero-content flex-col lg:flex-row-reverse gap-12 px-6 max-w-7xl mx-auto py-12 lg:py-0">
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
            <Image
              src={Logo}
              alt="Hero Image"
              className="relative max-w-sm md:max-w-lg w-full drop-shadow-2xl z-10"
              priority
            />
          </div>
        </div>
        <div className="flex-1 text-center lg:text-left z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Elevate Your <span className="text-gradient">Gadget</span> Game
          </h1>
          <p className="py-8 text-lg md:text-xl text-base-content/70 max-w-xl mx-auto lg:mx-0 leading-relaxed text-pretty">
            Discover the future of tech with Gadgetify. We curate the most innovative
            phones, laptops, and smartwatches to keep you ahead of the digital curve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="#products" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/30 transition-all px-8">
              Shop Now
            </Link>
            <Link href="/products" className="btn btn-outline btn-lg px-8 hover:bg-base-300 transition-colors">
              Explore All
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
