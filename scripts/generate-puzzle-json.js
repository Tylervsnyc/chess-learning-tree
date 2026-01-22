const fs = require('fs');
const path = require('path');

const PUZZLES_DIR = path.join(__dirname, '..', 'data', 'puzzles-by-rating');
const LESSONS_FILE = path.join(__dirname, '..', 'data', 'lesson-puzzle-sets.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'lesson-puzzles-full.json');

// Load lesson data
const lessons = JSON.parse(fs.readFileSync(LESSONS_FILE, 'utf-8'));

// Collect all unique puzzle IDs
const allPuzzleIds = new Set();
for (const lesson of lessons) {
  if (lesson.puzzleIds && Array.isArray(lesson.puzzleIds)) {
    for (const id of lesson.puzzleIds) {
      allPuzzleIds.add(id);
    }
  }
}

console.log(`Found ${allPuzzleIds.size} unique puzzle IDs across ${lessons.length} lessons`);

// Load all puzzles from CSV files
const puzzleMap = new Map();
const brackets = fs.readdirSync(PUZZLES_DIR).filter(d => !d.endsWith('.csv'));

for (const bracket of brackets) {
  const bracketDir = path.join(PUZZLES_DIR, bracket);
  const files = fs.readdirSync(bracketDir).filter(f => f.endsWith('.csv'));

  for (const file of files) {
    const content = fs.readFileSync(path.join(bracketDir, file), 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      const parts = line.split(',');
      if (parts.length >= 9 && allPuzzleIds.has(parts[0])) {
        puzzleMap.set(parts[0], {
          puzzleId: parts[0],
          fen: parts[1],
          moves: parts[2],
          rating: parseInt(parts[3], 10),
          themes: parts[7].split(' '),
          url: parts[8],
        });
      }
    }
  }
  console.log(`Processed ${bracket}, found ${puzzleMap.size} puzzles so far`);
}

console.log(`\nTotal puzzles found: ${puzzleMap.size} / ${allPuzzleIds.size}`);

// Find missing puzzles
const missing = [];
for (const id of allPuzzleIds) {
  if (!puzzleMap.has(id)) {
    missing.push(id);
  }
}
if (missing.length > 0) {
  console.log(`Missing ${missing.length} puzzles:`, missing.slice(0, 10));
}

// Write output
const output = Object.fromEntries(puzzleMap);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`\nWrote ${puzzleMap.size} puzzles to ${OUTPUT_FILE}`);
