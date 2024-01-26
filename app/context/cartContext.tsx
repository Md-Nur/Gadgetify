"use client";
import {
  createContext,
  useContext,
  Dispatch,
  ReactNode,
  useState,
  SetStateAction,
  useEffect,
} from "react";
import { toast } from "react-toastify";
interface CartContextProps {
  cartStatus: any[];
  setCartStatus: Dispatch<SetStateAction<any[]>>;
}

const CartContext = createContext<CartContextProps>({
  cartStatus: [],
  setCartStatus: () => {},
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartStatus, setCartStatus] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => res.json())
      .then((jCarts: any) => {
        if (jCarts.success && jCarts.data.productId) {
          let carts: any[] = [];
          jCarts.data.productId.forEach((pId: string, index: number) => {
            fetch(`/api/product/${pId}`)
              .then((res) => res.json())
              .then((jProduct) => {
                if (jProduct.statusCode === 404) {
                  carts.push({
                    productId: pId,
                    productName: "",
                    productPrice: 0,
                    productQuantity: 0,
                  });
                  carts.pop();
                } else if (jProduct.success) {
                  carts.push({
                    productId: pId,
                    productName: jProduct.data.name,
                    productPrice: jProduct.data.price,
                    productQuantity: jCarts.data.productQuantity[index],
                  });
                } else {
                  toast.error(jProduct.errors);
                }
              })
              .catch((e) => toast.error(e.message));
          });
          console.log("carts from context:", carts);
          setCartStatus(carts);
        } else {
          toast.error(jCarts.errors);
        }
      })
      .catch((err) => toast.error(err.message));
  }, []);
  return (
    <CartContext.Provider value={{ cartStatus, setCartStatus }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const data = useContext(CartContext);
  if (data === undefined) {
    throw new Error("useCart must be used within an Provider");
  }
  return data;
};
