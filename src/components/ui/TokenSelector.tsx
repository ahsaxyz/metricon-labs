"use client";

import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance?: string;
  comingSoon?: boolean;
}

const TOKENS: Token[] = [
  {
    symbol: "SOL",
    name: "Solana",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    balance: "0.00",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    balance: "0.00",
    comingSoon: true,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    balance: "0.00",
    comingSoon: true,
  },
  {
    symbol: "BNB",
    name: "BNB Chain",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
    balance: "0.00",
    comingSoon: true,
  },
  {
    symbol: "BASE",
    name: "Base",
    icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/27716.png",
    balance: "0.00",
    comingSoon: true,
  },
  {
    symbol: "METRICON",
    name: "Metricon Labs",
    icon: "/metricon-logo.png",
    balance: "0.00",
    comingSoon: true,
  },
];

interface TokenSelectorProps {
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  label?: string;
}

export default function TokenSelector({
  selectedToken,
  onSelectToken,
  label,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = TOKENS.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="token-selector"
      >
        <img
          src={selectedToken.icon}
          alt={selectedToken.symbol}
          width={32}
          height={32}
          className="rounded-full w-8 h-8 object-cover"
        />
        <div className="flex flex-col items-start">
          <span className="font-medium text-white">{selectedToken.symbol}</span>
          {label && <span className="text-xs text-[#666]">{label}</span>}
          {!label && selectedToken.name && (
            <span className="text-xs text-[#666]">{selectedToken.name}</span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-[#666]" />
      </button>

      {/* Token Selection Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          />
          <div className="relative glass-card-static w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Select Token</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#666]" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#404040]" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-white/[0.06] rounded-xl text-white placeholder-[#404040] focus:border-[#FF7A00]/40 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {filteredTokens.map((token) => (
                <button
                  key={token.symbol}
                  type="button"
                  onClick={() => {
                    if (token.comingSoon) return;
                    onSelectToken(token);
                    setIsOpen(false);
                  }}
                  disabled={token.comingSoon}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    token.comingSoon
                      ? "opacity-50 cursor-not-allowed"
                      : selectedToken.symbol === token.symbol
                      ? "bg-[#FF7A00]/10 border border-[#FF7A00]/20"
                      : "hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <img
                    src={token.icon}
                    alt={token.symbol}
                    width={40}
                    height={40}
                    className={`rounded-full w-10 h-10 object-cover ${token.comingSoon ? "grayscale" : ""}`}
                  />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{token.symbol}</span>
                      {token.comingSoon && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF7A00]/20 text-[#FF7A00] font-medium">
                          COMING SOON
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#666]">{token.name}</div>
                  </div>
                  {token.balance && !token.comingSoon && (
                    <span className="text-sm text-[#666]">{token.balance}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { TOKENS };
