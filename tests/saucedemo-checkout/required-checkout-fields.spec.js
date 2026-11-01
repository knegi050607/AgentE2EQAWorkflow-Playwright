// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');
const {
  addToCart,
  continueCheckout,
  fillCheckoutInformation,
  openCart,
  signIn,
  startCheckout,
} = require('./checkout-helpers');

test.describe('SauceDemo checkout', () => {
  test('Checkout requires each information field before continuing', async ({ page }) => {
    // 1. Sign in, add an item, and open the checkout information page.
    await signIn(page);
    await addToCart(page, 'backpack');
    await openCart(page);
    await startCheckout(page);
    await expect(page.getByText('Checkout: Your Information', { exact: true })).toBeVisible();
    await expect(page.locator('#first-name')).toBeVisible();
    await expect(page.locator('#last-name')).toBeVisible();
    await expect(page.locator('#postal-code')).toBeVisible();

    // 2. Submit the empty form and verify the first required field is identified.
    await continueCheckout(page);
    await expect(page.getByText('Error: First Name is required')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 3. Enter only a first name and verify the last-name error.
    await page.locator('#first-name').fill('Ava');
    await continueCheckout(page);
    await expect(page.getByText('Error: Last Name is required')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 4. Enter a last name but leave the postal code empty.
    await page.locator('#last-name').fill('Tester');
    await continueCheckout(page);
    await expect(page.getByText('Error: Postal Code is required')).toBeVisible();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 5. Complete all fields and verify the checkout overview is displayed.
    await fillCheckoutInformation(page, 'Ava', 'Tester', '12345');
    await continueCheckout(page);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
  });
});
