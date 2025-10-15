import { test, expect } from '@playwright/test';

test.describe('Sing Up Page Tests - NaviJapan', () => {
  const baseUrl = 'https://app.navijapan.ai';
  const firstName="JayK";
  const lastName="Singh";
  const validEmail = 'playwrightTest@yopmail.com';
  const phoneNumber="9528968142";

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
  });

  
test('Should signUp successfully with valid email, then verify signout flow', async ({ page }) => {
  // Step 1: Open login page
  await page.goto(`${baseUrl}/login`);

    // Step 2: click signup tab
   await page.getByRole('link', { name: 'Sign Up' }).first().click();



  // Step 2: Enter valid first name , last name ,email, phone number
  await page.getByRole('textbox',{name:'First name'}).fill(firstName);
  await page.getByRole('textbox',{name:'Last name'}).fill(lastName);
  await page.getByRole('textbox',{name:'Email' }).fill(validEmail);
  await page.getByRole('textbox',{name:'Phone Number'}).fill(phoneNumber);




  //step 3: clicck on check boxs
  await page.getByRole('checkbox', { name: 'I agree to the Terms of Service and Privacy Policy' }).check();
  await page.getByRole('checkbox', { name: 'I want to receive updates about scholarships and programs' }).check();



  // step4: click on create Account  button
  await page.getByRole('button', { name: 'Create Account' }).click();

});

});
