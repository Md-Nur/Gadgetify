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
    { value: "Power Banks", label: "পাওয়ার ব্যাংক" },
    { value: "Cables & Adapters", label: "কিউবল ও অ্যাডাপ্টার" },
    { value: "Cases & Covers", label: "কেস ও কভার" },
    { value: "Smartwatches", label: "স্মার্টওয়াচ" },
    { value: "Audio", label: "অডিও" },
    { value: "Accessories", label: "অ্যাকসেসরিস" },
    { value: "Gaming", label: "গেমিং" },
    { value: "Others", label: "অন্যান্য" },
  ];

  const Props: any = {
    headingName: "পণ্য যোগ করুন",
    method: "POST",
    apiUrl: "/api/product",
    submitName: "পণ্য যোগ করুন",
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl bg-base-100 p-8 rounded-3xl shadow-xl mt-4",
    onSuccess: () => setImages([]),
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-0">
        <h1 className="text-3xl font-bold">পণ্য ব্যবস্থাপনা</h1>
        <p className="text-base-content/60 mt-1">দোকানে নতুন পণ্য যোগ করুন।</p>
      </div>

      <Forms {...Props}>
        {/* 1. Image Upload Section - At the beginning and Full Width */}
        <div className="form-control w-full md:col-span-2 lg:col-span-3">
          <label className="label">
            <span className="label-text font-bold text-lg text-primary">১. পণ্যের ছবি</span>
          </label>

          <div className="flex flex-col gap-4 p-8 border-2 border-dashed border-base-300 rounded-3xl bg-base-200/30 transition-all hover:border-primary/50 group">
            <label
              htmlFor="img"
              className={`flex flex-col items-center justify-center w-full min-h-[160px] cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <span className="text-sm font-bold text-primary animate-pulse">ক্লাউডে আপলোড হচ্ছে...</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-primary/10 text-primary p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                    </div>
                    <p className="mb-2 text-sm text-base-content/70"><span className="font-bold text-primary">আপলোড করতে ক্লিক করুন</span> অথবা ড্র্যাগ করে আনুন</p>
                    <p className="text-xs text-base-content/40 uppercase tracking-widest font-bold">PNG, JPG (সর্বোচ্চ ৮০০x৪০০ পিক্সেল)</p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                {images.map((url, idx) => (
                  <div key={idx} className="relative aspect-square border border-base-300 rounded-2xl overflow-hidden group shadow-sm bg-base-100">
                    <Image
                      src={url}
                      alt={`Preview ${idx}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 btn btn-circle btn-xs btn-error shadow-lg"
                    >
                      ✕
                    </button>
                    {/* Hidden inputs to pass URLs to the form API */}
                    <input type="hidden" name="images" value={url} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="divider md:col-span-2 lg:col-span-3 my-6 text-base-content/30 italic text-sm font-medium">পণ্যের বিবরণ</div>

        {/* Name - Full Width */}
        <div className="form-control md:col-span-2 lg:col-span-3">
          <label className="label">
            <span className="label-text font-bold text-base">পণ্যের নাম</span>
          </label>
          <input
            type="text"
            placeholder="এখানে পণ্যের নাম লিখুন"
            name="name"
            className="input input-bordered w-full focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-base">ক্যাটাগরি</span>
          </label>
          <select
            name="category"
            className="select select-bordered w-full focus:select-primary transition-all rounded-2xl h-14 bg-base-200/50"
            required
            defaultValue=""
          >
            <option value="" disabled>একটি ক্যাটাগরি নির্বাচন করুন</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Sub-category */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-base">সাব-ক্যাটাগরি</span>
          </label>
          <input
            type="text"
            placeholder="যেমন: ফ্ল্যাগশিপ, বাজেট"
            name="subCategory"
            className="input input-bordered w-full focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
          />
        </div>

        {/* Brand */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-base">ব্র্যান্ড</span>
          </label>
          <input
            type="text"
            placeholder="যেমন: অ্যাপল, স্যামসাং, ডেল"
            name="brand"
            className="input input-bordered w-full focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
          />
        </div>

        {/* Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-base">মূল্য (টাকা)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">৳</span>
            <input
              type="number"
              placeholder="০.০০"
              name="price"
              className="input input-bordered w-full pl-10 focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
              required
            />
          </div>
        </div>

        {/* Stock Quantity */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold text-base">স্টকের পরিমাণ</span>
          </label>
          <input
            type="number"
            placeholder="০"
            name="stockQuantity"
            className="input input-bordered w-full focus:input-primary transition-all rounded-2xl h-14 bg-base-200/50"
            required
          />
        </div>

        {/* Description - Full Width */}
        <div className="form-control md:col-span-2 lg:col-span-3">
          <label className="label">
            <span className="label-text font-bold text-base">বর্ণনা</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-40 focus:textarea-primary transition-all rounded-3xl resize-none p-6 bg-base-200/50"
            name="description"
            placeholder="পণ্যের বিস্তারিত বর্ণনা"
            required
          />
        </div>
      </Forms>
    </div>
  );
};

export default page;
