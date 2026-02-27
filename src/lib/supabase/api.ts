import { getSupabase } from "./client";
import type { WithdrawRequest, Deposit, SwapRequest, BridgeMeta } from "./types";

// Withdraw delay in minutes (configurable via env)
const WITHDRAW_DELAY_MINUTES = Number(process.env.NEXT_PUBLIC_WITHDRAW_DELAY_MINUTES) || 5;

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}

// ============================================================================
// DEPOSITS
// ============================================================================

/**
 * Record a deposit
 */
export async function recordDeposit(params: {
  wallet: string;
  mint: string | null;
  amount: string;
  fee: string;
  tx_signature: string;
}): Promise<Deposit | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Supabase not configured - deposit not recorded");
    return null;
  }

  const { data, error } = await supabase
    .from("deposits")
    .insert({
      wallet: params.wallet,
      mint: params.mint,
      amount: params.amount,
      fee: params.fee,
      tx_signature: params.tx_signature,
    })
    .select()
    .single();

  if (error) {
    console.error("Error recording deposit:", error);
    throw new Error(error.message);
  }

  return data as Deposit;
}

/**
 * Get deposits for a wallet
 */
export async function getDeposits(wallet: string): Promise<Deposit[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("deposits")
    .select("*")
    .eq("wallet", wallet)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching deposits:", error);
    return [];
  }

  return (data || []) as Deposit[];
}

// ============================================================================
// WITHDRAW REQUESTS
// ============================================================================

/**
 * Create a new withdraw request
 */
export async function createWithdrawRequest(params: {
  wallet: string;
  destination: string;
  mint: string | null;
  amount: string;
  nonce: string;
}): Promise<WithdrawRequest | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Supabase not configured - withdraw request not created");
    return null;
  }

  const executeAfter = new Date(
    Date.now() + WITHDRAW_DELAY_MINUTES * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("withdraw_requests")
    .insert({
      wallet: params.wallet,
      destination: params.destination,
      mint: params.mint,
      amount: params.amount,
      nonce: params.nonce,
      execute_after: executeAfter,
      status: "pending" as const,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating withdraw request:", error);
    throw new Error(error.message);
  }

  return data as WithdrawRequest;
}

/**
 * Get withdraw requests for a wallet
 */
export async function getWithdrawRequests(
  wallet: string
): Promise<WithdrawRequest[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("withdraw_requests")
    .select("*")
    .eq("wallet", wallet)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching withdraw requests:", error);
    return [];
  }

  return (data || []) as WithdrawRequest[];
}

// ============================================================================
// SWAP REQUESTS
// ============================================================================

/**
 * Create a swap request
 */
export async function createSwapRequest(params: {
  wallet: string;
  fromMint: string | null;
  toMint: string;
  fromAmount: string;
  toAmount?: string;
  slippageBps?: number;
  destination?: string;
  fee?: string;
  nonce?: string; // Nonce from on-chain instruction - required for relayer to match PDA
}): Promise<SwapRequest | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Supabase not configured - swap request not created");
    return null;
  }

  // Use provided nonce or generate one (provided nonce is required for on-chain matching)
  const nonce = params.nonce || Date.now().toString() + Math.random().toString(36).substring(2);
  // Calculate fee (0.3% = 30 bps)
  const feeAmount = params.fee || Math.floor(Number(params.fromAmount) * 0.003).toString();

  const { data, error } = await supabase
    .from("swap_requests")
    .insert({
      wallet: params.wallet,
      nonce,
      input_mint: params.fromMint,
      output_mint: params.toMint,
      amount: params.fromAmount,
      fee: feeAmount,
      output_amount: params.toAmount || null,
      slippage_bps: params.slippageBps || 50,
      destination: params.destination || params.wallet,
      status: "pending" as const,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating swap request:", error);
    throw new Error(error.message);
  }

  return data as SwapRequest;
}

/**
 * Update swap request with result
 */
export async function updateSwapRequest(
  id: string,
  update: {
    status?: "pending" | "processing" | "completed" | "failed";
    tx_signature?: string;
    output_amount?: string;
    error_message?: string;
  }
): Promise<SwapRequest | null> {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("swap_requests")
    .update({
      ...update,
      executed_at: update.status === "completed" || update.status === "failed"
        ? new Date().toISOString()
        : undefined,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating swap request:", error);
    throw new Error(error.message);
  }

  return data as SwapRequest;
}

/**
 * Get swap requests for a wallet
 */
export async function getSwapRequests(wallet: string): Promise<SwapRequest[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("swap_requests")
    .select("*")
    .eq("wallet", wallet)
    .is("bridge_meta", null) // Only swaps, not bridges
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching swap requests:", error);
    return [];
  }

  return (data || []) as SwapRequest[];
}

// ============================================================================
// BRIDGE REQUESTS (stored in swap_requests with bridge_meta)
// ============================================================================

/**
 * Create a bridge request
 */
export async function createBridgeRequest(params: {
  wallet: string;
  fromMint: string | null;
  fromAmount: string;
  destChain: string;
  destAddress: string;
  quoteId?: string;
  fee?: string;
}): Promise<SwapRequest | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Supabase not configured - bridge request not created");
    return null;
  }

  const bridgeMeta: BridgeMeta = {
    destChain: params.destChain,
    destAddress: params.destAddress,
    provider: "mayan",
    quoteId: params.quoteId,
  };

  const nonce = Date.now().toString() + Math.random().toString(36).substring(2);
  // Calculate fee (0.3% = 30 bps)
  const feeAmount = params.fee || Math.floor(Number(params.fromAmount) * 0.003).toString();

  const { data, error } = await supabase
    .from("swap_requests")
    .insert({
      wallet: params.wallet,
      nonce,
      input_mint: params.fromMint,
      output_mint: `bridge:${params.destChain}`,
      amount: params.fromAmount,
      fee: feeAmount,
      destination: params.destAddress,
      status: "pending" as const,
      bridge_meta: bridgeMeta,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating bridge request:", error);
    throw new Error(error.message);
  }

  return data as SwapRequest;
}

/**
 * Get bridge requests for a wallet
 */
export async function getBridgeRequests(wallet: string): Promise<SwapRequest[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("swap_requests")
    .select("*")
    .eq("wallet", wallet)
    .not("bridge_meta", "is", null) // Only bridges
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bridge requests:", error);
    return [];
  }

  return (data || []) as SwapRequest[];
}

// ============================================================================
// STATS
// ============================================================================

/**
 * Get user stats (total deposited, pending withdrawals, etc.)
 */
export async function getUserStats(wallet: string): Promise<{
  totalDeposited: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  swapCount: number;
  bridgeCount: number;
}> {
  const [deposits, withdrawRequests, swapRequests, bridgeRequests] = await Promise.all([
    getDeposits(wallet),
    getWithdrawRequests(wallet),
    getSwapRequests(wallet),
    getBridgeRequests(wallet),
  ]);

  const totalDeposited = deposits.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );

  const pendingWithdrawals = withdrawRequests
    .filter((w) => w.status === "pending" || w.status === "processing")
    .reduce((sum, w) => sum + Number(w.amount), 0);

  const completedWithdrawals = withdrawRequests
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + Number(w.amount), 0);

  return {
    totalDeposited,
    pendingWithdrawals,
    completedWithdrawals,
    swapCount: swapRequests.length,
    bridgeCount: bridgeRequests.length,
  };
}
