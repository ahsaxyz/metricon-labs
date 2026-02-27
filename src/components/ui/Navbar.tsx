"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Eye, EyeOff, ArrowLeftRight, ArrowUpDown, Wallet } from "lucide-react";
import WalletButton from "./WalletButton";

const solutions = [
  {
    name: "Stealth",
    description: "Deposit tokens into privacy pools",
    href: "/stealth",
    icon: Eye,
  },
  {
    name: "Reveal",
    description: "Withdraw from privacy pools",
    href: "/reveal",
    icon: EyeOff,
  },
  {
    name: "Swap",
    description: "Private token swaps via Jupiter",
    href: "/swap",
    icon: ArrowLeftRight,
  },
  {
    name: "Bridge",
    description: "Cross-chain privacy transfers",
    href: "/bridge",
    icon: ArrowUpDown,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setSolutionsOpen(false);
    }, 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/metricon-logo.png"
              alt="Metricon Labs"
              className="h-9 w-auto"
            />
            <span className="text-lg font-semibold text-white tracking-tight hidden sm:block">
              Metricon Labs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {/* Solutions Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors rounded-lg hover:bg-white/[0.03]"
                onClick={() => setSolutionsOpen(!solutionsOpen)}
              >
                Solutions
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {solutionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.06] shadow-2xl overflow-hidden animate-fade-in">
                  <div className="p-2">
                    {solutions.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                        onClick={() => setSolutionsOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-[#FF7A00]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white group-hover:text-[#FF7A00] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-[#666] mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio Link */}
            <Link
              href="/portfolio"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors rounded-lg hover:bg-white/[0.03]"
            >
              <Wallet className="w-4 h-4" />
              Portfolio
            </Link>

            {/* Documents Link */}
            <Link
              href="/docs"
              className="px-4 py-2 text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors rounded-lg hover:bg-white/[0.03]"
            >
              Documents
            </Link>

            {/* X Link */}
            <a
              href="https://x.com/MetriconLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-[#a0a0a0] hover:text-white transition-colors rounded-lg hover:bg-white/[0.03]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* Right Side - Wallet & CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Link
              href="/stealth"
              className="px-4 py-2 text-sm font-medium text-[#a0a0a0] hover:text-white transition-colors"
            >
              Open App
            </Link>
            <WalletButton />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050505]/98 backdrop-blur-xl border-t border-white/[0.04]">
          <div className="px-4 py-6 space-y-4">
            {/* Solutions Section */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-[#404040] uppercase tracking-wider px-3">
                Solutions
              </div>
              {solutions.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-[#FF7A00]" />
                  </div>
                  <span className="text-sm font-medium text-white">{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="h-px bg-white/[0.04]" />

            {/* Other Links */}
            <div className="space-y-1">
              <Link
                href="/portfolio"
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Wallet className="w-5 h-5 text-[#666]" />
                <span className="text-sm font-medium text-white">Portfolio</span>
              </Link>
              <Link
                href="/docs"
                className="block px-3 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/[0.03] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documents
              </Link>
              <a
                href="https://x.com/MetriconLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/[0.03] transition-colors"
              >
                <svg className="w-5 h-5 text-[#666]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (Twitter)
              </a>
            </div>

            <div className="h-px bg-white/[0.04]" />

            {/* Wallet */}
            <div className="pt-2">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
