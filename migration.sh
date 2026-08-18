#!/usr/bin/env bash

echo "========== START MIGRATION =========="
echo "Time: $(date)"

set -e

echo "Running migrations..."
npx prisma migrate deploy

echo "Running generate prisma client..."
npx prisma generate

echo "Running seed database..."
npx prisma db seed

# echo "Starting application..."
# npm start

echo "✅ Migration completed successfully"
echo "========== END MIGRATION =========="
echo "Time: $(date)"