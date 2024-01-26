"use client";
import { IoMdCart } from "react-icons/io";
import { toast } from "react-toastify";
import { useCartContext } from "../context/cartContext";

const AddCartButton = ({
  productId,
  name,
  price,
}: {
  productId: string;
  name: string;
  price: number;
}) => {
  const { cartStatus, setCartStatus } = useCartContext();
  return (
    <button
      className="btn btn-primary my-3"
      onClick={() => {
        toast.loading("add to cart...");
        fetch(
          `/api/cart/${productId}/incriment-product-quantity?name=${name}&price=${price}`
        )
          .then((res) => res.json())
          .then((jData) => {
            toast.dismiss();
            if (jData.success) {
              let prevCart = cartStatus;
              let isMatch;
              isMatch = cartStatus.findIndex(
                (cart) => cart.productId === productId
              );
              console.log("Match", isMatch);
              if (isMatch >= 0) {
                prevCart[isMatch] = {
                  productId: productId,
                  productName: name,
                  productPrice: price,
                  productQuantity: prevCart[isMatch].productQuantity + 1,
                };
                console.log("prev cart in add button", prevCart);
                setCartStatus(prevCart);
              } else {
                console.log("In the else block: ", cartStatus);
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
