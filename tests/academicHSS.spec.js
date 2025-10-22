import { test, expect } from "@playwright/test";

test.describe("academic High School Student Page Test - Navijapan", () => {
  const baseUrl = "https://app.navijapan.ai";
  const validEmail = "student-acumen@yopmail.com";
  const validOtp = "123456";

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
  });

  test("Should save academic High School Student successfully after filling all fields", async ({
    page,
  }) => {
    // Step 1: Login
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
 await page.waitForSelector('text=Me', { state: 'visible', timeout: 30000 });
await page.getByText("Me", { exact: true }).click();
await expect(page).toHaveURL(/profile/i);

 // Step 3: Go to acadmic Page
const academicTab = page.getByRole('tab', { name: 'Academic' });
await academicTab.waitFor({ state: 'visible', timeout: 10000 });
await academicTab.click();


// Step 4: fill academic input field data
await page.getByPlaceholder("University of California, Berkeley").fill("University of Tokyo");
await page.getByPlaceholder("Bachelor of Science in Computer Science").fill("BTech Computer Science");
const currentYearDropdown = page.getByRole('combobox', { name: 'Current Year *' });
await currentYearDropdown.click();

// Wait for options to be visible and select one
await page.getByRole('option', { name: 'First Year' }).click();

const gradingScaleDropdown = page.getByRole('combobox', { name: 'Grading Scale' });
await gradingScaleDropdown.click();
// Wait for and select the option
await page.getByRole('option', { name: '4.0 Scale' }).click();

await page.getByPlaceholder('3.7').fill('4.0');
await page.getByPlaceholder('Computer Science & Engineering').fill('Computer Science');
await page.getByPlaceholder('Artificial Intelligence').fill('AI');
await page.setInputFiles('input[type="file"]', 'tests/doc.png', { timeout: 5000 });
await page.getByRole('button', { name: 'Save Academic Profile' }).click();


  });
});
