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
  id: number;
  images: string;
  isAdmin: boolean;
}
interface UserContextProps {
  userAuth: UserProps;
  setUserAuth: Dispatch<SetStateAction<UserProps>>;
}

const UserContext = createContext<UserContextProps>({
  userAuth: {
    id: 0,
    images: "",
    isAdmin: false,
  },
  setUserAuth: () => {},
});

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [userAuth, setUserAuth] = useState<UserProps>({
    id: 0,
    images: "",
    isAdmin: false,
  });
  useEffect(() => {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((jData) => {
        if (jData.success) setUserAuth(jData.data);
      })
      .then(() => {
        if (userAuth.id > 0) {
          fetch(`/api/users/${userAuth.id}`)
            .then((res) => res.json())
            .then((jdata) => {
              if (jdata.success) {
                setUserAuth({
                  id: 0,
                  images: "",
                  isAdmin: false,
                });
              }
            });
        }
      });
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
