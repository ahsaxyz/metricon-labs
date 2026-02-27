"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/metricon-logo.png"
                alt="Metricon"
                className="h-8 w-auto"
              />
              <span className="font-semibold text-white">Metricon</span>
            </div>
            <p className="text-sm text-[#666] max-w-xs">
              Privacy infrastructure for Solana. Move assets without the noise.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-[#666] hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs#faq"
                  className="text-sm text-[#666] hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-4">
              Community
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://x.com/MetriconLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#666] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  X (Twitter)
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs#terms"
                  className="text-sm text-[#666] hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/docs#privacy"
                  className="text-sm text-[#666] hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/MetriconLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/[0.03] transition-colors text-[#404040] hover:text-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
          <span className="text-xs text-[#404040]">
            METRICON LABS 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
