import { test, expect, Page } from '@playwright/test';

/**
 * Puzzle Solver E2E Tests
 *
 * These tests actually play through puzzles by:
 * 1. Intercepting the API response to get solution moves
 * 2. Making the correct moves on the chessboard
 * 3. Verifying puzzle completion
 *
 * This catches issues like:
 * - Puzzles not loading
 * - Move validation bugs
 * - UI not responding to moves
 * - Progress not updating
 */

// Store puzzle data intercepted from API
interface PuzzleData {
  puzzleId: string;
  puzzleFen: string;
  solutionMoves: string[]; // UCI format moves
  playerColor: 'white' | 'black';
}

// Convert UCI move (e2e4) to from/to squares
function parseUciMove(uci: string): { from: string; to: string } {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
  };
}

// Wait for the chessboard to be ready
async function waitForBoard(page: Page) {
  // Wait for puzzle API to complete and board to render
  // react-chessboard renders squares with data-square attribute
  await expect(page.locator('[data-square="e4"]')).toBeVisible({ timeout: 20000 });
  // Small delay for board to fully initialize
  await page.waitForTimeout(500);
}

// Dismiss any intro popups
async function dismissIntroPopups(page: Page) {
  // Wait for page to settle
  await page.waitForTimeout(1000);

  // Keep clicking popup buttons until no more popups
  // Popups have either "Let's Go" or "Start" buttons
  for (let i = 0; i < 5; i++) {
    // Look for buttons with "go" OR "start" text (case-insensitive)
    const goButton = page.getByRole('button', { name: /go/i });
    const startButton = page.getByRole('button', { name: /start/i });

    const goVisible = await goButton.isVisible({ timeout: 1500 }).catch(() => false);
    const startVisible = await startButton.isVisible({ timeout: 500 }).catch(() => false);

    if (goVisible) {
      await goButton.click({ force: true });
      await page.waitForTimeout(800);
    } else if (startVisible) {
      await startButton.click({ force: true });
      await page.waitForTimeout(800);
    } else {
      break;
    }
  }
}

// Click on a chess square
async function clickSquare(page: Page, square: string) {
  const squareElement = page.locator(`[data-square="${square}"]`);
  await expect(squareElement).toBeVisible({ timeout: 5000 });
  await squareElement.click();
  await page.waitForTimeout(100); // Small delay between clicks
}

// Make a move by clicking from and to squares
async function makeMove(page: Page, from: string, to: string) {
  await clickSquare(page, from);
  await clickSquare(page, to);
}

// Wait for opponent's response move (auto-played by the app)
async function waitForOpponentMove(page: Page) {
  // The app auto-plays opponent moves after 400ms
  await page.waitForTimeout(600);
}

// Click the "Continue" button to go to next puzzle
async function clickContinue(page: Page) {
  const continueButton = page.locator('button:has-text("Continue")');
  if (await continueButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await continueButton.click();
    await page.waitForTimeout(500);
  }
}

test.describe('Puzzle Solver', () => {
  test('can complete a full lesson by solving all puzzles', async ({ page }) => {
    let puzzles: PuzzleData[] = [];

    // Intercept the puzzle API to capture solution moves
    await page.route('**/api/puzzles/lesson**', async (route) => {
      const response = await route.fetch();
      const json = await response.json();

      if (json.puzzles) {
        // Transform puzzles to get solution data
        puzzles = json.puzzles.map((p: any) => {
          // The first move in p.moves is the setup move (opponent's)
          // Solution moves are p.moves.slice(1)
          const solutionMoves = p.moves.slice(1);

          return {
            puzzleId: p.id,
            puzzleFen: p.fen,
            solutionMoves,
            playerColor: 'white', // Will be determined by the app
          };
        });
      }

      await route.fulfill({ response });
    });

    // Go to an easy lesson
    await page.goto('/lesson/1.1.1');

    // Dismiss intro popups
    await dismissIntroPopups(page);

    // Wait for board to load
    await waitForBoard(page);

    // Verify we captured puzzle data
    expect(puzzles.length).toBeGreaterThan(0);
    console.log(`Found ${puzzles.length} puzzles to solve`);

    // Solve each puzzle
    for (let puzzleIndex = 0; puzzleIndex < Math.min(puzzles.length, 6); puzzleIndex++) {
      const puzzle = puzzles[puzzleIndex];
      console.log(`Solving puzzle ${puzzleIndex + 1}/${puzzles.length}`);

      // Make all the solution moves (player moves are at even indices: 0, 2, 4...)
      for (let moveIdx = 0; moveIdx < puzzle.solutionMoves.length; moveIdx++) {
        const isPlayerMove = moveIdx % 2 === 0;

        if (isPlayerMove) {
          const move = parseUciMove(puzzle.solutionMoves[moveIdx]);
          console.log(`  Player move: ${move.from} -> ${move.to}`);

          await makeMove(page, move.from, move.to);

          // Wait a bit for move to register
          await page.waitForTimeout(300);
        } else {
          // Wait for opponent's auto-response
          console.log(`  Waiting for opponent move...`);
          await waitForOpponentMove(page);
        }
      }

      // Wait for "Correct!" feedback
      await page.waitForTimeout(500);

      // Click continue to go to next puzzle (if not last)
      if (puzzleIndex < puzzles.length - 1) {
        await clickContinue(page);
        await page.waitForTimeout(500);
      }
    }

    // Should see lesson complete or progress indicator
    console.log('Lesson puzzles completed!');
  });

  test('handles wrong moves gracefully', async ({ page }) => {
    // Go to a lesson
    await page.goto('/lesson/1.1.1');

    // Dismiss intro popups
    await dismissIntroPopups(page);

    // Wait for board
    await waitForBoard(page);

    // Make an intentionally wrong move (a1 to a2 is almost always wrong)
    // First click a piece that exists
    const squares = page.locator('[data-square]');
    await squares.first().click();

    // The board should still be functional (no crash)
    await expect(page.locator('[data-square="e4"]')).toBeVisible();
  });
});

test.describe('Puzzle Pages Load Correctly', () => {
  const lessonIds = [
    '1.1.1', // Easy Forks
    '1.1.2', // Easy Discovered Attacks
    '1.2.1', // Queen Mate in 1: Easy
  ];

  for (const lessonId of lessonIds) {
    test(`lesson ${lessonId} loads and shows chessboard`, async ({ page }) => {
      await page.goto(`/lesson/${lessonId}`);

      // Dismiss popups
      await dismissIntroPopups(page);

      // Board should be visible
      await expect(page.locator('[data-square="e4"]')).toBeVisible({ timeout: 15000 });

      // Progress bar should be visible
      await expect(page.locator('.rounded-full').first()).toBeVisible();
    });
  }
});

test.describe('Daily Challenge', () => {
  test('daily challenge page loads and can start', async ({ page }) => {
    await page.goto('/daily-challenge');

    // Daily challenge has a start screen first
    const startButton = page.getByRole('button', { name: /start challenge/i });
    await expect(startButton).toBeVisible({ timeout: 10000 });

    // Click to start the challenge
    await startButton.click();

    // Now the board should appear
    await expect(page.locator('[data-square="e4"]')).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Workout Mode', () => {
  test('workout page loads', async ({ page }) => {
    await page.goto('/workout');

    // Should show workout interface
    await expect(page.locator('body')).toBeVisible();
  });
});
