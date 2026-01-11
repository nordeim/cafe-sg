# Deployment Runbook

## Prerequisites
- A VPS (DigitalOcean Droplet, AWS EC2) with Docker & Docker Compose installed.
- Git access to the repository.
- `.env.production` file populated with secrets (Stripe, Postgres, etc).

## Initial Setup
1.  Clone repository:
    ```bash
    git clone <repo_url> /var/www/merlion-brews
    cd /var/www/merlion-brews
    ```
2.  Create `.env.production`:
    ```bash
    cp infra/.env.example .env.production
    # Edit .env.production with real values
    ```

## Deploying
1.  Build and Start:
    ```bash
    docker compose -f infra/production/docker-compose.prod.yml --env-file .env.production up --build -d
    ```
2.  Run Migrations:
    ```bash
    docker compose -f infra/production/docker-compose.prod.yml exec backend php artisan migrate --force
    ```
3.  Seed (First time only):
    ```bash
    docker compose -f infra/production/docker-compose.prod.yml exec backend php artisan db:seed --force
    ```

## Rollback
1.  Revert code via git:
    ```bash
    git checkout <previous_tag>
    ```
2.  Rebuild:
    ```bash
    docker compose -f infra/production/docker-compose.prod.yml up --build -d
    ```
