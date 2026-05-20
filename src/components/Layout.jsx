import { Link, useLocation } from 'react-router-dom'
import { isSupabaseConnected } from '../lib/supabase'

export default function Layout({ children }) {
  const location = useLocation()
  const connected = isSupabaseConnected()

  const navLink = (to, label) => {
    const active = location.pathname === to ||
      (to !== '/' && location.pathname.startsWith(to))
    return (
      <Link
        to={to}
        className={`text-sm tracking-tight transition-colors ${
          active ? 'text-terra-600 font-medium' : 'text-ink-700 hover:text-ink-900'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!connected && (
        <div className="bg-ink-900 text-paper-50 text-xs py-2 px-4 text-center font-mono tracking-tight">
          DEMO MODE — Supabase 미연동. 데이터는 브라우저 로컬에만 저장됩니다.
        </div>
      )}

      <header className="border-b border-ink-900/10 bg-paper-50/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-3 group">
            <span className="serif-display text-2xl font-black tracking-tightest text-ink-900">
              Fail<span className="text-terra-600">Bank</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] text-ink-500 uppercase hidden sm:inline">
              EST. 2026
            </span>
          </Link>
          <nav className="flex items-center gap-6 sm:gap-8">
            {navLink('/browse', '리포트 찾기')}
            {navLink('/submit', '리포트 쓰기')}
            {navLink('/sell', '판매자 안내')}
            {navLink('/about', '소개')}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink-900/10 mt-24 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="serif-display text-lg font-bold mb-2">FailBank</div>
              <p className="text-sm text-ink-500 leading-relaxed">
                먼저 망해본 사람의 리포트로<br/>시행착오를 줄이세요.
              </p>
            </div>
            <div>
              <div className="text-xs tracking-[0.2em] text-ink-500 uppercase mb-3">Data</div>
              <ul className="space-y-1.5 text-sm text-ink-700">
                <li>창업 5년 생존율 29.2%</li>
                <li>재창업 5년 생존율 73.3%</li>
                <li>연간 폐업자 100.8만 명</li>
              </ul>
            </div>
            <div>
              <div className="text-xs tracking-[0.2em] text-ink-500 uppercase mb-3">출처</div>
              <ul className="space-y-1.5 text-sm text-ink-700">
                <li>통계청 기업생멸행정통계</li>
                <li>국세청 2024 국세통계</li>
                <li>중소벤처기업부 (2026)</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-ink-900/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-500">
            <div>© 2026 FailBank. 2026학년도 1학기 플랫폼 비즈니스 과제.</div>
            <div className="font-mono">실패가 자산이 되는 세상.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
