"use client";

import { useState } from "react";
import { Menu, X as XIcon, ArrowUpRight } from "lucide-react";
import WalletButton from "./WalletButton";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import Link from "next/link";

type Tab = "stealth" | "reveal" | "swap" | "bridge" | "portfolio";

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLaunchApp?: () => void;
}

export default function Header({
  activeTab,
  onTabChange,
  onLaunchApp,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connected, truncatedAddress, disconnect, walletIcon } = useWalletConnection();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.04]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <img
                src="/metricon-logo.png"
                alt="Metricon"
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white hidden sm:block">
              Metricon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/docs"
              className="btn-ghost text-sm"
            >
              Docs
            </Link>
            <a
              href="https://x.com/MetriconLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-sm flex items-center gap-1"
            >
              X
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {onLaunchApp && (
              <button
                type="button"
                onClick={onLaunchApp}
                className="btn-ghost text-sm"
              >
                Launch App
              </button>
            )}
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.04]">
            <nav className="flex flex-col gap-2 mb-4">
              <Link
                href="/docs"
                className="px-4 py-3 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/[0.03] transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <a
                href="https://x.com/MetriconLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-white/[0.03] transition-all flex items-center gap-2"
              >
                X (Twitter)
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </nav>
            <div className="pt-4 border-t border-white/[0.06]">
              {connected && truncatedAddress ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {walletIcon ? (
                      <img src={walletIcon} alt="Wallet" className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF3D00]" />
                    )}
                    <span className="text-sm text-white">{truncatedAddress}</span>
                  </div>
                  <button
                    type="button"
                    onClick={disconnect}
                    className="text-red-400 text-sm hover:text-red-300 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <WalletButton />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
