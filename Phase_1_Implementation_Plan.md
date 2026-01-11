# Phase 1 Implementation Plan: Monorepo Foundation + Local Dev Infrastructure

## Phase 1.1: Root Configuration & Documentation

### 1. `.gitignore` (Update)
- **Purpose**: Ensure all generated, secret, and OS-specific files are ignored across the monorepo structure.
- **Action**: Update the existing `.gitignore` to include:
  - IDE specific files (`.idea/`, `.vscode/`)
  - OS artifacts (`.DS_Store`, `Thumbs.db`)
  - Backend specific (`storage/logs/`, `bootstrap/cache/`, `vendor/`, `.phpunit.result.cache`)
  - Frontend specific (`.next/`, `node_modules/`, `coverage/`)
  - Infra specific (any local volumes if mapped locally, though named volumes are preferred)
  - Environment files (`.env`, `.env.local`, `.env.*.local`)
- **Checklist**:
  - [ ] Ignores `.env` but allows `.env.example`
  - [ ] Covers Node, PHP/Laravel, and System artifacts

### 2. `docs/adr/ADR-0001-scope-lock.md` (Create)
- **Purpose**: Record the architectural scope locks to prevent drift.
- **Content**:
  - Frontend: Next.js 15 + Tailwind v4 + Merlion Wrappers.
  - Backend: Laravel 12 + Postgres 16 (Day 1).
  - Compliance: PayNow required, InvoiceNow MVP.
  - Browser Floor: Safari 16.4+, Chrome 111+.
- **Checklist**:
  - [ ] Document is created in `docs/adr/`
  - [ ] Explicitly states "Do not downgrade Tailwind v4"

### 3. `docs/runbooks/local-development.md` (Create)
- **Purpose**: Guide for developers to troubleshoot local setup.
- **Content**:
  - Prerequisites check.
  - Common issues (ports already in use, migration failures).
  - Database reset commands.
- **Checklist**:
  - [ ] Includes Postgres/Redis connection troubleshooting

## Phase 1.2: Infrastructure Setup

### 1. `infra/docker-compose.yml` (Create)
- **Purpose**: Define local services (Postgres 16, Redis 7).
- **Content**:
  - Service: `db` (postgres:16)
    - Ports: 5432:5432
    - Volumes: `pg_data:/var/lib/postgresql/data`
    - Healthcheck: `pg_isready`
  - Service: `redis` (redis:7)
    - Ports: 6379:6379
    - Volumes: `redis_data:/data`
    - Healthcheck: `redis-cli ping`
- **Checklist**:
  - [ ] Uses named volumes for persistence
  - [ ] Uses environment variables for credentials (no hardcoded passwords)

### 2. `infra/.env.example` (Create)
- **Purpose**: Template for local infrastructure environment variables.
- **Content**:
  - `POSTGRES_DB`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `REDIS_PORT`
- **Checklist**:
  - [ ] Matches variables used in `docker-compose.yml`
  - [ ] Contains safe default values (e.g., user: `merlion`, db: `merlion_brews`)

## Validation Criteria
- [ ] `docker compose up -d` (from `infra/`) starts containers successfully and they become healthy.
- [ ] `.gitignore` prevents git from seeing `.env` or `node_modules` in `git status`.
- [ ] Documentation files exist and are linked/accessible.
