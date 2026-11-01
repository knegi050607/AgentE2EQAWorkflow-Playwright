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
  test('Finishing checkout confirms the order and clears the cart', async ({ page }) => {
    // 1. Create a one-item order and verify its overview.
    await signIn(page);
    await addToCart(page, 'backpack');
    await openCart(page);
    await startCheckout(page);
    await fillCheckoutInformation(page);
    await continueCheckout(page);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('.cart_item')).toContainText('Sauce Labs Backpack');
    await expect(page.getByText('Item total: $29.99')).toBeVisible();

    // 2. Finish the order and verify confirmation and the Back Home action.
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back Home' })).toBeVisible();

    // 3. Return home and verify the completed order cleared the cart.
    await page.getByRole('button', { name: 'Back Home' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
