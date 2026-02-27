"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#0a0a0a",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          color: "#ffffff",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
        },
        classNames: {
          success: "!border-green-500/20",
          error: "!border-red-500/20",
          warning: "!border-yellow-500/20",
          info: "!border-[#FF7A00]/20",
        },
      }}
    />
  );
}
