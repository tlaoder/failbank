import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../lib/auth'

export default function UserMenu({ onOpenAuth }) {
  const { user, profile } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
  }

  const displayName = profile?.nickname ?? user?.email?.split('@')[0] ?? '사용자'
  const initial = displayName[0]?.toUpperCase() ?? 'U'

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => onOpenAuth('login')}
          className="text-xs tracking-widest uppercase font-mono text-ink-500 hover:text-ink-900 transition-colors"
        >
          로그인
        </button>
        <button
          onClick={() => onOpenAuth('signup')}
          className="text-xs tracking-widest uppercase font-mono bg-ink-900 text-paper-50 px-4 py-2 hover:bg-ink-700 transition-colors"
        >
          회원가입
        </button>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2.5 group"
      >
        {/* 아바타 */}
        <div className="w-8 h-8 bg-ink-900 text-paper-50 text-xs font-bold flex items-center justify-center select-none group-hover:bg-gold-500 transition-colors">
          {initial}
        </div>
        <span className="text-xs font-mono text-ink-600 hidden sm:inline group-hover:text-ink-900 transition-colors">
          {displayName}
        </span>
        <span className="text-paper-400 text-[10px]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 bg-white border border-paper-200 shadow-lg z-50 py-1 animate-fade-up"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-paper-100">
            <div className="text-xs font-bold text-ink-800 truncate">{displayName}</div>
            <div className="text-[10px] text-paper-400 font-mono truncate">{user.email}</div>
          </div>

          <Link
            to="/mypage"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-xs text-ink-600 hover:bg-paper-50 hover:text-ink-900 transition-colors"
          >
            <span>👤</span> 마이페이지
          </Link>
          <Link
            to="/submit"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-xs text-ink-600 hover:bg-paper-50 hover:text-ink-900 transition-colors"
          >
            <span>✏️</span> 리포트 등록
          </Link>

          <div className="border-t border-paper-100 mt-1">
            <button
              role="menuitem"
              onClick={handleSignOut}
              className="w-full text-left flex items-center gap-3 px-4 py-3 text-xs text-red-500 hover:bg-red-50 transition-colors"
            >
              <span>↩</span> 로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
