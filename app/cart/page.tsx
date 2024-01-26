"use client";

import { useEffect, useState } from "react";
import { useCartContext } from "../context/cartContext";

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const { cartStatus } = useCartContext();
  useEffect(() => {
    let price = 0;
    cartStatus.forEach((cart) => {
      price += cart?.productPrice * cart?.productQuantity;
    });
    setTotalPrice(price);
  }, [cartStatus]);
  if (cartStatus.length < 1)
    return (
      <div className="w-full flex py-28 h-full  items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  return (
    <div className="overflow-x-auto p-5 m-5 min-h-[500px]">
      <h1 className="text-5xl text-center font-bold my-10">Cart Items</h1>
      <table className="table mx-auto">
        {/* head */}
        <thead className="bg-base-200">
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {cartStatus?.map((cart, index) => (
            <tr key={index}>
              <td>{cart?.productName}</td>
              <td>{cart?.productQuantity}</td>
              <td>{cart?.productPrice}</td>
              <td>{cart?.productQuantity * cart?.productPrice}</td>
            </tr>
          ))}
        </tbody>
        {/* foot */}
        <tfoot className="bg-base-200">
          <tr>
            <th></th>
            <th></th>
            <th>Total</th>
            <th>{totalPrice}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Cart;
