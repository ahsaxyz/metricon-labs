"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";

export function useWalletConnection() {
  const { publicKey, connected, connecting, disconnect, wallet } = useWallet();
  const prevConnected = useRef(connected);

  const walletAddress = useMemo(() => {
    if (!publicKey) return null;
    return publicKey.toBase58();
  }, [publicKey]);

  const truncatedAddress = useMemo(() => {
    if (!walletAddress) return null;
    return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  // Toast notifications for wallet connection changes
  useEffect(() => {
    if (connected && !prevConnected.current && wallet?.adapter?.name) {
      toast.success(`Connected to ${wallet.adapter.name}`, {
        description: truncatedAddress ? `Address: ${truncatedAddress}` : undefined,
      });
    } else if (!connected && prevConnected.current) {
      toast.info("Wallet disconnected");
    }
    prevConnected.current = connected;
  }, [connected, wallet?.adapter?.name, truncatedAddress]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  }, [disconnect]);

  return {
    publicKey,
    walletAddress,
    truncatedAddress,
    connected,
    connecting,
    disconnect: handleDisconnect,
    walletName: wallet?.adapter?.name || null,
    walletIcon: wallet?.adapter?.icon || null,
  };
}
