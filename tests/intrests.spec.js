import { test, expect } from '@playwright/test';

test.describe("Intrest-form - NaviJapan", async ()=>{
  const baseUrl = "https://app.navijapan.ai";
  const validEmail = "student-acumen@yopmail.com";
  const validOtp = "123456";

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
  });

  
  test('Fill and submit interests profile form', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page
      .getByRole("textbox", { name: "Enter your email" })
      .fill(validEmail);
    await page.getByRole("button", { name: "Login" }).click();
    await page.locator('input[data-input-otp="true"]').fill(validOtp);

    await Promise.all([
      page.waitForNavigation({ url: baseUrl }),
      page.getByRole("button", { name: /verify code/i }).click(),
    ]);

    await expect(page).toHaveURL(baseUrl);

    const closeGuideButton = page.locator(".driver-popover-close-btn");
    try {
      await closeGuideButton.click({ timeout: 2000 });
    } catch (error) {
      // Ignore if popup not present
    }

    // Step 3: Go to Profile Page
    await page.getByText("Me", { exact: true }).click();
    await expect(page).toHaveURL(/profile/i);

    await page.getByRole('tab', { name: 'Interests' }).click();


  const academicInterestsSection = page.locator('text=Academic Interests').locator('..');
  const academicButtons = academicInterestsSection.locator('button[type="button"]');
  await academicButtons.nth(0).click();
  await academicButtons.nth(1).click();

  const activitiesSection = page.locator('text=Extracurricular Activities').locator('..');
  const activityButtons = activitiesSection.locator('button[type="button"]');
  await activityButtons.nth(0).click();
  await activityButtons.nth(2).click();

  const hobbiesSection = page.locator('text=Hobbies & Personal Interests').locator('..');
  const hobbyButtons = hobbiesSection.locator('button[type="button"]');
  await hobbyButtons.nth(0).click();
  await hobbyButtons.nth(1).click();

  await page.getByPlaceholder(/JLPT N3, IELTS 7.5/).fill('JLPT N2, TOEFL 110');
  await page.getByPlaceholder(/Math Olympiad Gold Medal/).fill('Science Fair Winner 2024');
  await page.getByPlaceholder(/Google Analytics, Adobe Photoshop/).fill('AWS Certified, Python Certification');

  await page.getByPlaceholder(/What do you want to achieve in your career/).fill('I want to become a software engineer specializing in AI and machine learning technologies.');
  await page.getByPlaceholder(/What motivates you to study in Japan/).fill('Japan has excellent technology education, innovative research opportunities, and rich cultural heritage.');

  const citiesSection = page.locator('text=Preferred Cities in Japan').locator('..');
  const cityButtons = citiesSection.locator('button[type="button"]');
  await cityButtons.nth(0).click();
  await cityButtons.nth(1).click();

  const universitySection = page.locator('text=Preferred University Type').locator('..');
  const universityButtons = universitySection.locator('button[type="button"]');
  await universityButtons.nth(0).click();

  const submitButton = page.getByRole('button', { name: /Save Interests Profile/i });
  await submitButton.click();

  await expect(page.getByRole('button', { name: /Interest Saved!/i })).toBeVisible({ timeout: 10000 });
  
  const successButton = page.getByRole('button', { name: /Interest Saved!/i });
  await expect(successButton).toHaveClass(/bg-green-600/);

  console.log('✅ Form submitted successfully!');
});

})

