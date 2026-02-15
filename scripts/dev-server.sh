#!/bin/bash
# Resilient dev server — starts once, stays alive, auto-restarts on crash.
# Usage: ./scripts/dev-server.sh

PORT=3000

# Kill any zombie on the port
kill_port() {
  local pid=$(lsof -ti :$PORT 2>/dev/null)
  if [ -n "$pid" ]; then
    echo "♟ Killing zombie process on port $PORT (pid $pid)"
    kill -9 $pid 2>/dev/null
    sleep 1
  fi
}

# Only clear .next if it's corrupted (missing BUILD_ID or cache dir)
maybe_clear_cache() {
  if [ -d ".next" ] && { [ ! -f ".next/BUILD_ID" ] && [ ! -d ".next/cache" ]; }; then
    echo "♟ .next cache looks corrupted, clearing..."
    rm -rf .next
  fi
}

kill_port
maybe_clear_cache

echo "♟ Starting dev server with Turbopack on port $PORT..."
echo "♟ Auto-restarts on crash. Ctrl+C to stop."
echo ""

while true; do
  npm run dev -- --port $PORT
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ] || [ $EXIT_CODE -eq 130 ] || [ $EXIT_CODE -eq 143 ]; then
    # Clean exit or Ctrl+C — don't restart
    echo "♟ Dev server stopped."
    break
  fi
  echo ""
  echo "♟ Dev server crashed (exit $EXIT_CODE). Restarting in 2s..."
  kill_port
  sleep 2
done
