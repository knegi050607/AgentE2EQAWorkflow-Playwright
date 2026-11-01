const APP_URL = 'https://www.saucedemo.com';
const CHECKOUT_INFO_URL = `${APP_URL}/checkout-step-one.html`;

const products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    addButton: '#add-to-cart-sauce-labs-backpack',
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
    addButton: '#add-to-cart-sauce-labs-bike-light',
  },
};

async function signIn(page) {
  const username = process.env.SAUCEDEMO_USERNAME;
  const password = process.env.SAUCEDEMO_PASSWORD;
  if (!username || !password) {
    throw new Error('Set SAUCEDEMO_USERNAME and SAUCEDEMO_PASSWORD before running checkout tests.');
  }

  await page.goto(APP_URL);
  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#login-button').click();
  await page.waitForURL(/inventory\.html/);
}

async function addToCart(page, ...items) {
  for (const item of items) {
    await page.locator(products[item].addButton).click();
  }
}

async function openCart(page) {
  await page.locator('.shopping_cart_link').click();
  await page.waitForURL(/cart\.html/);
}

async function startCheckout(page) {
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.waitForURL(/checkout-step-one\.html/);
}

async function fillCheckoutInformation(page, firstName = 'Ava', lastName = 'Tester', postalCode = '12345') {
  await page.locator('#first-name').fill(firstName);
  await page.locator('#last-name').fill(lastName);
  await page.locator('#postal-code').fill(postalCode);
}

async function continueCheckout(page) {
  await page.getByRole('button', { name: 'Continue' }).click();
}

module.exports = {
  APP_URL,
  CHECKOUT_INFO_URL,
  products,
  signIn,
  addToCart,
  openCart,
  startCheckout,
  fillCheckoutInformation,
  continueCheckout,
};
