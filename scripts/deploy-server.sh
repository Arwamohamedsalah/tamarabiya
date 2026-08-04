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

echo "==> Seed page content (MongoDB)"
cd server
npm run seed:page-content
npm run sync:work-areas
cd "$ROOT"

echo "==> Verify Image model has work-area section"
if ! grep -q "work-area" "$ROOT/server/src/models/Image.js"; then
  echo "ERROR: server/src/models/Image.js missing work-area — git pull may have failed."
  exit 1
fi

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
