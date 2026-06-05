/**
 * One-off: render a daily puzzle video from a specific daily-challenge puzzle.
 * Usage: npx tsx scripts/render-daily-video-from-id.ts <date> <indexFromOne>
 * Example: npx tsx scripts/render-daily-video-from-id.ts 2026-04-29 18
 */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Chess } from 'chess.js';
import { describeResult } from '../remotion/lib/describe-result';
import { getVideoQuip } from '../remotion/lib/video-quips';

const DAILY_FILE = path.join(process.cwd(), 'data', 'daily-challenge-puzzles.json');
const USAGE_FILE = path.join(process.cwd(), 'data', 'video-puzzle-usage.json');
const OUTPUT_DIR = path.join(process.cwd(), 'out', 'videos');
const ENTRY_POINT = path.join(process.cwd(), 'remotion', 'index.ts');

const PREFERRED = ['mateIn1','mateIn2','mateIn3','backRankMate','smotheredMate','fork','pin','skewer','sacrifice','discoveredAttack','kingsideAttack','queensideAttack','deflection','attraction'];

function main() {
  const [date, idxStr] = process.argv.slice(2);
  if (!date || !idxStr) { console.error('Usage: <YYYY-MM-DD> <indexFromOne>'); process.exit(1); }
  const idx = parseInt(idxStr, 10) - 1;

  const data = JSON.parse(fs.readFileSync(DAILY_FILE, 'utf-8'));
  const day = data.days[date];
  if (!day) { console.error(`No daily puzzles for ${date}`); process.exit(1); }
  const p = day[idx];
  if (!p) { console.error(`No puzzle at index ${idxStr} for ${date}`); process.exit(1); }

  const rawMoves: string[] = p.moves;
  const themes: string[] = p.themes;
  const primary = PREFERRED.find(t => themes.includes(t)) || themes[0];

  const setupUci = rawMoves[0];
  const chess = new Chess(p.fen);
  chess.move({ from: setupUci.slice(0,2), to: setupUci.slice(2,4), promotion: setupUci.length>4?setupUci[4]:undefined });
  const puzzleFen = chess.fen();
  const playerColor = chess.turn()==='w'?'white':'black';
  const solutionUci = rawMoves.slice(1);

  const finalChess = new Chess(puzzleFen);
  for (const u of solutionUci) {
    try { finalChess.move({ from: u.slice(0,2), to: u.slice(2,4), promotion: u.length>4?u[4]:undefined }); } catch { break; }
  }

  const result = describeResult(puzzleFen, finalChess.fen(), playerColor as 'white'|'black', themes, solutionUci);
  const quip = getVideoQuip(p.puzzleId, result, themes, primary);

  const now = new Date();
  const dateStr = `${now.getMonth()+1}.${now.getDate()}.${String(now.getFullYear()).slice(-2)}`;
  const dayDir = path.join(OUTPUT_DIR, dateStr);
  fs.mkdirSync(dayDir, { recursive: true });
  const outputFile = path.join(dayDir, `daily.${dateStr}-${p.puzzleId}.mp4`);

  const inputProps = {
    puzzleId: p.puzzleId,
    rawFen: p.fen,
    rawMoves,
    rating: p.rating,
    themes,
    quip,
  };
  const propsJson = JSON.stringify(inputProps);

  console.log(`Puzzle: ${p.puzzleId} rating ${p.rating} themes ${themes.join(',')}`);
  console.log(`Result: "${result.text}" (${result.category})`);
  console.log(`Quip: "${quip}"`);
  console.log(`Rendering -> ${outputFile}`);

  execSync(
    `npx remotion render ${ENTRY_POINT} DailyPuzzleVideo "${outputFile}" --props='${propsJson.replace(/'/g,"'\\''")}' --config=remotion.config.ts`,
    { stdio: 'inherit', timeout: 600000 },
  );

  // Mark used
  let usage: any = { usedPuzzleIds: [], renders: [] };
  if (fs.existsSync(USAGE_FILE)) usage = JSON.parse(fs.readFileSync(USAGE_FILE,'utf-8'));
  if (!usage.usedPuzzleIds.includes(p.puzzleId)) usage.usedPuzzleIds.push(p.puzzleId);
  usage.renders.push({ puzzleId: p.puzzleId, date: dateStr, file: path.basename(outputFile) });
  fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));

  console.log(`\nDone! ${outputFile}`);
}
main();
