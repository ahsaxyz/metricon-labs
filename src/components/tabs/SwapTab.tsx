"use client";

import { useState, useEffect } from "react";
import { ArrowDownUp, Eye, Loader2, Wallet, AlertCircle, MapPin } from "lucide-react";
import TokenSelector, { TOKENS, type Token } from "../TokenSelector";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSwap, SWAP_TOKENS } from "@/hooks/useSwap";
import { useVault } from "@/hooks/useVault";
import { toast } from "sonner";
import { getSwapRequests } from "@/lib/supabase/api";

export default function SwapTab() {
  const [sellingAmount, setSellingAmount] = useState("");
  const [sellingToken, setSellingToken] = useState<Token>(TOKENS[0]); // SOL
  const [buyingToken, setBuyingToken] = useState<Token>(TOKENS[1]); // USDC
  const [slippage, setSlippage] = useState(0.5); // 0.5%
  const [destinationAddress, setDestinationAddress] = useState("");
  const [useCustomDestination, setUseCustomDestination] = useState(false);

  const { connected, walletAddress } = useWalletConnection();
  const { setVisible } = useWalletModal();
  const { stats } = useVault();
  const {
    isLoading,
    isQuoting,
    quote,
    getQuote,
    executeSwap,
    formatOutputAmount
  } = useSwap();

  // Track SPL token balances from completed swaps
  const [splBalances, setSplBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!walletAddress) return;
    getSwapRequests(walletAddress).then((swaps) => {
      const balances: Record<string, number> = {};
      for (const swap of swaps) {
        // Add tokens received from completed SOL→token swaps
        if (swap.status === "completed" && swap.output_mint && swap.output_amount) {
          balances[swap.output_mint] = (balances[swap.output_mint] || 0) + Number(swap.output_amount) / 1e6;
        }
        // Subtract tokens spent in completed token→SOL reverse swaps
        if (swap.status === "completed" && swap.input_mint && swap.amount) {
          balances[swap.input_mint] = (balances[swap.input_mint] || 0) - Number(swap.amount) / 1e6;
        }
      }
      // Never show negative balance
      for (const key of Object.keys(balances)) {
        balances[key] = Math.max(0, balances[key]);
      }
      setSplBalances(balances);
    });
  }, [walletAddress]);

  // Get mint addresses
  const getTokenMint = (symbol: string): string => {
    return SWAP_TOKENS[symbol] || SWAP_TOKENS.SOL;
  };

  // Auto-fill destination with connected wallet if not using custom
  useEffect(() => {
    if (walletAddress && !useCustomDestination) {
      setDestinationAddress(walletAddress);
    }
  }, [walletAddress, useCustomDestination]);

  // Debounced quote fetching
  useEffect(() => {
    const amount = Number.parseFloat(sellingAmount);
    if (amount > 0 && sellingToken.symbol !== buyingToken.symbol) {
      const timeout = setTimeout(() => {
        getQuote(
          getTokenMint(sellingToken.symbol),
          getTokenMint(buyingToken.symbol),
          amount,
          Math.floor(slippage * 100) // Convert to bps
        );
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [sellingAmount, sellingToken, buyingToken, slippage, getQuote]);

  const handleSwapTokens = () => {
    const tempToken = sellingToken;
    setSellingToken(buyingToken);
    setBuyingToken(tempToken);
    setSellingAmount("");
    toast.info("Tokens swapped");
  };

  const handleExecute = async () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    const amount = Number.parseFloat(sellingAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Use custom destination or default to connected wallet
    const destination = useCustomDestination && destinationAddress
      ? destinationAddress
      : walletAddress;

    if (!destination) {
      toast.error("Please enter a destination address");
      return;
    }

    const signature = await executeSwap(
      getTokenMint(sellingToken.symbol),
      getTokenMint(buyingToken.symbol),
      amount,
      destination,
      Math.floor(slippage * 100)
    );

    if (signature) {
      setSellingAmount("");
    }
  };

  const handleConnect = () => {
    setVisible(true);
  };

  // Calculate vault balance for selling token
  const vaultBalance = sellingToken.symbol === "SOL"
    ? (stats?.userBalance || 0).toFixed(4)
    : (splBalances[getTokenMint(sellingToken.symbol)] || 0).toFixed(6);

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="glass-card-static p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center shrink-0">
          <Eye className="w-6 h-6 text-[#FF7A00]" />
        </div>
        <div>
          <p className="text-white font-medium mb-1">
            Private Swap via <span className="text-[#FF7A00]">Relayer</span>
          </p>
          <p className="text-sm text-[#666]">
            Request a swap from your vault. The relayer executes Jupiter trades privately.
          </p>
        </div>
      </div>

      {/* Swap Card */}
      <div className="glass-card-static p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center">
              <ArrowDownUp className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Private Swap</h2>
              <p className="text-sm text-[#666]">Powered by Jupiter</p>
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#666]">Slippage:</span>
            <select
              value={slippage}
              onChange={(e) => setSlippage(Number(e.target.value))}
              className="bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-2 py-1 text-xs text-white outline-none"
            >
              <option value={0.1}>0.1%</option>
              <option value={0.5}>0.5%</option>
              <option value={1}>1%</option>
              <option value={3}>3%</option>
            </select>
          </div>
        </div>

        {/* Selling Input */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#666]">You're selling</span>
            <div className="flex items-center gap-2">
              <Wallet className="w-3.5 h-3.5 text-[#404040]" />
              <span className="text-[#666]">
                Vault: {vaultBalance} {sellingToken.symbol}
              </span>
              <button
                type="button"
                onClick={() => setSellingAmount(vaultBalance)}
                className="px-2 py-0.5 text-xs font-medium rounded bg-[#FF7A00]/10 text-[#FF7A00] hover:bg-[#FF7A00]/20 transition-colors"
              >
                MAX
              </button>
            </div>
          </div>

          <div className="input-field p-4 flex items-center gap-3">
            <input
              type="text"
              value={sellingAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
                  setSellingAmount(value);
                }
              }}
              placeholder="0.0"
              className="flex-1 bg-transparent outline-none text-2xl font-medium text-white placeholder-[#333]"
            />
            <TokenSelector
              selectedToken={sellingToken}
              onSelectToken={setSellingToken}
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex items-center gap-2 px-3 my-2">
          <div className="flex-1 h-px bg-white/[0.04]" />
          <button
            type="button"
            onClick={handleSwapTokens}
            className="p-2 rounded-full hover:bg-white/[0.05] transition-colors"
          >
            <ArrowDownUp className="w-5 h-5 text-[#666]" />
          </button>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>

        {/* Buying Input */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#666]">You're buying</span>
            {isQuoting && (
              <span className="flex items-center gap-1 text-[#666]">
                <Loader2 className="w-3 h-3 animate-spin" />
                Getting quote...
              </span>
            )}
          </div>

          <div className="input-field p-4 flex items-center gap-3">
            <input
              type="text"
              value={quote ? formatOutputAmount(getTokenMint(buyingToken.symbol)) : ""}
              disabled
              placeholder="0.0"
              className="flex-1 bg-transparent outline-none text-2xl font-medium text-white placeholder-[#333]"
            />
            <TokenSelector
              selectedToken={buyingToken}
              onSelectToken={setBuyingToken}
            />
          </div>
        </div>

        {/* Destination Address */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-sm text-[#666] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Destination Address
            </label>
            <button
              type="button"
              onClick={() => {
                setUseCustomDestination(!useCustomDestination);
                if (!useCustomDestination && walletAddress) {
                  setDestinationAddress("");
                } else if (walletAddress) {
                  setDestinationAddress(walletAddress);
                }
              }}
              className="text-xs text-[#FF7A00] hover:underline"
            >
              {useCustomDestination ? "Use my wallet" : "Use different address"}
            </button>
          </div>
          <div className="input-field">
            <input
              type="text"
              value={useCustomDestination ? destinationAddress : (walletAddress || "")}
              onChange={(e) => setDestinationAddress(e.target.value)}
              disabled={!useCustomDestination}
              placeholder="Enter Solana address for output tokens"
              className={`w-full p-4 bg-transparent outline-none text-sm ${
                useCustomDestination ? "text-white" : "text-[#666]"
              } placeholder-[#333]`}
            />
          </div>
          {useCustomDestination && (
            <p className="text-xs text-[#666]">
              Tokens will be sent to this address, breaking the link to your vault.
            </p>
          )}
        </div>

        {/* Quote Info */}
        {quote && Number.parseFloat(sellingAmount) > 0 && (
          <div className="space-y-2 text-sm px-1 mb-6">
            <div className="flex justify-between text-[#666]">
              <span>Price Impact</span>
              <span className={quote.priceImpactPct > 1 ? "text-[#FF3D00]" : "text-[#a0a0a0]"}>
                {quote.priceImpactPct.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-[#666]">
              <span>Route</span>
              <span className="text-[#a0a0a0]">
                {quote.routePlan?.length || 1} hop(s)
              </span>
            </div>
            <div className="flex justify-between text-[#666]">
              <span>Execution</span>
              <span className="text-[#FF7A00]">Via Relayer (Private)</span>
            </div>
          </div>
        )}

        {/* Price Impact Warning */}
        {quote && quote.priceImpactPct > 1 && (
          <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-[#FF3D00]/10 border border-[#FF3D00]/20">
            <AlertCircle className="w-4 h-4 text-[#FF3D00]" />
            <span className="text-sm text-[#FF3D00]">
              High price impact! Consider reducing your trade size.
            </span>
          </div>
        )}

        {/* Execute Button */}
        {connected ? (
          <button
            type="button"
            onClick={handleExecute}
            disabled={!sellingAmount || Number.parseFloat(sellingAmount) <= 0 || isLoading || isQuoting}
            className="btn-primary w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Requesting Swap...
              </>
            ) : (
              "Request Private Swap"
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

        {/* Privacy Note */}
        <p className="text-xs text-center text-[#666] mt-4">
          You sign a swap request. The relayer executes Jupiter trades from the vault.
        </p>
      </div>
    </div>
  );
}
