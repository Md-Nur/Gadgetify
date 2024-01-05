import Forms from "@/app/components/Forms";
import React from "react";
import prisma from "@/prisma/client";
import { fileToUrl } from "@/app/utils/files";
import { z } from "zod";
import { redirect } from "next/navigation";

export const productSchema: any = z.object({
  name: z.string(),
  price: z.number().min(1),
  description: z.string().max(1000),
  images: z.array(z.string()),
  stockQuantity: z.number(),
  brand: z.string(),
  category: z.string(),
});

const page = () => {
  const addProduct = async (data: FormData) => {
    "use server";
    const files: any = data.getAll("images");

    const images = await fileToUrl(files);
    if (!images || images.length < 1) {
      throw Error("Images are required");
    }
    const body = {
      name: data.get("name")?.toString(),
      price: Number(data.get("price") || 1),
      description: data.get("description"),
      images: images,
      brand: data.get("brand")?.toString() || "",
      category: data.get("category")?.toString() || "",
      stockQuantity: Number(data.get("stockQuantity")),
    };
    const validatedData = productSchema.safeParse(body);

    if (!validatedData.success) {
      throw Error(validatedData.error.errors);
    }
    const product = await prisma.product.create({ data: validatedData.data });

    if (!product) {
      throw Error("Something went wrong");
    }
    redirect("/");
  };

  const Props: any = {
    headingName: "Add Product",
    action: addProduct,
    method: "POST",
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
      <div className="flex justify-evenly w-full flex-wrap ">
        <input
          type="submit"
          value="Add Product"
          className="btn btn-outline rounded"
        />
        <input type="reset" className="btn btn-outline rounded" value="Clear" />
      </div>
    </Forms>
  );
};

export default page;
