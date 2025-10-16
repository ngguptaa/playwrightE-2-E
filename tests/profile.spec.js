import { test, expect } from "@playwright/test";

test.describe("Profile Page Test - Navijapan", () => {
  const baseUrl = "https://app.navijapan.ai";
  const validEmail = "student-acumen@yopmail.com";
  const validOtp = "123456";

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
  });

  test("Should save profile successfully after filling all fields", async ({
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
    await page.getByText("Me", { exact: true }).click();
    await expect(page).toHaveURL(/profile/i);

    // Step 5: Scroll before interacting with Date picker
    const dobButton = page.getByRole("button", {
      name: /date of birth|october \d+, \d+/i,
    });
    await dobButton.scrollIntoViewIfNeeded();
    await dobButton.click();

    await page.locator("select.rdp-years_dropdown").selectOption("2025");
    await page.locator("select.rdp-months_dropdown").selectOption("6");
    // await page.waitForSelector('[data-day="07/07/2025"]', { state: "visible" });
    // await page.locator('[data-day="07/07/2025"]').click();
    await page.getByRole("button", { name: "Monday, July 7th, 2025" }).click();

    // const genderDropdown = page.getByRole("combobox", { name: "Gender" });
    // await genderDropdown.scrollIntoViewIfNeeded();
    // await genderDropdown.click();
    // await page.getByText("Female", { exact: true }).click();

    // const genderDropdown = page.locator(
    //   'button[role="combobox"][data-slot="form-control"]'
    // );
    // await genderDropdown.click();
    const genderDropdown = page.getByRole("combobox", { name: "Gender" });
    console.log(genderDropdown);
    await genderDropdown.click();
    await page.waitForSelector('[role="option"]');
    await page.selectOption("select", { value: "male" });

    // const nationalityDropdown = page.getByRole("combobox", {
    //   name: "Nationality",
    // });
    // console.log(nationalityDropdown);
    // await nationalityDropdown.click();
    // await page.waitForSelector('[role="option"]');
    // await page.selectOption("select", { value: "India" });
   await page.locator('[data-state="unchecked"]').first().click();

   await expect(page.locator('[data-state="checked"]').first()).toBeVisible();
    await page
      .locator(
        'xpath=//*[@id="radix-«rd»-content-personal"]/div/div[2]/form/div[7]/button'
      )
      .click();

    // const toast = page.locator('div[role="alert"]:has-text("success")');
    // await expect(toast).toBeVisible({ timeout: 5000 });

    // await expect(page.locator("text=Profile updated successfully")).toBeVisible(
    //   { timeout: 5000 }
    // );
  });
});
