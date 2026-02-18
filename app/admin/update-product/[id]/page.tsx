import UpdateProductForm from "./UpdateProductForm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}`, {
    cache: "no-store",
  });
  const jdata = await res.json();
  const product = jdata.success ? jdata.data : null;

  if (!product)
    return (
      <div className="h-screen flex justify-center items-center">
        <span className=" loading loading-bars loading-lg"></span>
      </div>
    );

  return <UpdateProductForm id={id} initialProduct={product} />;
};

export default Page;
