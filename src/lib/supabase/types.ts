export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Bridge metadata for swap_requests
export interface BridgeMeta {
  destChain: string; // "ethereum" | "base" | "bsc"
  destAddress: string;
  provider: string; // "mayan"
  quoteId?: string;
}

export interface Database {
  public: {
    Tables: {
      deposits: {
        Row: {
          id: string;
          wallet: string;
          mint: string | null;
          amount: string;
          fee: string;
          tx_signature: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet: string;
          mint?: string | null;
          amount: string;
          fee: string;
          tx_signature: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          wallet?: string;
          mint?: string | null;
          amount?: string;
          fee?: string;
          tx_signature?: string;
          created_at?: string;
        };
      };
      withdraw_requests: {
        Row: {
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
        };
        Insert: {
          id?: string;
          wallet: string;
          destination: string;
          mint?: string | null;
          amount: string;
          nonce: string;
          execute_after: string;
          status?: "pending" | "processing" | "completed" | "failed";
          tx_signature?: string | null;
          error_message?: string | null;
          retry_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet?: string;
          destination?: string;
          mint?: string | null;
          amount?: string;
          nonce?: string;
          execute_after?: string;
          status?: "pending" | "processing" | "completed" | "failed";
          tx_signature?: string | null;
          error_message?: string | null;
          retry_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      swap_requests: {
        Row: {
          id: string;
          wallet: string;
          nonce: string;
          input_mint: string | null; // null = SOL
          output_mint: string;
          amount: string;
          fee: string | null;
          destination: string | null;
          slippage_bps: number;
          status: "pending" | "processing" | "completed" | "failed";
          input_amount: string | null;
          output_amount: string | null;
          tx_signature: string | null;
          error_message: string | null;
          created_at: string;
          executed_at: string | null;
          bridge_meta: BridgeMeta | null;
        };
        Insert: {
          id?: string;
          wallet: string;
          nonce: string;
          input_mint?: string | null;
          output_mint: string;
          amount: string;
          fee?: string | null;
          destination?: string | null;
          slippage_bps?: number;
          status?: "pending" | "processing" | "completed" | "failed";
          input_amount?: string | null;
          output_amount?: string | null;
          tx_signature?: string | null;
          error_message?: string | null;
          created_at?: string;
          executed_at?: string | null;
          bridge_meta?: BridgeMeta | null;
        };
        Update: {
          id?: string;
          wallet?: string;
          nonce?: string;
          input_mint?: string | null;
          output_mint?: string;
          amount?: string;
          fee?: string | null;
          destination?: string | null;
          slippage_bps?: number;
          status?: "pending" | "processing" | "completed" | "failed";
          input_amount?: string | null;
          output_amount?: string | null;
          tx_signature?: string | null;
          error_message?: string | null;
          created_at?: string;
          executed_at?: string | null;
          bridge_meta?: BridgeMeta | null;
        };
      };
      activity: {
        Row: {
          id: string;
          wallet: string;
          type: "deposit" | "withdraw" | "swap" | "bridge";
          amount: string;
          mint: string | null;
          status: "pending" | "completed" | "failed";
          tx_signature: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet: string;
          type: "deposit" | "withdraw" | "swap" | "bridge";
          amount: string;
          mint?: string | null;
          status?: "pending" | "completed" | "failed";
          tx_signature?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          wallet?: string;
          type?: "deposit" | "withdraw" | "swap" | "bridge";
          amount?: string;
          mint?: string | null;
          status?: "pending" | "completed" | "failed";
          tx_signature?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      withdraw_status: "pending" | "processing" | "completed" | "failed";
      activity_type: "deposit" | "withdraw" | "swap" | "bridge";
    };
  };
}

// Helper types
export type Deposit = Database["public"]["Tables"]["deposits"]["Row"];
export type DepositInsert = Database["public"]["Tables"]["deposits"]["Insert"];
export type WithdrawRequest = Database["public"]["Tables"]["withdraw_requests"]["Row"];
export type WithdrawRequestInsert = Database["public"]["Tables"]["withdraw_requests"]["Insert"];
export type SwapRequest = Database["public"]["Tables"]["swap_requests"]["Row"];
export type SwapRequestInsert = Database["public"]["Tables"]["swap_requests"]["Insert"];
export type Activity = Database["public"]["Tables"]["activity"]["Row"];
export type ActivityInsert = Database["public"]["Tables"]["activity"]["Insert"];
