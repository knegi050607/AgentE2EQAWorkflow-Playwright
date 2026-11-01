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
  test('Cancel checkout returns to cart and browser back preserves a usable flow', async ({ page }) => {
    // 1. Start checkout and enter partial information while retaining the cart item.
    await signIn(page);
    await addToCart(page, 'backpack');
    await openCart(page);
    await startCheckout(page);
    await page.locator('#first-name').fill('Ava');
    await expect(page.locator('#first-name')).toHaveValue('Ava');

    // 2. Cancel the information step and verify the cart item remains.
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');

    // 3. Reopen checkout, navigate back and forward, then verify overview Cancel returns to Cart.
    await startCheckout(page);
    await fillCheckoutInformation(page);
    await continueCheckout(page);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await page.goBack();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.locator('#first-name')).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect.soft(page).toHaveURL(/cart\.html/);
    await expect.soft(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
  });
});
