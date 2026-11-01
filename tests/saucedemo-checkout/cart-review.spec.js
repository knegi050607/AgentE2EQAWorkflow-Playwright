// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');
const { addToCart, openCart, products, signIn } = require('./checkout-helpers');

test.describe('SauceDemo checkout', () => {
  test('Cart review displays products, quantities, prices, and navigation options', async ({ page }) => {
    // 1. Sign in, add the Backpack and Bike Light, and verify both were added.
    await signIn(page);
    await addToCart(page, 'backpack', 'bikeLight');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();
    await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();

    // 2. Open the cart and verify the selected products and their details.
    await openCart(page);
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    for (const product of Object.values(products)) {
      const item = cartItems.filter({ hasText: product.name });
      await expect(item).toHaveCount(1);
      await expect(item.locator('.inventory_item_name')).toHaveText(product.name);
      await expect(item.locator('.inventory_item_desc')).not.toBeEmpty();
      await expect(item.locator('.inventory_item_price')).toHaveText(product.price);
      await expect(item.locator('.cart_quantity')).toHaveText('1');
    }

    // 3. Verify navigation actions and the required cart total calculation.
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
    await expect(page.getByText('Item total: $39.98')).toBeVisible();

    // 4. Continue shopping and verify the cart still contains both products.
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await expect(page.locator('#remove-sauce-labs-backpack')).toBeVisible();
    await expect(page.locator('#remove-sauce-labs-bike-light')).toBeVisible();
  });
});
