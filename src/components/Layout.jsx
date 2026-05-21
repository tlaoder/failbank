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
        className={`text-sm tracking-widest uppercase transition-colors font-mono ${
          active ? 'text-gold-400' : 'text-void-50 hover:text-cream-900'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-void-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-gold-500 focus:text-void-900 focus:px-4 focus:py-2 focus:text-sm">
        본문으로 바로가기
      </a>

      <header role="banner" className="border-b border-void-500/40 bg-void-900/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" aria-label="FailBank 홈으로 이동" className="flex items-baseline gap-3">
            <span className="text-2xl font-black tracking-tightest text-cream-900">
              Fail<span className="text-gold-400">Bank</span>
            </span>
            <span className="text-[9px] tracking-[0.3em] text-void-100 uppercase hidden sm:inline font-mono">EST. 2026</span>
          </Link>
          <nav role="navigation" aria-label="주요 메뉴" className="flex items-center gap-8">
            {navLink('/browse', 'Browse')}
            {navLink('/submit', 'Submit')}
            {navLink('/sell', 'Sell')}
            {navLink('/about', 'About')}
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>

      <footer role="contentinfo" className="border-t border-void-500/40 mt-24 py-16 px-6 bg-void-800">
        <div className="max-w-7xl mx-auto">
          <div className="divider-gold mb-12" />
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="text-xl font-black tracking-tightest mb-3 text-cream-900">
                Fail<span className="text-gold-400">Bank</span>
              </div>
              <p className="text-sm text-void-50 leading-relaxed">먼저 망해본 사람의 리포트로<br />시행착오를 줄이세요.</p>
            </div>
            <div>
              <div className="text-[9px] tracking-[0.3em] text-void-100 uppercase mb-4 font-mono">Data</div>
              <ul className="space-y-2 text-sm text-cream-700">
                <li>창업 5년 생존율 29.2%</li>
                <li>재창업 5년 생존율 73.3%</li>
                <li>연간 폐업자 100.8만 명</li>
              </ul>
            </div>
            <div>
              <div className="text-[9px] tracking-[0.3em] text-void-100 uppercase mb-4 font-mono">출처</div>
              <ul className="space-y-2 text-sm text-cream-700">
                <li>통계청 기업생멸행정통계</li>
                <li>국세청 2024 국세통계</li>
                <li>중소벤처기업부 (2026)</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-void-500/30 flex flex-col sm:flex-row justify-between gap-2 text-xs text-void-100 font-mono">
            <div>© 2026 FailBank. All rights reserved.</div>
            <div>실패가 자산이 되는 세상.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
