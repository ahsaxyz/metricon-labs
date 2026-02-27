use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("MetrVau1tXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

pub const FEE_BASIS_POINTS: u16 = 30; // 0.3% fee
pub const VAULT_SEED: &[u8] = b"vault";
pub const FEE_VAULT_SEED: &[u8] = b"fee_vault";
pub const TOKEN_VAULT_SEED: &[u8] = b"token_vault";
pub const WITHDRAW_REQUEST_SEED: &[u8] = b"withdraw_request";
pub const CONFIG_SEED: &[u8] = b"config";

#[program]
pub mod metricon_vault {
    use super::*;

    /// Initialize the vault configuration
    pub fn initialize(ctx: Context<Initialize>, relayer: Pubkey, fee_bps: u16) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.relayer = relayer;
        config.fee_bps = fee_bps;
        config.total_deposits = 0;
        config.total_withdrawals = 0;
        config.bump = ctx.bumps.config;

        msg!("Vault initialized with relayer: {}", relayer);
        Ok(())
    }

    /// Deposit SOL into the vault
    pub fn deposit_sol(ctx: Context<DepositSol>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::InvalidAmount);

        let config = &mut ctx.accounts.config;

        // Calculate fee
        let fee = (amount as u128 * config.fee_bps as u128 / 10000) as u64;
        let deposit_amount = amount - fee;

        // Transfer SOL to vault
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.depositor.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, deposit_amount)?;

        // Transfer fee to fee vault
        if fee > 0 {
            let fee_cpi_context = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.depositor.to_account_info(),
                    to: ctx.accounts.fee_vault.to_account_info(),
                },
            );
            anchor_lang::system_program::transfer(fee_cpi_context, fee)?;
        }

        // Update stats
        config.total_deposits += deposit_amount;

        // Emit event
        emit!(DepositEvent {
            depositor: ctx.accounts.depositor.key(),
            amount: deposit_amount,
            fee,
            mint: None,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Deposited {} lamports (fee: {})", deposit_amount, fee);
        Ok(())
    }

    /// Deposit SPL tokens into the vault
    pub fn deposit_spl(ctx: Context<DepositSpl>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::InvalidAmount);

        let config = &mut ctx.accounts.config;

        // Calculate fee
        let fee = (amount as u128 * config.fee_bps as u128 / 10000) as u64;
        let deposit_amount = amount - fee;

        // Transfer tokens to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.depositor_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.depositor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
        token::transfer(cpi_ctx, deposit_amount)?;

        // Transfer fee to fee vault
        if fee > 0 {
            let fee_cpi_accounts = Transfer {
                from: ctx.accounts.depositor_token_account.to_account_info(),
                to: ctx.accounts.fee_token_account.to_account_info(),
                authority: ctx.accounts.depositor.to_account_info(),
            };
            let fee_cpi_ctx = CpiContext::new(cpi_program, fee_cpi_accounts);
            token::transfer(fee_cpi_ctx, fee)?;
        }

        // Emit event
        emit!(DepositEvent {
            depositor: ctx.accounts.depositor.key(),
            amount: deposit_amount,
            fee,
            mint: Some(ctx.accounts.mint.key()),
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Deposited {} tokens (fee: {})", deposit_amount, fee);
        Ok(())
    }

    /// Create a withdraw request (user signs, relayer executes later)
    pub fn request_withdraw(
        ctx: Context<RequestWithdraw>,
        amount: u64,
        nonce: u64,
        destination: Pubkey,
    ) -> Result<()> {
        require!(amount > 0, VaultError::InvalidAmount);

        let request = &mut ctx.accounts.withdraw_request;

        // Check this nonce hasn't been used
        require!(!request.executed, VaultError::AlreadyExecuted);

        request.requester = ctx.accounts.requester.key();
        request.destination = destination;
        request.amount = amount;
        request.nonce = nonce;
        request.mint = None; // SOL
        request.created_at = Clock::get()?.unix_timestamp;
        request.executed = false;
        request.bump = ctx.bumps.withdraw_request;

        emit!(WithdrawRequestEvent {
            requester: ctx.accounts.requester.key(),
            destination,
            amount,
            nonce,
            mint: None,
            timestamp: request.created_at,
        });

        msg!("Withdraw request created for {} lamports", amount);
        Ok(())
    }

    /// Create a withdraw request for SPL tokens
    pub fn request_withdraw_spl(
        ctx: Context<RequestWithdrawSpl>,
        amount: u64,
        nonce: u64,
        destination: Pubkey,
    ) -> Result<()> {
        require!(amount > 0, VaultError::InvalidAmount);

        let request = &mut ctx.accounts.withdraw_request;

        // Check this nonce hasn't been used
        require!(!request.executed, VaultError::AlreadyExecuted);

        request.requester = ctx.accounts.requester.key();
        request.destination = destination;
        request.amount = amount;
        request.nonce = nonce;
        request.mint = Some(ctx.accounts.mint.key());
        request.created_at = Clock::get()?.unix_timestamp;
        request.executed = false;
        request.bump = ctx.bumps.withdraw_request;

        emit!(WithdrawRequestEvent {
            requester: ctx.accounts.requester.key(),
            destination,
            amount,
            nonce,
            mint: Some(ctx.accounts.mint.key()),
            timestamp: request.created_at,
        });

        msg!("Withdraw request created for {} tokens", amount);
        Ok(())
    }

    /// Execute a withdraw request (relayer only)
    pub fn execute_withdraw_sol(ctx: Context<ExecuteWithdrawSol>) -> Result<()> {
        let request = &mut ctx.accounts.withdraw_request;
        let config = &mut ctx.accounts.config;

        // Verify not already executed
        require!(!request.executed, VaultError::AlreadyExecuted);

        // Verify caller is relayer
        require!(
            ctx.accounts.relayer.key() == config.relayer,
            VaultError::UnauthorizedRelayer
        );

        // Calculate fee on withdrawal
        let fee = (request.amount as u128 * config.fee_bps as u128 / 10000) as u64;
        let withdraw_amount = request.amount - fee;

        // Transfer SOL from vault to destination
        let vault_bump = ctx.bumps.vault;
        let seeds = &[VAULT_SEED, &[vault_bump]];
        let signer = &[&seeds[..]];

        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= withdraw_amount;
        **ctx.accounts.destination.to_account_info().try_borrow_mut_lamports()? += withdraw_amount;

        // Transfer fee to fee vault
        if fee > 0 {
            **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= fee;
            **ctx.accounts.fee_vault.to_account_info().try_borrow_mut_lamports()? += fee;
        }

        // Mark as executed
        request.executed = true;
        request.executed_at = Some(Clock::get()?.unix_timestamp);

        // Update stats
        config.total_withdrawals += withdraw_amount;

        emit!(WithdrawExecutedEvent {
            requester: request.requester,
            destination: request.destination,
            amount: withdraw_amount,
            fee,
            nonce: request.nonce,
            mint: None,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Executed withdraw of {} lamports to {}", withdraw_amount, request.destination);
        Ok(())
    }

    /// Execute a withdraw request for SPL tokens (relayer only)
    pub fn execute_withdraw_spl(ctx: Context<ExecuteWithdrawSpl>) -> Result<()> {
        let request = &mut ctx.accounts.withdraw_request;
        let config = &mut ctx.accounts.config;

        // Verify not already executed
        require!(!request.executed, VaultError::AlreadyExecuted);

        // Verify caller is relayer
        require!(
            ctx.accounts.relayer.key() == config.relayer,
            VaultError::UnauthorizedRelayer
        );

        // Verify mint matches
        require!(
            request.mint == Some(ctx.accounts.mint.key()),
            VaultError::MintMismatch
        );

        // Calculate fee on withdrawal
        let fee = (request.amount as u128 * config.fee_bps as u128 / 10000) as u64;
        let withdraw_amount = request.amount - fee;

        // Transfer tokens from vault to destination
        let mint_key = ctx.accounts.mint.key();
        let seeds = &[
            TOKEN_VAULT_SEED,
            mint_key.as_ref(),
            &[ctx.bumps.vault_token_account],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.destination_token_account.to_account_info(),
            authority: ctx.accounts.vault_token_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts, signer);
        token::transfer(cpi_ctx, withdraw_amount)?;

        // Transfer fee to fee vault
        if fee > 0 {
            let fee_cpi_accounts = Transfer {
                from: ctx.accounts.vault_token_account.to_account_info(),
                to: ctx.accounts.fee_token_account.to_account_info(),
                authority: ctx.accounts.vault_token_account.to_account_info(),
            };
            let fee_cpi_ctx = CpiContext::new_with_signer(cpi_program, fee_cpi_accounts, signer);
            token::transfer(fee_cpi_ctx, fee)?;
        }

        // Mark as executed
        request.executed = true;
        request.executed_at = Some(Clock::get()?.unix_timestamp);

        emit!(WithdrawExecutedEvent {
            requester: request.requester,
            destination: request.destination,
            amount: withdraw_amount,
            fee,
            nonce: request.nonce,
            mint: Some(ctx.accounts.mint.key()),
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Executed withdraw of {} tokens to {}", withdraw_amount, request.destination);
        Ok(())
    }

    /// Update relayer address (authority only)
    pub fn update_relayer(ctx: Context<UpdateConfig>, new_relayer: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.relayer = new_relayer;
        msg!("Relayer updated to: {}", new_relayer);
        Ok(())
    }

    /// Update fee basis points (authority only)
    pub fn update_fee(ctx: Context<UpdateConfig>, new_fee_bps: u16) -> Result<()> {
        require!(new_fee_bps <= 1000, VaultError::FeeTooHigh); // Max 10%
        let config = &mut ctx.accounts.config;
        config.fee_bps = new_fee_bps;
        msg!("Fee updated to: {} bps", new_fee_bps);
        Ok(())
    }
}

// ============================================================================
// ACCOUNTS
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Config::INIT_SPACE,
        seeds = [CONFIG_SEED],
        bump
    )]
    pub config: Account<'info, Config>,

    /// CHECK: PDA for SOL vault
    #[account(
        seeds = [VAULT_SEED],
        bump
    )]
    pub vault: AccountInfo<'info>,

    /// CHECK: PDA for fee vault
    #[account(
        seeds = [FEE_VAULT_SEED],
        bump
    )]
    pub fee_vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositSol<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(
        mut,
        seeds = [CONFIG_SEED],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    /// CHECK: PDA for SOL vault
    #[account(
        mut,
        seeds = [VAULT_SEED],
        bump
    )]
    pub vault: AccountInfo<'info>,

    /// CHECK: PDA for fee vault
    #[account(
        mut,
        seeds = [FEE_VAULT_SEED],
        bump
    )]
    pub fee_vault: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositSpl<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(
        mut,
        seeds = [CONFIG_SEED],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = depositor
    )]
    pub depositor_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = depositor,
        seeds = [TOKEN_VAULT_SEED, mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = vault_token_account
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = depositor,
        seeds = [FEE_VAULT_SEED, mint.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = fee_token_account
    )]
    pub fee_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64, nonce: u64)]
pub struct RequestWithdraw<'info> {
    #[account(mut)]
    pub requester: Signer<'info>,

    #[account(
        seeds = [CONFIG_SEED],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    #[account(
        init,
        payer = requester,
        space = 8 + WithdrawRequest::INIT_SPACE,
        seeds = [WITHDRAW_REQUEST_SEED, requester.key().as_ref(), &nonce.to_le_bytes()],
        bump
    )]
    pub withdraw_request: Account<'info, WithdrawRequest>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64, nonce: u64)]
pub struct RequestWithdrawSpl<'info> {
    #[account(mut)]
    pub requester: Signer<'info>,

    #[account(
        seeds = [CONFIG_SEED],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = requester,
        space = 8 + WithdrawRequest::INIT_SPACE,
        seeds = [WITHDRAW_REQUEST_SEED, requester.key().as_ref(), mint.key().as_ref(), &nonce.to_le_bytes()],
        bump
    )]
    pub withdraw_request: Account<'info, WithdrawRequest>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteWithdrawSol<'info> {
    #[account(mut)]
    pub relayer: Signer<'info>,

    #[account(
        mut,
        seeds = [CONFIG_SEED],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    #[account(
        mut,
        constraint = withdraw_request.mint.is_none() @ VaultError::MintMismatch
    )]
    pub withdraw_request: Account<'info, WithdrawRequest>,

    /// CHECK: PDA for SOL vault
    #[account(
        mut,
        seeds = [VAULT_SEED],
        bump
    )]
    pub vault: AccountInfo<'info>,

    /// CHECK: PDA for fee vault
    #[account(
        mut,
        seeds = [FEE_VAULT_SEED],
        bump
    )]
    pub fee_vault: AccountInfo<'info>,

    /// CHECK: Destination account
    #[account(
        mut,
        constraint = destination.key() == withdraw_request.destination @ VaultError::InvalidDestination
    )]
    pub destination: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteWithdrawSpl<'info> {
    #[account(mut)]
    pub relayer: Signer<'info>,

    #[account(
        mut,
        seeds = [CONFIG_SEED],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,

    #[account(mut)]
    pub withdraw_request: Account<'info, WithdrawRequest>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [TOKEN_VAULT_SEED, mint.key().as_ref()],
        bump
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [FEE_VAULT_SEED, mint.key().as_ref()],
        bump
    )]
    pub fee_token_account: Account<'info, TokenAccount>,

    /// CHECK: Destination token account
    #[account(mut)]
    pub destination_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        constraint = authority.key() == config.authority @ VaultError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [CONFIG_SEED],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
}

// ============================================================================
// STATE
// ============================================================================

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,
    pub relayer: Pubkey,
    pub fee_bps: u16,
    pub total_deposits: u64,
    pub total_withdrawals: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct WithdrawRequest {
    pub requester: Pubkey,
    pub destination: Pubkey,
    pub amount: u64,
    pub nonce: u64,
    #[max_len(0)]
    pub mint: Option<Pubkey>,
    pub created_at: i64,
    pub executed: bool,
    pub executed_at: Option<i64>,
    pub bump: u8,
}

// ============================================================================
// EVENTS
// ============================================================================

#[event]
pub struct DepositEvent {
    pub depositor: Pubkey,
    pub amount: u64,
    pub fee: u64,
    pub mint: Option<Pubkey>,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawRequestEvent {
    pub requester: Pubkey,
    pub destination: Pubkey,
    pub amount: u64,
    pub nonce: u64,
    pub mint: Option<Pubkey>,
    pub timestamp: i64,
}

#[event]
pub struct WithdrawExecutedEvent {
    pub requester: Pubkey,
    pub destination: Pubkey,
    pub amount: u64,
    pub fee: u64,
    pub nonce: u64,
    pub mint: Option<Pubkey>,
    pub timestamp: i64,
}

// ============================================================================
// ERRORS
// ============================================================================

#[error_code]
pub enum VaultError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Already executed")]
    AlreadyExecuted,
    #[msg("Unauthorized relayer")]
    UnauthorizedRelayer,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Mint mismatch")]
    MintMismatch,
    #[msg("Invalid destination")]
    InvalidDestination,
    #[msg("Fee too high")]
    FeeTooHigh,
}
