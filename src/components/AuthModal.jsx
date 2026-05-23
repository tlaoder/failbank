import { useState, useEffect } from 'react'
import { signIn, signUp } from '../lib/auth'
import { isSupabaseConnected } from '../lib/supabase'

// mode: 'login' | 'signup'
export default function AuthModal({ initialMode = 'login', onClose }) {
  const [mode, setMode]       = useState(initialMode)
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)   // 회원가입 완료 안내

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!isSupabaseConnected()) {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center py-4">
          <div className="text-2xl mb-4 text-ink-400">⚠</div>
          <h2 className="text-xl font-bold mb-3 text-ink-900">Supabase 연결 필요</h2>
          <p className="text-sm text-ink-500 leading-relaxed">
            회원 기능을 사용하려면<br />
            <code className="text-xs bg-paper-100 px-2 py-0.5 font-mono">VITE_SUPABASE_URL</code>과<br />
            <code className="text-xs bg-paper-100 px-2 py-0.5 font-mono">VITE_SUPABASE_ANON_KEY</code>를<br />
            환경변수에 설정해주세요.
          </p>
          <button onClick={onClose} className="mt-6 btn-primary px-8 py-3">확인</button>
        </div>
      </Overlay>
    )
  }

  // 회원가입 완료 → 이메일 확인 안내
  if (done) {
    return (
      <Overlay onClose={onClose}>
        <div className="text-center py-4">
          <div className="text-4xl mb-4 text-gold-500">✉</div>
          <h2 className="text-xl font-bold mb-3 text-ink-900">이메일을 확인해주세요</h2>
          <p className="text-sm text-ink-500 leading-relaxed mb-6">
            <strong className="text-ink-700">{email}</strong>으로<br />
            인증 링크를 발송했습니다.<br />
            링크를 클릭하면 로그인됩니다.
          </p>
          <button onClick={onClose} className="btn-primary px-8 py-3">확인</button>
        </div>
      </Overlay>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn({ email, password })
        onClose()
      } else {
        if (nickname.trim().length < 2) throw new Error('닉네임은 2자 이상이어야 합니다')
        await signUp({ email, password, nickname: nickname.trim() })
        setDone(true)
      }
    } catch (err) {
      setError(translateError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay onClose={onClose}>
      {/* 탭 */}
      <div className="flex border-b border-paper-200 -mx-10 px-10 mb-8">
        {['login', 'signup'].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError('') }}
            className={`flex-1 pb-4 text-xs font-mono uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              mode === m
                ? 'border-gold-500 text-gold-600'
                : 'border-transparent text-ink-400 hover:text-ink-700'
            }`}
          >
            {m === 'login' ? '로그인' : '회원가입'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {mode === 'signup' && (
          <Field
            id="auth-nickname" label="닉네임"
            type="text" value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="예: 강남디저트" maxLength={20}
            autoComplete="username"
          />
        )}
        <Field
          id="auth-email" label="이메일"
          type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="hello@example.com"
          autoComplete="email"
        />
        <Field
          id="auth-password" label="비밀번호"
          type="password" value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={mode === 'signup' ? '8자 이상' : ''}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {error && (
          <div role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="btn-primary w-full py-4 mt-2"
        >
          {loading
            ? <span role="status">{mode === 'login' ? '로그인 중...' : '가입 중...'}</span>
            : mode === 'login' ? '로그인' : '회원가입'}
        </button>
      </form>

      {mode === 'login' && (
        <p className="text-center text-xs text-ink-400 mt-6">
          계정이 없으신가요?{' '}
          <button onClick={() => { setMode('signup'); setError('') }}
            className="text-gold-500 hover:text-gold-600 underline">
            회원가입
          </button>
        </p>
      )}
    </Overlay>
  )
}

/* ── 공용 컴포넌트 ── */

function Overlay({ onClose, children }) {
  return (
    <div
      role="dialog" aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" aria-hidden />
      <div className="relative bg-white border border-paper-200 w-full max-w-md px-10 py-10 shadow-xl animate-fade-up">
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 text-paper-400 hover:text-ink-900 p-2 font-mono text-lg"
        >✕</button>
        <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-6">
          FailBank Account
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ id, label, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="text-[9px] tracking-[0.3em] text-ink-500 uppercase font-mono block mb-2">
        {label}
      </label>
      <input
        id={id}
        required
        className="w-full border border-paper-300 bg-paper-50 px-4 py-3 text-sm text-ink-800 placeholder-paper-400 focus:outline-none focus:border-ink-600 focus:bg-white transition-colors"
        {...inputProps}
      />
    </div>
  )
}

/* ── Supabase 오류 메시지 한국어 변환 ── */
function translateError(msg = '') {
  if (msg.includes('Invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않습니다'
  if (msg.includes('Email not confirmed'))        return '이메일 인증이 필요합니다. 받은 편지함을 확인하세요'
  if (msg.includes('User already registered'))   return '이미 가입된 이메일입니다'
  if (msg.includes('Password should be'))        return '비밀번호는 8자 이상이어야 합니다'
  if (msg.includes('Unable to validate'))        return '이메일 형식이 올바르지 않습니다'
  if (msg.includes('duplicate key'))             return '이미 사용 중인 닉네임입니다'
  return msg
}
