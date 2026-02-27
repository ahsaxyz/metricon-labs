"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, Loader2, Wallet, Clock, AlertCircle, Globe } from "lucide-react";
import TokenSelector, { TOKENS, type Token } from "../TokenSelector";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useVault } from "@/hooks/useVault";
import { useBridge, BRIDGE_CHAINS, type BridgeChain } from "@/hooks/useBridge";
import { toast } from "sonner";

export default function BridgeTab() {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS[0]); // SOL
  const [selectedChain, setSelectedChain] = useState<BridgeChain>("ethereum");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [refundAddress, setRefundAddress] = useState("");

  const { connected, walletAddress } = useWalletConnection();
  const { setVisible } = useWalletModal();
  const { stats } = useVault();
  const {
    isLoading,
    isQuoting,
    quote,
    getQuote,
    executeBridge,
    formatEstimatedTime,
    chains,
  } = useBridge();

  // Auto-fill refund address with connected wallet
  useEffect(() => {
    if (walletAddress && !refundAddress) {
      setRefundAddress(walletAddress);
    }
  }, [walletAddress, refundAddress]);

  // Debounced quote fetching
  useEffect(() => {
    const numAmount = Number.parseFloat(amount);
    if (numAmount > 0 && destinationAddress) {
      const timeout = setTimeout(() => {
        getQuote(numAmount, selectedChain, destinationAddress);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [amount, selectedChain, destinationAddress, getQuote]);

  const handleBridge = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    const numAmount = Number.parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!destinationAddress) {
      toast.error("Please enter a destination address");
      return;
    }

    const signature = await executeBridge(
      numAmount,
      selectedChain,
      destinationAddress,
      refundAddress || walletAddress || undefined
    );

    if (signature) {
      setAmount("");
      setDestinationAddress("");
    }
  };

  const handleConnect = () => {
    setVisible(true);
  };

  // Calculate vault balance for SOL
  const vaultBalance = (stats?.userBalance || 0).toFixed(4);

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="glass-card-static p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center shrink-0">
          <Globe className="w-6 h-6 text-[#FF7A00]" />
        </div>
        <div>
          <p className="text-white font-medium mb-1">
            Cross-Chain Privacy via <span className="text-[#FF7A00]">Mayan Finance</span>
          </p>
          <p className="text-sm text-[#666]">
            Bridge SOL from your vault privately to Ethereum, Base, BNB Chain, and more.
          </p>
        </div>
      </div>

      {/* Bridge Card */}
      <div className="glass-card-static p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center">
            <ArrowUpDown className="w-5 h-5 text-[#FF7A00]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Private Bridge</h2>
            <p className="text-sm text-[#666]">Powered by Mayan Finance</p>
          </div>
        </div>

        {/* From Input */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#666]">From (Solana Vault)</span>
            <div className="flex items-center gap-2">
              <Wallet className="w-3.5 h-3.5 text-[#404040]" />
              <span className="text-[#666]">
                Vault: {vaultBalance} SOL
              </span>
              <button
                type="button"
                onClick={() => setAmount(vaultBalance)}
                className="px-2 py-0.5 text-xs font-medium rounded bg-[#FF7A00]/10 text-[#FF7A00] hover:bg-[#FF7A00]/20 transition-colors"
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

        {/* Arrow Divider */}
        <div className="flex items-center gap-2 px-3 my-2">
          <div className="flex-1 h-px bg-white/[0.04]" />
          <div className="p-2 rounded-full bg-white/[0.02]">
            <ArrowUpDown className="w-5 h-5 text-[#666]" />
          </div>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>

        {/* To Chain Selection */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#666]">To Chain</span>
            {isQuoting && (
              <span className="flex items-center gap-1 text-[#666]">
                <Loader2 className="w-3 h-3 animate-spin" />
                Getting quote...
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(chains) as BridgeChain[]).slice(0, 3).map((chainKey) => {
              const chain = chains[chainKey];
              return (
                <button
                  key={chainKey}
                  type="button"
                  onClick={() => setSelectedChain(chainKey)}
                  className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                    selectedChain === chainKey
                      ? "border-[#FF7A00]/40 bg-[#FF7A00]/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
                  }`}
                >
                  <img
                    src={chain.icon}
                    alt={chain.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-xs text-white font-medium">{chain.name}</span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(chains) as BridgeChain[]).slice(3).map((chainKey) => {
              const chain = chains[chainKey];
              return (
                <button
                  key={chainKey}
                  type="button"
                  onClick={() => setSelectedChain(chainKey)}
                  className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${
                    selectedChain === chainKey
                      ? "border-[#FF7A00]/40 bg-[#FF7A00]/10"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
                  }`}
                >
                  <img
                    src={chain.icon}
                    alt={chain.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-white">{chain.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Destination Address */}
        <div className="space-y-2 mb-4">
          <label className="text-sm text-[#666]">
            Destination Address ({chains[selectedChain]?.name})
          </label>
          <div className="input-field">
            <input
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder={`Enter ${chains[selectedChain]?.name} address`}
              className="w-full p-4 bg-transparent outline-none text-white placeholder-[#333]"
            />
          </div>
        </div>

        {/* Refund Address */}
        <div className="space-y-2 mb-6">
          <label className="text-sm text-[#666]">Refund Address (Solana)</label>
          <div className="input-field">
            <input
              type="text"
              value={refundAddress}
              onChange={(e) => setRefundAddress(e.target.value)}
              placeholder="Enter Solana refund address"
              className="w-full p-4 bg-transparent outline-none text-white placeholder-[#333]"
            />
          </div>
        </div>

        {/* Quote Info */}
        {quote && Number.parseFloat(amount) > 0 && (
          <div className="space-y-2 text-sm px-1 mb-6 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div className="flex justify-between text-[#666]">
              <span>Expected Output</span>
              <span className="text-white font-medium">
                ~{Number(quote.expectedAmountOut).toFixed(4)} {chains[selectedChain]?.nativeToken}
              </span>
            </div>
            <div className="flex justify-between text-[#666]">
              <span>Min Output</span>
              <span className="text-[#a0a0a0]">
                {Number(quote.minAmountOut).toFixed(4)} {chains[selectedChain]?.nativeToken}
              </span>
            </div>
            <div className="flex justify-between text-[#666]">
              <span>Bridge Fee</span>
              <span className="text-[#a0a0a0]">
                ~{Number(quote.fee).toFixed(4)} SOL
              </span>
            </div>
            <div className="flex justify-between text-[#666]">
              <span>Estimated Time</span>
              <span className="text-[#a0a0a0] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatEstimatedTime(quote.estimatedTime)}
              </span>
            </div>
            <div className="flex justify-between text-[#666]">
              <span>Route</span>
              <span className="text-[#FF7A00]">{quote.route}</span>
            </div>
          </div>
        )}

        {/* Warning */}
        {Number.parseFloat(amount) > 0 && !destinationAddress && (
          <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">
              Please enter a destination address to get a quote
            </span>
          </div>
        )}

        {/* Bridge Button */}
        {connected ? (
          <button
            type="button"
            onClick={handleBridge}
            disabled={
              !amount ||
              Number.parseFloat(amount) <= 0 ||
              !destinationAddress ||
              isLoading ||
              isQuoting
            }
            className="btn-primary w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Bridging...
              </>
            ) : (
              <>
                Bridge to {chains[selectedChain]?.name}
              </>
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
    </div>
  );
}
