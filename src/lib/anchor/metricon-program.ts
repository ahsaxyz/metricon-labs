import { PublicKey } from "@solana/web3.js";
import idl from "@/idl/metricon_vault.json";

export const PROGRAM_ID = new PublicKey("8jqxR93uXC1np9CaoJXU64mGdM45ThhoWiqsjdJB7d7g");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const METRICON_IDL = idl as any;

// PDA Seeds
export const CONFIG_SEED = Buffer.from("config");
export const VAULT_SEED = Buffer.from("vault");
export const FEE_VAULT_SEED = Buffer.from("fee_vault");
export const TOKEN_VAULT_SEED = Buffer.from("token_vault");
export const WITHDRAW_REQUEST_SEED = Buffer.from("withdraw_request");
export const SWAP_REQUEST_SEED = Buffer.from("swap_request");

// PDA derivation helpers
export function getConfigPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([CONFIG_SEED], PROGRAM_ID);
  return pda;
}

export function getVaultPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([VAULT_SEED], PROGRAM_ID);
  return pda;
}

export function getFeeVaultPDA(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync([FEE_VAULT_SEED], PROGRAM_ID);
  return pda;
}

export function getTokenVaultPDA(mint: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [TOKEN_VAULT_SEED, mint.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getWithdrawRequestPDA(
  requester: PublicKey,
  nonce: { toArrayLike: (type: typeof Buffer, endian: "le", length: number) => Buffer }
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [WITHDRAW_REQUEST_SEED, requester.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );
  return pda;
}

export function getSwapRequestPDA(
  requester: PublicKey,
  nonce: { toArrayLike: (type: typeof Buffer, endian: "le", length: number) => Buffer }
): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [SWAP_REQUEST_SEED, requester.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );
  return pda;
}
