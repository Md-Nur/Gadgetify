"use client";
import { useUserAuth } from "@/app/context/userContext";
import React from "react";

const Login = () => {
  const { userAuth, setUserAuth } = useUserAuth();
  return <div>Login {userAuth.isAdmin ? "(Admin)" : "(User)"}</div>;
};

export default Login;
