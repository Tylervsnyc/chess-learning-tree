/**
 * Add missing review/mixed lessons to lesson-puzzle-sets.json
 *
 * Review lessons (.R and .M suffixes) were not generated for Levels 1-3.
 * This script adds them by selecting puzzles from the same module's regular lessons.
 */

const fs = require('fs');
const path = require('path');

// Load current puzzle sets
const dataPath = path.join(__dirname, '..', 'data', 'lesson-puzzle-sets.json');
const lessonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Get all existing lesson IDs
const existingLessonIds = new Set(lessonData.map(l => l.lessonId));

// Define the missing review lessons for Level 1
// Format: { lessonId, lessonName, sourceModuleLessons, mixedThemes }
const missingReviewLessons = [
  {
    lessonId: '1.1.R',
    lessonName: 'Module 1 Review: Best Move',
    sourceModuleLessons: ['1.1.1', '1.1.2', '1.1.3'],
    mixedThemes: ['fork', 'discoveredAttack', 'skewer'],
    ratingRange: '400-700'
  },
  {
    lessonId: '1.2.M',
    lessonName: 'Mixed Practice: Mate in 1',
    sourceModuleLessons: ['1.2.1', '1.2.2', '1.2.3'],
    mixedThemes: ['mateIn1'],
    ratingRange: '400-600'
  },
  {
    lessonId: '1.2.R',
    lessonName: 'Module 2 Review: Best Move',
    sourceModuleLessons: ['1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.2.5', '1.2.6', '1.2.7', '1.2.8'],
    mixedThemes: ['mateIn1'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.3.R',
    lessonName: 'Module 3 Review: Best Move',
    sourceModuleLessons: ['1.3.1', '1.3.2', '1.3.3', '1.3.4', '1.3.5'],
    mixedThemes: ['backRankMate'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.4.M',
    lessonName: 'Mixed Practice: Knight Forks',
    sourceModuleLessons: ['1.4.1', '1.4.2', '1.4.3', '1.4.4'],
    mixedThemes: ['fork'],
    ratingRange: '400-750'
  },
  {
    lessonId: '1.4.R',
    lessonName: 'Module 4 Review: Best Move',
    sourceModuleLessons: ['1.4.1', '1.4.2', '1.4.3', '1.4.4', '1.4.5'],
    mixedThemes: ['fork'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.5.R',
    lessonName: 'Module 5 Review: Best Move',
    sourceModuleLessons: ['1.5.1', '1.5.2', '1.5.3', '1.5.4'],
    mixedThemes: ['fork'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.6.R',
    lessonName: 'Module 6 Review: Best Move',
    sourceModuleLessons: ['1.6.1', '1.6.2', '1.6.3', '1.6.4'],
    mixedThemes: ['pin', 'discoveredAttack'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.7.R',
    lessonName: 'Module 7 Review: Best Move',
    sourceModuleLessons: ['1.7.1', '1.7.2', '1.7.3'],
    mixedThemes: ['skewer'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.8.R',
    lessonName: 'Module 8 Review: Best Move',
    sourceModuleLessons: ['1.8.1', '1.8.2', '1.8.3'],
    mixedThemes: ['discoveredAttack'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.9.R',
    lessonName: 'Module 9 Review: Best Move',
    sourceModuleLessons: ['1.9.1', '1.9.2', '1.9.3', '1.9.4'],
    mixedThemes: ['mateIn2'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.10.R',
    lessonName: 'Module 10 Review: Best Move',
    sourceModuleLessons: ['1.10.1', '1.10.2', '1.10.3', '1.10.4', '1.10.5', '1.10.6'],
    mixedThemes: ['operaMate', 'pillsburysMate', 'smotheredMate', 'arabianMate', 'doubleBishopMate', 'hookMate'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.11.R',
    lessonName: 'Module 11 Review: Best Move',
    sourceModuleLessons: ['1.11.1', '1.11.2', '1.11.3'],
    mixedThemes: ['promotion'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.12.R',
    lessonName: 'Module 12 Review: Best Move',
    sourceModuleLessons: ['1.12.1', '1.12.2'],
    mixedThemes: ['deflection', 'attraction'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.13.R',
    lessonName: 'Module 13 Review: Best Move',
    sourceModuleLessons: ['1.13.1', '1.13.2', '1.13.3', '1.13.4'],
    mixedThemes: ['rookEndgame', 'pawnEndgame', 'queenEndgame'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.14.R',
    lessonName: 'Module 14 Review: Best Move',
    sourceModuleLessons: ['1.14.1', '1.14.2', '1.14.3', '1.14.4', '1.14.5'],
    mixedThemes: ['backRankMate', 'sacrifice', 'fork', 'mateIn2'],
    ratingRange: '400-800'
  },
  {
    lessonId: '1.15.R',
    lessonName: 'Module 15 Review: Best Move',
    sourceModuleLessons: ['1.15.1', '1.15.2'],
    mixedThemes: ['mateIn3'],
    ratingRange: '400-800'
  },
];

// Build a map of lesson ID to puzzle IDs
const lessonToPuzzles = {};
for (const lesson of lessonData) {
  lessonToPuzzles[lesson.lessonId] = lesson.puzzleIds || [];
}

// Generate review lessons
const newLessons = [];
for (const review of missingReviewLessons) {
  if (existingLessonIds.has(review.lessonId)) {
    console.log(`Skipping ${review.lessonId} - already exists`);
    continue;
  }

  // Collect puzzles from source lessons
  const allPuzzleIds = [];
  for (const sourceId of review.sourceModuleLessons) {
    const puzzles = lessonToPuzzles[sourceId] || [];
    allPuzzleIds.push(...puzzles);
  }

  // Remove duplicates
  const uniquePuzzleIds = [...new Set(allPuzzleIds)];

  // Select 6 puzzles evenly distributed
  let selectedPuzzles;
  if (uniquePuzzleIds.length <= 6) {
    selectedPuzzles = uniquePuzzleIds;
  } else {
    // Pick every Nth puzzle to get variety
    selectedPuzzles = [];
    const step = uniquePuzzleIds.length / 6;
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(i * step);
      selectedPuzzles.push(uniquePuzzleIds[index]);
    }
  }

  const newLesson = {
    lessonId: review.lessonId,
    lessonName: review.lessonName,
    puzzleIds: selectedPuzzles,
    puzzleCount: selectedPuzzles.length,
    criteria: {
      requiredTags: [],
      isMixedPractice: true,
      mixedThemes: review.mixedThemes,
      ratingRange: review.ratingRange
    }
  };

  newLessons.push(newLesson);
  console.log(`Created ${review.lessonId} with ${selectedPuzzles.length} puzzles`);
}

if (newLessons.length === 0) {
  console.log('\nNo new lessons to add.');
  process.exit(0);
}

// Insert new lessons in correct order
// We need to insert each review lesson after the last lesson of its module
for (const newLesson of newLessons) {
  // Extract module number (e.g., "1.1.R" -> "1.1")
  const parts = newLesson.lessonId.split('.');
  const modulePrefix = `${parts[0]}.${parts[1]}.`;

  // Find the last lesson of this module in the array
  let insertIndex = -1;
  for (let i = 0; i < lessonData.length; i++) {
    if (lessonData[i].lessonId.startsWith(modulePrefix) &&
        !lessonData[i].lessonId.includes('.R') &&
        !lessonData[i].lessonId.includes('.M')) {
      insertIndex = i + 1;
    }
  }

  // For mixed lessons (.M), insert after the third lesson
  if (newLesson.lessonId.endsWith('.M')) {
    // Find after the 3rd numbered lesson
    let count = 0;
    for (let i = 0; i < lessonData.length; i++) {
      if (lessonData[i].lessonId.startsWith(modulePrefix)) {
        count++;
        if (count === 3) {
          insertIndex = i + 1;
          break;
        }
      }
    }
  }

  if (insertIndex > 0) {
    lessonData.splice(insertIndex, 0, newLesson);
  } else {
    // Fallback: add at end
    lessonData.push(newLesson);
  }
}

// Write updated data
fs.writeFileSync(dataPath, JSON.stringify(lessonData, null, 2));
console.log(`\nUpdated ${dataPath}`);
console.log(`Total lessons: ${lessonData.length}`);
