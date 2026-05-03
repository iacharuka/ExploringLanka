# ExploringLanka

A static Sri Lankan tourism marketplace website built with HTML5, CSS3, and vanilla JavaScript. It supports WhatsApp and email-based booking without a backend.

## Features

- Responsive premium tourism marketplace design
- Multi-page website: Home, Tours, Tour Details, Transfers, Custom Tour, About, Contact
- Tour marketplace cards
- WhatsApp booking flow
- Email booking flow
- Booking modal with form validation
- Custom tour request form
- Airport transfer quote form
- Contact form through WhatsApp/email
- Wishlist using localStorage
- Mobile navigation menu
- Floating WhatsApp button
- Back-to-top button
- Simple frontend tour search/filter on the tours page

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts
- Unsplash image URLs

## How to Run

Open `index.html` directly in your browser, or use VS Code Live Server.

## How to Update WhatsApp Number

Open `js/script.js` and change:

```js
const BUSINESS_WHATSAPP = "94700000000";
```

Use the number in international format without `+`.

## How to Update Email

Open `js/script.js` and change:

```js
const BUSINESS_EMAIL = "exploringlankaofficial@gmail.com";
```

## University Presentation Notes

This website is a frontend simulation of a Sri Lankan tourism marketplace. It does not use a backend, database, or payment gateway. Bookings are handled through WhatsApp and email, which is practical for small tourism businesses because the owner receives customer details directly.

The project demonstrates responsive design, semantic HTML, CSS Grid, Flexbox, JavaScript form handling, modal interactions, localStorage wishlist functionality, and real-world tourism booking user flow.

## Future Improvements

- Backend booking system
- Admin dashboard
- Payment gateway
- Real database
- User accounts
- Tour availability calendar
- Multilingual support
- Real CMS for tour content
