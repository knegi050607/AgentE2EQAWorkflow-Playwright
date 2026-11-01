# SCRUM-101 Exploratory Test Results

## Execution details

- Application: https://www.saucedemo.com
- Browser: Chromium through the Playwright test MCP server
- Account: Configured through the test environment; credential values are not stored in this report.
- Mobile viewport checked: 390 × 844 CSS pixels
- Date: 2026-11-01

## Scenario results

| Scenario | Result | Observations |
|---|---|---|
| Cart review | Partial | Selected products, descriptions, prices, quantity, Continue Shopping, and Checkout were present. The cart did not display a calculated total. |
| Required checkout fields | Pass | Blank submission produced `Error: First Name is required`; subsequent submissions identified missing Last Name and Postal Code. Valid non-empty information advanced to the overview. |
| Order overview | Pass | Product rows, payment and shipping information, subtotal, tax, total, Cancel, and Finish were present. Backpack ($29.99) plus Bike Light ($9.99) displayed subtotal $39.98, tax $3.20, total $43.18. |
| Order completion | Pass | Finish displayed “Thank you for your order!” and Back Home. After returning home, the cart was empty. |
| Invalid checkout data | Fail | Punctuation-only first and last names and `abc` as postal code were accepted and advanced to the overview without a validation message. |
| Cancel and browser navigation | Partial | Cancel from the information step returned to Cart with the item retained. Cancel from the overview returned to Products instead of Cart. Browser Back/Forward between overview and information worked. |
| Authentication and empty-cart guard | Partial | Direct checkout navigation while logged out redirected to the login page. An empty cart still exposed Checkout and could advance through the overview to a successful zero-value order. |
| Mobile checkout | Pass | At 390 × 844, the information and overview steps remained usable. The overview had no horizontal document overflow; Cancel and Finish were within the viewport. |

## Defects and requirement gaps

1. **Cart total is not displayed.** The cart lists each selected product and price but has no subtotal or total, contrary to AC1.
2. **Invalid non-empty data is accepted.** Checkout does not reject punctuation-only names or a non-postal value, contrary to AC5.
3. **Empty cart can be checked out and completed.** The application allowed a zero-item overview with Item total $0, Tax $0.00, Total $0.00, and a Finish action, contrary to the empty-cart business rule.
4. **Overview Cancel does not return to Cart.** It navigates to Products, contrary to the stated cancel behavior.

## Evidence

- [Cart review with two products](./screenshots/cart-two-items.png)
- [Required-field error](./screenshots/checkout-required-field-error.png)
- [Order overview and totals](./screenshots/checkout-overview.png)
- [Order confirmation](./screenshots/order-confirmation.png)
- [Empty-cart overview](./screenshots/empty-cart-overview.png)
- [Invalid data accepted](./screenshots/invalid-data-accepted.png)
- [Mobile checkout information](./screenshots/mobile-checkout-information.png)
- [Mobile checkout overview](./screenshots/mobile-checkout-overview.png)
