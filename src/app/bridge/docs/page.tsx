"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  ChevronRight,
  Search,
  Eye,
  ArrowDownUp,
  Wallet,
  Lock,
  Zap,
  CheckCircle,
  FileText,
  HelpCircle,
  Coins,
  Layers,
  DollarSign,
  Server,
  Menu,
  X,
  Home,
  ArrowLeft,
} from "lucide-react";

type DocSection = "what-is-metricon" | "faq" | "tokenomics" | "technical" | "fees" | "relayer";

const sidebarItems = {
  gettingStarted: {
    title: "Getting Started",
    items: [
      { id: "what-is-metricon" as DocSection, label: "What is Metricon?", icon: FileText },
      { id: "faq" as DocSection, label: "FAQ", icon: HelpCircle },
      { id: "tokenomics" as DocSection, label: "Tokenomics", icon: Coins },
    ],
  },
  coreConcepts: {
    title: "Core Concepts",
    items: [
      { id: "technical" as DocSection, label: "Technical Architecture", icon: Layers },
      { id: "fees" as DocSection, label: "Fees", icon: DollarSign },
      { id: "relayer" as DocSection, label: "Relayer Service", icon: Server },
    ],
  },
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<DocSection>("what-is-metricon");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "what-is-metricon":
        return <WhatIsMetriconContent />;
      case "faq":
        return <FAQContent />;
      case "tokenomics":
        return <TokenomicsContent />;
      case "technical":
        return <TechnicalContent />;
      case "fees":
        return <FeesContent />;
      case "relayer":
        return <RelayerContent />;
      default:
        return <WhatIsMetriconContent />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#050505]">
      {/* Ambient Background */}
      <div className="gradient-glow-top" />
      <div className="noise-texture" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050505]/80 border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/metricon-logo.png"
                alt="Metricon"
                className="h-8 w-auto"
              />
              <span className="font-semibold text-lg text-white">Metricon</span>
            </Link>
            <span className="text-[#404040]">|</span>
            <span className="text-[#a0a0a0] font-medium">Documentation</span>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#404040]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-16 py-2 w-64 bg-[#0a0a0a] border border-white/[0.06] rounded-lg text-sm text-white placeholder-[#404040] focus:border-[#FF7A00]/40 focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#404040] bg-[#0a0a0a] px-1.5 py-0.5 rounded">
                Ctrl K
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-white/[0.04] p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <nav className="space-y-6">
            {/* Back to App */}
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors mb-6"
            >
              <Home className="w-4 h-4" />
              <span>Back to App</span>
            </Link>

            {/* Getting Started */}
            <div>
              <h3 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-3">
                {sidebarItems.gettingStarted.title}
              </h3>
              <ul className="space-y-1">
                {sidebarItems.gettingStarted.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === item.id
                          ? "bg-[#FF7A00]/10 text-white border-l-2 border-[#FF7A00]"
                          : "text-[#666] hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Core Concepts */}
            <div>
              <h3 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-3">
                {sidebarItems.coreConcepts.title}
              </h3>
              <ul className="space-y-1">
                {sidebarItems.coreConcepts.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === item.id
                          ? "bg-[#FF7A00]/10 text-white border-l-2 border-[#FF7A00]"
                          : "text-[#666] hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl pt-20 px-4">
            <nav className="space-y-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Back to App</span>
              </Link>

              <div>
                <h3 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-3">
                  {sidebarItems.gettingStarted.title}
                </h3>
                <ul className="space-y-1">
                  {sidebarItems.gettingStarted.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm transition-all ${
                          activeSection === item.id
                            ? "bg-[#FF7A00]/10 text-white"
                            : "text-[#666]"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-3">
                  {sidebarItems.coreConcepts.title}
                </h3>
                <ul className="space-y-1">
                  {sidebarItems.coreConcepts.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm transition-all ${
                          activeSection === item.id
                            ? "bg-[#FF7A00]/10 text-white"
                            : "text-[#666]"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 relative z-10">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <span className="text-xs text-[#404040]">METRICON LABS 2026</span>
        </div>
      </footer>
    </div>
  );
}

// Content Components
function WhatIsMetriconContent() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2">
        <span className="text-xs text-[#404040]">[ 01 ] GETTING STARTED</span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">What is Metricon?</h1>
      <p className="text-xl text-[#666] mb-8">
        We enable private trustless DeFi on Solana.
      </p>

      <div className="space-y-6">
        <p className="text-[#a0a0a0] leading-relaxed">
          Metricon is a privacy protocol on Solana that lets you stealth SOL and any SPL token
          into our privacy pool and trade any pair privately on Jupiter. Any action done
          through our protocol is fully untraceable by any external observer.
        </p>
        <p className="text-[#a0a0a0] leading-relaxed">
          Using zero-knowledge proofs, you can prove a transaction is valid without
          exposing amounts or participants. It only relies on ZK cryptography, no trusted
          parties, no questionable TEEs.
        </p>

        {/* How It Works */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#FF7A00]" />
          How It Works
        </h2>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF3D00] flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div className="flex-1 border-l border-white/[0.06] pl-6 pb-6">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#FF7A00]" />
                Deposit Tokens
              </h3>
              <p className="text-[#666]">
                Send tokens to the protocol and receive a private note. This note represents
                your balance but doesn't reveal any information on-chain.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF3D00] flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div className="flex-1 border-l border-white/[0.06] pl-6 pb-6">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#FF7A00]" />
                Make Private Transactions
              </h3>
              <p className="text-[#666]">
                Use your notes to transact privately. The protocol verifies you have the funds
                without revealing which deposit you're spending from.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF3D00] flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div className="flex-1 pl-6">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <ArrowDownUp className="w-5 h-5 text-[#FF7A00]" />
                Withdraw or Swap
              </h3>
              <p className="text-[#666]">
                Withdraw to any address or swap to different tokens. The recipient can't trace
                back to your original deposit.
              </p>
            </div>
          </div>
        </div>

        {/* Supported Tokens */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
          <Coins className="w-6 h-6 text-[#FF7A00]" />
          Supported Tokens
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card-static p-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <h3 className="font-semibold text-white mb-1">Native SOL</h3>
            <p className="text-sm text-[#666]">Automatic WSOL wrapping/unwrapping</p>
          </div>

          <div className="glass-card-static p-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <h3 className="font-semibold text-white mb-1">All SPL Tokens</h3>
            <p className="text-sm text-[#666]">USDC, USDT, and any standard token</p>
          </div>

          <div className="glass-card-static p-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-3">
              <ArrowDownUp className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <h3 className="font-semibold text-white mb-1">Cross-Token Swaps</h3>
            <p className="text-sm text-[#666]">Powered by Jupiter Aggregator</p>
          </div>
        </div>

        {/* Security & Trust */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6 text-[#FF7A00]" />
          Security & Trust
        </h2>

        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#FF7A00] mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-white">Non-custodial:</span>
              <span className="text-[#666]"> You always control your funds</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#FF7A00] mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-white">Audited Cryptography:</span>
              <span className="text-[#666]"> Uses industry-standard Groth16 zkSNARKs</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#FF7A00] mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-white">Open Source:</span>
              <span className="text-[#666]"> All code is publicly verifiable</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

function FAQContent() {
  const faqs = [
    {
      question: "Is Metricon safe to use?",
      answer: "Yes, Metricon uses zero-knowledge proofs and industry-standard cryptography. The protocol is non-custodial, meaning you always maintain control of your funds."
    },
    {
      question: "How does privacy work?",
      answer: "When you stealth tokens, they enter a privacy pool. The zero-knowledge proofs allow you to prove you own tokens without revealing which specific deposit is yours."
    },
    {
      question: "What tokens are supported?",
      answer: "Metricon supports native SOL and all SPL tokens. You can also swap between tokens privately using our Jupiter integration."
    },
    {
      question: "Are there any fees?",
      answer: "Yes, there are minimal protocol fees for stealth, reveal, and swapping. See the Fees section for detailed information."
    },
    {
      question: "How do I get started?",
      answer: "Simply connect your Solana wallet, choose the amount and token you want to stealth, and click Stealth. Your tokens will enter the privacy pool."
    },
  ];

  return (
    <div className="max-w-3xl">
      <div className="mb-2">
        <span className="text-xs text-[#404040]">[ 01 ] GETTING STARTED</span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">FAQ</h1>
      <p className="text-xl text-[#666] mb-8">
        Frequently asked questions about Metricon.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="glass-card-static p-6">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#FF7A00]" />
              {faq.question}
            </h3>
            <p className="text-[#666] ml-7">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenomicsContent() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2">
        <span className="text-xs text-[#404040]">[ 01 ] GETTING STARTED</span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Tokenomics</h1>
      <p className="text-xl text-[#666] mb-8">
        Understanding the METR token economics.
      </p>

      <div className="glass-card-static p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Token Distribution</h3>
        <div className="space-y-4">
          {[
            { label: "Community & Ecosystem", value: "40%" },
            { label: "Team & Advisors", value: "20%" },
            { label: "Treasury", value: "25%" },
            { label: "Liquidity", value: "15%" },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[#666]">{item.label}</span>
                <span className="text-white font-medium">{item.value}</span>
              </div>
              <div className="w-full bg-white/[0.04] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#FF7A00] to-[#FF3D00] h-2 rounded-full"
                  style={{ width: item.value }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechnicalContent() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2">
        <span className="text-xs text-[#404040]">[ 02 ] CORE CONCEPTS</span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Technical Architecture</h1>
      <p className="text-xl text-[#666] mb-8">
        Deep dive into how Metricon works under the hood.
      </p>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Zero-Knowledge Proofs</h2>
          <p className="text-[#a0a0a0] leading-relaxed">
            Metricon uses Groth16 zkSNARKs to enable private transactions. When you make a transaction,
            you generate a proof that demonstrates you have sufficient funds without revealing which
            specific deposit you're spending from.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Merkle Trees</h2>
          <p className="text-[#a0a0a0] leading-relaxed">
            All deposits are stored in a Merkle tree structure. This allows for efficient proof
            verification while maintaining the privacy of all participants.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Nullifiers</h2>
          <p className="text-[#a0a0a0] leading-relaxed">
            Each note can only be spent once. When you spend a note, a unique nullifier is revealed
            that prevents double-spending without linking to your original deposit.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeesContent() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2">
        <span className="text-xs text-[#404040]">[ 02 ] CORE CONCEPTS</span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Fees</h1>
      <p className="text-xl text-[#666] mb-8">
        Understanding the fee structure.
      </p>

      <div className="grid gap-4">
        {[
          { label: "Stealth Fee", description: "When depositing tokens into the privacy pool", value: "0.3%" },
          { label: "Reveal Fee", description: "When withdrawing tokens from the privacy pool", value: "0.3%" },
          { label: "Swap Fee", description: "When swapping tokens privately", value: "0.5%" },
          { label: "Relayer Fee", description: "For transactions using the relayer service", value: "0.1%" },
        ].map((fee) => (
          <div key={fee.label} className="glass-card-static p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white mb-1">{fee.label}</h3>
                <p className="text-sm text-[#666]">{fee.description}</p>
              </div>
              <span className="text-2xl font-bold text-gradient">{fee.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelayerContent() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2">
        <span className="text-xs text-[#404040]">[ 02 ] CORE CONCEPTS</span>
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Relayer Service</h1>
      <p className="text-xl text-[#666] mb-8">
        How relayers enable gasless private transactions.
      </p>

      <div className="space-y-8">
        <p className="text-[#a0a0a0] leading-relaxed">
          The relayer service allows you to make private transactions without needing to pay gas
          from a linked wallet. This enhances privacy by breaking the connection between your
          public wallet and private transactions.
        </p>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-3 text-[#a0a0a0]">
            <li>You generate a transaction proof locally</li>
            <li>The proof is sent to a relayer</li>
            <li>The relayer submits the transaction on-chain</li>
            <li>A small fee is deducted from your stealth balance</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Benefits</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF7A00] mt-0.5 shrink-0" />
              <span className="text-[#a0a0a0]">No gas wallet required</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF7A00] mt-0.5 shrink-0" />
              <span className="text-[#a0a0a0]">Enhanced privacy</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#FF7A00] mt-0.5 shrink-0" />
              <span className="text-[#a0a0a0]">Decentralized relayer network</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
