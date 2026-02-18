import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import GlobalContext from "./GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://gadgetify-store.vercel.app"),
  title: "Gadgetify | Your Ultimate Tech Destination",
  description:
    "Explore the latest and greatest in tech at Gadgetify. From premium smartphones to powerful laptops and cutting-edge smartwatches, we bring you the future of gadgets. Shop now for exclusive deals!",
  keywords: ["gadgets", "electronics", "smartphones", "laptops", "smartwatches", "tech shop", "Gadgetify"],
  openGraph: {
    title: "Gadgetify | Premium Tech & Gadgets Store",
    description: "Your one-stop shop for all things tech. Premium quality, best prices.",
    url: "https://gadgetify-store.vercel.app", // Placeholder URL
    siteName: "Gadgetify",
    images: [
      {
        url: "/og-image.jpg", // Placeholder image path
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gadgetify | Premium Tech Store",
    description: "The best gadgets at your fingertips. Explore our collection now!",
    images: ["/og-image.jpg"],
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="gadgetify" suppressHydrationWarning>
      <body className={inter.className}>
        <GlobalContext>
          <Drawer>

            <Navbar />
            <div className="flex-1 w-full">
              {children}
            </div>
            <Toast />
            <Footer />
          </Drawer>
        </GlobalContext>
      </body>
    </html>
  );
}
