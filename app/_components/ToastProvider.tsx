"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

export default function ToastProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      newestOnTop={true}
      closeOnClick={true}
      pauseOnHover={true}
      theme="light"
    />
  );
}
