"use client";

import { useState, useEffect } from "react";
import { Eye, Loader2, Wallet } from "lucide-react";
import TokenSelector, { TOKENS, type Token } from "../TokenSelector";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useVault } from "@/hooks/useVault";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { toast } from "sonner";

export default function StealthTab() {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
  const [walletBalance, setWalletBalance] = useState<string>("0.00");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const { connected, publicKey } = useWalletConnection();
  const { setVisible } = useWalletModal();
  const { depositSol, isLoading } = useVault();
  const { connection } = useConnection();
  const wallet = useWallet();

  // Fetch wallet balance
  useEffect(() => {
    async function fetchBalance() {
      if (!wallet.publicKey) {
        setWalletBalance("0.00");
        return;
      }

      setIsLoadingBalance(true);
      try {
        if (selectedToken.symbol === "SOL") {
          const balance = await connection.getBalance(wallet.publicKey);
          setWalletBalance((balance / LAMPORTS_PER_SOL).toFixed(4));
        } else {
          setWalletBalance("0.00");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setWalletBalance("0.00");
      } finally {
        setIsLoadingBalance(false);
      }
    }

    fetchBalance();
  }, [connection, wallet.publicKey, selectedToken]);

  const handleMaxClick = () => {
    const maxAmount = Math.max(0, Number.parseFloat(walletBalance) - 0.01);
    setAmount(maxAmount.toFixed(4));
    toast.info(`Max amount set: ${maxAmount.toFixed(4)} ${selectedToken.symbol}`);
  };

  const handleStealth = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    const numAmount = Number.parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (numAmount > Number.parseFloat(walletBalance)) {
      toast.error("Insufficient balance");
      return;
    }

    if (selectedToken.symbol === "SOL") {
      const signature = await depositSol(numAmount);
      if (signature) {
        setAmount("");
      }
    } else {
      toast.info("SPL token deposits coming soon!");
    }
  };

  const handleConnect = () => {
    setVisible(true);
  };

  return (
    <div className="glass-card-static p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center">
          <Eye className="w-5 h-5 text-[#FF7A00]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Stealth</h2>
          <p className="text-sm text-[#666]">Deposit into privacy pool</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner mb-6">
        <p className="text-sm text-[#a0a0a0]">
          Deposit your assets into the Metricon vault for private transactions.
          A <span className="text-[#FF7A00] font-medium">0.3% fee</span> applies to all deposits.
        </p>
      </div>

      {/* Amount Input */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#666]">Amount</span>
          <div className="flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5 text-[#404040]" />
            {isLoadingBalance ? (
              <span className="flex items-center gap-1 text-[#666]">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading...
              </span>
            ) : (
              <span className="text-[#666]">
                {walletBalance} {selectedToken.symbol}
              </span>
            )}
            <button
              type="button"
              onClick={handleMaxClick}
              disabled={!connected || isLoadingBalance}
              className="px-2 py-0.5 text-xs font-medium rounded bg-[#FF7A00]/10 text-[#FF7A00] hover:bg-[#FF7A00]/20 transition-colors disabled:opacity-50"
            >
              MAX
            </button>
          </div>
        </div>

        <div className="input-field p-4 flex items-center gap-3">
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
                setAmount(value);
              }
            }}
            placeholder="0.0"
            className="flex-1 bg-transparent outline-none text-2xl font-medium text-white placeholder-[#333]"
          />
          <TokenSelector
            selectedToken={selectedToken}
            onSelectToken={setSelectedToken}
          />
        </div>
      </div>

      {/* Fee Display */}
      {amount && Number.parseFloat(amount) > 0 && (
        <div className="flex justify-between text-sm px-1 mb-6 text-[#666]">
          <span>Fee (0.3%)</span>
          <span className="text-[#a0a0a0]">
            {(Number.parseFloat(amount) * 0.003).toFixed(6)} {selectedToken.symbol}
          </span>
        </div>
      )}

      {/* Stealth Button */}
      {connected ? (
        <button
          type="button"
          onClick={handleStealth}
          disabled={!amount || Number.parseFloat(amount) <= 0 || isLoading}
          className="btn-primary w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Stealth"
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          className="btn-primary w-full py-4 rounded-xl font-semibold text-base"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
