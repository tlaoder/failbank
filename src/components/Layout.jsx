import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import UserMenu from './UserMenu'
import AuthModal from './AuthModal'

export default function Layout({ children }) {
  const location = useLocation()
  const [authModal, setAuthModal] = useState(null) // null | 'login' | 'signup'
  const [scrolled, setScrolled] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  // RequireAuth가 로그인 모달 오픈 요청을 state로 전달하면 자동으로 열기
  useEffect(() => {
    if (location.state?.openAuth) {
      setAuthModal(location.state.openAuth)
    }
  }, [location.state])

  // 스크롤에 따라 헤더 그림자 강도 조절
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLink = (to, label) => {
    const active =
      location.pathname === to ||
      (to !== '/' && location.pathname.startsWith(to))
    return (
      <Link
        to={to}
        aria-current={active ? 'page' : undefined}
        className={`text-sm font-medium transition-colors relative pb-0.5 ${
          active
            ? 'text-gold-500'
            : 'text-paper-500 hover:text-ink-900'
        }`}
      >
        {label}
        {active && (
          <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gold-500 rounded-full" />
        )}
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink-900 focus:text-paper-50 focus:px-4 focus:py-2 focus:text-sm focus:rounded-lg">
        본문으로 바로가기
      </a>

      {/* ── Announcement Bar (GrowthHackers-style) ── */}
      {showBanner && (
        <div className="relative bg-gold-500 text-ink-900 py-2.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 z-50">
          <span>🎉</span>
          <span>초기 판매자 100명 모집 중 · 3개월 수수료 0%</span>
          <Link
            to="/sell"
            className="underline underline-offset-2 ml-1 hover:no-underline whitespace-nowrap"
          >
            신청하기 →
          </Link>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-ink-700 hover:text-ink-900 hover:bg-gold-400/40 rounded-full transition-colors"
            aria-label="공지 닫기"
          >
            ✕
          </button>
        </div>
      )}

      <header
        role="banner"
        className={`bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-shadow duration-200 ${
          scrolled ? 'shadow-[0_1px_20px_0_rgb(0_0_0/0.08)]' : 'border-b border-paper-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* 로고 */}
          <Link to="/" aria-label="FailBank 홈으로 이동" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center">
              <span className="text-gold-400 font-black text-sm leading-none">F</span>
            </div>
            <span className="text-xl font-black tracking-tight text-ink-900">
              Fail<span className="text-gold-500">Bank</span>
            </span>
          </Link>

          {/* 네비게이션 */}
          <div className="flex items-center gap-6 sm:gap-8">
            <nav role="navigation" aria-label="주요 메뉴" className="hidden sm:flex items-center gap-6">
              {navLink('/browse', 'Browse')}
              {navLink('/submit', 'Submit')}
              {navLink('/sell', 'Sell')}
              {navLink('/about', 'About')}
            </nav>
            <UserMenu onOpenAuth={(mode) => setAuthModal(mode)} />
          </div>
        </div>

        {/* 모바일 하단 네비 */}
        <nav className="sm:hidden flex border-t border-paper-100 px-6 py-2 gap-6" role="navigation" aria-label="모바일 메뉴">
          {navLink('/browse', 'Browse')}
          {navLink('/submit', 'Submit')}
          {navLink('/sell', 'Sell')}
          {navLink('/about', 'About')}
        </nav>
      </header>

      {authModal && (
        <AuthModal
          initialMode={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}

      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>

      <footer role="contentinfo" className="mt-24 py-16 px-6 bg-ink-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gold-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-gold-400 font-black text-xs">F</span>
                </div>
                <span className="text-lg font-black text-white">
                  Fail<span className="text-gold-400">Bank</span>
                </span>
              </div>
              <p className="text-sm text-paper-400 leading-relaxed max-w-xs">
                먼저 망해본 사람의 리포트로<br />시행착오를 줄이세요.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="mailto:b2b@failbank.kr"
                  className="text-xs text-paper-500 hover:text-gold-400 transition-colors font-mono">
                  b2b@failbank.kr
                </a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-paper-300 uppercase tracking-wider mb-4">시장 데이터</div>
              <ul className="space-y-2 text-sm text-paper-500">
                <li>창업 5년 생존율 29.2%</li>
                <li>재창업 5년 생존율 73.3%</li>
                <li>연간 폐업자 100.8만 명</li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-paper-300 uppercase tracking-wider mb-4">출처</div>
              <ul className="space-y-2 text-sm text-paper-500">
                <li>통계청 기업생멸행정통계</li>
                <li>국세청 2024 국세통계</li>
                <li>중소벤처기업부 (2026)</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-ink-800 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper-600">
            <div>© 2026 FailBank. All rights reserved.</div>
            <div>실패가 자산이 되는 세상.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
