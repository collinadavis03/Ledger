export const S = {
  app: {
    minHeight: '100vh',
    background: '#0A0E1A',
    color: '#E2E8F0',
    fontFamily: "'DM Sans', sans-serif",
  },
  nav: {
    background: 'rgba(15,20,35,0.97)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #6EE7B7, #60A5FA)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: '1.5rem',
  },
  statCard: (accent) => ({
    background: `linear-gradient(135deg, ${accent}18, ${accent}08)`,
    border: `1px solid ${accent}30`,
    borderRadius: 16,
    padding: '1.25rem 1.5rem',
  }),
  label: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-1px',
  },
  btn: (variant = 'primary') => ({
    padding: variant === 'sm' ? '6px 14px' : '10px 20px',
    borderRadius: 10,
    border: variant === 'ghost' ? '1px solid rgba(255,255,255,0.1)' : 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: variant === 'sm' ? 13 : 14,
    transition: 'all 0.15s',
    background:
      variant === 'primary'
        ? 'linear-gradient(135deg, #6EE7B7, #60A5FA)'
        : variant === 'danger'
        ? 'rgba(239,68,68,0.15)'
        : 'rgba(255,255,255,0.06)',
    color:
      variant === 'primary'
        ? '#0A0E1A'
        : variant === 'danger'
        ? '#F87171'
        : '#E2E8F0',
  }),
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#E2E8F0',
    fontSize: 14,
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#E2E8F0',
    fontSize: 14,
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  tab: (active) => ({
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.15s',
    background: active ? 'rgba(110,231,183,0.15)' : 'transparent',
    color: active ? '#6EE7B7' : '#64748B',
  }),
  badge: (color) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: `${color}22`,
    color: color,
    letterSpacing: '0.02em',
  }),
}
