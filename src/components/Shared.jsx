import { CATEGORIES, CATEGORY_EMOJIS, PALETTE } from '../utils/categories.js'
import { S } from '../utils/styles.js'

export function TxRow({ t, onDelete }) {
  const idx = CATEGORIES.indexOf(t.category)
  const catColor = PALETTE[idx >= 0 ? idx : PALETTE.length - 1]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: `${catColor}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}>
          {CATEGORY_EMOJIS[t.category] || '📦'}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{t.description}</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
            {t.date} · <span style={{ color: catColor }}>{t.category}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          fontSize: 15,
          fontWeight: 700,
          color: t.type === 'income' ? '#6EE7B7' : '#F87171',
        }}>
          {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
        </span>
        {onDelete && (
          <button
            onClick={onDelete}
            style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 16, padding: 4, lineHeight: 1 }}
            title="Delete"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function EmptyState({ msg }) {
  return (
    <div style={{ textAlign: 'center', color: '#334155', padding: '3rem', fontSize: 14 }}>
      {msg}
    </div>
  )
}
