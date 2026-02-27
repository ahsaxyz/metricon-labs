"use client";

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Copy, LogOut, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WalletButtonProps {
  variant?: "default" | "compact";
}

export default function WalletButton({ variant = "default" }: WalletButtonProps) {
  const { setVisible } = useWalletModal();
  const { connected, connecting, truncatedAddress, walletAddress, disconnect, walletIcon } =
    useWalletConnection();
  const [copied, setCopied] = useState(false);

  const handleConnect = () => {
    setVisible(true);
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (connecting) {
    return (
      <button
        type="button"
        disabled
        className="btn-primary px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 opacity-70"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Connecting...
      </button>
    );
  }

  if (connected && truncatedAddress) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        {walletIcon ? (
          <img src={walletIcon} alt="Wallet" className="w-5 h-5 rounded-full" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF3D00]" />
        )}
        <span className="text-sm font-medium text-[#a0a0a0]">{truncatedAddress}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-[#666]" />
          )}
        </button>
        <button
          type="button"
          onClick={disconnect}
          className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-3.5 h-3.5 text-[#666]" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleConnect}
      className="btn-primary px-5 py-2.5 rounded-lg font-medium text-sm"
    >
      Connect Wallet
    </button>
  );
}
