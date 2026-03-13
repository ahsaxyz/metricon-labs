"use client";

import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { toast } from "sonner";
import { createSwapRequest } from "@/lib/supabase/api";
import { useAnchorProvider } from "@/lib/anchor/use-anchor-provider";
import {
  getConfigPDA,
  getVaultPDA,
  getFeeVaultPDA,
  getSwapRequestPDA,
} from "@/lib/anchor/metricon-program";

// Jupiter Quote API (for display only - relayer executes actual swaps)
const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";

// SOL mint address (native)
const SOL_MINT = "So11111111111111111111111111111111111111112";

// Popular token mints (mainnet)
export const SWAP_TOKENS: Record<string, string> = {
  SOL: SOL_MINT,
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
};

export interface SwapQuote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: number;
  routePlan: {
    swapInfo: {
      ammKey: string;
      label: string;
    };
  }[];
}

export function useSwap() {
  const { publicKey, connected } = useWallet();

  // Get shared program from hook - NEVER create Program elsewhere
  const { program } = useAnchorProvider();

  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);

  /**
   * Get a swap quote from Jupiter (for display only - relayer executes actual swaps)
   */
  const getQuote = useCallback(
    async (
      inputMint: string,
      outputMint: string,
      amount: number,
      slippageBps = 50
    ): Promise<SwapQuote | null> => {
      if (amount <= 0) {
        setQuote(null);
        return null;
      }

      setIsQuoting(true);
      try {
        // Convert to lamports/smallest unit
        const inputAmount = Math.floor(
          inputMint === SOL_MINT ? amount * LAMPORTS_PER_SOL : amount * 1e6
        );

        const params = new URLSearchParams({
          inputMint,
          outputMint,
          amount: inputAmount.toString(),
          slippageBps: slippageBps.toString(),
        });

        const response = await fetch(`${JUPITER_QUOTE_API}?${params}`);

        if (!response.ok) {
          throw new Error("Failed to get quote");
        }

        const data = await response.json();

        const quoteData: SwapQuote = {
          inputMint: data.inputMint,
          outputMint: data.outputMint,
          inAmount: data.inAmount,
          outAmount: data.outAmount,
          priceImpactPct: Number.parseFloat(data.priceImpactPct || "0"),
          routePlan: data.routePlan || [],
        };

        setQuote(quoteData);
        return quoteData;
      } catch (error) {
        console.error("Quote error:", error);
        setQuote(null);
        return null;
      } finally {
        setIsQuoting(false);
      }
    },
    []
  );

  /**
   * Request a private swap via on-chain instruction
   * The relayer will execute the actual Jupiter swap from the vault
   * User only signs the requestSwap transaction, NOT the Jupiter swap
   */
  const executeSwap = useCallback(
    async (
      inputMint: string,
      outputMint: string,
      amount: number,
      destination: string,
      slippageBps = 50
    ): Promise<string | null> => {
      if (!publicKey || !connected) {
        toast.error("Please connect your wallet");
        return null;
      }

      // Use shared program from hook
      if (!program) {
        toast.error("Program not ready. Please connect your wallet.");
        return null;
      }

      const configPDA = getConfigPDA();
      const vaultPDA = getVaultPDA();
      const feeVaultPDA = getFeeVaultPDA();

      if (amount <= 0) {
        toast.error("Invalid amount");
        return null;
      }

      // Validate destination address
      let destinationPubkey: PublicKey;
      try {
        destinationPubkey = new PublicKey(destination);
      } catch {
        toast.error("Invalid destination address");
        return null;
      }

      // Validate output mint
      let outputMintPubkey: PublicKey;
      try {
        outputMintPubkey = new PublicKey(outputMint);
      } catch {
        toast.error("Invalid output token");
        return null;
      }

      setIsLoading(true);

      try {
        // 1. Get Jupiter quote (for display/estimation only)
        const quoteData = await getQuote(inputMint, outputMint, amount, slippageBps);

        // Check if this is a reverse swap (SPL token → SOL)
        // Reverse swaps are handled entirely by the relayer from its own token custody
        // No on-chain vault instruction needed because the user's tokens are in relayer custody, not in the vault
        const isReverseSwap = inputMint !== "So11111111111111111111111111111111111111112";

        if (isReverseSwap) {
          // Convert amount to token atoms (USDC/USDT use 6 decimals)
          const tokenAtoms = Math.floor(amount * 1e6).toString();

          // Just write to Supabase — relayer picks it up and executes Jupiter swap from its own token ATA
          await createSwapRequest({
            wallet: publicKey.toBase58(),
            fromMint: inputMint,
            toMint: outputMint,
            fromAmount: tokenAtoms,
            toAmount: quoteData?.outAmount,
            slippageBps,
            destination,
            nonce: Date.now().toString(),
          });

          toast.success("Reverse swap requested!", {
            description: "The relayer will privately swap your tokens to SOL and send to your destination.",
          });

          setIsLoading(false);
          return "reverse_swap_requested";
        }

        // --- From here down is the existing SOL→token swap code ---
        const nonceBN = new BN(Date.now());
        const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

        // Derive the swap request PDA
        const swapRequestPDA = getSwapRequestPDA(publicKey, nonceBN);

        // Call the on-chain requestSwap instruction
        const tx = await program.methods
          .requestSwap(
            new BN(lamports),
            nonceBN,
            outputMintPubkey,
            destinationPubkey,
            slippageBps
          )
          .accounts({
            requester: publicKey,
            config: configPDA,
            vault: vaultPDA,
            feeVault: feeVaultPDA,
            swapRequest: swapRequestPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        console.log("On-chain swap request tx:", tx);

        // Record in Supabase for relayer to pick up
        await createSwapRequest({
          wallet: publicKey.toBase58(),
          fromMint: inputMint === SOL_MINT ? null : inputMint,
          toMint: outputMint,
          fromAmount: lamports.toString(),
          toAmount: quoteData?.outAmount,
          slippageBps,
          destination,
          nonce: nonceBN.toString(),
        });

        toast.success("Swap requested!", {
          description: "The relayer will execute your swap privately.",
        });

        return tx;
      } catch (error) {
        console.error("Swap request error:", error);
        toast.error("Swap request failed", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, connected, program, getQuote]
  );

  /**
   * Format output amount from quote
   */
  const formatOutputAmount = useCallback(
    (outputMint: string): string => {
      if (!quote) return "0.0";

      const decimals = outputMint === SOL_MINT ? 9 : 6;
      const amount = Number(quote.outAmount) / Math.pow(10, decimals);
      return amount.toFixed(decimals === 9 ? 4 : 2);
    },
    [quote]
  );

  return {
    isLoading,
    isQuoting,
    quote,
    getQuote,
    
    formatOutputAmount,
    isProgramReady: !!program,
  };
}
