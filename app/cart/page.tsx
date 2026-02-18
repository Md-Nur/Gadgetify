"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCartContext } from "../context/cartContext";

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { cartStatus, removeFromCart, updateQuantity, loading } = useCartContext();
  useEffect(() => {
    let price = 0;
    cartStatus.forEach((cart) => {
      price += cart?.productPrice * cart?.productQuantity;
    });
    setTotalPrice(price);
  }, [cartStatus]);

  if (loading)
    return (
      <div className="w-full flex py-52 h-full items-center justify-center">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );

  if (cartStatus.length < 1)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-5">
        <div className="w-32 h-32 bg-base-200 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold mb-4">Your Cart is Empty</h2>
        <p className="text-base-content/60 max-w-md mb-10 text-lg">
          Looks like you haven&apos;t added any gadgets yet. Explore our latest innovations and find something perfect for you!
        </p>
        <Link href="/" className="btn btn-primary btn-lg rounded-2xl px-12 shadow-lg hover:shadow-primary/30 transition-all font-bold">
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="overflow-x-auto p-5 m-5 min-h-[500px]">
      <h1 className="text-5xl text-center font-bold my-10">Cart Items</h1>
      <div className="max-w-5xl mx-auto mb-10">
        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto bg-base-100 rounded-3xl shadow-sm border border-primary/5">
          <table className="table w-full">
            <thead className="bg-base-200/50">
              <tr>
                <th className="rounded-tl-3xl py-4">Product</th>
                <th className="py-4">Quantity</th>
                <th className="py-4 text-center">Price</th>
                <th className="py-4 text-center">Subtotal</th>
                <th className="rounded-tr-3xl py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartStatus?.map((cart, index) => (
                <tr key={index} className="hover:bg-base-200/30 transition-colors">
                  <td className="font-bold text-lg">{cart?.productName}</td>
                  <td>
                    <div className="flex items-center gap-3 bg-base-200/50 w-fit rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(cart.productId, "dec")}
                        className="btn btn-xs btn-circle btn-ghost"
                        disabled={cart.productQuantity <= 1}
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="font-bold min-w-4 text-center">
                        {cart?.productQuantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(cart.productId, "inc")}
                        className="btn btn-xs btn-circle btn-ghost"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </td>
                  <td className="text-center">৳{cart?.productPrice}</td>
                  <td className="font-black text-primary text-center">৳{cart?.productQuantity * cart?.productPrice}</td>
                  <td className="text-center">
                    <button
                      onClick={() => removeFromCart(cart.productId)}
                      className="btn btn-ghost btn-circle text-error hover:bg-error/10"
                      title="Remove from cart"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-base-200/50 font-bold">
              <tr>
                <td colSpan={3} className="rounded-bl-3xl text-right py-4 text-lg">Total Amount:</td>
                <td className="text-center py-4 text-2xl font-black text-primary">৳{totalPrice}</td>
                <td className="rounded-br-3xl"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="md:hidden space-y-4">
          {cartStatus?.map((cart, index) => (
            <div key={index} className="bg-base-100 p-5 rounded-3xl shadow-md border border-primary/5 relative group">
              <button
                onClick={() => removeFromCart(cart.productId)}
                className="absolute top-4 right-4 btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
              >
                <FaTrash className="w-4 h-4" />
              </button>

              <h3 className="font-extrabold text-xl pr-10 mb-2">{cart?.productName}</h3>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-4 bg-base-200/50 rounded-full px-4 py-2">
                  <button
                    onClick={() => updateQuantity(cart.productId, "dec")}
                    className="btn btn-xs btn-circle btn-ghost"
                    disabled={cart.productQuantity <= 1}
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="font-black text-lg">{cart?.productQuantity}</span>
                  <button
                    onClick={() => updateQuantity(cart.productId, "inc")}
                    className="btn btn-xs btn-circle btn-ghost"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-base-content/50">৳{cart?.productPrice} / item</p>
                  <p className="text-xl font-black text-primary">৳{cart?.productQuantity * cart?.productPrice}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-primary text-primary-content p-6 rounded-3xl shadow-xl mt-8">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold opacity-80">Total Amount</span>
              <span className="text-3xl font-black">৳{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-end max-w-4xl mx-auto mt-10">
        <Link href="/order-form" className="btn btn-primary btn-lg px-12 rounded-xl shadow-lg hover:shadow-primary/20 transition-all font-bold">
          Order Now
        </Link>
      </div>
    </div>
  );
};

export default Cart;
