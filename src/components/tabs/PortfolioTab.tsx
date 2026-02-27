"use client";

import { useState } from "react";
import {
  Share2,
  Wallet,
  Eye,
  Copy,
  Check,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useVault } from "@/hooks/useVault";
import { toast } from "sonner";

interface PortfolioTabProps {
  onNavigateToStealth: () => void;
}

export default function PortfolioTab({
  onNavigateToStealth,
}: PortfolioTabProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"deposits" | "withdrawals">("deposits");

  const { connected, walletAddress } = useWalletConnection();
  const { setVisible } = useWalletModal();
  const { stats, fetchStats, isLoading, getTimeRemaining } = useVault();

  const referralLink = walletAddress
    ? `https://metricon.app/?ref=${walletAddress}`
    : "https://metricon.app/?ref=...";

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!", {
      description: "Share with friends to earn rewards",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    setVisible(true);
  };

  const handleRefresh = () => {
    fetchStats();
    toast.info("Refreshing portfolio...");
  };

  const totalDeposited = stats?.userDeposits.reduce(
    (sum, d) => sum + Number(d.amount) / 1e9,
    0
  ) || 0;

  const totalFees = stats?.userDeposits.reduce(
    (sum, d) => sum + Number(d.fee) / 1e9,
    0
  ) || 0;

  const pendingWithdrawals = stats?.pendingWithdrawals.reduce(
    (sum, w) => sum + Number(w.amount) / 1e9,
    0
  ) || 0;

  const completedWithdrawals = stats?.completedWithdrawals.reduce(
    (sum, w) => sum + Number(w.amount) / 1e9,
    0
  ) || 0;

  const currentBalance = totalDeposited - pendingWithdrawals - completedWithdrawals;

  return (
    <div className="space-y-4">
      {/* Referral Section */}
      <div className="glass-card-static p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center">
            <Share2 className="w-5 h-5 text-[#FF7A00]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Referral</h2>
            <p className="text-sm text-[#666]">Earn 10% of referred users' fees</p>
          </div>
        </div>

        <div className="input-field flex items-center gap-2 p-3">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-transparent outline-none text-sm text-[#666] truncate"
          />
          <button
            type="button"
            onClick={handleCopyReferral}
            className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors shrink-0"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-[#666]" />
            )}
          </button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="glass-card-static p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF3D00]/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#FF7A00]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Private Portfolio</h2>
              <p className="text-sm text-[#666]">Your stealth balances</p>
            </div>
          </div>
          {connected && (
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-[#666] ${isLoading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>

        {connected ? (
          <>
            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl bg-[#FF7A00]/5 border border-[#FF7A00]/10">
                <p className="text-xs text-[#666] mb-1">Vault Balance</p>
                <p className="text-xl font-bold text-white">
                  {currentBalance.toFixed(4)} <span className="text-sm text-[#666]">SOL</span>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-xs text-[#666] mb-1">Pending</p>
                <p className="text-xl font-bold text-white">
                  {pendingWithdrawals.toFixed(4)} <span className="text-sm text-[#666]">SOL</span>
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-between text-sm px-1 mb-6">
              <div>
                <span className="text-[#666]">Total Deposited:</span>
                <span className="text-white ml-2">{totalDeposited.toFixed(4)} SOL</span>
              </div>
              <div>
                <span className="text-[#666]">Fees Paid:</span>
                <span className="text-[#FF7A00] ml-2">{totalFees.toFixed(6)} SOL</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/[0.04] pb-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveTab("deposits")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "deposits"
                    ? "text-white bg-[#FF7A00]/10"
                    : "text-[#666] hover:text-white"
                }`}
              >
                Deposits ({stats?.userDeposits.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("withdrawals")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === "withdrawals"
                    ? "text-white bg-[#FF7A00]/10"
                    : "text-[#666] hover:text-white"
                }`}
              >
                Withdrawals ({(stats?.pendingWithdrawals.length || 0) + (stats?.completedWithdrawals.length || 0)})
              </button>
            </div>

            {/* Transaction List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeTab === "deposits" ? (
                stats?.userDeposits.length ? (
                  stats.userDeposits.map((deposit) => (
                    <DepositCard key={deposit.id} deposit={deposit} />
                  ))
                ) : (
                  <EmptyState
                    message="No deposits yet"
                    action={onNavigateToStealth}
                    actionLabel="Make your first deposit"
                  />
                )
              ) : (
                [...(stats?.pendingWithdrawals || []), ...(stats?.completedWithdrawals || [])].length ? (
                  [...(stats?.pendingWithdrawals || []), ...(stats?.completedWithdrawals || [])].map((withdrawal) => (
                    <WithdrawalCard
                      key={withdrawal.id}
                      withdrawal={withdrawal}
                      getTimeRemaining={getTimeRemaining}
                    />
                  ))
                ) : (
                  <EmptyState message="No withdrawals yet" />
                )
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#666] mb-6">Connect your wallet to view your private portfolio</p>
            <button
              type="button"
              onClick={handleConnect}
              className="btn-primary px-6 py-3 rounded-xl font-semibold"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DepositCard({ deposit }: { deposit: { id: string; amount: string; fee: string; tx_signature: string; created_at: string } }) {
  const amount = Number(deposit.amount) / 1e9;
  const date = new Date(deposit.created_at).toLocaleDateString();

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-green-500/10">
          <ArrowDownLeft className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <p className="text-white font-medium">{amount.toFixed(4)} SOL</p>
          <p className="text-xs text-[#666]">{date}</p>
        </div>
      </div>
      <a
        href={`https://explorer.solana.com/tx/${deposit.tx_signature}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
      >
        <ExternalLink className="w-4 h-4 text-[#666]" />
      </a>
    </div>
  );
}

function WithdrawalCard({
  withdrawal,
  getTimeRemaining
}: {
  withdrawal: { id: string; amount: string; status: string; tx_signature: string | null; execute_after: string; created_at: string };
  getTimeRemaining: (date: string) => string;
}) {
  const amount = Number(withdrawal.amount) / 1e9;
  const date = new Date(withdrawal.created_at).toLocaleDateString();
  const isPending = withdrawal.status === "pending" || withdrawal.status === "processing";

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${
      isPending
        ? "bg-yellow-500/5 border border-yellow-500/10"
        : withdrawal.status === "completed"
        ? "bg-[#FF7A00]/5 border border-[#FF7A00]/10"
        : "bg-red-500/5 border border-red-500/10"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          isPending ? "bg-yellow-500/10" : withdrawal.status === "completed" ? "bg-[#FF7A00]/10" : "bg-red-500/10"
        }`}>
          {isPending ? (
            <Clock className="w-4 h-4 text-yellow-400" />
          ) : (
            <ArrowUpRight className={`w-4 h-4 ${withdrawal.status === "completed" ? "text-[#FF7A00]" : "text-red-400"}`} />
          )}
        </div>
        <div>
          <p className="text-white font-medium">{amount.toFixed(4)} SOL</p>
          <p className="text-xs text-[#666]">
            {isPending ? getTimeRemaining(withdrawal.execute_after) : date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
          isPending
            ? "bg-yellow-500/10 text-yellow-400"
            : withdrawal.status === "completed"
            ? "bg-[#FF7A00]/10 text-[#FF7A00]"
            : "bg-red-500/10 text-red-400"
        }`}>
          {withdrawal.status}
        </span>
        {withdrawal.tx_signature && (
          <a
            href={`https://explorer.solana.com/tx/${withdrawal.tx_signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#666]" />
          </a>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message, action, actionLabel }: { message: string; action?: () => void; actionLabel?: string }) {
  return (
    <div className="text-center py-6">
      <p className="text-[#666] mb-4">{message}</p>
      {action && actionLabel && (
        <button
          type="button"
          onClick={action}
          className="btn-primary px-4 py-2 rounded-lg font-medium text-sm inline-flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
