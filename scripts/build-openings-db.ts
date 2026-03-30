/**
 * Build a compact openings database JSON from Lichess TSV files.
 * Output: data/openings-eco/openings-db.json
 *
 * Run: npx tsx scripts/build-openings-db.ts
 */

import fs from 'fs';
import path from 'path';

const ECO_DIR = path.join(process.cwd(), 'data/openings-eco');
const OUTPUT = path.join(ECO_DIR, 'openings-db.json');

interface OpeningEntry {
  eco: string;
  name: string;
  moves: string[];  // PGN moves as flat SAN array
}

function parsePgnToSans(pgn: string): string[] {
  // "1. e4 e5 2. Nf3 Nc6" → ["e4", "e5", "Nf3", "Nc6"]
  return pgn
    .replace(/\d+\.\s*/g, '')   // strip move numbers
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

const entries: OpeningEntry[] = [];

for (const file of ['a.tsv', 'b.tsv', 'c.tsv', 'd.tsv', 'e.tsv']) {
  const content = fs.readFileSync(path.join(ECO_DIR, file), 'utf-8');
  const lines = content.trim().split('\n');

  for (let i = 1; i < lines.length; i++) {  // skip header
    const parts = lines[i].split('\t');
    if (parts.length < 3) continue;
    const [eco, name, pgn] = parts;
    entries.push({
      eco,
      name,
      moves: parsePgnToSans(pgn),
    });
  }
}

// Sort by move count descending so longest match wins in linear scan
entries.sort((a, b) => b.moves.length - a.moves.length);

fs.writeFileSync(OUTPUT, JSON.stringify(entries));
console.log(`Built openings DB: ${entries.length} entries → ${OUTPUT}`);
