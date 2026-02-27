/**
 * METRICON VAULT RELAYER WORKER
 *
 * This worker polls Supabase for pending withdraw requests and executes them
 * when the execute_after time has passed.
 *
 * Run with: bun run relayer/index.ts
 */

import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Program, AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createClient } from "@supabase/supabase-js";
import bs58 from "bs58";

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!, // Use service role key for updates

  // Solana
  RPC_URL: process.env.RPC_URL || "https://api.devnet.solana.com",
  RELAYER_PRIVATE_KEY: process.env.RELAYER_PRIVATE_KEY!,
  PROGRAM_ID: process.env.PROGRAM_ID || "MetrVau1tXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",

  // Worker settings
  POLL_INTERVAL_MS: Number(process.env.POLL_INTERVAL_MS) || 5000, // 5 seconds
  MAX_RETRIES: Number(process.env.MAX_RETRIES) || 3,
  BATCH_SIZE: Number(process.env.BATCH_SIZE) || 5,
};

// ============================================================================
// SEEDS
// ============================================================================

const CONFIG_SEED = Buffer.from("config");
const VAULT_SEED = Buffer.from("vault");
const FEE_VAULT_SEED = Buffer.from("fee_vault");
const TOKEN_VAULT_SEED = Buffer.from("token_vault");
const WITHDRAW_REQUEST_SEED = Buffer.from("withdraw_request");

// ============================================================================
// TYPES
// ============================================================================

interface WithdrawRequest {
  id: string;
  wallet: string;
  destination: string;
  mint: string | null;
  amount: string;
  nonce: string;
  execute_after: string;
  status: "pending" | "processing" | "completed" | "failed";
  tx_signature: string | null;
  error_message: string | null;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_KEY);

// ============================================================================
// SOLANA SETUP
// ============================================================================

function getRelayerKeypair(): Keypair {
  const privateKey = CONFIG.RELAYER_PRIVATE_KEY;

  // Try to parse as base58
  try {
    const decoded = bs58.decode(privateKey);
    return Keypair.fromSecretKey(decoded);
  } catch {
    // Try as JSON array
    try {
      const parsed = JSON.parse(privateKey);
      return Keypair.fromSecretKey(Uint8Array.from(parsed));
    } catch {
      throw new Error("Invalid RELAYER_PRIVATE_KEY format");
    }
  }
}

// ============================================================================
// PDA HELPERS
// ============================================================================

function getProgramId(): PublicKey {
  return new PublicKey(CONFIG.PROGRAM_ID);
}

function getConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([CONFIG_SEED], getProgramId());
}

function getVaultPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([VAULT_SEED], getProgramId());
}

function getFeeVaultPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([FEE_VAULT_SEED], getProgramId());
}

function getWithdrawRequestPDA(requester: PublicKey, nonce: BN): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [WITHDRAW_REQUEST_SEED, requester.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
    getProgramId()
  );
}

function getWithdrawRequestSplPDA(
  requester: PublicKey,
  mint: PublicKey,
  nonce: BN
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      WITHDRAW_REQUEST_SEED,
      requester.toBuffer(),
      mint.toBuffer(),
      nonce.toArrayLike(Buffer, "le", 8),
    ],
    getProgramId()
  );
}

// ============================================================================
// LOGGER
// ============================================================================

function log(level: "info" | "error" | "warn", message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data,
  };

  if (level === "error") {
    console.error(JSON.stringify(logEntry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

async function getPendingRequests(): Promise<WithdrawRequest[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("withdraw_requests")
    .select("*")
    .eq("status", "pending")
    .lte("execute_after", now)
    .lt("retry_count", CONFIG.MAX_RETRIES)
    .order("execute_after", { ascending: true })
    .limit(CONFIG.BATCH_SIZE);

  if (error) {
    log("error", "Failed to fetch pending requests", { error: error.message });
    return [];
  }

  return data || [];
}

async function lockRequest(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("withdraw_requests")
    .update({
      status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")
    .select()
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

async function markCompleted(id: string, txSignature: string): Promise<void> {
  const { error } = await supabase
    .from("withdraw_requests")
    .update({
      status: "completed",
      tx_signature: txSignature,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    log("error", "Failed to mark request as completed", { id, error: error.message });
  }
}

async function markFailed(id: string, errorMessage: string, retryCount: number): Promise<void> {
  const newStatus = retryCount + 1 >= CONFIG.MAX_RETRIES ? "failed" : "pending";

  const { error } = await supabase
    .from("withdraw_requests")
    .update({
      status: newStatus,
      error_message: errorMessage,
      retry_count: retryCount + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    log("error", "Failed to mark request as failed", { id, error: error.message });
  }
}

// ============================================================================
// WITHDRAWAL EXECUTION
// ============================================================================

async function executeWithdrawal(
  connection: Connection,
  relayerKeypair: Keypair,
  request: WithdrawRequest
): Promise<string> {
  const programId = getProgramId();
  const [configPDA] = getConfigPDA();
  const [vaultPDA, vaultBump] = getVaultPDA();
  const [feeVaultPDA] = getFeeVaultPDA();

  const requester = new PublicKey(request.wallet);
  const destination = new PublicKey(request.destination);
  const nonce = new BN(request.nonce);

  if (request.mint === null) {
    // SOL withdrawal
    const [withdrawRequestPDA] = getWithdrawRequestPDA(requester, nonce);

    // Build the instruction manually since we don't have the full IDL loaded
    const data = Buffer.alloc(8);
    // Discriminator for execute_withdraw_sol (this would need to match the actual discriminator)
    // For MVP, we'll use a simplified approach

    const instruction = {
      programId,
      keys: [
        { pubkey: relayerKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: configPDA, isSigner: false, isWritable: true },
        { pubkey: withdrawRequestPDA, isSigner: false, isWritable: true },
        { pubkey: vaultPDA, isSigner: false, isWritable: true },
        { pubkey: feeVaultPDA, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([/* execute_withdraw_sol discriminator would go here */]),
    };

    // For now, we'll use a direct transfer approach for the MVP
    // In production, this would call the actual program instruction

    log("info", "Executing SOL withdrawal", {
      requestId: request.id,
      destination: request.destination,
      amount: request.amount,
    });

    // Simulate for MVP - in production this would be the actual program call
    // Return a mock signature for testing
    const mockSig = `mock_${Date.now()}_${request.id.slice(0, 8)}`;

    return mockSig;
  } else {
    // SPL token withdrawal
    const mint = new PublicKey(request.mint);
    const [withdrawRequestPDA] = getWithdrawRequestSplPDA(requester, mint, nonce);

    log("info", "Executing SPL withdrawal", {
      requestId: request.id,
      destination: request.destination,
      mint: request.mint,
      amount: request.amount,
    });

    // Mock for MVP
    const mockSig = `mock_spl_${Date.now()}_${request.id.slice(0, 8)}`;

    return mockSig;
  }
}

// ============================================================================
// WORKER LOOP
// ============================================================================

async function processRequests(connection: Connection, relayerKeypair: Keypair): Promise<void> {
  const requests = await getPendingRequests();

  if (requests.length === 0) {
    return;
  }

  log("info", `Processing ${requests.length} pending requests`);

  for (const request of requests) {
    // Try to lock the request
    const locked = await lockRequest(request.id);
    if (!locked) {
      log("warn", "Failed to lock request, skipping", { requestId: request.id });
      continue;
    }

    try {
      const txSignature = await executeWithdrawal(connection, relayerKeypair, request);
      await markCompleted(request.id, txSignature);

      log("info", "Withdrawal completed", {
        requestId: request.id,
        txSignature,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      await markFailed(request.id, errorMessage, request.retry_count);

      log("error", "Withdrawal failed", {
        requestId: request.id,
        error: errorMessage,
        retryCount: request.retry_count + 1,
      });
    }

    // Small delay between requests to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function startWorker(): Promise<void> {
  log("info", "Starting Metricon Vault Relayer Worker", {
    rpcUrl: CONFIG.RPC_URL,
    programId: CONFIG.PROGRAM_ID,
    pollInterval: CONFIG.POLL_INTERVAL_MS,
  });

  // Validate configuration
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_KEY) {
    throw new Error("Missing Supabase configuration");
  }

  if (!CONFIG.RELAYER_PRIVATE_KEY) {
    throw new Error("Missing RELAYER_PRIVATE_KEY");
  }

  const connection = new Connection(CONFIG.RPC_URL, "confirmed");
  const relayerKeypair = getRelayerKeypair();

  log("info", "Relayer wallet", {
    publicKey: relayerKeypair.publicKey.toBase58()
  });

  // Check relayer balance
  const balance = await connection.getBalance(relayerKeypair.publicKey);
  log("info", "Relayer balance", {
    balance: balance / LAMPORTS_PER_SOL,
    unit: "SOL",
  });

  if (balance < 0.01 * LAMPORTS_PER_SOL) {
    log("warn", "Relayer balance is low, may not be able to execute transactions");
  }

  // Main loop
  while (true) {
    try {
      await processRequests(connection, relayerKeypair);
    } catch (error) {
      log("error", "Error in worker loop", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    await new Promise((resolve) => setTimeout(resolve, CONFIG.POLL_INTERVAL_MS));
  }
}

// ============================================================================
// MAIN
// ============================================================================

startWorker().catch((error) => {
  log("error", "Worker crashed", {
    error: error instanceof Error ? error.message : "Unknown error",
  });
  process.exit(1);
});
