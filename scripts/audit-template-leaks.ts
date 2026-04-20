/**
 * Audit every authored speech line + touchpoint for template placeholders
 * that survive the sanitizer in both "no name" and "with name" modes.
 *
 * Run: npx tsx scripts/audit-template-leaks.ts
 * Exits non-zero if any line renders with an unresolved `{...}` token.
 */

import { AUTHORED_LINES } from '../lib/speech/line-pool';
import { TOUCHPOINT_LINES } from '../lib/speech/rookie-touchpoints';
import { renderLine } from '../lib/speech/sanitize';

const PLACEHOLDER = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/;

let failures = 0;
let checked = 0;

function check(pool: readonly { id: string; text: string }[], poolName: string) {
  for (const line of pool) {
    checked += 2;
    for (const name of [null, 'Tyler']) {
      const rendered = renderLine(line.text, name);
      if (PLACEHOLDER.test(rendered)) {
        failures += 1;
        console.error(
          `[LEAK] ${poolName}:${line.id} (name=${name ?? 'null'})\n  in:  "${line.text}"\n  out: "${rendered}"`,
        );
      }
    }
  }
}

check(AUTHORED_LINES, 'AUTHORED_LINES');
check(TOUCHPOINT_LINES, 'TOUCHPOINT_LINES');

if (failures > 0) {
  console.error(`\n${failures} leak(s) across ${checked} render(s).`);
  process.exit(1);
}

console.log(`OK: ${checked} renders, 0 leaks.`);
