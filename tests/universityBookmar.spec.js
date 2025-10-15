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

  //step 3: click Universities icon 
    await page.locator('button:has(span:text("Universities"))').click();


    // step 4: Find the university card by its name
const universityCard = page.getByRole('heading', { name: 'Nagoya University' }).locator('..').locator('..');
const bookmarkBtn = universityCard.getByRole('button', { name: 'Remove bookmark' });
const isPressed = await bookmarkBtn.getAttribute('aria-pressed');
if (isPressed === 'false') {
  await bookmarkBtn.click();
}

    




  // Step 4: Open settings and verify sign out button
  await page.getByText('Settings').click();
  await expect(page.getByText('Sign out')).toBeVisible();

  // Step 5: Test sign out dialog
  await page.getByText('Sign out').click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();


  // Step 6: Complete sign out
  await page.getByText('Sign out').click();
  await expect(dialog).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ url: `${baseUrl}/login` }),
    page.getByRole('button', { name: 'Sign Out' }).click()
  ]);

});


});
