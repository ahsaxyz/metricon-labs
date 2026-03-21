"use client";

import type { ComponentType, ReactNode } from "react";
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import type { Adapter } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletContextProviderProps {
  children: ReactNode;
}

type SafeConnectionProviderProps = {
  endpoint: string;
  children: ReactNode;
};

type SafeWalletProviderProps = {
  wallets: Adapter[];
  autoConnect?: boolean;
  children: ReactNode;
};

const SafeConnectionProvider =
  ConnectionProvider as unknown as ComponentType<SafeConnectionProviderProps>;

const SafeWalletProvider =
  WalletProvider as unknown as ComponentType<SafeWalletProviderProps>;

export default function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl("mainnet-beta"),
    []
  );

  const wallets = useMemo<Adapter[]>(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  );

  return (
    <SafeConnectionProvider endpoint={endpoint}>
      <SafeWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SafeWalletProvider>
    </SafeConnectionProvider>
  );
}
