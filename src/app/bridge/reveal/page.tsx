"use client";

import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import RevealTab from "@/components/tabs/RevealTab";
import { EyeOff, ArrowRight, ArrowLeft, Clock, Shield, Wallet } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BlurIn } from "@/components/animations/ScrollReveal";

// Smooth easing - typed as tuple for Framer Motion
const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function RevealPage() {
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
              className="pt-8 lg:order-2"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: smoothEase }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
              >
                <EyeOff className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-sm text-[#FF7A00] font-medium">Reveal</span>
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
                  Withdrawals
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg text-[#666] mb-8 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
              >
                Withdraw to any address without linking back to your original deposit. The relayer service ensures your privacy is maintained throughout.
              </motion.p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: Wallet, text: "Withdraw to any Solana address" },
                  { icon: Clock, text: "Time-delayed for enhanced privacy" },
                  { icon: Shield, text: "Relayer-powered anonymity" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
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
                  href="/stealth"
                  className="text-sm text-[#666] hover:text-[#FF7A00] transition-colors flex items-center gap-1 group"
                >
                  <motion.span
                    animate={{ x: [0, -4, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.span>
                  Prev: Stealth
                </Link>
                <Link
                  href="/swap"
                  className="text-sm text-[#666] hover:text-[#FF7A00] transition-colors flex items-center gap-1 group"
                >
                  Next: Swap
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
              className="relative lg:order-1"
              initial={{ opacity: 0, x: -80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-l from-[#FF7A00]/10 via-[#FF3D00]/5 to-transparent rounded-3xl blur-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />

              <motion.div
                className="relative"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <RevealTab />
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
              <h2 className="text-xl font-semibold text-white mb-4">How Reveal Works</h2>
              <div className="space-y-4 text-[#a0a0a0]">
                <p>
                  When you reveal (withdraw) tokens, you specify the destination address. The relayer service submits the transaction on your behalf, breaking the link between your wallet and the withdrawal.
                </p>
                <p>
                  A time delay is applied between requesting and executing the withdrawal. This enhances privacy by mixing your withdrawal with others in the same time window.
                </p>
                <p>
                  The relayer pays the transaction fees, which are deducted from your withdrawal amount along with a 0.3% protocol fee.
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
