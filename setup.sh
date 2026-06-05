#!/usr/bin/env bash

# Safer bash: exit on error, undefined var is error, and fail pipelines
set -o errexit
set -o nounset
set -o pipefail

timestamp() { date --iso-8601=seconds 2>/dev/null || date; }

log() { printf '%s %s\n' "[$(timestamp)]" "$*"; }

run_cmd() {
  local desc="$1"; shift
  log "START: $desc"
  if "$@"; then
    log "OK: $desc"
  else
    local code=$?
    log "ERROR: $desc (exit $code)"
    exit $code
  fi
}

log "========== START SETUP MIGRATION =========="

# Install dependencies
run_cmd "Install dependencies" npm install

# Init database (detached)
run_cmd "Init database" docker compose -f docker-compose-dev.yml up -d

log "Waiting for SQL Server..."

until docker logs sqlserver 2>&1 | grep -q "SQL Server is now ready for client connections"; do
  sleep 5
done

log "SQL Server ready"

# Run migrations
run_cmd "Database migration" npx prisma migrate deploy

# Run migrations
run_cmd "create Prisma Client" npx prisma generate

# Seed database
run_cmd "Seed database" npx prisma db seed

log "Setup completed successfully"
log "========== END SETUP MIGRATION =========="