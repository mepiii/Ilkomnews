#!/usr/bin/env bash
#
# db-reset.sh — Rebuild the ILKOM NEWS database from scratch.
#
# Run from the project root:
#     ./db-reset.sh
#
# Default behavior: `php artisan migrate:fresh --seed --force`
#   - Drops every table (Laravel disables FK checks during the drop),
#     re-runs all migrations, then seeds.
#   - Preserves database grants since the database itself is not dropped.
#
# For a true nuke (drop + recreate the database via the mysql CLI), see the
# commented-out "NUCLEAR OPTION" block below.

set -euo pipefail

# Resolve the directory this script lives in and move to the project root.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/backend"

cd "${BACKEND_DIR}"

echo "==> Clearing config cache..."
php artisan config:clear

echo "==> Running migrate:fresh --seed --force (drops all tables, re-migrates, seeds)..."
if php artisan migrate:fresh --seed --force; then
    echo ""
    echo "=========================================================="
    echo " SUCCESS: Database rebuilt from scratch."
    echo "=========================================================="
else
    echo ""
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo " FAILED: migrate:fresh --seed did not complete successfully."
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    exit 1
fi

# ---------------------------------------------------------------------------
# NUCLEAR OPTION (disabled by default)
#
# Uncomment the block below to also DROP and RECREATE the database itself via
# the mysql CLI. This wipes the DB entirely (grants on the DB are also dropped
# and recreated). Use only when migrate:fresh is not enough (e.g. a corrupted
# schema or character-set mismatch).
#
# Requires the mysql client on PATH and a working .env.
# ---------------------------------------------------------------------------
# echo "==> NUCLEAR: Reading DB credentials from .env..."
# set -a
# source .env
# set +a
#
# DB_NAME="${DB_DATABASE}"
# DB_USER="${DB_USERNAME}"
# DB_PASS="${DB_PASSWORD}"
#
# echo "==> NUCLEAR: Dropping and recreating database '${DB_NAME}'..."
# mysql -u "${DB_USER}" ${DB_PASS:+-p"${DB_PASS}"} \
#     -e "DROP DATABASE IF EXISTS \`${DB_NAME}\`; CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
#
# echo "==> NUCLEAR: Running migrate --seed --force..."
# if php artisan migrate --seed --force; then
#     echo ""
#     echo "=========================================================="
#     echo " SUCCESS: Database dropped/recreated and rebuilt from scratch."
#     echo "=========================================================="
# else
#     echo ""
#     echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
#     echo " FAILED: nuclear rebuild did not complete successfully."
#     echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
#     exit 1
# fi
