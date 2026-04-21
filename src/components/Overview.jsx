import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { CATEGORIES, PALETTE } from '../utils/categories.js'
import { S } from '../utils/styles.js'
import { TxRow, EmptyState } from './Shared.jsx'

const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`

const TOOLTIP_STYLE = {
  contentStyle: {
    background: '#0F1625',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#E2E8F0',
    fontSize: 13,
  },
}

export default function Overview({ totalIncome, totalExpense, net, byCategory, monthlyTrend, recentTx }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total Income', value: fmt(totalIncome), accent: '#6EE7B7', sub: 'This month' },
          { label: 'Total Expenses', value: fmt(totalExpense), accent: '#F87171', sub: 'This month' },
          {
            label: 'Net Balance',
            value: fmt(net),
            accent: net >= 0 ? '#60A5FA' : '#FBBF24',
            sub: net >= 0 ? "You're ahead" : 'Over budget',
          },
          { label: 'Transactions', value: String(recentTx.length), accent: '#A78BFA', sub: 'This month' },
        ].map((s) => (
          <div key={s.label} style={S.statCard(s.accent)}>
            <div style={S.label}>{s.label}</div>
            <div style={{ ...S.value, color: s.accent }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

        {/* Area Chart - Monthly Trend */}
        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.25rem' }}>Monthly Trend</div>
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6EE7B7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6EE7B7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#334155" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis stroke="#334155" tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toFixed(2)}`, '']} />
                <Area type="monotone" dataKey="income" stroke="#6EE7B7" fill="url(#gradIncome)" strokeWidth={2} name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#F87171" fill="url(#gradExpense)" strokeWidth={2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState msg="Import transactions to see your trend" />
          )}
          <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            {[['Income', '#6EE7B7'], ['Expenses', '#F87171']].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 12, color: '#64748B' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart - By Category */}
        <div style={S.card}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.25rem' }}>By Category</div>
          {byCategory.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={byCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    {...TOOLTIP_STYLE}
                    formatter={(v) => [`$${Number(v).toFixed(2)}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
                {byCategory.slice(0, 5).map((c, i) => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>${Number(c.value).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState msg="No expenses yet" />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: '1.25rem' }}>Recent Transactions</div>
        {recentTx.length > 0
          ? recentTx.map((t) => <TxRow key={t.id} t={t} />)
          : <EmptyState msg="No transactions this month" />}
      </div>

    </div>
  )
}
