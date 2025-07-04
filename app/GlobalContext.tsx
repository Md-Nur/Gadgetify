import { ReactNode } from "react";
import { CartProvider } from "./context/cartContext";
import { UserAuthProvider } from "./context/userContext";

const GlobalContext = ({ children }: { children: ReactNode }) => {
  return (
    <UserAuthProvider>
      <CartProvider>{children}</CartProvider>
    </UserAuthProvider>
  );
};

export default GlobalContext;
