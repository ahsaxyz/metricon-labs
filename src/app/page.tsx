"use client";

import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import SiteFooter from "@/components/ui/SiteFooter";
import ProductSection from "@/components/ProductSection";
import { Eye, EyeOff, ArrowLeftRight, ArrowUpDown, Shield, Lock, Zap, Globe, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  FadeUp,
  FadeIn,
  BlurIn,
  StaggerContainer,
  StaggerItem,
  Parallax,
  TextReveal,
  ScaleUp,
  Float,
  GlowPulse,
  ClipReveal,
  SectionReveal,
} from "@/components/animations/ScrollReveal";

// Smooth easing - typed as tuple for Framer Motion
const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      {/* Ambient Background Effects */}
      <div className="gradient-glow-top" />
      <div className="noise-texture" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 overflow-hidden">
        {/* Background Gradient Orb with Parallax */}
        <Parallax speed={0.3} direction="down" className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#FF7A00]/[0.08] via-[#FF3D00]/[0.04] to-transparent blur-3xl rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </Parallax>

        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#FF7A00]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="text-sm text-[#a0a0a0]">Privacy Infrastructure for Solana</span>
          </motion.div>

          {/* Main Headline - Metricon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4">
              <motion.span
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: smoothEase }}
                className="metricon-hover-glow text-gradient cursor-pointer"
              >
                Metricon
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle - Solana Privacy Protocol */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: smoothEase }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-6"
          >
            Solana Privacy Protocol
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: smoothEase }}
            className="text-lg md:text-xl text-[#666] max-w-2xl mx-auto mb-12"
          >
            Move assets without the noise. Stealth, swap, and bridge with complete privacy on Solana.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: smoothEase }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <GlowPulse className="rounded-xl">
              <Link
                href="/stealth"
                className="btn-primary text-base px-8 py-4 rounded-xl flex items-center gap-2 font-semibold"
              >
                Open App
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Link>
            </GlowPulse>
            <Link
              href="/docs"
              className="btn-secondary text-base px-8 py-4 rounded-xl font-medium"
            >
              Documentation
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: smoothEase }}
            className="grid grid-cols-3 gap-8 max-w-xl mx-auto"
          >
            {[
              { value: "100%", label: "Non-Custodial" },
              { value: "<1s", label: "Finality" },
              { value: "0.3%", label: "Protocol Fee" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1, ease: smoothEase }}
              >
                <div className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-xs text-[#666] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <button
            type="button"
            onClick={() => document.getElementById("stealth-section")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center gap-2 text-[#404040] hover:text-[#666] transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </button>
        </motion.div>

        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </section>

      {/* Stealth Section */}
      <ProductSection
        id="stealth-section"
        index="01"
        title="Private"
        highlight="Deposits"
        description="Deposit SOL and SPL tokens into privacy pools. Your funds become untraceable on-chain, breaking the link between your wallet and your assets."
        features={[
          "Support for SOL and all SPL tokens",
          "Zero-knowledge proof generation",
          "Instant deposit confirmation",
          "Non-custodial architecture",
        ]}
        href="/stealth"
        ctaText="Launch Stealth"
        icon={Eye}
        imagePosition="right"
      />

      {/* Reveal Section */}
      <ProductSection
        id="reveal-section"
        index="02"
        title="Private"
        highlight="Withdrawals"
        description="Withdraw to any address without linking back to your original deposit. The relayer service ensures your privacy is maintained throughout the process."
        features={[
          "Withdraw to any Solana address",
          "Time-delayed for enhanced privacy",
          "Relayer-powered for anonymity",
          "No connection to deposit address",
        ]}
        href="/reveal"
        ctaText="Launch Reveal"
        icon={EyeOff}
        imagePosition="left"
      />

      {/* Swap Section */}
      <ProductSection
        id="swap-section"
        index="03"
        title="Private"
        highlight="Trading"
        description="Trade any token pair privately through Jupiter aggregator. Execute swaps without exposing your trading activity or wallet balance to observers."
        features={[
          "Access to all Jupiter liquidity",
          "Best price aggregation",
          "Hidden trading activity",
          "MEV protection",
        ]}
        href="/swap"
        ctaText="Launch Swap"
        icon={ArrowLeftRight}
        imagePosition="right"
      />

      {/* Bridge Section */}
      <ProductSection
        id="bridge-section"
        index="04"
        title="Cross-Chain"
        highlight="Privacy"
        description="Bridge assets privately across blockchains. Coming soon with privacy-preserving cross-chain transfers that maintain anonymity across networks."
        features={[
          "Multi-chain support (coming soon)",
          "Privacy-preserving bridges",
          "Atomic cross-chain swaps",
          "No chain analysis possible",
        ]}
        href="/bridge"
        ctaText="Launch Bridge"
        icon={ArrowUpDown}
        imagePosition="left"
      />

      {/* Security Section */}
      <SectionReveal id="security-section" className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-16">
            <span className="text-xs font-medium text-[#404040] tracking-wider">
              [ 05 ] SECURITY
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-6">
              <span className="text-white">Built for </span>
              <span className="text-gradient">Trust</span>
            </h2>
            <p className="text-lg text-[#666] max-w-2xl mx-auto">
              Privacy infrastructure designed with security-first principles. No trusted parties, no compromises.
            </p>
          </BlurIn>

          {/* Security Cards Grid */}
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {/* Card 1 */}
            <StaggerItem>
              <motion.div
                className="feature-card group h-full"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Float duration={5} distance={8}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6 text-[#FF7A00]" />
                  </div>
                </Float>
                <h3 className="text-xl font-semibold text-white mb-3">Non-Custodial</h3>
                <p className="text-[#666] leading-relaxed">
                  You always control your funds. The protocol never takes custody of your assets at any point.
                </p>
              </motion.div>
            </StaggerItem>

            {/* Card 2 */}
            <StaggerItem>
              <motion.div
                className="feature-card group h-full"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Float duration={5.5} distance={8}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-6">
                    <Lock className="w-6 h-6 text-[#FF7A00]" />
                  </div>
                </Float>
                <h3 className="text-xl font-semibold text-white mb-3">Zero-Knowledge</h3>
                <p className="text-[#666] leading-relaxed">
                  Uses industry-standard Groth16 zkSNARKs to verify transactions without revealing sensitive data.
                </p>
              </motion.div>
            </StaggerItem>

            {/* Card 3 */}
            <StaggerItem>
              <motion.div
                className="feature-card group h-full"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Float duration={6} distance={8}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-[#FF7A00]" />
                  </div>
                </Float>
                <h3 className="text-xl font-semibold text-white mb-3">Solana Native</h3>
                <p className="text-[#666] leading-relaxed">
                  Built specifically for Solana. Sub-second finality and minimal fees for private transactions.
                </p>
              </motion.div>
            </StaggerItem>

            {/* Card 4 */}
            <StaggerItem>
              <motion.div
                className="feature-card group h-full"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Float duration={5.2} distance={8}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-6">
                    <Globe className="w-6 h-6 text-[#FF7A00]" />
                  </div>
                </Float>
                <h3 className="text-xl font-semibold text-white mb-3">Open Source</h3>
                <p className="text-[#666] leading-relaxed">
                  All code is publicly verifiable. Transparency in implementation, privacy in usage.
                </p>
              </motion.div>
            </StaggerItem>

            {/* Card 5 */}
            <StaggerItem>
              <motion.div
                className="feature-card group h-full"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Float duration={5.8} distance={8}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </Float>
                <h3 className="text-xl font-semibold text-white mb-3">Battle-Tested</h3>
                <p className="text-[#666] leading-relaxed">
                  Built on proven cryptographic primitives and rigorously tested. Security is our top priority.
                </p>
              </motion.div>
            </StaggerItem>

            {/* Card 6 */}
            <StaggerItem>
              <motion.div
                className="feature-card group h-full"
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Float duration={5.4} distance={8}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </Float>
                <h3 className="text-xl font-semibold text-white mb-3">Decentralized</h3>
                <p className="text-[#666] leading-relaxed">
                  No single point of failure. The relayer network ensures censorship-resistant privacy.
                </p>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </SectionReveal>

      {/* How It Works Section */}
      <SectionReveal className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlurIn className="text-center mb-16">
            <span className="text-xs font-medium text-[#404040] tracking-wider">
              [ 06 ] HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-6">
              <span className="text-white">Three steps to </span>
              <span className="text-gradient">privacy</span>
            </h2>
          </BlurIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 lg:gap-12" staggerDelay={0.2}>
            {/* Step 1 */}
            <StaggerItem className="text-center">
              <ScaleUp delay={0.1}>
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl font-bold text-gradient">01</span>
                </motion.div>
              </ScaleUp>
              <h3 className="text-xl font-semibold text-white mb-3">Stealth</h3>
              <p className="text-[#666]">
                Connect your wallet and deposit tokens into the Metricon vault. Receive a private note representing your balance.
              </p>
            </StaggerItem>

            {/* Step 2 */}
            <StaggerItem className="text-center">
              <ScaleUp delay={0.2}>
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 mb-6"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl font-bold text-gradient">02</span>
                </motion.div>
              </ScaleUp>
              <h3 className="text-xl font-semibold text-white mb-3">Transact</h3>
              <p className="text-[#666]">
                Swap, bridge, or hold privately. Your activity is hidden from on-chain observers and analytics.
              </p>
            </StaggerItem>

            {/* Step 3 */}
            <StaggerItem className="text-center">
              <ScaleUp delay={0.3}>
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl font-bold text-gradient">03</span>
                </motion.div>
              </ScaleUp>
              <h3 className="text-xl font-semibold text-white mb-3">Reveal</h3>
              <p className="text-[#666]">
                Withdraw to any address. The link between deposit and withdrawal is cryptographically broken.
              </p>
            </StaggerItem>
          </StaggerContainer>

          {/* CTA */}
          <FadeUp delay={0.5} className="text-center mt-16">
            <GlowPulse className="inline-block rounded-xl">
              <Link
                href="/stealth"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold"
              >
                Start Now
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </Link>
            </GlowPulse>
          </FadeUp>
        </div>
      </SectionReveal>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
