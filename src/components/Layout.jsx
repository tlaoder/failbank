import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()

  const navLink = (to, label) => {
    const active =
      location.pathname === to ||
      (to !== '/' && location.pathname.startsWith(to))
    return (
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className={`text-sm tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-sm px-1 py-0.5 ${
          active
            ? 'text-navy-800 font-medium'
            : 'text-ink-700 hover:text-ink-900'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content — 접근성 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-navy-800 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
      >
        본문으로 바로가기
      </a>

      <header
        role="banner"
        className="border-b border-ink-900/10 bg-white/95 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            to="/"
            aria-label="FailBank 홈으로 이동"
            className="flex items-baseline gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-sm"
          >
            <span className="serif-display text-2xl font-black tracking-tightest text-ink-900">
              Fail<span className="text-navy-800">Bank</span>
            </span>
            <span
              className="text-[10px] tracking-[0.2em] text-ink-500 uppercase hidden sm:inline"
              aria-hidden="true"
            >
              EST. 2026
            </span>
          </Link>

          <nav role="navigation" aria-label="주요 메뉴" className="flex items-center gap-6 sm:gap-8">
            {navLink('/browse', '리포트 찾기')}
            {navLink('/submit', '리포트 쓰기')}
            {navLink('/sell', '판매자 안내')}
            {navLink('/about', '소개')}
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>

      <footer
        role="contentinfo"
        className="border-t border-ink-900/10 mt-24 py-12 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="serif-display text-lg font-bold mb-2" aria-label="FailBank">
                FailBank
              </div>
              <p className="text-sm text-ink-500 leading-relaxed">
                먼저 망해본 사람의 리포트로<br />시행착오를 줄이세요.
              </p>
            </div>
            <div>
              <div className="text-xs tracking-[0.2em] text-ink-500 uppercase mb-3 font-mono">
                Data
              </div>
              <ul className="space-y-1.5 text-sm text-ink-700" aria-label="주요 통계">
                <li>창업 5년 생존율 29.2%</li>
                <li>재창업 5년 생존율 73.3%</li>
                <li>연간 폐업자 100.8만 명</li>
              </ul>
            </div>
            <div>
              <div className="text-xs tracking-[0.2em] text-ink-500 uppercase mb-3 font-mono">
                출처
              </div>
              <ul className="space-y-1.5 text-sm text-ink-700" aria-label="데이터 출처">
                <li>통계청 기업생멸행정통계</li>
                <li>국세청 2024 국세통계</li>
                <li>중소벤처기업부 (2026)</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-ink-900/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-500">
            <div>© 2026 FailBank. All rights reserved.</div>
            <div className="font-mono">실패가 자산이 되는 세상.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
