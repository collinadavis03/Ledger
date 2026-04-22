# 💰 Ledger — Personal Finance Tracker

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A full-stack personal finance tracker built with React and Supabase. Connect your bank via CSV export, track spending by category, set monthly budget goals, and visualize your finances with live charts — all in a clean dark-mode interface.

> Built by [Collin Davis](https://www.linkedin.com/in/collin-davis-cs/) — CS Senior at the University of Wyoming

---

## Screenshots

![Overview Dashboard](screenshots/overview.png)
![Budget Goals](screenshots/budgets.png)
![CSV Import](screenshots/import.png)

---

## Features

- **Supabase Auth** — Secure email/password login with Row Level Security (each user only sees their own data)
- **CSV Bank Import** — Drag & drop exports from Chase, Wells Fargo, Bank of America, Capital One, and more
- **Auto-Categorization** — Rule-based engine categorizes transactions by merchant name on import
- **Spending Dashboard** — Area charts, pie charts, and 6-month trend analysis powered by Recharts
- **Budget Goals** — Set monthly spending limits per category with live progress bars and over-budget alerts
- **Transaction Management** — Add, search, filter, and delete transactions manually
- **Dark Mode UI** — Clean, minimal dark interface built from scratch with no UI library

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, JSX |
| Charts | Recharts |
| Backend / DB | Supabase (PostgreSQL + Auth) |
| Build Tool | Vite |
| Bank Sync | CSV import (no paid API required) |
| Hosting | Vercel / Netlify |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) account

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ledger.git
cd ledger

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**, paste the contents of `supabase_schema.sql` and click **Run**
3. Go to **Settings → API** and copy your Project URL and anon key
4. Go to **Authentication → Sign In / Providers** and turn off **Confirm email** for local development
5. Paste your credentials into `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How CSV Import Works

1. Log into your bank and export transactions as CSV
2. Go to the **Import** tab in Ledger
3. Drag & drop your CSV file
4. Preview auto-categorized transactions (click type badge to toggle income/expense)
5. Click **Import** — done

### Supported Bank Formats

| Bank | Export Location |
|---|---|
| Chase | Account → Download → CSV |
| Wells Fargo | Accounts → Download Activity |
| Bank of America | Transactions → Download → CSV |
| Capital One | Transactions → Download → CSV |

---

## Auto-Categorization

Transactions are categorized automatically using keyword matching:

| Category | Example Merchants |
|---|---|
| 🛒 Groceries | Safeway, Kroger, Whole Foods, Trader Joe's |
| 🍕 Dining | Chipotle, Starbucks, DoorDash, Uber Eats |
| 🚗 Transport | Uber, Lyft, Shell, BP, Parking |
| 📺 Subscriptions | Netflix, Spotify, Hulu, Apple Music |
| 🏠 Housing | Rent, Mortgage, Utility, Internet |
| 💪 Health & Fitness | Gym, Planet Fitness, Nike |
| 🛍️ Shopping | Amazon, eBay, Best Buy, Target |
| 💊 Healthcare | CVS, Walgreens, Hospital, Pharmacy |

---

## Project Structure

```
ledger/
├── src/
│   ├── App.jsx                  # Root component + Dashboard
│   ├── main.jsx                 # React entry point
│   ├── supabaseClient.js        # Supabase connection
│   ├── components/
│   │   ├── AuthScreen.jsx       # Login & signup
│   │   ├── Overview.jsx         # Charts & stats dashboard
│   │   ├── Transactions.jsx     # Transaction list, add, delete
│   │   ├── Budgets.jsx          # Budget goal setting & progress
│   │   ├── Import.jsx           # CSV drag & drop import
│   │   └── Shared.jsx           # TxRow, EmptyState components
│   └── utils/
│       ├── categories.js        # Category rules & constants
│       ├── parseCSV.js          # Bank CSV parser
│       └── styles.js            # Shared style objects
├── supabase_schema.sql          # Database schema (run in Supabase)
├── .env.example                 # Environment variable template
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
└── package.json
```

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Netlify

```bash
npm run build
# Drag the dist/ folder to netlify.com/drop
```

---

## Roadmap

- [ ] Plaid API integration for automatic bank sync
- [ ] Recurring transaction detection
- [ ] Export transactions to CSV
- [ ] Net worth tracker
- [ ] Mobile responsive layout improvements
- [ ] Dark/light mode toggle

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE) © 2026 Collin Davis
