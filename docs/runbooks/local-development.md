# Local Development Runbook

## Prerequisites
Ensure you have the following installed:
- Docker Desktop / Docker Compose
- Node.js LTS (v20+)
- PHP 8.3+ & Composer
- Git

## Getting Started
1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd merlion-brews
    ```

2.  **Start Infrastructure**:
    ```bash
    cd infra
    cp .env.example .env
    docker compose up -d
    ```

3.  **Verify Infrastructure**:
    Run `docker compose ps`. You should see `db` (Postgres) and `redis` running.

## Troubleshooting

### Database Connection Issues
**Symptom**: `Connection refused` or `SQLSTATE[08006]`
- **Check**: Is the `db` container running? (`docker compose ps`)
- **Check**: Are the credentials in `backend/.env` matching `infra/.env`?
- **Action**: 
    ```bash
    # Test connection from host
    docker compose exec db pg_isready -U merlion
    ```

### Redis Connection Issues
**Symptom**: `Connection refused` when connecting to Redis.
- **Check**: Is the `redis` container running?
- **Action**:
    ```bash
    docker compose exec redis redis-cli ping
    ```

### Resetting the Database
**Warning**: This deletes all data!
```bash
cd infra
docker compose down -v
docker compose up -d
# Then re-run migrations in backend
cd ../backend
php artisan migrate --seed
```
