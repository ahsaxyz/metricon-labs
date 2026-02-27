-- ============================================================================
-- METRICON VAULT - SUPABASE SCHEMA
-- Run this in Supabase SQL Editor to set up the database
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE withdraw_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE activity_type AS ENUM ('deposit', 'withdraw', 'swap', 'bridge');
CREATE TYPE activity_status AS ENUM ('pending', 'completed', 'failed');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Withdraw requests table
CREATE TABLE IF NOT EXISTS withdraw_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT NOT NULL,
    destination TEXT NOT NULL,
    mint TEXT, -- NULL for SOL
    amount TEXT NOT NULL, -- Store as string to avoid precision issues
    nonce TEXT NOT NULL,
    execute_after TIMESTAMPTZ NOT NULL,
    status withdraw_status NOT NULL DEFAULT 'pending',
    tx_signature TEXT,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate requests with same nonce
    UNIQUE(wallet, nonce, mint)
);

-- Deposits table (for tracking/display purposes)
CREATE TABLE IF NOT EXISTS deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT NOT NULL,
    mint TEXT, -- NULL for SOL
    amount TEXT NOT NULL,
    fee TEXT NOT NULL,
    tx_signature TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Swap requests table (also used for bridges with bridge_meta)
CREATE TABLE IF NOT EXISTS swap_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT NOT NULL,
    from_mint TEXT, -- NULL for SOL
    to_mint TEXT NOT NULL,
    from_amount TEXT NOT NULL,
    to_amount TEXT, -- Estimated, filled after swap
    slippage_bps INTEGER NOT NULL DEFAULT 50,
    status withdraw_status NOT NULL DEFAULT 'pending',
    tx_signature TEXT,
    error_message TEXT,
    bridge_meta JSONB, -- If not null, this is a bridge request
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT NOT NULL,
    type activity_type NOT NULL,
    amount TEXT NOT NULL,
    mint TEXT, -- NULL for SOL
    status activity_status NOT NULL DEFAULT 'pending',
    tx_signature TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for fetching pending requests
CREATE INDEX IF NOT EXISTS idx_withdraw_requests_pending
ON withdraw_requests(status, execute_after)
WHERE status = 'pending';

-- Index for wallet lookups
CREATE INDEX IF NOT EXISTS idx_withdraw_requests_wallet
ON withdraw_requests(wallet);

CREATE INDEX IF NOT EXISTS idx_deposits_wallet
ON deposits(wallet);

CREATE INDEX IF NOT EXISTS idx_swap_requests_wallet
ON swap_requests(wallet);

CREATE INDEX IF NOT EXISTS idx_activity_wallet
ON activity(wallet);

CREATE INDEX IF NOT EXISTS idx_activity_created_at
ON activity(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE withdraw_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own withdraw requests
CREATE POLICY "Users can read own withdraw requests"
ON withdraw_requests
FOR SELECT
USING (true); -- Allow read for now, can restrict later

-- Policy: Users can insert their own withdraw requests
CREATE POLICY "Users can insert own withdraw requests"
ON withdraw_requests
FOR INSERT
WITH CHECK (true); -- Wallet verification happens in app

-- Policy: Only service role can update withdraw requests
CREATE POLICY "Service role can update withdraw requests"
ON withdraw_requests
FOR UPDATE
USING (auth.role() = 'service_role');

-- Policy: Users can read their own deposits
CREATE POLICY "Users can read deposits"
ON deposits
FOR SELECT
USING (true);

-- Policy: Users can insert deposits
CREATE POLICY "Users can insert deposits"
ON deposits
FOR INSERT
WITH CHECK (true);

-- Policy: Users can read swap requests
CREATE POLICY "Users can read swap requests"
ON swap_requests
FOR SELECT
USING (true);

-- Policy: Users can insert swap requests
CREATE POLICY "Users can insert swap requests"
ON swap_requests
FOR INSERT
WITH CHECK (true);

-- Policy: Allow update swap requests
CREATE POLICY "Allow update swap requests"
ON swap_requests
FOR UPDATE
USING (true);

-- Policy: Users can read activity
CREATE POLICY "Users can read activity"
ON activity
FOR SELECT
USING (true);

-- Policy: Users can insert activity
CREATE POLICY "Users can insert activity"
ON activity
FOR INSERT
WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_withdraw_requests_updated_at
    BEFORE UPDATE ON withdraw_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_swap_requests_updated_at
    BEFORE UPDATE ON swap_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS (optional, for admin dashboard)
-- ============================================================================

-- View for request statistics
CREATE OR REPLACE VIEW withdraw_request_stats AS
SELECT
    status,
    COUNT(*) as count,
    SUM(CAST(amount AS NUMERIC)) as total_amount
FROM withdraw_requests
GROUP BY status;

-- View for daily deposits
CREATE OR REPLACE VIEW daily_deposits AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as count,
    SUM(CAST(amount AS NUMERIC)) as total_amount,
    SUM(CAST(fee AS NUMERIC)) as total_fees
FROM deposits
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View for swap statistics
CREATE OR REPLACE VIEW swap_stats AS
SELECT
    status,
    COUNT(*) as count,
    SUM(CAST(from_amount AS NUMERIC)) as total_from_amount,
    COUNT(*) FILTER (WHERE bridge_meta IS NOT NULL) as bridge_count
FROM swap_requests
GROUP BY status;

-- View for activity summary
CREATE OR REPLACE VIEW activity_summary AS
SELECT
    type,
    status,
    COUNT(*) as count,
    SUM(CAST(amount AS NUMERIC)) as total_amount
FROM activity
GROUP BY type, status
ORDER BY type, status;
