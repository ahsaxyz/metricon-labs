# Vault Flow

## Purpose

The vault flow is the core interaction pattern in Metricon.

It is designed to introduce an intermediate execution layer between the user wallet and the final destination of funds. This creates a cleaner foundation for privacy-oriented asset movement than direct wallet-to-wallet execution alone.

## High-Level Flow

1. User connects wallet
2. User initializes or selects a vault
3. User deposits assets into the vault
4. Vault state is updated on-chain
5. A later execution path determines how funds are moved or withdrawn
6. Assets are sent to the intended destination according to program rules

## Why Vaults Matter

Vaults are useful because they:
- isolate asset handling into a dedicated program-controlled structure
- make execution flows more composable
- provide a foundation for delayed or coordinated execution
- allow future privacy features to build on top of a stable primitive

## Example Flow

### Step 1: Wallet Connection

The user connects a Solana wallet through the frontend application.

### Step 2: Vault Initialization

A vault account is created or referenced. This vault is expected to be controlled by the program and associated with the relevant user or execution context.

### Step 3: Deposit

The user deposits supported assets into the vault.

At this point:
- the wallet is the source of funds
- the vault becomes the temporary controlled holding point
- program rules can govern what happens next

### Step 4: Execution Decision

After deposit, the system may take one of several future paths depending on how Metricon evolves:
- direct withdrawal back to an authorized destination
- routed transfer to another address
- swap-related execution
- bridge-related execution
- relayer-assisted execution
- commitment-triggered settlement

### Step 5: Settlement

Funds are moved out of the vault under valid rules and constraints.

## Security Considerations

The vault flow must enforce:
- correct signer checks
- valid account ownership
- destination validation
- balance tracking
- unauthorized withdrawal prevention
- replay resistance where applicable

## Current vs Future Scope

### Current Scope
- vault-related account interactions
- deposit / withdrawal-style flows
- frontend hooks for vault operations

### Future Scope
- commitment-linked execution
- stealth movement patterns
- relayer-assisted settlement
- private swap and bridge pathways

## Important Note

Vaults improve execution structure, but they do not automatically guarantee privacy by themselves. Privacy depends on the broader execution model, what metadata becomes public on-chain, and how off-chain coordination is designed.
