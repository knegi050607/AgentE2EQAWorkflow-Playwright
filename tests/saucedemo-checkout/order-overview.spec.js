// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');
const {
  addToCart,
  continueCheckout,
  fillCheckoutInformation,
  openCart,
  products,
  signIn,
  startCheckout,
} = require('./checkout-helpers');

test.describe('SauceDemo checkout', () => {
  test('Order overview shows items, payment, shipping, subtotal, tax, and total', async ({ page }) => {
    // 1. Add two items and advance through valid checkout information.
    await signIn(page);
    await addToCart(page, 'backpack', 'bikeLight');
    await openCart(page);
    await startCheckout(page);
    await fillCheckoutInformation(page);
    await continueCheckout(page);
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();

    // 2. Verify both item rows, order details, and the calculated summary.
    const overviewItems = page.locator('.cart_item');
    await expect(overviewItems).toHaveCount(2);
    for (const product of Object.values(products)) {
      const item = overviewItems.filter({ hasText: product.name });
      await expect(item).toHaveCount(1);
      await expect(item.locator('.inventory_item_price')).toHaveText(product.price);
      await expect(item.locator('.cart_quantity')).toHaveText('1');
    }
    await expect(page.getByText('Payment Information:')).toBeVisible();
    await expect(page.getByText('Shipping Information:')).toBeVisible();
    await expect(page.getByText('Item total: $39.98')).toBeVisible();
    await expect(page.getByText('Tax: $3.20')).toBeVisible();
    await expect(page.getByText('Total: $43.18')).toBeVisible();

    // 3. Verify the order actions are available.
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
  });
});
