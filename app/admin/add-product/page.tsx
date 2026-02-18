"use client";
import Forms from "@/app/components/Forms";
import { useState } from "react";
import Image from "next/image";

const page = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages: string[] = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);

        const res = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        const jData = await res.json();
        if (jData.success) {
          newImages.push(jData.data.url);
        }
      }
      setImages(newImages);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const categories = [
    "Power Banks",
    "Cables & Adapters",
    "Cases & Covers",
    "Smartwatches",
    "Audio",
    "Accessories",
    "Gaming",
    "Others",
  ];

  const Props: any = {
    headingName: "Add Product",
    method: "POST",
    apiUrl: "/api/product",
    submitName: "Add product",
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl bg-base-100 p-8 rounded-xl shadow-lg",
    onSuccess: () => setImages([]),
  };

  return (
    <Forms {...Props}>
      {/* 1. Image Upload Section - At the beginning and Full Width */}
      <div className="form-control w-full md:col-span-2 lg:col-span-3">
        <label className="label">
          <span className="label-text font-bold text-lg text-primary">1. Product Images</span>
        </label>

        <div className="flex flex-col gap-4 p-6 border-2 border-dashed border-base-300 rounded-xl bg-base-50 transition-all hover:border-primary/50">
          <label
            htmlFor="img"
            className={`flex flex-col items-center justify-center w-full min-h-[120px] cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <div className="flex items-center gap-3">
                  <span className="loading loading-spinner text-primary"></span>
                  <span className="text-sm font-medium">Uploading to cloud...</span>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 mb-3 text-base-content/50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="mb-2 text-sm text-base-content/70"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-base-content/50">PNG, JPG (MAX. 800x400px)</p>
                </>
              )}
            </div>
            <input
              type="file"
              name="image_picker"
              className="hidden"
              accept="image/png, image/jpeg"
              id="img"
              multiple
              onChange={handleImageChange}
            />
          </label>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
              {images.map((url, idx) => (
                <div key={idx} className="relative aspect-square border-2 border-base-200 rounded-lg overflow-hidden group shadow-sm bg-white">
                  <Image
                    src={url}
                    alt={`Preview ${idx}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    ✕
                  </button>
                  {/* Hidden inputs to pass URLs to the form API */}
                  <input type="hidden" name="imageUrls" value={url} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="divider md:col-span-2 lg:col-span-3 my-2 text-base-content/30 italic text-sm font-light">Product Details</div>

      {/* Name - Full Width */}
      <div className="form-control md:col-span-2 lg:col-span-3">
        <label className="label">
          <span className="label-text font-semibold text-base">Product Name</span>
        </label>
        <input
          type="text"
          placeholder="Type product name here"
          name="name"
          className="input input-bordered w-full focus:input-primary transition-all rounded-lg"
          required
        />
      </div>

      {/* Category Selection */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-base">Category</span>
        </label>
        <select
          name="category"
          className="select select-bordered w-full focus:select-primary transition-all rounded-lg"
          required
          defaultValue=""
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Sub-category */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-base">Sub-category</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Flagship, Budget"
          name="subCategory"
          className="input input-bordered w-full focus:input-primary transition-all rounded-lg"
        />
      </div>

      {/* Brand */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-base">Brand</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Apple, Samsung, Dell"
          name="brand"
          className="input input-bordered w-full focus:input-primary transition-all rounded-lg"
        />
      </div>

      {/* Price */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-base">Price (Tk)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 font-medium">Tk.</span>
          <input
            type="number"
            placeholder="0.00"
            name="price"
            className="input input-bordered w-full pl-12 focus:input-primary transition-all rounded-lg"
            required
          />
        </div>
      </div>

      {/* Stock Quantity */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-base">Stock Quantity</span>
        </label>
        <input
          type="number"
          placeholder="0"
          name="stockQuantity"
          className="input input-bordered w-full focus:input-primary transition-all rounded-lg"
          required
        />
      </div>

      {/* Description - Full Width */}
      <div className="form-control md:col-span-2 lg:col-span-3">
        <label className="label">
          <span className="label-text font-semibold text-base">Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full h-32 focus:textarea-primary transition-all rounded-lg resize-none"
          name="description"
          placeholder="Detailed product description"
          required
        />
      </div>
    </Forms>
  );
};

export default page;
