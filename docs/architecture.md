# Metricon Architecture

## Overview

Metricon is an experimental privacy-oriented infrastructure project on Solana focused on reducing signal leakage during asset movement.

The system is being designed around a vault-based execution model, where assets move through controlled program-owned accounts instead of direct wallet-to-wallet flows. This creates a foundation for more private execution patterns, delayed settlement paths, and future stealth-oriented routing mechanisms.

Metricon is currently in an early stage and should be treated as experimental infrastructure.

## Design Goals

- Reduce direct wallet-to-wallet visibility where possible
- Introduce structured vault-based asset handling
- Create a foundation for stealth transfers and private routing
- Separate user-facing interaction flows from execution logic
- Support future relayer or commitment-based execution models

## High-Level Components

### 1. Frontend Application

The frontend handles user interaction, wallet connection, vault actions, and future swap/bridge flows.

Responsibilities include:
- wallet connection
- transaction initiation
- displaying vault state
- surfacing swap and bridge actions
- integrating with backend services where needed

### 2. On-Chain Vault Program

The Solana Anchor program is responsible for vault-related state and controlled asset operations.

Responsibilities include:
- vault initialization
- deposit handling
- withdrawal logic
- storing program state
- enforcing account constraints and validation rules

### 3. Off-Chain Coordination Layer

Some privacy-oriented behaviors may require off-chain coordination to avoid exposing unnecessary information directly on-chain.

This layer may eventually support:
- relayer-assisted execution
- commitment submission
- delayed execution flows
- transaction orchestration
- event indexing and monitoring

### 4. Data / Backend Services

Backend services may be used for operational metadata, execution tracking, analytics, or relayer coordination.

This layer is not intended to hold custody of user funds. Its role is operational rather than custodial.

## Core Architecture Pattern

Metricon is being developed around the following general flow:

User Wallet → Vault PDA → Execution Layer → Destination

Instead of directly executing all actions from the user wallet to the final destination, Metricon introduces intermediate controlled infrastructure that can support more advanced execution patterns over time.

## Vault-Centric Model

The vault is the core primitive in the current system design.

A vault is intended to:
- temporarily hold assets under program-controlled rules
- isolate execution flow from direct end-state transfers
- support structured movement logic
- act as the anchor point for future privacy features

## Trust Boundaries

Metricon’s intended trust boundaries are:

- User wallets remain user-controlled
- On-chain vault logic is enforced by the Solana program
- Off-chain services may coordinate activity but should not have direct custody over user assets
- Privacy guarantees are limited by what remains visible on-chain and by how execution infrastructure evolves

## Current State

At the current stage, Metricon includes early vault-related infrastructure and frontend interaction logic. The architecture is still evolving, and several advanced privacy mechanisms remain in research or design phase.

## Future Architecture Direction

Planned future architecture exploration includes:
- commitment-based execution
- relayer-assisted actions
- stealth transfer patterns
- private swap routing
- bridge flows with reduced signaling
- stronger event and execution tracking
