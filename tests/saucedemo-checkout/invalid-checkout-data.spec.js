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
  test('Invalid checkout data is rejected with clear validation feedback', async ({ page }) => {
    // 1. Submit punctuation-only names and a non-postal value.
    await signIn(page);
    await addToCart(page, 'backpack');
    await openCart(page);
    await startCheckout(page);
    await fillCheckoutInformation(page, '!!!', '@@@', 'abc');
    await continueCheckout(page);

    // Invalid values must produce feedback and must not reach the overview.
    await expect.soft(page.locator('[data-test="error"]')).toBeVisible();
    await expect.soft(page.locator('[data-test="error"]')).toContainText(/invalid|valid|postal|name/i);
    await expect.soft(page).toHaveURL(/checkout-step-one\.html/);

    // 2. Correct the data and verify valid information advances to the overview.
    if (await page.locator('#first-name').isVisible()) {
      await fillCheckoutInformation(page, 'Ava', 'Tester', '12345');
      await continueCheckout(page);
    } else {
      await page.goBack();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
      await fillCheckoutInformation(page, 'Ava', 'Tester', '12345');
      await continueCheckout(page);
    }
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
  });
});
