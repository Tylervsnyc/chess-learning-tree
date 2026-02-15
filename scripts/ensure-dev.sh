#!/bin/bash
# Ensures the dev server is running. Does nothing if it's already up.
# Usage: ./scripts/ensure-dev.sh

PORT=3000

# Check if something is already listening on the port
if curl -s --max-time 2 http://localhost:$PORT > /dev/null 2>&1; then
  exit 0
fi

# Check if a process owns the port but isn't responding yet (still starting up)
if lsof -ti :$PORT > /dev/null 2>&1; then
  echo "♟ Dev server is starting up, waiting..."
  for i in {1..15}; do
    sleep 2
    if curl -s --max-time 2 http://localhost:$PORT > /dev/null 2>&1; then
      exit 0
    fi
  done
  echo "♟ Server process exists but not responding. Killing and restarting..."
  kill -9 $(lsof -ti :$PORT) 2>/dev/null
  sleep 1
fi

# Start the resilient dev server in the background
echo "♟ Starting dev server with Turbopack..."
nohup ./scripts/dev-server.sh > /tmp/chess-path-dev.log 2>&1 &

# Wait for it to be ready
for i in {1..30}; do
  sleep 2
  if curl -s --max-time 2 http://localhost:$PORT > /dev/null 2>&1; then
    echo "♟ Dev server ready."
    exit 0
  fi
done

echo "♟ Dev server failed to start. Check /tmp/chess-path-dev.log"
exit 1
