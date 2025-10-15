import { test, expect } from '@playwright/test';

test.describe('University bookmark  Tests - NaviJapan', () => {
  const baseUrl = 'https://app.navijapan.ai';
  const validEmail = 'student-acumen@yopmail.com';
  const validOtp = '123456';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
  });

test('Should login successfully with valid email and OTP, then verify signout flow', async ({ page }) => {
  // Step 1: Open login page
  await page.goto(`${baseUrl}/login`);

  // Step 2: Enter valid email
  await page.getByRole('textbox', { name: 'Enter your email' }).fill(validEmail);
  await page.getByRole('button', { name: 'Login' }).click();
 
 
  //otp enter
    await page.locator('input[data-input-otp="true"]').fill(validOtp);
    await Promise.all([
    page.waitForNavigation({ url: baseUrl }),
    page.getByRole('button', { name: /verify code/i }).click()
  ]);
  await expect(page).toHaveURL(baseUrl);


   const closeGuideButton = page.locator('.driver-popover-close-btn');
  try {
    await closeGuideButton.click({ timeout: 2000 });
  } catch (error) {
    // Ignore if popup is not present
  }


  //step 3: click Universities icon 
   const universitiesBtn = page.locator('button:has(span:text("Universities"))');
// Wait for button to be visible, enabled, and not blocked
await universitiesBtn.waitFor({ state: 'visible', timeout: 150000 });
await page.waitForFunction(() => !document.body.classList.contains('driver-active'));
const closeBtn = page.locator('button:has-text("Close")');
if (await closeBtn.isVisible()) await closeBtn.click();
await universitiesBtn.click();





  // step 4: Find the university card by its name
await page.waitForSelector('h3:has-text("Tokyo")', { timeout: 15000 });
const bookmarkBtn = page.getByRole('button', { name: /bookmark/i });
await bookmarkBtn.first().waitFor({ state: 'visible', timeout: 15000 });
await bookmarkBtn.first().click();



 // Step 5: Open settings and verify sign out button
await page.getByRole('link', { name: 'Settings' }).click(); // safer than getByText
const signOutBtn = page.getByRole('button', { name: /^Sign Out$/i });
await expect(signOutBtn).toBeVisible();

// Step 6: Open the sign out confirmation dialog
await signOutBtn.click();

// Wait for the dialog to appear
const dialog = page.getByRole('alertdialog', { name: 'Sign Out' });
await expect(dialog).toBeVisible();

// Confirm buttons inside the dialog
const confirmSignOut = dialog.getByRole('button', { name: /^Sign Out$/i });
const cancelBtn = dialog.getByRole('button', { name: /^Cancel$/i });

await expect(confirmSignOut).toBeVisible();
await expect(cancelBtn).toBeVisible();

// Step 7: Complete sign out
await Promise.all([
  page.waitForNavigation({ url: `${baseUrl}/login` }),
  confirmSignOut.click(),
]);


});


});
