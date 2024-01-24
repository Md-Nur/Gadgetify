"use client";

import {
  createContext,
  useContext,
  Dispatch,
  ReactNode,
  useState,
  SetStateAction,
} from "react";
interface AdminContextProps {
  adminAuthStatus: boolean;
  setAdminAuthStatus: Dispatch<SetStateAction<boolean>>;
}

const AdminContext = createContext<AdminContextProps>({
  adminAuthStatus: false,
  setAdminAuthStatus: () => {},
});

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminAuthStatus, setAdminAuthStatus] = useState<boolean>(false);
  return (
    <AdminContext.Provider value={{ adminAuthStatus, setAdminAuthStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminAuth = () => {
  const data = useContext(AdminContext);
  if (data === undefined) {
    throw new Error("useAdminAuth must be used within an AuthProvider");
  }
  return data;
};
