"use client";

import { useCallback, useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { toast } from "sonner";
import {
  createWithdrawRequest,
  getWithdrawRequests,
  getDeposits,
  recordDeposit,
} from "@/lib/supabase/api";
import type { WithdrawRequest, Deposit } from "@/lib/supabase/types";
import { useAnchorProvider } from "@/lib/anchor/use-anchor-provider";
import {
  getConfigPDA,
  getVaultPDA,
  getFeeVaultPDA,
  getWithdrawRequestPDA,
} from "@/lib/anchor/metricon-program";

// Fee in basis points (0.3% = 30 bps)
const FEE_BPS = Number(process.env.NEXT_PUBLIC_FEE_BPS) || 30;

export interface VaultStats {
  vaultBalance: number;
  userBalance: number;
  userDeposits: Deposit[];
  pendingWithdrawals: WithdrawRequest[];
  completedWithdrawals: WithdrawRequest[];
}

export function useVault() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  // Get shared program from hook - NEVER create Program elsewhere
  const { program } = useAnchorProvider();

  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<VaultStats | null>(null);

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    if (!publicKey) {
      setStats(null);
      return;
    }

    const vaultPDA = getVaultPDA();

    try {
      // Get vault balance
      let vaultBalance = 0;
      try {
        vaultBalance = await connection.getBalance(vaultPDA);
      } catch {
        // Vault may not exist yet
      }

      // Get user data from Supabase
      const [deposits, withdrawRequests] = await Promise.all([
        getDeposits(publicKey.toBase58()),
        getWithdrawRequests(publicKey.toBase58()),
      ]);

      const pendingWithdrawals = withdrawRequests.filter(
        (w) => w.status === "pending" || w.status === "processing"
      );
      const completedWithdrawals = withdrawRequests.filter(
        (w) => w.status === "completed"
      );

      // Calculate user's vault balance
      const totalDeposited = deposits
        .filter((d) => d.mint === null)
        .reduce((sum, d) => sum + Number(d.amount), 0);

      const totalWithdrawn = completedWithdrawals
        .filter((w) => w.mint === null)
        .reduce((sum, w) => sum + Number(w.amount), 0);

      const pendingAmount = pendingWithdrawals
        .filter((w) => w.mint === null)
        .reduce((sum, w) => sum + Number(w.amount), 0);

      const userBalance = Math.max(0, totalDeposited - totalWithdrawn - pendingAmount);

      setStats({
        vaultBalance: vaultBalance / LAMPORTS_PER_SOL,
        userBalance: userBalance / LAMPORTS_PER_SOL,
        userDeposits: deposits,
        pendingWithdrawals,
        completedWithdrawals,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [connection, publicKey]);

  // Refresh stats when wallet changes
  useEffect(() => {
    fetchStats();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Deposit SOL using the shared Anchor program
  const depositSol = useCallback(
    async (amount: number): Promise<string | null> => {
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

      // Check balance
      const balance = await connection.getBalance(publicKey);
      const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
      const lamportsNeeded = lamports + 10000; // Extra for fees

      if (balance < lamportsNeeded) {
        toast.error("Insufficient balance");
        return null;
      }

      setIsLoading(true);
      try {
        // Call the depositSol instruction via Anchor
        const signature = await program.methods
          .depositSol(new BN(lamports))
          .accounts({
            depositor: publicKey,
            config: configPDA,
            vault: vaultPDA,
            feeVault: feeVaultPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        // Calculate fee for Supabase record
        const fee = Math.floor((lamports * FEE_BPS) / 10000);
        const depositAmount = lamports - fee;

        // Record in Supabase
        await recordDeposit({
          wallet: publicKey.toBase58(),
          mint: null,
          amount: depositAmount.toString(),
          fee: fee.toString(),
          tx_signature: signature,
        });

        toast.success("Deposit successful!", {
          description: `Deposited ${(depositAmount / LAMPORTS_PER_SOL).toFixed(4)} SOL to vault`,
        });

        // Refresh stats
        await fetchStats();

        return signature;
      } catch (error) {
        console.error("Deposit error:", error);
        toast.error("Deposit failed", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [connection, publicKey, connected, program, fetchStats]
  );

  // Request withdraw using the shared Anchor program
  const requestWithdraw = useCallback(
    async (
      amount: number,
      destination: string,
      mint: string | null = null
    ): Promise<boolean> => {
      if (!publicKey || !connected) {
        toast.error("Please connect your wallet");
        return false;
      }

      // Use shared program from hook
      if (!program) {
        toast.error("Program not ready. Please connect your wallet.");
        return false;
      }

      const configPDA = getConfigPDA();

      if (amount <= 0) {
        toast.error("Invalid amount");
        return false;
      }

      // Validate destination address
      let destinationPubkey: PublicKey;
      try {
        destinationPubkey = new PublicKey(destination);
      } catch {
        toast.error("Invalid destination address");
        return false;
      }

      // Check if user has enough balance
      const userBalance = stats?.userBalance || 0;
      if (amount > userBalance) {
        toast.error("Insufficient vault balance", {
          description: `You have ${userBalance.toFixed(4)} SOL available`,
        });
        return false;
      }

      setIsLoading(true);
      try {
        const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
        // Generate a unique nonce (using timestamp)
        const nonceBN = new BN(Date.now());

        // Derive the withdraw request PDA
        const withdrawRequestPDA = getWithdrawRequestPDA(publicKey, nonceBN);

        // Call on-chain instruction
        const tx = await program.methods
          .requestWithdraw(new BN(lamports), nonceBN, destinationPubkey)
          .accounts({
            requester: publicKey,
            config: configPDA,
            withdrawRequest: withdrawRequestPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        console.log("On-chain withdraw request tx:", tx);

        // Then record in Supabase
        await createWithdrawRequest({
          wallet: publicKey.toBase58(),
          destination,
          mint,
          amount: lamports.toString(),
          nonce: nonceBN.toString(),
        });

        toast.success("Withdrawal requested!", {
          description: "Your request will be processed after the privacy delay.",
        });

        // Refresh stats
        await fetchStats();

        return true;
      } catch (error) {
        console.error("Withdraw request error:", error);
        toast.error("Withdrawal request failed", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [publicKey, connected, program, stats, fetchStats]
  );

  // Get remaining time for pending withdrawal
  const getTimeRemaining = useCallback((executeAfter: string): string => {
    const target = new Date(executeAfter).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return "Processing...";
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  return {
    isLoading,
    stats,
    depositSol,
    requestWithdraw,
    fetchStats,
    getTimeRemaining,
    isProgramReady: !!program,
  };
}
