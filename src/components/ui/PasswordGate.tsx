"use client";

import { useState, useEffect, ReactNode } from "react";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const CORRECT_PASSWORD = "metri";
const STORAGE_KEY = "metricon_access";

interface PasswordGateProps {
  children: ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show children if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show password gate
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF7A00]/[0.06] via-[#FF3D00]/[0.02] to-transparent blur-3xl" />
      </div>

      {/* Noise texture */}
      <div className="noise-texture" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="glass-card-static p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img
                src="/metricon-logo.png"
                alt="Metricon"
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 tracking-tight">
            <span className="text-gradient">Metricon</span>
            <span className="text-white"> Labs</span>
          </h1>

          {/* Under Construction Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs text-[#666]">[ PREVIEW ]</span>
              <span className="text-sm text-[#a0a0a0]">Under Construction</span>
            </div>
          </div>

          {/* Message */}
          <p className="text-center text-[#666] mb-8">
            We're building something special. Enter the password to access the preview.
          </p>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-5 h-5 text-[#404040]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                className="w-full pl-12 pr-12 py-4 bg-[#0a0a0a] border border-white/[0.06] rounded-xl text-white placeholder-[#404040] focus:border-[#FF7A00]/40 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/10 transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#404040] hover:text-[#666] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              Access Preview
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-white/[0.04] flex justify-center">
            <a
              href="https://x.com/MetriconLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-white/[0.03] transition-colors text-[#404040] hover:text-white"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
