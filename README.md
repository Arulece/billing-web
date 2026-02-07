# Desktop Hotel — Billing Web App

This repository contains a minimal scaffold for a mobile-first Hotel Billing web application using React functional components, Context API, and LocalStorage persistence.

Quick start (assuming existing React setup):

1. Wrap your application with `AppProvider` from `src/store/AppContext.js`.

2. Pages available in `src/pages/`:
- `BillingPage.jsx` — create/update bills
- `PrintInvoice.jsx` — print-friendly invoice
- `ReportsPage.jsx` — reports overview
- `EmployeesPage.jsx` — employee management
- `ExpensesPage.jsx` — expense management

3. Key services:
- `src/services/storageService.js` — localStorage with in-memory fallback
- `src/services/billingService.js` — billing logic and calculations

4. Routing and usage
- `src/App.jsx` — application router with role-based guards
- `src/store/AuthContext.js` — simple role context (Admin/Staff) used for gating admin pages
- `src/index.jsx` — entry point to mount the app

Run notes:
- Ensure `react`, `react-dom`, and `react-router-dom` are installed in your project.
- Start the application the usual way for your React setup (e.g., `npm start` or `yarn start`).

Styling & Theme
- Global styles are in `src/styles/global.css` and use CSS variables for theme tokens (colors, radius, shadows, type scale).
- To customize the visual theme, edit the `:root` variables at the top of `src/styles/global.css` (for example `--accent`, `--bg`, `--card-bg`).
- The project includes mobile-first utility classes: `.container`, `.card`, `.row`, `.col`, and button variants (`.btn-ghost`, `.btn-sm`, `.btn-lg`).

Print support
- The print styles hide navigation and interactive controls and optimize invoice layout. Use the PrintInvoice route (`/print/:id`) or the Print button on the invoice page.

Notes:
- Uses LocalStorage for persistence; master JSON stored under key `dh_master_json_v1`.
- Designed to be extended to a backend (MongoDB) later by replacing storageService.
