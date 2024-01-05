import Logo from "@/public/images/logo2.jpg";
import Image from "next/image";
const Hero = () => {
  return (
    <div className="hero min-h-[600px] bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <Image
          src={Logo}
          alt="Hero Image"
          className="max-w-md md:max-w-lg rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">Gadgetify</h1>
          <p className="py-6">
          Gadgetify is a one-stop shop for all your gadgets needs. We sell everything from phones to laptops to smartwatches and more!  Come visit us today!
          </p>
          {/* <button className="btn btn-primary">Get Started</button> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
