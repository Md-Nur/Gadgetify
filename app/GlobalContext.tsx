import { ReactNode } from "react";
import { CartProvider } from "./context/cartContext";
import { AdminAuthProvider } from "./context/admin";

const GlobalContext = ({ children }: { children: ReactNode }) => {
  return (
    <AdminAuthProvider>
      <CartProvider>{children}</CartProvider>
    </AdminAuthProvider>
  );
};

export default GlobalContext;
