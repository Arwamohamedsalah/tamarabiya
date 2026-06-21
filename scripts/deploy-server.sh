#!/usr/bin/env bash
# نشر على VPS — من جذر المشروع: bash scripts/deploy-server.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Pull latest code"
git pull origin main

echo "==> Frontend build"
npm ci
npm run build:prod

echo "==> Backend install"
cd server
npm ci --omit=dev
cd "$ROOT"

echo "==> Restart PM2"
if pm2 describe tam-backend >/dev/null 2>&1; then
  pm2 restart tam-backend --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

echo "==> Verify API routes"
sleep 2
API_BASE="${VERIFY_API_BASE:-http://127.0.0.1:5000/api}" node server/scripts/verify-backend.js

echo "==> Deploy done. Frontend: dist/ — reload Nginx if needed."
