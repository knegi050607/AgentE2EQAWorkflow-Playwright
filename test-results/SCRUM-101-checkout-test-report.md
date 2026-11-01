# SCRUM-101 Checkout Test Report

## 1. Executive Summary

- **Planned scenarios:** 8
- **Executed scenarios:** 8 exploratory scenarios and 8 automated scenarios
- **Automated browser runs:** 24 (8 scenarios each in Chromium, Firefox, and WebKit)
- **Automated result:** 12 passed, 12 failed
- **Overall status:** **FAIL** — four application requirements were not met. The failures were reproduced in all three browser projects and preserved in the tests.

## 2. Manual Test Results

Manual exploratory testing was performed against `https://www.saucedemo.com` using the account configured in the local test environment. The checkout-information and overview screens were also inspected at a 390 × 844 CSS-pixel viewport.

| Scenario | Status | Result |
|---|---|---|
| Cart review | Partial | Item names, descriptions, quantities, prices, and navigation were present; no cart total was displayed. |
| Required checkout fields | Pass | Empty form, missing last name, and missing postal code each produced the corresponding required-field message. |
| Order overview | Pass | Payment, shipping, item subtotal, tax, total, and order actions were present. Two-item values were $39.98 + $3.20 = $43.18. |
| Order completion | Pass | Confirmation and Back Home appeared; the cart was empty after returning home. |
| Invalid checkout data | Fail | Punctuation-only names and a non-postal value were accepted and advanced to the overview. |
| Cancel and browser navigation | Partial | Information-step Cancel returned to Cart with items preserved. Overview Cancel returned to Products instead of Cart. Back/Forward between checkout steps worked. |
| Authentication and empty-cart guard | Partial | Logged-out direct access redirected to login. An authenticated empty cart could proceed to the overview and finish a zero-value order. |
| Mobile checkout | Pass | No horizontal overflow was observed; fields and overview actions remained visible and usable. |

Detailed execution notes are in [SCRUM-101-exploratory-results.md](./SCRUM-101-exploratory-results.md).

### Screenshots

- [Two-item cart](./screenshots/cart-two-items.png)
- [Required-field error](./screenshots/checkout-required-field-error.png)
- [Checkout overview](./screenshots/checkout-overview.png)
- [Order confirmation](./screenshots/order-confirmation.png)
- [Empty-cart overview](./screenshots/empty-cart-overview.png)
- [Invalid data accepted](./screenshots/invalid-data-accepted.png)
- [Mobile checkout information](./screenshots/mobile-checkout-information.png)
- [Mobile checkout overview](./screenshots/mobile-checkout-overview.png)

## 3. Automated Test Results

The eight suites were run against the existing Chromium, Firefox, and WebKit projects. The initial Chromium run reported 2 passed and 6 failed. Two failures were caused by tests using heading-role locators where the application exposes generic text; those selectors were corrected without changing business assertions.

| Browser project | Passed | Failed | Result |
|---|---:|---:|---|
| Chromium | 4 | 4 | Four confirmed requirement failures |
| Firefox | 4 | 4 | Four confirmed requirement failures |
| WebKit (Safari engine) | 4 | 4 | Four confirmed requirement failures |
| **Total** | **12** | **12** | **Four scenarios pass and four fail in each browser** |

Passing scenarios in each browser:

- Required checkout fields
- Order overview totals and actions
- Order completion and cart clearing
- Mobile checkout layout

Failing scenarios in each browser:

- Cart review total
- Invalid checkout data validation
- Checkout cancellation from overview
- Empty-cart checkout guard

### Healing activities

- The configured `playwright-test-generator` and `playwright-test-healer` agents could not start because their agent definitions pin the unavailable model `Claude Sonnet 4.6`.
- Tests were generated using a direct implementation fallback with shared checkout helpers and stable selectors.
- Test-side heading-role locator errors were corrected to match the observed generic page-title text.
- The final Chromium/Firefox/WebKit run verified that remaining failures are the same four documented application defects. Their assertions were retained; no failures were hidden or marked skipped.

## 4. Defects and Requirement Gaps

### DEF-1: Cart does not display a calculated total

- **Requirement:** AC1 requires a total price calculation on the cart page.
- **Steps:** Sign in, add Sauce Labs Backpack and Sauce Labs Bike Light, open Cart.
- **Expected:** Cart shows the item total ($39.98).
- **Actual:** Cart shows product details and prices but no total.
- **Evidence:** [Two-item cart screenshot](./screenshots/cart-two-items.png)

### DEF-2: Invalid non-empty checkout data is accepted

- **Requirement:** AC5 requires invalid data to show validation and prevent continuation.
- **Steps:** In Checkout: Your Information, enter punctuation-only names and a non-postal value, then Continue.
- **Expected:** Validation feedback appears and the user remains on the information step.
- **Actual:** The overview opens without a validation message.
- **Evidence:** [Invalid data screenshot](./screenshots/invalid-data-accepted.png)

### DEF-3: Empty cart can be submitted as an order

- **Requirement:** Business rule 3 says checkout cannot proceed with an empty cart.
- **Steps:** Sign in with an empty cart, select Checkout, enter non-empty information, Continue, then Finish.
- **Expected:** Checkout is blocked while the cart is empty.
- **Actual:** The application permits a $0.00 overview and order confirmation.
- **Evidence:** [Empty-cart overview screenshot](./screenshots/empty-cart-overview.png)

### DEF-4: Overview Cancel navigates to Products rather than Cart

- **Requirement:** Business rule 5 says users can cancel checkout and return to Cart.
- **Steps:** Add an item, proceed through checkout to the overview, select Cancel.
- **Expected:** Cart opens and the item remains available.
- **Actual:** Products opens instead.

## 5. Test Coverage Analysis

| Acceptance criteria / business rule | Coverage |
|---|---|
| AC1 Cart review and total | Cart item details and navigation verified; total assertion fails because the total is absent. |
| AC2 Required checkout fields | All three required-field messages and successful continuation verified. |
| AC3 Order overview | Items, payment, shipping, subtotal, tax, total, Cancel, and Finish verified. |
| AC4 Order completion | Confirmation, Back Home, and cart clearing verified. |
| AC5 Invalid-data handling | Tests verify invalid values are rejected; the application currently accepts them. |
| Business rule 2 Authentication | Logged-out direct checkout access redirects to login. |
| Business rule 3 Non-empty cart | Empty cart can proceed; test fails as expected. |
| Business rule 5 Cancellation | Information-step cancel passes; overview cancel returns to the wrong page. |
| Technical note: mobile responsiveness | Manual and automated 390 × 844 viewport checks pass. |
| Technical note: browser coverage | Automation executed in Chromium, Firefox, and WebKit. |

## 6. Summary and Recommendations

The standard checkout path, required-field handling, overview calculations, order confirmation, and mobile layout passed. The checkout flow has four reproducible requirement gaps: missing cart total, absent format validation, empty-cart order completion, and overview cancellation to the wrong destination. Resolve these defects before treating checkout as ready for release, then rerun the preserved regression assertions across all three browser projects.

## Environment

- Application: SauceDemo (`https://www.saucedemo.com`)
- Playwright: 1.64.1
- Browser projects: Chromium, Firefox, WebKit
- Manual viewport: 390 × 844 CSS pixels
- Test credentials: supplied via `SAUCEDEMO_USERNAME` and `SAUCEDEMO_PASSWORD`; values are not stored in reports or test source.
- Execution date: 2026-11-01
