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
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/60 font-medium">পণ্যের তথ্য লোড হচ্ছে...</p>
      </div>
    );

  return <UpdateProductForm id={id} initialProduct={product} />;
};

export default Page;
