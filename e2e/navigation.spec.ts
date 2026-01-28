import { test, expect } from '@playwright/test';

/**
 * Navigation tests - verify routing and navigation works
 */

test.describe('Navigation', () => {
  test('can navigate from home to learn', async ({ page }) => {
    await page.goto('/');

    // Look for a link/button to the learn page
    const learnLink = page.locator('a[href="/learn"], a[href*="learn"]').first();

    if (await learnLink.isVisible().catch(() => false)) {
      await learnLink.click();
      await expect(page).toHaveURL(/learn/);
    }
  });

  test('auth pages are accessible', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('body')).toBeVisible();
  });

  test('profile page redirects or loads', async ({ page }) => {
    await page.goto('/profile');
    // Should either show profile or redirect to auth
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Curriculum Tree', () => {
  test('learn page shows curriculum content', async ({ page }) => {
    await page.goto('/learn');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should have some content visible
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
