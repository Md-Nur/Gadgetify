import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gadgetify ",
  description:
    "Gadgetify is a one-stop shop for all your gadgets needs. We sell everything from phones to laptops to smartwatches and more!  Come visit us today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="corporate">
      <body className={inter.className}>
        <Drawer>
          <Navbar />
          <div className="py-8"></div>{" "}
          {/* This the the buffer space for navbar fixed */}
          <Toast />
          {children}
          <Footer />
        </Drawer>
      </body>
    </html>
  );
}
