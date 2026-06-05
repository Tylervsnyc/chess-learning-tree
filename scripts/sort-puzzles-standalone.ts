/**
 * Standalone Puzzle Sorter
 *
 * Reads Lichess puzzle CSVs and sorts them into JSON files by primary theme.
 *
 * Setup:
 *   1. Put your Lichess CSV files in a folder called `data/puzzles-by-rating/`
 *      (files like 0400-0800.csv, 0800-1200.csv, etc.)
 *   2. Run: npx tsx scripts/sort-puzzles-standalone.ts
 *   3. Output lands in `data/sorted-puzzles/`
 */

import * as fs from "fs";
import * as path from "path";

// ── Where to find CSVs and where to put output ──────────────────────────────

const INPUT_DIR = path.join(process.cwd(), "data", "puzzles-by-rating");
const OUTPUT_DIR = path.join(process.cwd(), "data", "sorted-puzzles");

// ── Theme categories ────────────────────────────────────────────────────────
// Each puzzle on Lichess has multiple tags. We want to pick ONE primary theme.

const MECHANISMS = [
  "fork",
  "pin",
  "skewer",
  "discoveredAttack",
  "doubleCheck",
  "xRayAttack",
];
const ENABLERS = [
  "attraction",
  "deflection",
  "clearance",
  "interference",
  "sacrifice",
  "exposedKing",
];
const MATE_PATTERNS = [
  "backRankMate",
  "smotheredMate",
  "hookMate",
  "arabianMate",
  "anastasiasMate",
  "bodensMate",
  "doubleBishopMate",
  "dovetailMate",
  "suffocationMate",
];
const MATE_DEPTH = ["mateIn1", "mateIn2", "mateIn3", "mateIn4", "mateIn5"];
const MATERIAL = ["hangingPiece", "trappedPiece", "crushing"];
const ENDGAME = [
  "pawnEndgame",
  "rookEndgame",
  "queenEndgame",
  "bishopEndgame",
  "knightEndgame",
];
const OTHER = [
  "quietMove",
  "zugzwang",
  "kingsideAttack",
  "queensideAttack",
  "defensiveMove",
  "intermezzo",
  "promotion",
  "underPromotion",
];

// All themes we care about (everything else is noise like "short", "middlegame", etc.)
const ALL_THEMES = [
  ...MECHANISMS,
  ...ENABLERS,
  ...MATE_PATTERNS,
  ...MATE_DEPTH,
  ...MATERIAL,
  ...ENDGAME,
  ...OTHER,
];

// ── Primary theme picker ────────────────────────────────────────────────────
// Given a puzzle's list of tags, pick the ONE most important theme.
// Returns null if ambiguous (puzzle gets skipped).

function pickPrimaryTheme(tags: string[]): string | null {
  const tactical = tags.filter((t) => ALL_THEMES.includes(t));
  const mechanisms = tactical.filter((t) => MECHANISMS.includes(t));
  const enablers = tactical.filter((t) => ENABLERS.includes(t));
  const mateDepth = tags.find((t) => MATE_DEPTH.includes(t));
  const matePattern = tags.find((t) => MATE_PATTERNS.includes(t));

  // Named mate pattern wins (e.g. "backRankMate")
  if (matePattern && mechanisms.filter((m) => m !== "discoveredAttack").length === 0) {
    return matePattern;
  }

  // Mate by depth (e.g. "mateIn2") if no other mechanism
  if (mateDepth && !matePattern) {
    const other = tactical.filter((t) => !MATE_DEPTH.includes(t) && t !== "mate");
    if (other.length === 0) return mateDepth;
    if (other.length === 1 && other[0] === "discoveredAttack") return mateDepth;
    return null;
  }

  // Material themes (hangingPiece, trappedPiece)
  const material = tactical.filter((t) => MATERIAL.includes(t));
  if (material.length > 0 && mechanisms.length === 0) {
    if (material.includes("hangingPiece")) return "hangingPiece";
    if (material.includes("trappedPiece")) return "trappedPiece";
    if (material.includes("crushing")) return "crushing";
  }

  // Endgame type (if only one and no mechanism)
  const endgame = tactical.filter((t) => ENDGAME.includes(t));
  if (endgame.length === 1 && mechanisms.length === 0) return endgame[0];

  // Single mechanism (fork, pin, skewer, etc.)
  if (mechanisms.length === 1) return mechanisms[0];

  // Single enabler with no mechanism
  if (enablers.length === 1 && mechanisms.length === 0) return enablers[0];

  // Other themes (quietMove, zugzwang, promotion, etc.)
  for (const theme of OTHER) {
    if (tactical.includes(theme) && mechanisms.length === 0) return theme;
  }

  // Exactly one tactical theme total
  if (tactical.length === 1) return tactical[0];

  // Ambiguous — skip this puzzle
  return null;
}

// ── CSV parser (handles quoted fields) ──────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else current += char;
  }
  result.push(current);
  return result;
}

// ── Main ────────────────────────────────────────────────────────────────────

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Find all CSV files
const csvFiles = fs
  .readdirSync(INPUT_DIR)
  .filter((f) => f.endsWith(".csv"))
  .sort();

if (csvFiles.length === 0) {
  console.log(`No CSV files found in ${INPUT_DIR}`);
  console.log("Put your Lichess puzzle CSVs there and try again.");
  process.exit(1);
}

// Accumulate all puzzles by theme across all files
const allByTheme = new Map<string, any[]>();
let totalProcessed = 0;
let totalSorted = 0;

for (const file of csvFiles) {
  const filePath = path.join(INPUT_DIR, file);
  console.log(`Reading ${file}...`);

  const lines = fs.readFileSync(filePath, "utf-8").split("\n").slice(1); // skip header

  for (const line of lines) {
    if (!line.trim()) continue;
    totalProcessed++;

    const fields = parseCsvLine(line);
    const [puzzleId, fen, moves, ratingStr, , popularityStr, nbPlaysStr, themesStr, gameUrl] = fields;

    const rating = parseInt(ratingStr) || 0;
    const popularity = parseInt(popularityStr) || 0;
    const nbPlays = parseInt(nbPlaysStr) || 0;
    const tags = themesStr?.split(" ").filter(Boolean) || [];

    const theme = pickPrimaryTheme(tags);
    if (!theme) continue;

    totalSorted++;

    if (!allByTheme.has(theme)) allByTheme.set(theme, []);
    allByTheme.get(theme)!.push({
      puzzleId,
      fen,
      moves,
      rating,
      popularity,
      nbPlays,
      theme,
      allThemes: tags,
      gameUrl: gameUrl || "",
    });
  }
}

// Write one JSON file per theme, sorted by rating
for (const [theme, puzzles] of allByTheme) {
  puzzles.sort((a: any, b: any) => a.rating - b.rating);
  const outFile = path.join(OUTPUT_DIR, `${theme}.json`);
  fs.writeFileSync(outFile, JSON.stringify(puzzles, null, 2));
}

// Print results
console.log(`\nDone!`);
console.log(`Processed: ${totalProcessed.toLocaleString()} puzzles`);
console.log(`Sorted:    ${totalSorted.toLocaleString()} puzzles (${((totalSorted / totalProcessed) * 100).toFixed(1)}%)`);
console.log(`Skipped:   ${(totalProcessed - totalSorted).toLocaleString()} (ambiguous themes)`);
console.log(`\nOutput: ${OUTPUT_DIR}/`);
console.log(`\nThemes found:`);

const sorted = [...allByTheme.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [theme, puzzles] of sorted) {
  console.log(`  ${theme.padEnd(25)} ${puzzles.length.toLocaleString()} puzzles`);
}
