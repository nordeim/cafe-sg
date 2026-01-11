# ADR-0001: Project Scope Locks

## Status
ACCEPTED

## Date
2026-01-11

## Context
To prevent scope creep and ensure the "Peranakan Soul" aesthetic is not compromised by technical conveniences, we are establishing strict architectural boundaries.

## Decision
The following decisions are locked and require a formal RFC to change:

1.  **Design Authority**: `cafe.html` is the source of truth for all tokens, CSS layers, and interaction behaviors.
2.  **Frontend Stack**: Next.js 15 (App Router) + Tailwind CSS v4 + Merlion Wrapper Components.
    *   **Constraint**: Do not downgrade Tailwind v4. We rely on its native cascade layers.
    *   **Browser Floor**: Safari 16.4+, Chrome 111+, Firefox 128+.
3.  **Backend Stack**: Laravel 12 (PHP 8.3+) + PostgreSQL 16 from Day 1.
    *   **Constraint**: No serverless functions for domain logic.
4.  **Compliance**: 
    *   **PayNow**: Required via Stripe.
    *   **InvoiceNow**: MVP-scope integration via provider API.
5.  **Inventory**: Two-Phase Reservation pattern (Reserve -> Commit) with Ledger.

## Consequences
- We accept the operational overhead of managing a containerized backend.
- We accept the "bleeding edge" risk of Tailwind v4 for the benefit of better CSS layer management.
- We prioritize compliance readiness over MVP speed.
