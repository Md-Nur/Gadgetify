import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/images/logo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content pt-16 pb-8 border-t border-primary/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/20 rounded-full blur group-hover:blur-md transition duration-300"></div>
                  <Image src={Logo} alt="Gadgetify Logo" width={50} height={50} className="relative" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">GADGETIFY</span>
              </div>
            </Link>
            <p className="text-neutral-content/70 leading-relaxed max-w-xs">
              Providing reliable tech and high-quality gadgets since 2023. Your one-stop shop for the latest electronics and accessories.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebookF />, href: "https://www.facebook.com/profile.php?id=61554402345206", bg: "bg-blue-600" },
                { icon: <FaTwitter />, href: "#", bg: "bg-sky-500" },
                { icon: <FaInstagram />, href: "#", bg: "bg-pink-600" },
                { icon: <FaYoutube />, href: "#", bg: "bg-red-600" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 ${social.bg} rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300 shadow-md`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Explore Shop</h4>
            <ul className="space-y-4 text-neutral-content/70">
              {["Smartphones", "Laptops", "Smartwatches", "Accessories", "Audio Gadgets"].map((item) => (
                <li key={item}>
                  <Link href={`/products?category=${item}`} className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-4 text-neutral-content/70">
              <li><Link href="/cart" className="hover:text-primary transition-colors">My Cart</Link></li>
              <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li className="pt-2">
                <div className="badge badge-primary badge-outline font-bold py-3 px-4">Delivery: ৳60 (Dhaka) | ৳130 (Outside)</div>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Get In Touch</h4>
            <ul className="space-y-5 text-neutral-content/70">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-primary text-lg" />
                </div>
                <span>Mirpur, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <FaPhoneAlt className="text-primary text-lg" />
                </div>
                <span>+880 01770171779</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-primary text-lg" />
                </div>
                <span className="truncate">support@gadgetify.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-content/50">
          <p>© {new Date().getFullYear()} GADGETIFY Industries Ltd. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Safety</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="#" className="hover:text-white transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
