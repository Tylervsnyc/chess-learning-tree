#!/bin/bash
#
# Syncs all env vars from .env.local to Vercel.
# Skips NEXT_PUBLIC_* vars (they're baked into the build).
# Requires: vercel CLI logged in.
#
# Usage: ./scripts/sync-env-to-vercel.sh
#

set -e

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

if ! command -v vercel &> /dev/null; then
  echo "Error: vercel CLI not installed. Run: npm i -g vercel"
  exit 1
fi

echo "Syncing env vars from $ENV_FILE to Vercel..."
echo ""

SYNCED=0
SKIPPED=0

while IFS= read -r line; do
  # Skip comments and empty lines
  [[ "$line" =~ ^#.*$ ]] && continue
  [[ -z "$line" ]] && continue

  # Parse key=value
  KEY="${line%%=*}"
  VALUE="${line#*=}"

  # Skip NEXT_PUBLIC_ vars (baked into client build, not server env)
  if [[ "$KEY" == NEXT_PUBLIC_* ]]; then
    echo "  SKIP  $KEY (public, baked into build)"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  # Add/update in Vercel for all environments
  echo "$VALUE" | vercel env add "$KEY" production --force 2>/dev/null && \
    echo "  SET   $KEY" || \
    echo "  FAIL  $KEY"

  SYNCED=$((SYNCED + 1))
done < "$ENV_FILE"

echo ""
echo "Done. $SYNCED synced, $SKIPPED skipped."
echo ""
echo "NOTE: You need to redeploy for changes to take effect:"
echo "  vercel --prod"
