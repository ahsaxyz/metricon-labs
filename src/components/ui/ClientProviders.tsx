"use client";

import { ReactNode } from "react";
import WalletContextProvider from "@/contexts/WalletContextProvider";
import Toaster from "@/components/ui/Toaster";

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <WalletContextProvider>
      {children}
      <Toaster />
    </WalletContextProvider>
  );
}
