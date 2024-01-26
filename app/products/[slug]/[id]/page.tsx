import type { Metadata } from "next";
import SingleProduct from "./SingleProduct";

let id: string;
const Page = ({ params }: { params: { id: string; slug: string } }) => {
  id = params.id;
  return <SingleProduct params={params} />;
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}`
  );
  const jData = await data.json();
  if (jData.success) {
    const product = await jData.data;
    return {
      title: `${product.name} - Gadgetify`,
      description: `${product.description} || Gadgetify is a one-stop shop for all your gadgets needs. We sell everything from phones to laptops to smartwatches and more!  Come visit us today!`,
    };
  } else {
    return {
      title: "Gadgetify",
      description:
        "Gadgetify is a one-stop shop for all your gadgets needs. We sell everything from phones to laptops to smartwatches and more!  Come visit us today!",
    };
  }
}
export default Page;
