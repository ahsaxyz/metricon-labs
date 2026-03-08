"use client";

import { useState } from "react";
import { EyeOff, Loader2, Wallet, Clock } from "lucide-react";
import TokenSelector, { TOKENS, type Token } from "../ui/TokenSelector";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useVault } from "@/hooks/useVault";
import { toast } from "sonner";

const WITHDRAW_DELAY_MINUTES = Number(process.env.NEXT_PUBLIC_WITHDRAW_DELAY_MINUTES) || 5;

export default function RevealTab() {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]);
  const [useOwnWallet, setUseOwnWallet] = useState(true);

  const { connected, walletAddress } = useWalletConnection();
  const { setVisible } = useWalletModal();
  const { requestWithdraw, isLoading, stats } = useVault();

  // Use userBalance from useVault which correctly calculates:
  // totalDeposited - totalWithdrawn - pendingAmount
  const actualAvailable = stats?.userBalance ?? 0;

  const handleReveal = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    const numAmount = Number.parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const destination = useOwnWallet ? walletAddress : recipientAddress;
    if (!destination) {
      toast.error("Please enter a destination address");
      return;
    }

    const success = await requestWithdraw(
      numAmount,
      destination,
      selectedToken.symbol === "SOL" ? null : undefined
    );

    if (success) {
      setAmount("");
      if (!useOwnWallet) {
        setRecipientAddress("");
      }
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
          <EyeOff className="w-5 h-5 text-[#FF7A00]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Reveal</h2>
          <p className="text-sm text-[#666]">Withdraw from privacy pool</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="info-banner mb-6 flex items-start gap-3">
        <Clock className="w-5 h-5 text-[#FF7A00] mt-0.5 shrink-0" />
        <p className="text-sm text-[#a0a0a0]">
          Withdrawals are processed by the relayer after a{" "}
          <span className="text-[#FF7A00] font-medium">{WITHDRAW_DELAY_MINUTES} minute</span> delay
          for enhanced privacy.
        </p>
      </div>

      {/* Destination Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setUseOwnWallet(true)}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            useOwnWallet
              ? "bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-white"
              : "bg-transparent border border-white/[0.06] text-[#666] hover:border-white/[0.1]"
          }`}
        >
          My Wallet
        </button>
        <button
          type="button"
          onClick={() => setUseOwnWallet(false)}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            !useOwnWallet
              ? "bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-white"
              : "bg-transparent border border-white/[0.06] text-[#666] hover:border-white/[0.1]"
          }`}
        >
          Other Address
        </button>
      </div>

      {/* Recipient Address Input */}
      {!useOwnWallet && (
        <div className="space-y-2 mb-6">
          <label className="text-sm text-[#666]">Recipient Address</label>
          <div className="input-field">
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Enter Solana Address"
              className="w-full p-4 bg-transparent outline-none text-white placeholder-[#333]"
            />
          </div>
        </div>
      )}

      {/* Amount Input */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#666]">Amount</span>
          <div className="flex items-center gap-2">
            <Wallet className="w-3.5 h-3.5 text-[#404040]" />
            <span className="text-[#666]">
              {actualAvailable.toFixed(4)} {selectedToken.symbol} available
            </span>
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
        <div className="space-y-2 text-sm px-1 mb-6">
          <div className="flex justify-between text-[#666]">
            <span>Fee (0.3%)</span>
            <span className="text-[#a0a0a0]">
              {(Number.parseFloat(amount) * 0.003).toFixed(6)} {selectedToken.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666]">You will receive</span>
            <span className="text-white font-medium">
              {(Number.parseFloat(amount) * 0.997).toFixed(6)} {selectedToken.symbol}
            </span>
          </div>
        </div>
      )}

      {/* Reveal Button */}
      {connected ? (
        <button
          type="button"
          onClick={handleReveal}
          disabled={
            !amount ||
            Number.parseFloat(amount) <= 0 ||
            (!useOwnWallet && !recipientAddress) ||
            isLoading
          }
          className="btn-primary w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Request Reveal"
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

      {/* Pending Withdrawals */}
      {stats && stats.pendingWithdrawals.length > 0 && (
        <div className="pt-6 mt-6 border-t border-white/[0.04]">
          <h3 className="text-sm font-medium text-[#666] mb-3">Pending Withdrawals</h3>
          <div className="space-y-2">
            {stats.pendingWithdrawals.map((w) => (
              <PendingWithdrawalCard key={w.id} withdrawal={w} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PendingWithdrawalCard({ withdrawal }: { withdrawal: { id: string; amount: string; status: string; execute_after: string } }) {
  const { getTimeRemaining } = useVault();

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#FF7A00]/5 border border-[#FF7A00]/10">
      <div>
        <span className="text-white font-medium">
          {(Number(withdrawal.amount) / 1e9).toFixed(4)} SOL
        </span>
        <span className="text-xs text-[#666] ml-2">
          {withdrawal.status === "processing" ? "Processing..." : getTimeRemaining(withdrawal.execute_after)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4 text-[#FF7A00]" />
        <span className="text-xs text-[#FF7A00] capitalize">{withdrawal.status}</span>
      </div>
    </div>
  );
}
