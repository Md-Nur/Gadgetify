"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaUser, FaPhone, FaLock, FaEnvelope, FaMapMarkerAlt, FaImage, FaShoppingBag, FaCheckCircle, FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { useUserAuth } from "@/app/context/userContext";

const Signup = () => {
  const router = useRouter();
  const { setUserAuth } = useUserAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("image", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();
      if (result.success && result.data?.url) {
        setUploadedImageUrl(result.data.url);
      } else {
        toast.error(result.message || "Image upload failed. It will be uploaded during signup.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed. It will be uploaded during signup.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      uploadImage(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("address", formData.address);

      if (uploadedImageUrl) {
        formDataToSend.append("images", uploadedImageUrl);
      } else if (profileImage) {
        formDataToSend.append("images", profileImage);
      }

      const response = await fetch("/api/users/signin", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Account created successfully!");
        if (result.data) {
          setUserAuth({
            id: result.data.id || "",
            name: result.data.name || "",
            phone: result.data.phone || "",
            address: result.data.address || "",
            images: result.data.images || "",
            isAdmin: result.data.isAdmin || false,
          });
        }
        router.push("/");
        router.refresh();
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = formData.password.length >= 8 ? "strong" : formData.password.length >= 6 ? "medium" : "weak";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/5 via-base-100 to-primary/5 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-gradient-to-br from-secondary to-primary rounded-2xl mb-4 shadow-lg">
            <FaShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
            Join Gadgetify!
          </h1>
          <p className="text-base-content/70">Create your account in seconds</p>
        </div>

        {/* Signup Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300 hover:shadow-secondary/20 transition-all duration-300">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaUser className="text-primary" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary w-full transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaEnvelope className="text-primary" />
                    Email <span className="text-xs text-base-content/50">(Optional)</span>
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary w-full transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaPhone className="text-primary" />
                    Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary w-full transition-all"
                  required
                />
              </div>

              {/* Address */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    Address
                  </span>
                </label>
                <textarea
                  name="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={handleChange}
                  className="textarea textarea-bordered focus:textarea-primary w-full transition-all"
                  rows={2}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaLock className="text-primary" />
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary w-full transition-all"
                  required
                  minLength={6}
                />
                {formData.password && (
                  <div className="label">
                    <span className={`label-text-alt ${passwordStrength === "strong" ? "text-success" :
                      passwordStrength === "medium" ? "text-warning" : "text-error"
                      }`}>
                      Strength: {passwordStrength}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaCheckCircle className="text-primary" />
                    Confirm Password
                  </span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary w-full transition-all"
                  required
                />
                {formData.confirmPassword && (
                  <div className="label">
                    <span className={`label-text-alt ${formData.password === formData.confirmPassword ? "text-success" : "text-error"
                      }`}>
                      {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Picture Drag & Drop */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaImage className="text-primary" />
                    Profile Picture <span className="text-xs text-base-content/50">(Optional)</span>
                  </span>
                </label>

                {!imagePreview ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${isDragging
                      ? "border-primary bg-primary/10"
                      : "border-base-300 hover:border-primary hover:bg-base-200"
                      }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg, image/jpg"
                    />
                    <div className="flex flex-col items-center gap-2 text-base-content/60">
                      <div className="p-3 bg-base-200 rounded-full">
                        <FaCloudUploadAlt className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Click to upload or drag & drop</p>
                      <p className="text-xs">SVG, PNG, JPG (max. 800x400px)</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative group w-32 h-32 mx-auto bg-base-200 rounded-full overflow-hidden border-4 border-base-300 shadow-md">
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? "opacity-30" : "opacity-100"}`}
                    />

                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                      </div>
                    )}

                    {!isUploading && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20"
                          title="Change Image"
                        >
                          <FaCloudUploadAlt className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="btn btn-circle btn-sm btn-ghost text-error hover:bg-white/20"
                          title="Remove Image"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {/* Hidden input to keep it working if they click change */}
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg, image/jpg"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full mt-4 gap-2"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : isUploading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Uploading Image...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="divider text-sm">Already a member?</div>

            {/* Login Link */}
            <Link href="/user/login" className="btn btn-outline btn-secondary w-full">
              Login to Account
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 text-center text-sm text-base-content/60">
          <p>🔒 Secure signup • ⚡ Instant access • 🎁 Exclusive deals</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
