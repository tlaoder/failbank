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
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenAuth('login')}
          className="text-sm font-medium text-paper-500 hover:text-ink-900 transition-colors px-3 py-1.5"
        >
          로그인
        </button>
        <button
          onClick={() => onOpenAuth('signup')}
          className="text-sm font-medium bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-700 transition-colors"
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
        <div className="w-8 h-8 bg-ink-900 text-white text-xs font-bold flex items-center justify-center rounded-lg select-none group-hover:bg-gold-500 transition-colors">
          {initial}
        </div>
        <span className="text-sm text-paper-500 hidden sm:inline group-hover:text-ink-900 transition-colors">
          {displayName}
        </span>
        <svg className={`w-3 h-3 text-paper-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 8L1 3h10L6 8z" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-paper-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 overflow-hidden animate-fade-up"
          role="menu"
        >
          {/* 사용자 정보 */}
          <div className="px-4 py-3.5 border-b border-paper-100 bg-paper-50">
            <div className="text-sm font-bold text-ink-800 truncate">{displayName}</div>
            <div className="text-xs text-paper-400 font-mono truncate">{user.email}</div>
          </div>

          <div className="py-1.5">
            <Link
              to="/mypage"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-600 hover:bg-paper-50 hover:text-ink-900 transition-colors"
            >
              <span className="text-base">👤</span> 마이페이지
            </Link>
            <Link
              to="/submit"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-600 hover:bg-paper-50 hover:text-ink-900 transition-colors"
            >
              <span className="text-base">✏️</span> 리포트 등록
            </Link>
            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-mono"
              >
                <span className="text-base">⚙️</span> 관리자 패널
              </Link>
            )}
          </div>

          <div className="border-t border-paper-100 py-1.5">
            <button
              role="menuitem"
              onClick={handleSignOut}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <span className="text-base">↩</span> 로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
