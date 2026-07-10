#!/usr/bin/env bash
#
# ILKOM NEWS — local setup script
#
# PREREQUISITES (do these BEFORE running this script):
#   1. A MySQL or MariaDB server is RUNNING and listening on 127.0.0.1:3306
#      (e.g.  sudo systemctl start mysql   OR   sudo systemctl start mariadb)
#   2. Edit backend/.env and set DB_USERNAME / DB_PASSWORD to a user that can
#      CREATE the `ilkom_news` database (or pre-create it yourself).
#   3. PHP >= 8.1, Composer, Node >= 18, and npm are installed and on PATH.
#
# This script installs deps, creates the database if missing, runs migrations
# + seeders (idempotent — safe to re-run), and installs frontend deps.
# It does NOT start the dev servers — see the end for those commands.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "==> ILKOM NEWS setup (root: $ROOT)"

command -v php  >/dev/null 2>&1 || { echo "ERROR: php not found on PATH"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "ERROR: node not found on PATH"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "ERROR: npm not found on PATH"; exit 1; }

# ---------- Backend ----------
echo "==> Backend: PHP dependencies"
cd "$ROOT/backend"
if [ ! -d vendor ]; then
  if command -v composer >/dev/null 2>&1; then
    composer install --no-interaction --prefer-dist
  else
    echo "ERROR: composer not found. Install Composer (https://getcomposer.org), then re-run."; exit 1
  fi
else
  echo "    vendor/ present, skipping composer install"
fi

if ! grep -q "APP_KEY=base64:" .env; then
  php artisan key:generate --force
fi

php artisan config:clear

# Create the database if it does not exist (uses the mysql CLI; portable,
# no reliance on the Laravel db:create command which may be unavailable).
DB_NAME=$(grep '^DB_DATABASE=' .env | cut -d= -f2)
DB_USER=$(grep '^DB_USERNAME=' .env | cut -d= -f2)
DB_PASS=$(grep '^DB_PASSWORD=' .env | cut -d= -f2)
if command -v mysql >/dev/null 2>&1; then
  mysql -u "$DB_USER" ${DB_PASS:+-p"$DB_PASS"} -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null \
    && echo "    database '$DB_NAME' ready" \
    || echo "    (could not auto-create '$DB_NAME'; ensure it exists or run migrate with rights)"
else
  echo "    mysql CLI not found — ensure database '$DB_NAME' exists before migrate"
fi

echo "==> Backend: migrate + seed (idempotent, safe to re-run)"
php artisan migrate --seed --force

# ---------- Frontend ----------
echo "==> Frontend: JS dependencies"
cd "$ROOT/frontend"
if [ ! -d node_modules ]; then
  npm install
else
  echo "    node_modules/ present, skipping npm install"
fi

echo ""
echo "==> Setup complete."
echo ""
echo "Now start the servers in TWO more terminals:"
echo "   [1] cd backend  && php artisan serve --host=127.0.0.1 --port=8000"
echo "   [2] cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:5173"
echo "Admin login: /portal/login  (admin1@sapa.fasilkom.unsri.ac.id / AdminSapa01!)"
