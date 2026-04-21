import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import { S } from '../utils/styles.js'

export default function AuthScreen() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)

  async function handleSubmit() {
    if (!email || !password) { setMsg('Please enter your email and password.'); setIsError(true); return }
    setLoading(true)
    setMsg('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { setMsg(error.message); setIsError(true) }
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) { setMsg(error.message); setIsError(true) }
        else { setMsg('Account created! Check your email to confirm, then sign in.'); setIsError(false) }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ ...S.app, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 1.5rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ ...S.logo, fontSize: 36, marginBottom: 10 }}>Ledger</div>
          <div style={{ color: '#475569', fontSize: 15 }}>Your personal finance tracker</div>
        </div>

        {/* Card */}
        <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                style={{ ...S.tab(mode === m), flex: 1, textAlign: 'center' }}
                onClick={() => { setMode(m); setMsg('') }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div>
            <div style={S.label}>Email</div>
            <input
              style={S.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div style={S.label}>Password</div>
            <input
              style={S.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {msg && (
            <div style={{
              fontSize: 13,
              color: isError ? '#F87171' : '#6EE7B7',
              padding: '10px 14px',
              background: isError ? 'rgba(248,113,113,0.08)' : 'rgba(110,231,183,0.08)',
              borderRadius: 8,
              border: `1px solid ${isError ? 'rgba(248,113,113,0.2)' : 'rgba(110,231,183,0.2)'}`,
            }}>
              {msg}
            </div>
          )}

          <button
            style={{ ...S.btn('primary'), width: '100%', opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <div style={{ fontSize: 12, color: '#334155', textAlign: 'center' }}>
            {mode === 'login'
              ? "Don't have an account? Click Sign Up above."
              : 'Already have an account? Click Sign In above.'}
          </div>
        </div>
      </div>
    </div>
  )
}
