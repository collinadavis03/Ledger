import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { CATEGORIES, PALETTE } from '../utils/categories.js'
import { S } from '../utils/styles.js'
import { EmptyState } from './Shared.jsx'

const BUDGET_CATEGORIES = CATEGORIES.filter((c) => c !== 'Income' && c !== 'Transfers')

export default function Budgets({ budgets, byCategory, userId, onRefresh }) {
  const [form, setForm] = useState({ category: 'Groceries', monthly_limit: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const spendMap = Object.fromEntries(byCategory.map((c) => [c.name, c.value]))

  async function saveBudget() {
    if (!form.monthly_limit || isNaN(parseFloat(form.monthly_limit))) {
      setError('Please enter a valid amount.')
      return
    }
    setError('')
    setSaving(true)
    await supabase.from('budgets').upsert(
      [{ category: form.category, monthly_limit: parseFloat(form.monthly_limit), user_id: userId }],
      { onConflict: 'user_id,category' }
    )
    setSaving(false)
    setForm({ category: 'Groceries', monthly_limit: '' })
    onRefresh()
  }

  async function deleteBudget(id) {
    await supabase.from('budgets').delete().eq('id', id)
    onRefresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Add Budget Form */}
      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: '1rem' }}>Set Monthly Budget</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, alignItems: 'end' }}>
          <div>
            <div style={S.label}>Category</div>
            <select style={S.select} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {BUDGET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={S.label}>Monthly Limit ($)</div>
            <input
              style={S.input}
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 500"
              value={form.monthly_limit}
              onChange={(e) => setForm((f) => ({ ...f, monthly_limit: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && saveBudget()}
            />
          </div>
          <div>
            <button style={S.btn('primary')} onClick={saveBudget} disabled={saving}>
              {saving ? 'Saving...' : 'Set Budget'}
            </button>
          </div>
        </div>
        {error && <div style={{ marginTop: 10, fontSize: 13, color: '#F87171' }}>{error}</div>}
        <div style={{ marginTop: 10, fontSize: 12, color: '#475569' }}>
          Setting a budget for a category that already has one will update the existing limit.
        </div>
      </div>

      {/* Budget Cards */}
      {budgets.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {budgets.map((b, i) => {
            const spent = spendMap[b.category] || 0
            const pct = Math.min((spent / b.monthly_limit) * 100, 100)
            const over = spent > b.monthly_limit
            const accent = over ? '#F87171' : pct > 75 ? '#FBBF24' : PALETTE[i % PALETTE.length]

            return (
              <div key={b.id} style={S.statCard(accent)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={S.label}>{b.category}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: accent }}>
                      ${Number(spent).toFixed(0)}{' '}
                      <span style={{ fontSize: 14, color: '#475569', fontWeight: 400 }}>
                        / ${Number(b.monthly_limit).toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <button
                    style={{ ...S.btn('danger'), padding: '4px 10px', fontSize: 12 }}
                    onClick={() => deleteBudget(b.id)}
                    title="Remove budget"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress bar */}
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: accent,
                    borderRadius: 99,
                    transition: 'width 0.6s ease',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>{pct.toFixed(0)}% used</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: over ? '#F87171' : '#6EE7B7' }}>
                    {over
                      ? `$${(spent - b.monthly_limit).toFixed(0)} over limit`
                      : `$${(b.monthly_limit - spent).toFixed(0)} remaining`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ ...S.card, textAlign: 'center', color: '#475569', padding: '3rem' }}>
          No budgets set yet. Add one above to start tracking your spending goals.
        </div>
      )}

    </div>
  )
}
