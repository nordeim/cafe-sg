# Phase 13 Implementation Plan: CI, Deployment, and Environment Promotion

## Phase 13.1: CI/CD Pipeline Configuration

### 1. `frontend/next.config.ts` (Update)
- **Purpose**: Ensure standalone output for Docker optimization.
- **Content**:
  - `output: 'standalone'`
- **Checklist**:
  - [ ] `npm run build` produces `.next/standalone`.

### 2. `infra/production/Dockerfile.backend` (Create)
- **Purpose**: Production-ready PHP image.
- **Content**:
  - Base: `php:8.3-fpm-alpine`
  - Install extensions: `pdo_pgsql`, `redis`, `opcache`.
  - Copy code.
  - Run `composer install --no-dev --optimize-autoloader`.
  - Set permissions.
- **Checklist**:
  - [ ] Multi-stage build (if beneficial, otherwise single stage optimized).

### 3. `infra/production/Dockerfile.frontend` (Create)
- **Purpose**: Production-ready Next.js image.
- **Content**:
  - Base: `node:20-alpine`
  - Builder stage: `npm run build`
  - Runner stage: Copy `.next/standalone`.
  - Expose 3000.
- **Checklist**:
  - [ ] Minimal size.

### 4. `infra/production/nginx.conf` (Create)
- **Purpose**: Reverse proxy for backend (and frontend if not using Vercel).
- **Content**:
  - Proxy `/api` to Laravel FPM.
  - Proxy `/` to Next.js.
- **Checklist**:
  - [ ] Gzip enabled.
  - [ ] Security headers.

## Phase 13.2: Deployment Documentation

### 1. `docs/runbooks/deployment.md` (Create)
- **Purpose**: Instructions for deploying to a VPS (e.g., DigitalOcean/AWS EC2) using Docker Compose.
- **Content**:
  - Environment variables setup (`.env.production`).
  - Build command: `docker compose -f docker-compose.prod.yml up --build -d`.
  - Migration command: `docker compose exec backend php artisan migrate --force`.
  - Rollback steps.
- **Checklist**:
  - [ ] Includes zero-downtime considerations (basic).

### 2. `infra/production/docker-compose.prod.yml` (Create)
- **Purpose**: Production orchestration.
- **Content**:
  - Services: `frontend`, `backend`, `worker` (queue), `nginx`, `db`, `redis`.
  - Restart policies: `always`.
  - Networks: private backend network.
- **Checklist**:
  - [ ] No ports exposed unnecessarily (only Nginx 80/443).

## Validation Criteria
- [ ] Docker images build successfully.
- [ ] `docker-compose.prod.yml` starts all services.
- [ ] Frontend can communicate with Backend via internal network (or Nginx proxy).
- [ ] Static assets are served correctly.
