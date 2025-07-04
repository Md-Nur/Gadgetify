"use client";
import { useAdminAuth } from "@/app/context/userContext";
import React from "react";

const Login = () => {
  const { setAdminAuthStatus } = useAdminAuth();
  return <div>Login</div>;
};

export default Login;
