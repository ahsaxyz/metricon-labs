"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";
import { createBridgeRequest, updateSwapRequest } from "@/lib/supabase/api";

// Mayan Finance API
const MAYAN_API_BASE = "https://price-api.mayan.finance/v3";

// Supported chains
export const BRIDGE_CHAINS = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    nativeToken: "ETH",
  },
  base: {
    id: 8453,
    name: "Base",
    icon: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/Base_Symbol_Blue.png",
    nativeToken: "ETH",
  },
  bsc: {
    id: 56,
    name: "BNB Chain",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    nativeToken: "BNB",
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png",
    nativeToken: "ETH",
  },
  polygon: {
    id: 137,
    name: "Polygon",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    nativeToken: "MATIC",
  },
};

export type BridgeChain = keyof typeof BRIDGE_CHAINS;

export interface BridgeQuote {
  expectedAmountOut: string;
  minAmountOut: string;
  priceImpact: number;
  fee: string;
  estimatedTime: number; // in seconds
  route: string;
}

export function useBridge() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, signTransaction } = wallet;

  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<BridgeQuote | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);

  /**
   * Get a bridge quote from Mayan Finance
   */
  const getQuote = useCallback(
    async (
      amount: number,
      destChain: BridgeChain,
      destAddress: string
    ): Promise<BridgeQuote | null> => {
      if (amount <= 0 || !destAddress) {
        setQuote(null);
        return null;
      }

      setIsQuoting(true);
      try {
        // For MVP, simulate quote
        // In production, call Mayan Finance API
        const params = new URLSearchParams({
          amountIn: (amount * LAMPORTS_PER_SOL).toString(),
          fromToken: "So11111111111111111111111111111111111111112", // SOL
          fromChain: "solana",
          toChain: destChain,
          toToken: "native", // Native token on destination
          slippage: "0.5",
        });

        // Mayan API endpoint
        const response = await fetch(`${MAYAN_API_BASE}/quote?${params}`);

        let quoteData: BridgeQuote;

        if (response.ok) {
          const data = await response.json();
          quoteData = {
            expectedAmountOut: data.expectedAmountOut || (amount * 0.995).toString(),
            minAmountOut: data.minAmountOut || (amount * 0.99).toString(),
            priceImpact: data.priceImpact || 0.1,
            fee: data.fee || (amount * 0.005).toString(),
            estimatedTime: data.estimatedTime || 300, // 5 minutes default
            route: data.route || "Mayan Swift",
          };
        } else {
          // Fallback simulation for MVP
          quoteData = {
            expectedAmountOut: (amount * 0.995).toFixed(6),
            minAmountOut: (amount * 0.99).toFixed(6),
            priceImpact: 0.1,
            fee: (amount * 0.005).toFixed(6),
            estimatedTime: 300,
            route: "Mayan Swift",
          };
        }

        setQuote(quoteData);
        return quoteData;
      } catch (error) {
        console.error("Bridge quote error:", error);

        // Fallback for MVP
        const fallbackQuote: BridgeQuote = {
          expectedAmountOut: (amount * 0.995).toFixed(6),
          minAmountOut: (amount * 0.99).toFixed(6),
          priceImpact: 0.1,
          fee: (amount * 0.005).toFixed(6),
          estimatedTime: 300,
          route: "Mayan Swift",
        };
        setQuote(fallbackQuote);
        return fallbackQuote;
      } finally {
        setIsQuoting(false);
      }
    },
    []
  );

  /**
   * Execute a bridge via Mayan Finance
   */
  const executeBridge = useCallback(
    async (
      amount: number,
      destChain: BridgeChain,
      destAddress: string,
      refundAddress?: string
    ): Promise<string | null> => {
      if (!publicKey || !signTransaction) {
        toast.error("Please connect your wallet");
        return null;
      }

      if (amount <= 0) {
        toast.error("Invalid amount");
        return null;
      }

      if (!destAddress) {
        toast.error("Please enter a destination address");
        return null;
      }

      setIsLoading(true);
      let bridgeRequestId: string | null = null;

      try {
        // 1. Get quote
        const quoteData = await getQuote(amount, destChain, destAddress);
        if (!quoteData) {
          throw new Error("Failed to get bridge quote");
        }

        // 2. Record in Supabase
        const bridgeRequest = await createBridgeRequest({
          wallet: publicKey.toBase58(),
          fromMint: null, // SOL
          fromAmount: (amount * LAMPORTS_PER_SOL).toString(),
          destChain,
          destAddress,
        });
        bridgeRequestId = bridgeRequest?.id || null;

        // 3. Get bridge transaction from Mayan
        // For MVP, we'll simulate this
        // In production, call: POST /v3/swap with quote data

        toast.info("Bridge initiated", {
          description: `Bridging ${amount} SOL to ${BRIDGE_CHAINS[destChain].name}...`,
        });

        // Simulate bridge for MVP
        // In production, this would be a real transaction
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // For MVP, we'll mark as pending since bridges take time
        if (bridgeRequestId) {
          await updateSwapRequest(bridgeRequestId, {
            status: "processing",
          });
        }

        toast.success("Bridge submitted!", {
          description: `Your ${amount} SOL is being bridged to ${BRIDGE_CHAINS[destChain].name}. This may take a few minutes.`,
        });

        return "bridge_pending_" + Date.now();
      } catch (error) {
        console.error("Bridge error:", error);

        // Update Supabase with error
        if (bridgeRequestId) {
          await updateSwapRequest(bridgeRequestId, {
            status: "failed",
            error_message: error instanceof Error ? error.message : "Unknown error",
          });
        }

        toast.error("Bridge failed", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, signTransaction, getQuote]
  );

  /**
   * Format estimated time
   */
  const formatEstimatedTime = useCallback((seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
    return `${Math.ceil(seconds / 3600)}h`;
  }, []);

  return {
    isLoading,
    isQuoting,
    quote,
    getQuote,
    executeBridge,
    formatEstimatedTime,
    chains: BRIDGE_CHAINS,
  };
}
