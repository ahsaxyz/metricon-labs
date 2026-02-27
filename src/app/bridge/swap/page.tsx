"use client";

import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import SwapTab from "@/components/tabs/SwapTab";
import { ArrowLeftRight, ArrowRight, ArrowLeft, Zap, Shield, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BlurIn } from "@/components/animations/ScrollReveal";

// Smooth easing - typed as tuple for Framer Motion
const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function SwapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      {/* Ambient Background Effects */}
      <div className="gradient-glow-top" />
      <div className="noise-texture" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Content */}
            <motion.div
              className="pt-8"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: smoothEase }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
              >
                <ArrowLeftRight className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-sm text-[#FF7A00] font-medium">Swap</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
              >
                <span className="text-white">Private</span>{" "}
                <motion.span
                  className="text-gradient"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
                >
                  Trading
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg text-[#666] mb-8 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
              >
                Trade any token pair privately through Jupiter aggregator. Execute swaps without exposing your trading activity or wallet balance.
              </motion.p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: TrendingUp, text: "Access to all Jupiter liquidity" },
                  { icon: Zap, text: "Best price aggregation" },
                  { icon: Shield, text: "MEV protection included" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 + index * 0.1, ease: smoothEase }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1, type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-4 h-4 text-[#FF7A00]" />
                    </motion.div>
                    <span className="text-[#a0a0a0]">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <motion.div
                className="flex items-center gap-6 pt-4 border-t border-white/[0.04]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: smoothEase }}
              >
                <Link
                  href="/reveal"
                  className="text-sm text-[#666] hover:text-[#FF7A00] transition-colors flex items-center gap-1 group"
                >
                  <motion.span
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.span>
                  Prev: Reveal
                </Link>
                <Link
                  href="/bridge"
                  className="text-sm text-[#666] hover:text-[#FF7A00] transition-colors flex items-center gap-1 group"
                >
                  Next: Bridge
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>

            {/* App Card */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-[#FF7A00]/10 via-[#FF3D00]/5 to-transparent rounded-3xl blur-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />

              <motion.div
                className="relative"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <SwapTab />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <BlurIn>
            <motion.div
              className="glass-card-static p-8"
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(255, 122, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">How Private Swap Works</h2>
              <div className="space-y-4 text-[#a0a0a0]">
                <p>
                  Private swaps use your stealth balance to execute trades. When you swap, the transaction is routed through Jupiter aggregator for the best price, but the trade is executed from the privacy pool.
                </p>
                <p>
                  This means observers cannot see your trading activity, position sizes, or strategy. Your wallet is never connected to the trade on-chain.
                </p>
                <p>
                  A 0.5% protocol fee applies to all swaps, in addition to standard Jupiter routing fees.
                </p>
              </div>
            </motion.div>
          </BlurIn>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
