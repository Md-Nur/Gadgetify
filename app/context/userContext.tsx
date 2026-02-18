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
interface UserProps {
  id: string;
  name: string;
  phone: string;
  address: string;
  images: string;
  isAdmin: boolean;
}
interface UserContextProps {
  userAuth: UserProps;
  setUserAuth: Dispatch<SetStateAction<UserProps>>;
}

const UserContext = createContext<UserContextProps>({
  userAuth: {
    id: "",
    name: "",
    phone: "",
    address: "",
    images: "",
    isAdmin: false,
  },
  setUserAuth: () => { },
});

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [userAuth, setUserAuth] = useState<UserProps>({
    id: "",
    name: "",
    phone: "",
    address: "",
    images: "",
    isAdmin: false,
  });
  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((jData) => {
        if (jData.success) {
          setUserAuth({
            id: jData.data.id,
            name: jData.data.name || "",
            phone: jData.data.phone || "",
            address: jData.data.address || "",
            images: jData.data.images,
            isAdmin: jData.data.isAdmin,
          });
        }
      })
      .catch((err) => console.error("Error fetching user session:", err));
  }, []);
  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserAuth = () => {
  const data = useContext(UserContext);
  if (data === undefined) {
    throw new Error("useUserAuth must be used within an AuthProvider");
  }
  return data;
};
