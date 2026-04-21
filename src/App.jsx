import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from './supabaseClient.js'
import { CATEGORIES, MONTHS, PALETTE } from './utils/categories.js'
import { S } from './utils/styles.js'
import AuthScreen from './components/AuthScreen.jsx'
import Overview from './components/Overview.jsx'
import Transactions from './components/Transactions.jsx'
import Budgets from './components/Budgets.jsx'
import Import from './components/Import.jsx'

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ ...S.app, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
        Loading...
      </div>
    )
  }

  if (!session) return <AuthScreen />
  return <Dashboard session={session} />
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ session }) {
  const [tab, setTab] = useState('overview')
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const selectedYear = new Date().getFullYear()

  const fetchAll = useCallback(async () => {
    setLoadingData(true)
    const [{ data: tx }, { data: bg }] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false }),
      supabase
        .from('budgets')
        .select('*')
        .eq('user_id', session.user.id),
    ])
    setTransactions(tx || [])
    setBudgets(bg || [])
    setLoadingData(false)
  }, [session.user.id])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Filter to selected month
  const monthTx = useMemo(() =>
    transactions.filter((t) => {
      const d = new Date(t.date + 'T00:00:00')
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
    }),
    [transactions, selectedMonth, selectedYear]
  )

  // Stats
  const totalIncome = useMemo(() =>
    monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
    [monthTx]
  )
  const totalExpense = useMemo(() =>
    monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
    [monthTx]
  )
  const net = totalIncome - totalExpense

  // Spending by category (expenses only)
  const byCategory = useMemo(() => {
    const map = {}
    monthTx.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount)
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [monthTx])

  // Monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const map = {}
    transactions.forEach((t) => {
      const d = new Date(t.date + 'T00:00:00')
      const key = `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`
      if (!map[key]) map[key] = { name: key, income: 0, expense: 0, _ts: d.getTime() }
      if (t.type === 'income') map[key].income += Number(t.amount)
      else map[key].expense += Number(t.amount)
    })
    return Object.values(map).sort((a, b) => a._ts - b._ts).slice(-6)
  }, [transactions])

  async function signOut() {
    await supabase.auth.signOut()
  }

  const TABS = ['overview', 'transactions', 'budgets', 'import']

  return (
    <div style={S.app}>

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.logo}>Ledger</div>

        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map((t) => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#475569', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {session.user.email}
          </span>
          <button style={S.btn('ghost')} onClick={signOut}>Sign Out</button>
        </div>
      </nav>

      <div style={S.container}>

        {/* Month Selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {MONTHS.map((m, i) => (
            <button
              key={m}
              style={{ ...S.tab(selectedMonth === i), fontSize: 12, padding: '6px 12px' }}
              onClick={() => setSelectedMonth(i)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loadingData && (
          <div style={{ color: '#475569', textAlign: 'center', padding: '4rem', fontSize: 14 }}>
            Loading your data...
          </div>
        )}

        {/* Tab Content */}
        {!loadingData && tab === 'overview' && (
          <Overview
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            net={net}
            byCategory={byCategory}
            monthlyTrend={monthlyTrend}
            recentTx={monthTx.slice(0, 10)}
          />
        )}
        {!loadingData && tab === 'transactions' && (
          <Transactions
            transactions={monthTx}
            userId={session.user.id}
            onRefresh={fetchAll}
          />
        )}
        {!loadingData && tab === 'budgets' && (
          <Budgets
            budgets={budgets}
            byCategory={byCategory}
            userId={session.user.id}
            onRefresh={fetchAll}
          />
        )}
        {!loadingData && tab === 'import' && (
          <Import
            userId={session.user.id}
            onRefresh={() => { fetchAll(); setTab('transactions') }}
          />
        )}

      </div>
    </div>
  )
}
