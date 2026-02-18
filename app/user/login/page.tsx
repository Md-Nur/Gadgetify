"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { FaPhone, FaLock, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { useUserAuth } from "@/app/context/userContext";

const Login = () => {
  const router = useRouter();
  const { setUserAuth } = useUserAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Login successful!");
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
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-lg">
            <FaShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h1>
          <p className="text-base-content/70">Login to continue your tech journey</p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100 shadow-2xl border border-base-300 hover:shadow-primary/20 transition-all duration-300">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Phone/Email Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaPhone className="text-primary" />
                    Phone or Email
                  </span>
                </label>
                <input
                  type="text"
                  name="identifier"
                  placeholder="Enter phone or email"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary w-full transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaLock className="text-primary" />
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary w-full transition-all"
                  required
                />
                <label className="label">
                  <a href="#" className="label-text-alt link link-primary hover:link-hover">
                    Forgot password?
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full gap-2 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    Login
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="divider text-sm">New to Gadgetify?</div>

            {/* Sign Up Link */}
            <Link href="/user/signin" className="btn btn-outline btn-secondary w-full">
              Create Account
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 text-center text-sm text-base-content/60">
          <p>🔒 Secure login • 🚀 Fast checkout • 📦 Track orders</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
