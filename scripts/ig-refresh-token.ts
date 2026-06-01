/**
 * Instagram token maintenance.
 *
 *   npx tsx scripts/ig-refresh-token.ts            # refresh (extend 60d) — run on a schedule
 *   npx tsx scripts/ig-refresh-token.ts --exchange # one-time: initial token -> 60-day long-lived
 *
 * Writes the new token to .env.local and pushes it to Vercel env (Production).
 */
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
dotenv.config({ path: '.env.local' });

import { exchangeForLongLived, refreshLongLived } from '../lib/instagram-token';

function persist(token: string) {
  // 1. Local .env.local
  const path = '.env.local';
  const env = readFileSync(path, 'utf8');
  const line = `IG_ACCESS_TOKEN=${token}`;
  const next = /^IG_ACCESS_TOKEN=.*$/m.test(env)
    ? env.replace(/^IG_ACCESS_TOKEN=.*$/m, line)
    : env.trimEnd() + '\n' + line + '\n';
  writeFileSync(path, next);
  console.log('Updated .env.local');

  // 2. Vercel env (Production) — remove + re-add
  try {
    execSync('npx vercel env rm IG_ACCESS_TOKEN production --yes', { stdio: 'ignore' });
  } catch { /* not set yet — fine */ }
  execSync(`printf '%s' "${token}" | npx vercel env add IG_ACCESS_TOKEN production`, { stdio: 'inherit' });
  console.log('Pushed to Vercel env (Production)');
}

async function main() {
  const token = process.env.IG_ACCESS_TOKEN;
  if (!token) throw new Error('IG_ACCESS_TOKEN missing');

  if (process.argv.includes('--exchange')) {
    const secret = process.env.IG_APP_SECRET;
    if (!secret) throw new Error('IG_APP_SECRET missing — add it to .env.local first');
    const { token: longLived, expiresInSec } = await exchangeForLongLived(token, secret);
    console.log(`Exchanged. New token valid ${Math.round(expiresInSec / 86400)} days.`);
    persist(longLived);
  } else {
    const { token: refreshed, expiresInSec } = await refreshLongLived(token);
    console.log(`Refreshed. Token valid ${Math.round(expiresInSec / 86400)} days.`);
    persist(refreshed);
  }
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
