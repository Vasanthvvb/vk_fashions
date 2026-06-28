# VkFashions Checkout Page

A modern, elegant checkout page with Google Pay integration, featuring a dark theme and gold accent colors.

## Features

- **Google Pay Integration** - Secure payments via Google Pay API (TEST mode)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme** - Sophisticated dark color scheme with gold accents
- **Form Validation** - Real-time input validation with visual feedback
- **Promo Codes** - Working promo code system (try: `SAVE10`, `SAVE20`, `FLAT25`)
- **Success Modal** - Beautiful order confirmation modal with order number
- **Smooth Animations** - Subtle animations and transitions throughout

## Getting Started

1. Simply open `index.html` in your web browser
2. No build process or dependencies required

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Or using PHP
php -S localhost:8000

# Or using Node.js (if you have it)
npx serve
```

Then visit `http://localhost:8000` in your browser.

## Google Pay Configuration

The checkout uses Google Pay API in **TEST** mode with Adyen as the payment gateway.

### Current Configuration:
- **Environment**: TEST
- **Gateway**: Adyen
- **Merchant ID**: ZohoCorp_Platform_TEST

### Supported Card Networks:
- Visa
- Mastercard
- American Express
- Discover
- JCB
- Interac

### To Switch to Production:
1. Update the `environment` in `getGooglePaymentsClient()` from `'TEST'` to `'PRODUCTION'`
2. Update the `merchantId` in `getGooglePaymentDataRequest()` with your actual Google merchant ID
3. Update the `gatewayMerchantId` with your production Adyen merchant ID

## Test Promo Codes

| Code | Discount |
|------|----------|
| `SAVE10` | 10% off |
| `SAVE20` | 20% off |
| `FLAT25` | $25 off |

## Project Structure

```
checkout-page/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Google Pay integration & functionality
└── README.md       # This file
```

## Design Highlights

- **Typography**: Fraunces (display) + Outfit (body) font pairing
- **Color Palette**: Deep charcoal (#0d0d0f) with gold (#c9a227) accents
- **Micro-interactions**: Hover effects, focus states, and loading animations
- **Trust Signals**: Security badges and payment icons

## Browser Support

- Chrome (latest) - Full Google Pay support
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing Google Pay

Since this is in TEST mode:
1. You can use any Google account to test
2. No real charges will be made
3. Payment tokens generated are for testing only

## License

MIT License - feel free to use this for your projects!
