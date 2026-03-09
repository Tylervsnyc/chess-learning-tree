#!/bin/bash
export PATH="/opt/homebrew/bin:$PATH"
cd /Users/tyler.schwartz/chess-learning-tree
npx tsx scripts/daily-report.ts
npx tsx scripts/posthog-insights.ts --post-linear
npx tsx scripts/snapshot-funnel.ts
