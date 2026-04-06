# Clario — Personal Finance Dashboard

A dark-first personal finance dashboard built with React. Track income and expenses, view spending insights, manage transactions, and switch between Admin and Viewer roles.

---

## Folder Structure

```
src/
├── App.jsx                         # Root layout — wires sidebar, navbar, pages, modals, and sidebar open/close state
├── App.css                         # Global CSS variables (dark + light theme), reset, app layout, scrollbar
├── main.jsx                        # React entry point — mounts App into #root
├── index.css                       # Minimal base reset (box-sizing, margin, padding)
│
├── context/
│   └── AppContext.jsx              # Global state — transactions, role, theme, dateRange. Persists transactions to localStorage
│
├── data/
│   └── mockData.js                 # Seed data — allTransactions (15 entries), chartData (yearly bar chart), recentTransactions, spendingBreakdown
│
├── pages/
│   ├── Dashboard.jsx               # Home page — live summary cards, income vs expenses bar chart, recent transactions, spending breakdown pie
│   ├── Dashboard.css               # Dashboard page styles
│   ├── Transactions.jsx            # Full transaction table — search, filter by type/category, sort by date/amount, click-to-open detail modal
│   ├── Transactions.css            # Transactions page styles
│   ├── Insights.jsx                # Computed insights — top category, month vs last month, avg daily spend, biggest expense, category bar chart
│   └── Insights.css                # Insights page styles
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx             # Fixed sidebar — nav links, role switcher, user info. Slides in/out on mobile with backdrop
│   │   ├── Sidebar.css             # Sidebar styles including shimmer logo animation and mobile drawer
│   │   ├── Navbar.jsx              # Top bar — page title, theme toggle (sun/moon), Add Transaction button (Admin only), hamburger (mobile)
│   │   └── Navbar.css              # Navbar styles
│   │
│   └── ui/
│       ├── AddTransactionModal.jsx # Modal to add a new transaction — name, amount, category, type toggle, date picker, validation
│       ├── AddTransactionModal.css # Add modal styles
│       ├── TransactionDetailModal.jsx  # Click-to-open transaction card — view details, edit all fields, delete (Admin only)
│       ├── TransactionDetailModal.css  # Detail modal styles
│       └── CategoryIcon.jsx        # Reusable SVG icon component — renders an orange-tinted icon per transaction category
```

---

## Features

### Dashboard
- Live summary cards — Total Balance, Total Income, Total Expenses computed from all transactions in context
- Income vs Expenses bar chart — static 2024 yearly overview (Recharts BarChart)
- Recent Transactions — top 5 most recent from live context, updates instantly when transactions are added
- Spending Breakdown — pie chart computed live from context, shows category percentages
- "View All" link navigates directly to the Transactions page

### Transactions
- Full table of all transactions sorted by date (newest first) by default
- Live search — filters by name or category as you type
- Filter dropdowns — by Type (All / Income / Expense) and Category
- Sort toggle — by Date or Amount, ascending or descending
- Empty state — shown when no results match filters
- Click any row to open the Transaction Detail Modal

### Insights
- All values computed live from context — no hardcoded numbers
- Highest Spending Category — reduces all expenses to find the top category
- This Month vs Last Month — compares expense totals, shows % delta with up/down badge. Uses the most recent month in the data to avoid timezone/date issues
- Average Daily Spend — total expenses for the month divided by days in that month
- Biggest Single Expense — name and amount of the largest expense entry
- Horizontal bar chart — spending per category in orange shades (Recharts BarChart)

### Add Transaction Modal
- Triggered by "+ Add Transaction" button in Navbar (Admin only)
- Fields: Name, Amount (₹), Category, Type toggle (Income / Expense), Date
- Validation — red border and error text if fields are empty or invalid on Save
- On Save — calls `addTransaction()` from context, closes modal, all pages update instantly

### Transaction Detail Modal
- Opens by clicking any row in the Transactions table
- View mode — shows amount, type badge, category, date in a 2x2 grid
- Edit mode (Admin only) — inline form to update all fields with validation
- Delete (Admin only) — removes transaction from context and localStorage
- Close via X button or clicking the backdrop

### Theme Toggle
- Dark mode by default
- Sun/moon icon button in Navbar toggles between dark and light
- Theme applied via `data-theme` attribute on `<html>`, all colors driven by CSS variables — no hardcoded colors

### Responsive Sidebar
- Desktop — fixed 210px sidebar always visible
- Mobile (≤768px) — sidebar hidden off-screen, hamburger button appears in Navbar, tap to slide in with dark backdrop overlay, tap backdrop or X to close, navigating closes it automatically

### Data Persistence
- Transactions stored in `localStorage` under key `clario_transactions`
- Survives page refresh — loads from localStorage on mount, falls back to mockData if empty
- Add, edit, and delete all sync to localStorage automatically

---

## Roles

### Admin
- Can see the "+ Add Transaction" button in the Navbar
- Can open the Add Transaction Modal and create new entries
- Can edit any transaction via the detail modal
- Can delete any transaction via the detail modal
- Can switch role to Viewer via the sidebar dropdown

### Viewer
- Read-only access — can browse all pages and view all data
- No Add Transaction button shown
- Transaction detail modal opens in view-only mode — no Edit or Delete buttons
- Can switch role to Admin via the sidebar dropdown

---

## Dependencies

### Runtime
| Package | Version | Purpose |
|---|---|---|
| react | ^19.2.4 | UI library |
| react-dom | ^19.2.4 | DOM rendering |
| recharts | ^3.8.1 | Bar charts and pie chart (Dashboard + Insights) |

### Dev
| Package | Version | Purpose |
|---|---|---|
| vite | ^8.0.1 | Build tool and dev server |
| @vitejs/plugin-react | ^6.0.1 | React fast refresh for Vite |
| eslint | ^9.39.4 | Linting |
| eslint-plugin-react-hooks | ^7.0.1 | Hooks linting rules |
| eslint-plugin-react-refresh | ^0.5.2 | React refresh linting |
| @eslint/js | ^9.39.4 | ESLint JS config |
| globals | ^17.4.0 | Global variable definitions for ESLint |

---

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`
