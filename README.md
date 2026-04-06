# Clario — Personal Finance Dashboard

A dark-first personal finance dashboard built with React + Vite. Track income and expenses, explore transactions, view spending insights, and simulate role-based access — all on the frontend with mock data and localStorage persistence.

---

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 19 + Vite |
| Styling | Plain CSS with CSS Variables |
| Charts | Recharts |
| State | Context API |
| Persistence | localStorage |

---

## Folder Structure

```
src/
├── App.jsx                       # Root layout — sidebar, navbar, pages, modals
├── App.css                       # CSS variables, global reset, app layout
├── main.jsx                      # Entry point
│
├── context/
│   └── AppContext.jsx            # Global state — transactions, role, theme, dateRange
│
├── data/
│   └── mockData.js               # Seed data — transactions, chart data, spending breakdown
│
├── pages/
│   ├── Dashboard.jsx             # Summary cards, bar chart, recent transactions, pie chart
│   ├── Transactions.jsx          # Full table with search, filter, sort
│   └── Insights.jsx              # Computed insights + spending category bar chart
│
└── components/
    ├── layout/
    │   ├── Sidebar.jsx           # Nav links, role switcher, user info, mobile drawer
    │   └── Navbar.jsx            # Page title, theme toggle, Add Transaction button
    │
    └── ui/
        ├── AddTransactionModal.jsx      # Add new transaction with validation
        ├── TransactionDetailModal.jsx   # View, edit, or delete a transaction
        └── CategoryIcon.jsx             # SVG icon per transaction category
```

---

## Features

### Dashboard
- Summary cards — Total Balance, Total Income, Total Expenses (live from context)
- Income vs Expenses bar chart — full 12-month yearly overview (Recharts)
- Recent Transactions — top 5 most recent, updates instantly on add
- Spending Breakdown — donut pie chart computed live from context
- "View All" navigates to the Transactions page

### Transactions
- Full sortable table — newest first by default
- Live search by name or category
- Filter by Type (All / Income / Expense) and Category
- Sort by Date or Amount (asc / desc toggle)
- Empty state when no results match
- Click any row to open Transaction Detail Modal

### Insights
- All values computed live from context — no hardcoded numbers
- Highest spending category
- This month vs last month expenses — % delta with up/down badge
- Average daily spend this month
- Biggest single expense — name and amount
- Horizontal bar chart — spending per category (Recharts)

### Role-Based UI (RBAC)
| Action | Admin | Viewer |
|---|---|---|
| View all pages and data | ✅ | ✅ |
| Add new transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |
| Switch role | ✅ | ✅ |

Switch roles anytime via the dropdown in the sidebar.

### Add Transaction Modal (Admin only)
- Fields: Name, Amount, Category, Type (Income / Expense), Date
- Validation — red border + error on empty/invalid fields
- On save — adds to context + localStorage, all pages update instantly

### Transaction Detail Modal
- Opens on row click in Transactions table
- Viewer — read-only view of all fields
- Admin — inline edit form + delete button with confirmation

### Theme
- Dark mode by default
- Sun/moon toggle in Navbar switches to light mode
- All colors driven by CSS variables — zero hardcoded values

### Responsive Design
- Desktop — fixed 210px sidebar
- Mobile (≤768px) — hamburger menu, sidebar slides in as drawer with backdrop overlay

### Data Persistence
- Transactions saved to `localStorage` under key `clario_transactions`
- Survives page refresh — falls back to mock data if empty
- Add, edit, delete all sync automatically

---

## Assumptions Made

- Single-user app — Admin and Viewer represent access levels for the same account, not separate users
- Currency shown in ₹ (Indian Rupee)
- Chart data is static for 2024 yearly overview; transaction list is dynamic
- "This month" is determined by the most recent transaction date in the data to avoid timezone edge cases