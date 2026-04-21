import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { parseCSV } from '../utils/parseCSV.js'
import { S } from '../utils/styles.js'

export default function Import({ userId, onRefresh }) {
  const [preview, setPreview] = useState([])
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [parseError, setParseError] = useState('')

  function handleFile(file) {
    if (!file || !file.name.endsWith('.csv')) {
      setParseError('Please upload a .csv file.')
      return
    }
    setDone(false)
    setParseError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      const parsed = parseCSV(e.target.result)
      if (parsed.length === 0) {
        setParseError("Couldn't detect columns. Make sure your CSV has date, description, and amount columns.")
      } else {
        setPreview(parsed.slice(0, 100))
      }
    }
    reader.readAsText(file)
  }

  async function importAll() {
    if (!preview.length) return
    setImporting(true)
    const rows = preview.map((t) => ({ ...t, user_id: userId }))
    const { error } = await supabase.from('transactions').insert(rows)
    setImporting(false)
    if (error) {
      setParseError('Import failed: ' + error.message)
    } else {
      setDone(true)
      setPreview([])
      onRefresh()
    }
  }

  function toggleType(i) {
    setPreview((prev) => prev.map((t, idx) => idx === i ? { ...t, type: t.type === 'expense' ? 'income' : 'expense' } : t))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Upload Area */}
      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Import Bank Statement (CSV)</div>
        <div style={{ fontSize: 13, color: '#64748B', marginBottom: '1.25rem', lineHeight: 1.7 }}>
          Export a CSV from your bank — works with Chase, Wells Fargo, Bank of America, Capital One, and most others.
          Transactions are auto-categorized by merchant name. Required columns:{' '}
          <span style={{ color: '#94A3B8', fontWeight: 600 }}>date, description/name/memo, amount</span>.
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById('csvFileInput').click()}
          style={{
            border: `2px dashed ${dragOver ? '#6EE7B7' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 12,
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: dragOver ? 'rgba(110,231,183,0.04)' : 'transparent',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>
            Drag & drop your CSV here, or{' '}
            <span style={{ color: '#6EE7B7', textDecoration: 'underline' }}>browse files</span>
          </div>
          <div style={{ fontSize: 12, color: '#334155', marginTop: 8 }}>Supports .csv files up to 5MB</div>
          <input
            id="csvFileInput"
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {parseError && (
          <div style={{ marginTop: 12, fontSize: 13, color: '#F87171', padding: '10px 14px', background: 'rgba(248,113,113,0.08)', borderRadius: 8 }}>
            {parseError}
          </div>
        )}
      </div>

      {/* Success Banner */}
      {done && (
        <div style={{
          ...S.card,
          borderColor: '#6EE7B730',
          background: 'rgba(110,231,183,0.05)',
          textAlign: 'center',
          color: '#6EE7B7',
          fontWeight: 600,
          fontSize: 15,
        }}>
          ✓ Import complete! Your transactions have been saved.
        </div>
      )}

      {/* Preview Table */}
      {preview.length > 0 && (
        <div style={S.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Preview — {preview.length} transactions detected</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>Click the type badge to toggle income/expense</div>
            </div>
            <button style={S.btn('primary')} onClick={importAll} disabled={importing}>
              {importing ? 'Importing...' : `Import ${preview.length} Transactions`}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Date', 'Description', 'Amount', 'Type', 'Category'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '9px 12px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{t.date}</td>
                    <td style={{ padding: '9px 12px', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</td>
                    <td style={{ padding: '9px 12px', fontWeight: 600, color: t.type === 'income' ? '#6EE7B7' : '#F87171', whiteSpace: 'nowrap' }}>
                      {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '9px 12px' }}>
                      <span
                        style={{ ...S.badge(t.type === 'income' ? '#6EE7B7' : '#F87171'), cursor: 'pointer' }}
                        onClick={() => toggleType(i)}
                        title="Click to toggle"
                      >
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px' }}>
                      <span style={S.badge('#60A5FA')}>{t.category}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
