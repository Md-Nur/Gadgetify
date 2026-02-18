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
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, action: "inc" | "dec") => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextProps>({
  cartStatus: [],
  setCartStatus: () => { },
  removeFromCart: async () => { },
  updateQuantity: async () => { },
  loading: true,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartStatus, setCartStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const updateQuantity = async (productId: string, action: "inc" | "dec") => {
    try {
      const res = await fetch(`/api/cart/${productId}/update-quantity?action=${action}`);
      const jData = await res.json();
      if (jData.success) {
        setCartStatus((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? {
                ...item,
                productQuantity: action === "inc"
                  ? item.productQuantity + 1
                  : Math.max(1, item.productQuantity - 1)
              }
              : item
          )
        );
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch(`/api/cart/${productId}/remove-product`);
      const jData = await res.json();
      if (jData.success) {
        setCartStatus((prev) => prev.filter((item) => item.productId !== productId));
        toast.success("Product removed from cart");
      } else {
        toast.error(jData.message || "Failed to remove product");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => res.json())
      .then(async (jCarts: any) => {
        if (jCarts.success && jCarts.data?.productId) {
          const promises = jCarts.data.productId.map((pId: string, index: number) =>
            fetch(`/api/product/${pId}`)
              .then((res) => res.json())
              .then((jProduct) => {
                if (jProduct.success) {
                  return {
                    productId: pId,
                    productName: jProduct.data.name,
                    productPrice: jProduct.data.price,
                    productQuantity: jCarts.data.productQuantity[index],
                  };
                }
                return null;
              })
              .catch(() => null)
          );

          const resolvedCarts = await Promise.all(promises);
          const validCarts = resolvedCarts.filter((item) => item !== null);
          setCartStatus(validCarts);
        } else if (jCarts.success) {
          setCartStatus([]);
        } else {
          if (jCarts.statusCode !== 402 && jCarts.errors) {
            toast.error(jCarts.errors);
          }
        }
      })
      .catch((err) => console.error("Cart initialization error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CartContext.Provider value={{ cartStatus, setCartStatus, removeFromCart, updateQuantity, loading }}>
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
