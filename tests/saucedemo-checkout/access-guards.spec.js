// spec: specs/saucedemo-checkout-test-plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');
const { APP_URL, CHECKOUT_INFO_URL, signIn } = require('./checkout-helpers');

test.describe('SauceDemo checkout', () => {
  test('Checkout access requires authentication and a non-empty cart', async ({ page }) => {
    // 1. A logged-out user must be redirected away from direct checkout access.
    await page.goto(CHECKOUT_INFO_URL);
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page.locator('#first-name')).toHaveCount(0);

    // 2. Sign in with an empty cart and verify checkout cannot be started.
    await signIn(page);
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

    // If Checkout is exposed, check that it still blocks an empty-cart order.
    const checkoutButton = page.getByRole('button', { name: 'Checkout' });
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
      await expect.soft(page).not.toHaveURL(/checkout-step-one\.html|checkout-step-two\.html/);
    } else {
      await expect(checkoutButton).toHaveCount(0);
    }

    // 3. Direct checkout navigation must also keep an empty-cart user in a safe state.
    await page.goto(`${APP_URL}/checkout-step-one.html`);
    await expect.soft(page.getByText('Checkout: Your Information', { exact: true })).toHaveCount(0);
    await expect.soft(page).not.toHaveURL(/checkout-step-one\.html|checkout-step-two\.html/);
  });
});
