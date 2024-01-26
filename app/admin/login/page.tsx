"use client";
import { useAdminAuth } from "@/app/context/admin";
import React from "react";

const Login = () => {
  const { setAdminAuthStatus } = useAdminAuth();
  return <div>Login</div>;
};

export default Login;
