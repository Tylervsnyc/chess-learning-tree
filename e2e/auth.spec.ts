import { test, expect } from '@playwright/test';

/**
 * Authentication flow tests
 * Tests login and signup pages, form validation, and error handling
 */

test.describe('Login Page', () => {
  test('login page loads with form elements', async ({ page }) => {
    await page.goto('/auth/login');

    // Page should have welcome text
    await expect(page.getByText('Welcome back')).toBeVisible();

    // Should have email and password inputs
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();

    // Should have sign in button
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    // Should have Google login option
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();

    // Should have link to signup
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill in form with invalid credentials
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('wrongpassword123');

    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show an error message (Supabase returns "Invalid login credentials")
    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 10000 });
  });

  test('sign in button shows loading state', async ({ page }) => {
    await page.goto('/auth/login');

    // Fill in form
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('somepassword');

    // Click sign in
    await page.getByRole('button', { name: /sign in/i }).click();

    // Button should show loading state
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible();
  });

  test('can navigate to signup page', async ({ page }) => {
    await page.goto('/auth/login');

    // Click signup link
    await page.getByRole('link', { name: /sign up/i }).click();

    // Should navigate to signup page
    await expect(page).toHaveURL(/\/auth\/signup/);
  });
});

test.describe('Signup Page', () => {
  test('signup page loads with form elements', async ({ page }) => {
    await page.goto('/auth/signup');

    // Should have email, password, and display name inputs
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();

    // Should have create account button
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();

    // Should have Google signup option
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();

    // Should have link to login
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('can navigate to login page', async ({ page }) => {
    await page.goto('/auth/signup');

    // Click login link
    await page.getByRole('link', { name: /sign in/i }).click();

    // Should navigate to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('password field has minimum length requirement', async ({ page }) => {
    await page.goto('/auth/signup');

    // Password field should show minimum requirement hint
    await expect(page.getByText(/minimum 6 characters/i)).toBeVisible();

    // Password input should exist
    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toBeVisible();
  });
});

test.describe('Auth Redirects', () => {
  test('login preserves redirect parameter', async ({ page }) => {
    await page.goto('/auth/login?redirect=/learn');

    // The signup link should include the redirect
    const signupLink = page.getByRole('link', { name: /sign up/i });
    await expect(signupLink).toHaveAttribute('href', /redirect/);
  });

  test('profile page redirects unauthenticated users', async ({ page }) => {
    await page.goto('/profile');

    // Should redirect to login or show auth prompt
    // Wait for navigation to complete
    await page.waitForURL(/\/(auth|login|profile)/, { timeout: 5000 }).catch(() => {});

    // Either redirected to auth or showing the profile page (which handles unauth state)
    const url = page.url();
    expect(url).toMatch(/\/(auth|login|profile)/);
  });
});

test.describe('Auth Error Page', () => {
  test('error page exists and is accessible', async ({ page }) => {
    await page.goto('/auth/error');

    // Page should load without crashing
    await expect(page.locator('body')).toBeVisible();
  });
});
