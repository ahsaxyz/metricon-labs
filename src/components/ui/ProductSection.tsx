"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ProductSectionProps {
  id: string;
  index: string;
  title: string;
  highlight: string;
  description: string;
  features: string[];
  href: string;
  ctaText: string;
  icon: LucideIcon;
  imagePosition?: "left" | "right";
  mockupContent?: React.ReactNode;
}

// Premium easing curves
const smoothEase = [0.22, 1, 0.36, 1] as const;
const springEase = [0.34, 1.56, 0.64, 1] as const;

export default function ProductSection({
  id,
  index,
  title,
  highlight,
  description,
  features,
  href,
  ctaText,
  icon: Icon,
  imagePosition = "right",
  mockupContent,
}: ProductSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Parallax effect for the mockup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const mockupY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id={id} ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${imagePosition === "left" ? "lg:flex-row-reverse" : ""}`}>
          {/* Content */}
          <motion.div
            className={`${imagePosition === "left" ? "lg:order-2" : ""}`}
            style={{ y: contentY }}
            initial={{ opacity: 0, x: imagePosition === "right" ? -60 : 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: imagePosition === "right" ? -60 : 60 }}
            transition={{ duration: 0.9, ease: smoothEase }}
          >
            {/* Index Badge */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
            >
              <span className="text-xs font-medium text-[#404040] tracking-wider">
                [ {index} ]
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
            >
              <span className="text-white">{title}</span>{" "}
              <motion.span
                className="text-gradient inline-block"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={isInView ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 1, delay: 0.25, ease: smoothEase }}
              >
                {highlight}
              </motion.span>
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg text-[#666] mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.7, delay: 0.2, ease: smoothEase }}
            >
              {description}
            </motion.p>

            {/* Features List */}
            <ul className="space-y-3 mb-10">
              {features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.08, ease: smoothEase }}
                >
                  <motion.div
                    className="w-5 h-5 rounded-full bg-[#FF7A00]/10 flex items-center justify-center shrink-0"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 + idx * 0.08, ease: springEase }}
                  >
                    <svg className="w-3 h-3 text-[#FF7A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <span className="text-[#a0a0a0]">{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5, ease: smoothEase }}
            >
              <Link
                href={href}
                className="inline-flex items-center gap-2 text-[#FF7A00] hover:text-[#FF9A40] font-medium transition-colors group"
              >
                {ctaText}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mockup */}
          <motion.div
            className={`${imagePosition === "left" ? "lg:order-1" : ""}`}
            style={{ y: mockupY }}
            initial={{ opacity: 0, x: imagePosition === "right" ? 80 : -80, scale: 0.9, rotateY: imagePosition === "right" ? 10 : -10 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1, rotateY: 0 } : { opacity: 0, x: imagePosition === "right" ? 80 : -80, scale: 0.9, rotateY: imagePosition === "right" ? 10 : -10 }}
            transition={{ duration: 1, delay: 0.2, ease: smoothEase }}
          >
            <div className="relative" style={{ perspective: 1000 }}>
              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-[#FF7A00]/10 via-[#FF3D00]/5 to-transparent rounded-3xl blur-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 1, delay: 0.3 }}
              />

              {/* Glass Card */}
              <motion.div
                className="relative glass-card-static p-6 lg:p-8 rounded-2xl"
                whileHover={{
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(255, 122, 0, 0.15)",
                  transition: { duration: 0.4 }
                }}
              >
                {/* Card Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.04]">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: springEase }}
                  >
                    <Icon className="w-5 h-5 text-[#FF7A00]" />
                  </motion.div>
                  <div>
                    <motion.div
                      className="text-white font-semibold"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.5, delay: 0.45 }}
                    >
                      {title} {highlight}
                    </motion.div>
                    <motion.div
                      className="text-xs text-[#666]"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      Metricon Labs
                    </motion.div>
                  </div>
                </div>

                {/* Mockup Content */}
                {mockupContent || (
                  <div className="space-y-4">
                    {/* Input Mockup */}
                    <motion.div
                      className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.04]"
                      initial={{ opacity: 0, y: 15 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-[#666]">Amount</span>
                        <span className="text-xs text-[#666]">Balance: 0.00 SOL</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.span
                          className="text-2xl font-medium text-[#333]"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          0.0
                        </motion.span>
                        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" alt="SOL" className="w-5 h-5 rounded-full" />
                          <span className="text-sm font-medium text-white">SOL</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Button Mockup */}
                    <motion.div
                      className="btn-primary w-full py-4 rounded-xl text-center font-semibold"
                      initial={{ opacity: 0, y: 15 }}
                      animate={isInView ? { opacity: 0.6, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={{ opacity: 1, scale: 1.02 }}
                    >
                      Connect Wallet
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: smoothEase }}
        style={{
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)",
          transformOrigin: imagePosition === "right" ? "left" : "right"
        }}
      />
    </section>
  );
}
