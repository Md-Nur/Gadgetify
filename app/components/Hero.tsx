import Logo from "@/public/images/logo2.png";
import Image from "next/image";
const Hero = () => {
  return (
    <header className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col md:flex-row-reverse">
        <Image src={Logo} alt="Hero Image" className="flex-1 max-w-lg w-full" />
        <div className="flex-1">
          <h1 className="text-5xl font-bold">Gadgetify</h1>
          <p className="py-6">
            Gadgetify is a one-stop shop for all your gadgets needs. We sell
            everything from phones to laptops to smartwatches and more! Come
            visit us today!
          </p>
          {/* <button className="btn btn-primary">Get Started</button> */}
        </div>
      </div>
    </header>
  );
};

export default Hero;
