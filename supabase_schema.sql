-- ============================================================
-- LEDGER — Supabase SQL Schema
-- Run this entire file in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- TRANSACTIONS TABLE
create table if not exists transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  date        date not null,
  description text not null,
  amount      numeric(12, 2) not null check (amount >= 0),
  category    text not null default 'Other',
  type        text not null check (type in ('income', 'expense')),
  created_at  timestamptz default now()
);

-- Row Level Security — users only see their own transactions
alter table transactions enable row level security;

create policy "Users can manage their own transactions"
  on transactions for all
  using (auth.uid() = user_id);

-- Index for fast queries by user + date
create index if not exists idx_transactions_user_date
  on transactions (user_id, date desc);

-- ============================================================

-- BUDGETS TABLE
create table if not exists budgets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  category      text not null,
  monthly_limit numeric(12, 2) not null check (monthly_limit > 0),
  created_at    timestamptz default now(),
  unique(user_id, category)
);

-- Row Level Security — users only see their own budgets
alter table budgets enable row level security;

create policy "Users can manage their own budgets"
  on budgets for all
  using (auth.uid() = user_id);

-- ============================================================
-- Done! Go back to your app and start adding transactions.
-- ============================================================
