"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartContext } from "../context/cartContext";
import { useUserAuth } from "../context/userContext";
import { toast } from "react-toastify";

const OrderForm = () => {
  const router = useRouter();
  const { cartStatus } = useCartContext();
  const { userAuth } = useUserAuth();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    isDhaka: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autofill form if user is logged in
  useEffect(() => {
    if (userAuth.id) {
      setFormData((prev) => ({
        ...prev,
        customerName: userAuth.name || prev.customerName,
        customerPhone: userAuth.phone || prev.customerPhone,
        customerAddress: userAuth.address || prev.customerAddress,
      }));
    }
  }, [userAuth]);

  // Calculate totals
  const subtotal = cartStatus.reduce(
    (sum, item) => sum + (item.productPrice || 0) * (item.productQuantity || 0),
    0
  );
  const deliveryCharge = formData.isDhaka ? 60 : 130;
  const total = subtotal + deliveryCharge;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        isDhaka: value === "1",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartStatus.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        cartItems: cartStatus.map((item) => ({
          productId: item.productId,
          quantity: item.productQuantity,
        })),
        userId: userAuth.id || null,
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Order placed successfully!");
        // Clear cart in localStorage
        localStorage.removeItem("cart");
        // Redirect to confirmation page
        router.push(`/order-confirmation/${result.data.id}`);
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("An error occurred while placing your order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartStatus.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-base-content/70 mb-6">Add some products to your cart before placing an order.</p>
          <a href="/" className="btn btn-primary">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 md:px-8 bg-base-100 min-h-screen">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-center mb-4 tracking-tight">
          Complete Your <span className="text-gradient">Order</span>
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Order Form */}
        <div className="lg:col-span-7 bg-base-200/50 p-6 md:p-8 rounded-[2.5rem] border border-primary/5 shadow-xl">
          <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm">1</span>
            Customer Information
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label text-xs font-bold uppercase tracking-wider opacity-50 px-2">Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="input input-bordered w-full rounded-2xl bg-base-100 border-primary/10 focus:input-primary transition-all shadow-sm"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold uppercase tracking-wider opacity-50 px-2">Phone Number</label>
                <input
                  type="tel"
                  name="customerPhone"
                  placeholder="017XXXXXXXX"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  className="input input-bordered w-full rounded-2xl bg-base-100 border-primary/10 focus:input-primary transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold uppercase tracking-wider opacity-50 px-2">Delivery Area</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${!formData.isDhaka ? 'border-primary bg-primary/5 shadow-md' : 'border-base-300 hover:border-primary/30'}`}>
                  <input
                    type="radio"
                    value="0"
                    name="area"
                    className="radio radio-primary"
                    checked={!formData.isDhaka}
                    onChange={handleChange}
                  />
                  <div>
                    <span className="font-bold block">Outside Dhaka</span>
                    <span className="text-xs opacity-60">Delivery: ৳130</span>
                  </div>
                </label>
                <label className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.isDhaka ? 'border-primary bg-primary/5 shadow-md' : 'border-base-300 hover:border-primary/30'}`}>
                  <input
                    type="radio"
                    value="1"
                    name="area"
                    className="radio radio-primary"
                    checked={formData.isDhaka}
                    onChange={handleChange}
                  />
                  <div>
                    <span className="font-bold block">Inside Dhaka</span>
                    <span className="text-xs opacity-60">Delivery: ৳60</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold uppercase tracking-wider opacity-50 px-2">Delivery Address</label>
              <textarea
                name="customerAddress"
                placeholder="Street address, Apartment, City"
                value={formData.customerAddress}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-32 rounded-2xl bg-base-100 border-primary/10 focus:textarea-primary transition-all shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner text-white"></span>
              ) : (
                "Place Order (Cash on Delivery)"
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 bg-neutral text-neutral-content p-8 rounded-[2.5rem] shadow-2xl sticky top-24 border border-white/5">
          <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">2</span>
            Order Summary
          </h2>

          <div className="space-y-4 mb-8 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {cartStatus.map((item) => (
              <div key={item.productId} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <div className="flex flex-col">
                  <span className="font-bold text-sm md:text-base line-clamp-1">{item.productName}</span>
                  <span className="text-xs opacity-60">Quantity: {item.productQuantity}</span>
                </div>
                <span className="font-black text-primary">৳{(item.productPrice || 0) * (item.productQuantity || 0)}</span>
              </div>
            ))}
          </div>

          <div className="divider opacity-10"></div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="opacity-60">Subtotal:</span>
              <span className="font-bold">৳{subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="opacity-60">Delivery:</span>
              <span className="font-bold">৳{deliveryCharge}</span>
            </div>
            <div className="divider opacity-10 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total Amount</span>
              <span className="text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">৳{total}</span>
            </div>
          </div>

          <div className="alert bg-white/5 border-none mt-10 rounded-2xl flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-primary shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h4 className="font-bold text-sm">Payment Method</h4>
              <p className="text-xs opacity-60 italic">Cash on Delivery available nationwide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-base-200/50 p-6 rounded-3xl text-center mt-12 border border-primary/5">
        <p className="text-sm md:text-base text-base-content/70 italic leading-relaxed">
          <span className="font-bold text-error">নোট:</span> পণ্যের ছবি এবং বিবরণীর সাথে মিল থাকা সত্ত্বেও পণ্য গ্রহণ করতে না চাইলে ডেলিভারি চার্জ প্রদান করতে হবে।
        </p>
      </div>
    </div>
  );
};

export default OrderForm;
