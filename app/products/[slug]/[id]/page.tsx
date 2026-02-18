import type { Metadata } from "next";
import SingleProduct from "./SingleProduct";

const Page = async ({ params }: { params: Promise<{ id: string; slug: string }> }) => {
  const awaitedParams = await params;
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${awaitedParams.id}`,
    { cache: "no-store" }
  );
  const jData = await data.json();
  const product = jData.success ? jData.data : null;

  return <SingleProduct params={awaitedParams} initialProduct={product} />;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const awaitedParams = await params;
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${awaitedParams.id}`
  );
  const jData = await data.json();
  if (jData.success) {
    const product = jData.data;
    return {
      title: `${product.name} - Gadgetify`,
      description: `${product.description} || Gadgetify is a one-stop shop for all your gadgets needs.`,
    };
  } else {
    return {
      title: "Gadgetify",
      description: "Gadgetify is a one-stop shop for all your gadgets needs.",
    };
  }
}
export default Page;
