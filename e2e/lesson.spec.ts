import { test, expect, Page } from '@playwright/test';

/**
 * Lesson/Puzzle flow tests
 * Tests that users can start and interact with puzzles
 */

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

test.describe('Lesson Flow', () => {
  test('lesson page loads with chessboard', async ({ page }) => {
    // Navigate to an easy lesson (Easy Forks)
    await page.goto('/lesson/1.1.1');

    // Dismiss intro popups
    await dismissIntroPopups(page);

    // Wait for chessboard to render (react-chessboard renders squares with data-square)
    await expect(page.locator('[data-square="e4"]')).toBeVisible({ timeout: 20000 });
  });

  test('progress bar shows on lesson page', async ({ page }) => {
    await page.goto('/lesson/1.1.1');

    // Dismiss intro popups
    await dismissIntroPopups(page);

    // Progress bar should be visible
    await expect(page.locator('.rounded-full').first()).toBeVisible();
  });

  test('can close lesson and return to learn page', async ({ page }) => {
    await page.goto('/lesson/1.1.1');

    // Click the close button (X)
    await page.locator('button').filter({ hasText: '✕' }).click();

    // Should navigate back (to learn or previous page)
    await expect(page).not.toHaveURL('/lesson/1.1.1');
  });
});

test.describe('Puzzle Interaction', () => {
  test('chessboard squares are clickable', async ({ page }) => {
    await page.goto('/lesson/1.1.1');

    // Dismiss intro popups
    await dismissIntroPopups(page);

    // Wait for board
    await expect(page.locator('[data-square="e4"]')).toBeVisible({ timeout: 20000 });

    // Click on a square - the board should respond (squares have data-square attribute)
    const squares = page.locator('[data-square]');
    await expect(squares.first()).toBeVisible();

    // Clicking should not cause an error
    await squares.first().click();
  });
});
