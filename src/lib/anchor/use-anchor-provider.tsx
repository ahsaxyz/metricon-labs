"use client";

import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { METRICON_IDL } from "./metricon-program";

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, { commitment: "confirmed" });
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    // Use 2-arg Program constructor for Anchor 0.32+ with spec IDL (IDL contains address)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Program(METRICON_IDL as any, provider);
  }, [provider]);

  return { provider, program, wallet };
}
