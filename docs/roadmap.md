# Metricon Roadmap

## Status

Metricon is in an early experimental phase. The current focus is on building the vault foundation, structuring the codebase, and defining the long-term privacy-oriented execution model.

## Phase 1: Core Vault Infrastructure

Goals:
- establish vault account architecture
- support initialization, deposit, and withdrawal flows
- connect frontend wallet and vault interactions
- improve code structure and internal documentation
- build initial tests around vault behavior

## Phase 2: Execution Layer Design

Goals:
- define how assets move from vault to destination
- explore commitment-based execution patterns
- improve validation and account constraints
- add clearer execution state tracking
- expand event and logging design

## Phase 3: Privacy-Oriented Routing

Goals:
- research stealth transfer mechanisms
- design reduced-signal movement patterns
- explore relayer-assisted execution models
- define privacy tradeoffs and trust assumptions
- improve coordination between on-chain and off-chain layers

## Phase 4: Swap and Bridge Expansion

Goals:
- refine swap-related execution logic
- refine bridge-related execution logic
- integrate routing pathways into the vault execution model
- document custody assumptions and execution guarantees
- strengthen operational safety around complex flows

## Phase 5: Hardening and Maturity

Goals:
- expand test coverage
- improve CI and developer tooling
- document security assumptions
- prepare for external review or audit readiness
- reduce architectural ambiguity across modules

## Ongoing Priorities

These priorities apply across all phases:
- maintain honest documentation
- prioritize correctness over hype
- reduce unnecessary complexity
- improve transparency around implemented vs planned features
- keep privacy claims aligned with actual system behavior
