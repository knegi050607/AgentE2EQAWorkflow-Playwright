# SCRUM-101 SauceDemo Checkout Test Plan

## Application Overview

Validate the complete SauceDemo checkout journey against SCRUM-101, including cart review, mandatory information fields, order overview and totals, successful completion, validation failures, cancellation/navigation, authentication/cart guards, and responsive layout. Use the story's standard test account. Each test starts from a fresh browser context with a logged-out user unless stated otherwise.

## Test Scenarios

### 1. SauceDemo checkout

**Seed:** `tests/seed.spec.ts`

#### 1.1. Cart review displays products, quantities, prices, and navigation options

**File:** `tests/saucedemo-checkout/cart-review.spec.js`

**Steps:**
  1. Open https://www.saucedemo.com, sign in with the account configured through SAUCEDEMO_USERNAME and SAUCEDEMO_PASSWORD, and add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
    - expect: The products page shows both items as added and the cart badge count is 2.
  2. Open the cart.
    - expect: The cart lists both selected product names, descriptions, individual prices, and quantity 1 for each.
    - expect: The cart contents correspond exactly to the selected products.
  3. Review the cart controls and item prices.
    - expect: Continue Shopping and Checkout controls are available.
    - expect: The displayed item prices and quantities allow the cart subtotal to be calculated correctly.
  4. Select Continue Shopping.
    - expect: The products page is displayed and the cart retains both items.

#### 1.2. Checkout requires each information field before continuing

**File:** `tests/saucedemo-checkout/required-checkout-fields.spec.js`

**Steps:**
  1. Sign in, add one product to the cart, open the cart, and select Checkout.
    - expect: The Checkout: Your Information page is displayed with First Name, Last Name, and Zip/Postal Code fields.
  2. Leave all fields blank and select Continue.
    - expect: The page stays on the information step and an error identifies First Name as required.
  3. Enter a first name only and select Continue.
    - expect: The page stays on the information step and an error identifies Last Name as required.
  4. Enter a last name while leaving Zip/Postal Code blank and select Continue.
    - expect: The page stays on the information step and an error identifies Zip/Postal Code as required.
  5. Fill all fields with non-empty values and select Continue.
    - expect: The checkout overview is displayed.

#### 1.3. Order overview shows items, payment, shipping, subtotal, tax, and total

**File:** `tests/saucedemo-checkout/order-overview.spec.js`

**Steps:**
  1. Sign in and add Sauce Labs Backpack and Sauce Labs Bike Light to the cart. Open Checkout and enter valid first name, last name, and postal code.
    - expect: The checkout overview page is displayed.
  2. Review the overview item list and summary.
    - expect: Both selected products appear with correct quantities and prices.
    - expect: Payment and shipping information are displayed.
    - expect: Item total/subtotal, tax, and total are displayed.
    - expect: The total equals subtotal plus tax, subject to displayed currency rounding.
  3. Verify available order actions.
    - expect: Cancel and Finish controls are available.

#### 1.4. Finishing checkout confirms the order and clears the cart

**File:** `tests/saucedemo-checkout/order-completion.spec.js`

**Steps:**
  1. Sign in, add one product, open Checkout, enter valid information, and continue to the overview.
    - expect: The overview contains the expected item and order summary.
  2. Select Finish.
    - expect: The order confirmation page is displayed with a success message confirming the order.
    - expect: A Back Home control is available.
  3. Select Back Home and open the cart.
    - expect: The products page is displayed.
    - expect: The completed order's cart is empty and the cart badge has no item count.

#### 1.5. Invalid checkout data is rejected with clear validation feedback

**File:** `tests/saucedemo-checkout/invalid-checkout-data.spec.js`

**Steps:**
  1. Sign in, add one product, open Checkout, and enter punctuation-only names and a non-postal value in Zip/Postal Code.
    - expect: The application identifies invalid checkout information with an appropriate validation message.
    - expect: The user cannot proceed to the overview while the values are invalid.
  2. Replace the invalid values with valid non-empty checkout data and select Continue.
    - expect: The overview loads successfully after correcting the invalid values.

#### 1.6. Cancel checkout returns to cart and browser back preserves a usable flow

**File:** `tests/saucedemo-checkout/cancel-and-back-navigation.spec.js`

**Steps:**
  1. Sign in, add one product, open Checkout, and enter partial information.
    - expect: The information step is displayed with the cart item retained.
  2. Select Cancel.
    - expect: The cart page is displayed and the item remains in the cart.
  3. Open Checkout again, then use browser Back and Forward navigation.
    - expect: Navigation returns to the preceding page and can return to the checkout flow without losing the cart contents or producing a broken page.

#### 1.7. Checkout access requires authentication and a non-empty cart

**File:** `tests/saucedemo-checkout/access-guards.spec.js`

**Steps:**
  1. In a fresh logged-out browser context, navigate directly to the checkout information URL.
    - expect: The application requires login and does not expose the checkout form to a logged-out user.
  2. Sign in with the standard account and navigate to the cart with no products added.
    - expect: The cart is empty and Checkout is not available or cannot proceed.
  3. Attempt to navigate directly to the checkout information URL with an empty cart.
    - expect: The application prevents checkout from proceeding without cart items and presents a safe cart or products state.

#### 1.8. Checkout flow remains usable at a mobile viewport

**File:** `tests/saucedemo-checkout/mobile-checkout.spec.js`

**Steps:**
  1. Set a mobile viewport, sign in, add a product, open the cart, and start checkout.
    - expect: Cart and checkout controls remain visible and usable without horizontal overflow obscuring essential controls.
  2. Enter valid checkout information, continue, and review the order overview.
    - expect: All fields, order information, and Cancel/Finish controls remain readable and usable at the mobile viewport.
