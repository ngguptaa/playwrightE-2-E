import { test, expect } from '@playwright/test';

test.describe('Login Page Tests - NaviJapan', () => {
  const baseUrl = 'https://app.navijapan.ai';
  const validEmail = 'student-acumen@yopmail.com';
  const validOtp = '123456';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
  });

  test('Should show validation error for empty email', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('Should show validation error for invalid email (missing username)', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('@');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('Should show validation error for invalid email (missing @ symbol)', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill('nfjgh.com');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

test('Should login successfully with valid email and OTP, then verify signout flow', async ({ page }) => {
  // Step 1: Open login page
  await page.goto(`${baseUrl}/login`);

  // Step 2: Enter valid email
  await page.getByRole('textbox', { name: 'Enter your email' }).fill(validEmail);
  await page.getByRole('button', { name: 'Login' }).click();

  // Step 3: Wait for OTP input to appear and fill
  await page.locator('input[data-input-otp="true"]').fill(validOtp);

  // Step 4: Click Verify Code and wait for navigation
  await Promise.all([
    page.waitForNavigation({ url: baseUrl }),
    page.getByRole('button', { name: /verify code/i }).click()
  ]);

  // Step 5: Verify redirected to dashboard
  await expect(page).toHaveURL(baseUrl);

  // Step 6: Handle tour guide popup if present
  const closeGuideButton = page.locator('.driver-popover-close-btn');
  try {
    await closeGuideButton.click({ timeout: 2000 });
  } catch (error) {
    // Ignore if popup is not present
  }

  // Step 7: Open settings and verify sign out button
  await page.getByText('Settings').click();
  await expect(page.getByText('Sign out')).toBeVisible();

  // Step 8: Test sign out dialog
  await page.getByText('Sign out').click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // Step 9: Test Cancel button
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(`${baseUrl}/settings`);

  // Step 10: Complete sign out
  await page.getByText('Sign out').click();
  await expect(dialog).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ url: `${baseUrl}/login` }),
    page.getByRole('button', { name: 'Sign Out' }).click()
  ]);

  // Step 11: Verify redirect to login page
  await expect(page).toHaveURL(`${baseUrl}/login`);
});


  test('Should logout successfully after login', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(validEmail);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox').fill(validOtp);
    await page.getByRole('button', { name: 'Verify Code' }).click();

    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

    await page.getByRole('button', { name: 'Sign out' }).click();
    if (await page.getByRole('button', { name: 'Sign Out' }).isVisible()) {
      await page.getByRole('button', { name: 'Sign Out' }).click();
    }
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page).toHaveURL(baseUrl);
  });
});
