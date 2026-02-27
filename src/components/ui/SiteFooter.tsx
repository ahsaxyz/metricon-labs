"use client";

import Link from "next/link";

const footerLinks = {
  solutions: {
    title: "Solutions",
    links: [
      { name: "Stealth", href: "/stealth" },
      { name: "Reveal", href: "/reveal" },
      { name: "Swap", href: "/swap" },
      { name: "Bridge", href: "/bridge" },
      { name: "Portfolio", href: "/portfolio" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "FAQ", href: "/docs#faq" },
      { name: "Technical", href: "/docs#technical" },
      { name: "Fees", href: "/docs#fees" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About", href: "/docs#what-is-metricon" },
      { name: "Privacy Policy", href: "/docs#privacy" },
      { name: "Terms of Use", href: "/docs#terms" },
    ],
  },
};

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#030303]">
      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00]/5 via-[#FF3D00]/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to go <span className="text-gradient">private</span>?
            </h2>
            <p className="text-[#666] text-lg mb-8">
              Experience true financial privacy on Solana. Start using Metricon Labs today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/stealth"
                className="btn-primary px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
              >
                Launch App
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/docs"
                className="btn-secondary px-6 py-3 rounded-lg font-medium"
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <img
                  src="/metricon-logo.png"
                  alt="Metricon Labs"
                  className="h-8 w-auto"
                />
                <span className="font-semibold text-white">Metricon</span>
              </Link>
              <p className="text-sm text-[#666] max-w-xs mb-6">
                Privacy infrastructure for Solana. Move assets without the noise.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://x.com/MetriconLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#666] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-4">
                {footerLinks.solutions.title}
              </h4>
              <ul className="space-y-3">
                {footerLinks.solutions.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#666] hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-4">
                {footerLinks.resources.title}
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#666] hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-medium text-[#404040] uppercase tracking-wider mb-4">
                {footerLinks.company.title}
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#666] hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#404040]">
            © 2026 Metricon Labs — Privacy Infrastructure for Solana
          </span>
          <div className="flex items-center gap-6">
            <Link href="/docs#privacy" className="text-xs text-[#404040] hover:text-[#666] transition-colors">
              Privacy
            </Link>
            <Link href="/docs#terms" className="text-xs text-[#404040] hover:text-[#666] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
