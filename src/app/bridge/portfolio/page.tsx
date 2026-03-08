"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import SiteFooter from "@/components/ui/SiteFooter";
import PortfolioTab from "@/components/tabs/PortfolioTab";
import { Wallet, ArrowRight, Eye, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Smooth easing - typed as tuple for Framer Motion
const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function PortfolioPage() {
  const router = useRouter();

  const handleNavigateToStealth = () => {
    router.push("/stealth");
  };

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
                <Wallet className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-sm text-[#FF7A00] font-medium">Portfolio</span>
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
                  Portfolio
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg text-[#666] mb-8 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: smoothEase }}
              >
                View your stealth balances, track deposits and withdrawals, and manage your private assets all in one place.
              </motion.p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: Eye, text: "View all stealth balances" },
                  { icon: BarChart3, text: "Track transaction history" },
                  { icon: Shield, text: "Referral rewards tracking" },
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
                  href="/stealth"
                  className="text-sm text-[#666] hover:text-[#FF7A00] transition-colors flex items-center gap-1 group"
                >
                  Make a deposit
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
                <PortfolioTab onNavigateToStealth={handleNavigateToStealth} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
