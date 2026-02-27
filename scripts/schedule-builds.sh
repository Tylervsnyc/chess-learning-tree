#!/bin/bash
# schedule-builds.sh — Manage launchd schedule for opening builds
# Usage: ./scripts/schedule-builds.sh [start|stop|status]

PLIST_NAME="com.chesspath.build-openings"
PLIST_PATH="$HOME/Library/LaunchAgents/${PLIST_NAME}.plist"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="${PROJECT_DIR}/logs/builds"

case "$1" in
  start)
    mkdir -p "$LOG_DIR"
    mkdir -p "$HOME/Library/LaunchAgents"

    cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${PLIST_NAME}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/npx</string>
        <string>tsx</string>
        <string>${PROJECT_DIR}/scripts/run-opening-builds.ts</string>
        <string>-n</string>
        <string>2</string>
    </array>
    <key>WorkingDirectory</key>
    <string>${PROJECT_DIR}</string>
    <key>StartInterval</key>
    <integer>14400</integer>
    <key>StandardOutPath</key>
    <string>${LOG_DIR}/scheduler-stdout.log</string>
    <key>StandardErrorPath</key>
    <string>${LOG_DIR}/scheduler-stderr.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
        <key>HOME</key>
        <string>${HOME}</string>
    </dict>
</dict>
</plist>
PLIST

    launchctl load "$PLIST_PATH"
    echo "Scheduler started — runs every 4 hours, 2 builds per run"
    echo "Plist: $PLIST_PATH"
    echo "Logs:  $LOG_DIR/"
    ;;

  stop)
    if [ -f "$PLIST_PATH" ]; then
      launchctl unload "$PLIST_PATH"
      rm "$PLIST_PATH"
      echo "Scheduler stopped and plist removed"
    else
      echo "Scheduler not installed"
    fi
    ;;

  status)
    if launchctl list | grep -q "$PLIST_NAME"; then
      echo "Scheduler is ACTIVE"
      launchctl list "$PLIST_NAME" 2>/dev/null
    else
      echo "Scheduler is NOT running"
    fi

    # Show queue summary
    if [ -f "${PROJECT_DIR}/data/build-queue.json" ]; then
      echo ""
      echo "Queue summary:"
      node -e "
        const q = require('${PROJECT_DIR}/data/build-queue.json');
        const items = q.items;
        const counts = { pending: 0, building: 0, 'needs-review': 0, completed: 0, failed: 0 };
        items.forEach(i => counts[i.status]++);
        console.log('  Total:', items.length);
        Object.entries(counts).forEach(([k, v]) => v > 0 && console.log('  ' + k + ':', v));
      "
    fi
    ;;

  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac
