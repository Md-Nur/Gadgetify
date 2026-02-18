import Hero from "./components/Hero";
import Products from "./components/Products";
import Features from "./components/Features";
import Stats from "./components/Stats";
import Newsletter from "./components/Newsletter";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Home | Gadgetify",
  description: "Browse our exclusive collection of latest gadgets and tech accessories.",
};

export default async function Home() {
  let products: any[] = [];
  try {
    // Limit products on home page to latest 12 for better performance
    products = await prisma.product.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="overflow-hidden">
      <Hero />
      <Features />
      <Products initialProducts={products} />
      <Stats />
      <Newsletter />
    </main>
  );
}
