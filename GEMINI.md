# Merlion Brews — Artisan Coffee Platform

## Project Overview
Merlion Brews is a Singapore-first, design-led headless commerce platform. It fuses a bespoke "Peranakan" aesthetic with enterprise-grade transactional integrity and strict local compliance (GST, InvoiceNow, PayNow).

The system is architected as a **Backend-for-Frontend (BFF)** hybrid:
- **Frontend**: Next.js 15 (App Router) handles the "soul" (UX, animations, design tokens) and orchestrates user flows.
- **Backend**: Laravel 12 acts as the domain authority, handling inventory, orders, compliance, and invoicing.

## Architecture & Technology Stack

**Frontend (`/frontend`)**
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (CSS-first config via `@theme`)
- **Components**: Shadcn UI primitives wrapped in custom `Merlion` components (e.g., `folio-frame`, `button-merlion`) to enforce the design system.
- **Design Source**: `cafe.html` is the authoritative source for tokens, CSS layers, and interaction behaviors.

**Backend (`/backend`)**
- **Framework**: Laravel 12 (PHP 8.3+)
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **Key Services**: Inventory (Two-Phase Reservation), Orders (GST Logic), Invoicing (InvoiceNow via Provider API).

**Infrastructure (`/infra`)**
- Docker Compose for local development (Postgres + Redis).

## Development Constraints (Scope Lock)

These decisions are **architecturally locked** and must not be drifted from:
1.  **Design Authority**: `cafe.html` is the source of truth.
2.  **Compliance**: 9% GST inclusive pricing, PayNow support via Stripe, and InvoiceNow readiness are mandatory MVP features.
3.  **Stack**: Laravel/Postgres from Day 1 (no serverless backend functions for domain logic).
4.  **Browser Support**: Modern browsers only (Safari 16.4+, Chrome 111+) to support Tailwind v4 native cascade layers.

## Getting Started

### Prerequisites
- Node.js LTS
- PHP 8.3+ & Composer
- Docker Desktop / Compose

### Running Locally
(Refer to `Master_Execution_Plan.md` Phase 1 for detailed setup)
1.  Start infrastructure: `docker compose up -d` (in `/infra`)
2.  Backend: `php artisan serve` (in `/backend`)
3.  Frontend: `npm run dev` (in `/frontend`)

## Execution Plan
The project follows a strict **Master Execution Plan (MEP)** located at `Master_Execution_Plan.md`.
- **Phase 0**: Credentials & Compliance Setup.
- **Phase 1**: Monorepo & Local Infra.
- **Phase 2**: Backend Skeleton.
- **Phase 3**: Design Token Bridge.
...and so on.

**Agent Instructions**: Always check `Master_Execution_Plan.md` before starting a task to ensure alignment with the current phase and validation gates.
