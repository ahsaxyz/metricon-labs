# Privacy Model

## Overview

Metricon is being designed as privacy-oriented infrastructure, not as a guarantee of complete anonymity.

On public blockchains such as Solana, transaction data, account relationships, timing, and execution patterns may still reveal information. Metricon’s goal is to reduce signal leakage and improve execution privacy where possible, while being honest about the limits of on-chain systems.

## Privacy Objective

The main objective is to reduce how easily third parties can infer:
- source and destination relationships
- intent before execution
- execution timing patterns
- strategy-level wallet behavior
- direct asset movement paths

## What Metricon Aims To Improve

Metricon is intended to improve privacy in areas such as:
- reducing direct transfer simplicity
- separating user initiation from final execution flow
- supporting controlled intermediate vault logic
- enabling future relayer or commitment-based execution paths
- reducing obvious signaling in certain workflows

## What Metricon Does Not Guarantee

Metricon does not currently guarantee:
- full anonymity
- unlinkability in all cases
- protection from advanced chain analysis
- privacy against every observer
- private balances on a public chain

Users should assume that on-chain activity can still be analyzed.

## Threat Model

Metricon is primarily concerned with observers such as:
- public chain analysts
- traders monitoring visible wallet behavior
- copy-traders or MEV-style observers
- counterparties attempting to infer intent
- systems watching transaction timing and account relationships

## Limits of Privacy on Solana

Because Solana is a public blockchain:
- transactions are visible
- account activity can be tracked
- timing correlation may still reveal patterns
- repeated usage patterns can reduce privacy
- destinations may still be inferable depending on implementation

For that reason, privacy must be treated as incremental rather than absolute.

## Role of Vaults

Vaults provide an architectural primitive for privacy-oriented execution, but they are not sufficient on their own.

Their value comes from:
- separating direct source-to-destination actions
- enabling controlled settlement logic
- supporting delayed or relayer-assisted execution
- serving as the base layer for more advanced coordination models

## Future Privacy Enhancements

Potential future privacy improvements may include:
- commitment-based execution
- delayed settlement
- relayer-mediated broadcasts
- more flexible destination handling
- execution batching or obfuscation strategies
- stronger separation between user intent and final action

## Security and Privacy Tradeoff

Privacy systems often introduce additional complexity. Metricon must balance:
- stronger privacy properties
- protocol simplicity
- execution reliability
- auditability
- user safety

Where these goals conflict, safety and correctness should come first.

## Current Status

Metricon is early experimental infrastructure. Its privacy model is still developing, and no production-grade privacy guarantees should be assumed at this stage.
