import Forms from "@/app/components/Forms";

const page = () => {
  const Props: any = {
    headingName: "Add Product",
    method: "POST",
    apiUrl: "/api/product",
    submitName: "Add product"
  };
  return (
    <Forms {...Props}>
      <input
        type="text"
        placeholder="Product Name"
        name="name"
        className="input input-bordered w-full"
        required
      />
      <textarea
        className="textarea textarea-bordered w-full"
        name="description"
        placeholder="Product Description"
        required
      />
      <input
        type="number"
        placeholder="Price"
        name="price"
        className="input input-bordered w-full"
        required
      />
      <label
        htmlFor="img"
        className="flex items-center justify-between w-full px-4 py-1 border rounded"
      >
        <span className="text-lg">Images: </span>
        <input
          type="file"
          name="images"
          className="file-input w-full mx-5 rounded max-h-10"
          accept="image/png, image/jpeg"
          required
          id="img"
          multiple
        />
      </label>
      <input
        type="text"
        placeholder="Brand"
        name="brand"
        className="input input-bordered w-full"
      />
      <input
        type="text"
        placeholder="Category"
        name="category"
        className="input input-bordered w-full"
      />
      <input
        type="number"
        placeholder="Number of stocks"
        name="stockQuantity"
        className="input input-bordered w-full"
        required
      />
      
    </Forms>
  );
};

export default page;
