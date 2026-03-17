import { Chess } from 'chess.js';

// Verify all Sicilian variation lesson files have valid FENs
const files = [
  'sicilian-sveshnikov', 'sicilian-classical', 'sicilian-kan',
  'sicilian-taimanov', 'sicilian-accelerated-dragon', 'sicilian-alapin', 'sicilian-scheveningen'
];

let errors = 0;
for (const f of files) {
  try {
    const content = require('fs').readFileSync(`data/openings/${f}-lessons.ts`, 'utf8');
    // Extract all FEN strings
    const fenRegex = /['"]([rnbqkpRNBQKP1-8\/]+ [wb] [KQkq-]+ [a-h1-8-]+ \d+ \d+)['"]/g;
    let match;
    let count = 0;
    let invalid = 0;
    while ((match = fenRegex.exec(content)) !== null) {
      count++;
      const fen = match[1];
      try {
        new Chess(fen);
      } catch {
        invalid++;
        console.log(`  INVALID FEN in ${f}: ${fen}`);
      }
    }
    if (invalid > 0) {
      errors += invalid;
      console.log(`${f}: ${count} FENs, ${invalid} INVALID`);
    } else {
      console.log(`${f}: ${count} FENs, all valid`);
    }
  } catch (e: any) {
    console.log(`${f}: ERROR reading file: ${e.message}`);
    errors++;
  }
}
console.log(`\nTotal errors: ${errors}`);
process.exit(errors > 0 ? 1 : 0);
