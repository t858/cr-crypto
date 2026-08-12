"use client";

import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <Toaster 
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#161B22",
          color: "#ffffff",
          border: "1px solid #30363d",
          borderRadius: "12px",
          padding: "12px 18px",
          fontSize: "14px",
          fontWeight: "600",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          zIndex: 999999,
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#FF4520",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
};

export default ToasterContext;
