"use client";
import { IoMdCart } from "react-icons/io";
import { toast } from "react-toastify";
import { useCartContext } from "../context/cartContext";

const AddCartButton = ({
  productId,
  name,
  price,
  className = "",
}: {
  productId: string;
  name: string;
  price: number;
  className?: string;
}) => {
  const { cartStatus, setCartStatus } = useCartContext();
  return (
    <button
      className={`btn btn-primary ${className}`}
      onClick={() => {
        toast.loading("add to cart...");
        fetch(
          `/api/cart/${productId}/incriment-product-quantity?name=${name}&price=${price}`
        )
          .then((res) => res.json())
          .then((jData) => {
            toast.dismiss();
            if (jData.success) {
              const itemIndex = cartStatus.findIndex(
                (cart) => cart.productId === productId
              );

              if (itemIndex >= 0) {
                // Return a new array with the target item updated immutably
                setCartStatus(prev => {
                  const newCart = [...prev];
                  newCart[itemIndex] = {
                    ...newCart[itemIndex],
                    productQuantity: newCart[itemIndex].productQuantity + 1,
                  };
                  return newCart;
                });
              } else {
                setCartStatus((pCart) => [
                  ...pCart,
                  {
                    productId: productId,
                    productName: name,
                    productPrice: price,
                    productQuantity: 1,
                  },
                ]);
              }
              toast.success(jData.message);
            } else {
              toast.error(jData.errors);
            }
          })
          .catch((e) => {
            toast.dismiss();
            toast.error(e.message);
          });
      }}
    >
      Add to cart
      <IoMdCart />
    </button>
  );
};

export default AddCartButton;
