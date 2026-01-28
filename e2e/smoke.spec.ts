import { test, expect } from '@playwright/test';

/**
 * Smoke tests - verify basic pages load correctly
 */

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Chess/i);
  });

  test('learn page loads', async ({ page }) => {
    await page.goto('/learn');
    // Wait for the curriculum tree to render
    await expect(page.locator('body')).toBeVisible();
  });

  test('daily challenge page loads', async ({ page }) => {
    await page.goto('/daily-challenge');
    await expect(page.locator('body')).toBeVisible();
  });

  test('workout page loads', async ({ page }) => {
    await page.goto('/workout');
    await expect(page.locator('body')).toBeVisible();
  });
});
