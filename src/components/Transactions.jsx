import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { CATEGORIES, categorize } from '../utils/categories.js'
import { S } from '../utils/styles.js'
import { TxRow, EmptyState } from './Shared.jsx'

export default function Transactions({ transactions, userId, onRefresh }) {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: 'Other',
    type: 'expense',
  })

  const filtered = transactions.filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || t.category === filterCat
    const matchType = filterType === 'All' || t.type === filterType
    return matchSearch && matchCat && matchType
  })

  function handleDescChange(e) {
    const description = e.target.value
    setForm((f) => ({ ...f, description, category: categorize(description) }))
  }

  async function addTransaction() {
    if (!form.description || !form.amount || isNaN(parseFloat(form.amount))) return
    setSaving(true)
    const { error } = await supabase.from('transactions').insert([{
      date: form.date,
      description: form.description,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      user_id: userId,
    }])
    setSaving(false)
    if (!error) {
      setShowAdd(false)
      setForm({ date: new Date().toISOString().split('T')[0], description: '', amount: '', category: 'Other', type: 'expense' })
      onRefresh()
    }
  }

  async function deleteTransaction(id) {
    await supabase.from('transactions').delete().eq('id', id)
    onRefresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          style={{ ...S.input, maxWidth: 260 }}
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={{ ...S.select, maxWidth: 180 }} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select style={{ ...S.select, maxWidth: 140 }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
        <button style={S.btn('primary')} onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>New Transaction</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <div>
              <div style={S.label}>Date</div>
              <input style={S.input} type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <div style={S.label}>Description</div>
              <input style={S.input} placeholder="e.g. Walmart Grocery" value={form.description} onChange={handleDescChange} />
            </div>
            <div>
              <div style={S.label}>Amount ($)</div>
              <input style={S.input} type="number" min="0" step="0.01" placeholder="0.00" value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <div style={S.label}>Category</div>
              <select style={S.select} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <div style={S.label}>Type</div>
              <select style={S.select} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div>
            <button style={S.btn('primary')} onClick={addTransaction} disabled={saving}>
              {saving ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Transactions</div>
          <div style={{ fontSize: 13, color: '#475569' }}>{filtered.length} results</div>
        </div>
        {filtered.length > 0
          ? filtered.map((t) => <TxRow key={t.id} t={t} onDelete={() => deleteTransaction(t.id)} />)
          : <EmptyState msg="No transactions found" />}
      </div>

    </div>
  )
}
