"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import React from "react";

const Toast = () => {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};

export default Toast;
