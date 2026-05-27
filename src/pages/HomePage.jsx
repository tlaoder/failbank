import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { listReports } from '../lib/reports'

export default function HomePage() {
  const [topReports, setTopReports] = useState([])

  useEffect(() => {
    listReports({ sortBy: 'popular' }).then(r => setTopReports(r.slice(0, 3)))
  }, [])

  return (
    <div className="bg-paper-50">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-gradient px-6 pt-20 pb-28 md:min-h-[88vh] flex flex-col justify-center">
        {/* 앰비언트 글로우 */}
        <div className="absolute top-[-10%] right-[5%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.13) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-5%] left-[0%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-4xl">
            {/* 배지 */}
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-full text-gold-400 text-sm font-medium mb-8">
              <span>🏦</span> 국내 최초 실패 데이터 마켓플레이스
            </div>

            <h1 className="text-[clamp(3rem,7.5vw,7rem)] font-black leading-[1.01] text-white mb-6 tracking-tight">
              시행착오를<br />
              <span className="text-gold-400">사고파는</span><br />
              유일한 플랫폼.
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-xl mb-10">
              먼저 망해본 사람의 5단계 구조화 리포트.
              평균 5,000~30,000원으로 수백만 원의 시행착오를 피하세요.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link to="/browse" className="btn-gold text-base px-9 py-4">
                리포트 둘러보기 →
              </Link>
              <Link to="/sell"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-9 py-4 rounded-xl font-medium hover:bg-white/20 transition-all">
                판매자 안내
              </Link>
            </div>
          </div>

          {/* 커뮤니티 카운터 스트립 */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-8 border-t border-white/10">
            <HeroStat num="100.8만" label="연간 폐업자" />
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <HeroStat num="73.3%" label="재창업 5년 생존율" />
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <HeroStat num="2.5배" label="실패 경험 가치" />
            <div className="hidden sm:block w-px h-8 bg-white/10" />
            <HeroStat num="0원" label="초기 수수료" />
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM ────────────────────────────────────── */}
      {/* GrowthHackers의 "당신은 어떤 목적으로 오셨나요?" 섹션 */}
      <section className="py-24 px-6 bg-white section-divider">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-gold mb-4 inline-flex">Ecosystem</span>
            <h2 className="text-4xl font-black text-ink-900">당신은 어떤 목적으로 오셨나요?</h2>
            <p className="text-paper-400 mt-3 max-w-xl mx-auto text-lg">
              FailBank는 실패 데이터를 중심으로 구매자·판매자·기관을 연결하는 생태계입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <EcosystemCard
              icon="🛒"
              tag="Buyer"
              title="리포트 구매"
              desc="검증된 실패 데이터를 5,000~30,000원에 구매하세요. AI 품질 평가 + 5단계 구조로 실전에 바로 활용 가능합니다."
              cta={{ to: '/browse', label: '리포트 보기 →' }}
              accentClass="text-gold-500"
            />
            <EcosystemCard
              icon="✍️"
              tag="Seller"
              title="경험 자산화"
              desc="실패 경험을 구조화된 리포트로 영구 보존하고 수익화하세요. 초기 100명 판매자는 수수료 0%."
              cta={{ to: '/sell', label: '판매자 안내 →' }}
              accentClass="text-sky-500"
              highlight
            />
            <EcosystemCard
              icon="🏢"
              tag="Institution"
              title="B2B 도입"
              desc="액셀러레이터, 대학 창업지원단, VC를 위한 전용 패키지. 멤버 전체가 실패 데이터를 활용합니다."
              cta={{ to: '/sell#b2b', label: 'B2B 문의 →' }}
              accentClass="text-gold-500"
            />
          </div>
        </div>
      </section>

      {/* ── MARKET PROBLEM ───────────────────────────────── */}
      {/* GH-style 다크 배경 통계 섹션 */}
      <section className="py-24 px-6 bg-ink-900">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-end md:justify-between mb-14">
            <div>
              <span className="badge bg-white/10 border border-white/15 text-slate-300 mb-4 inline-flex">
                Market Problem
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                왜 지금인가?
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm mt-4 md:mt-0 text-sm leading-relaxed">
              창업 실패 데이터는 넘쳐나지만,<br />
              이를 거래하는 플랫폼은 존재하지 않았습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MarketStat number="29.2%" label="창업 5년 생존율" sub="OECD 28개국 중 26위" />
            <MarketStat number="100.8만" label="2024년 폐업자 수" sub="국세청 역대 최고치" />
            <MarketStat number="73.3%" label="재창업 생존율" sub="일반 창업의 2.5배" gold />
            <MarketStat number="최초" label="실패 데이터 거래소" sub="국내·해외 모두 부재" gold />
          </div>
        </div>
      </section>

      {/* ── TRENDING REPORTS ─────────────────────────────── */}
      <section className="py-24 px-6 section-divider">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge-gold mb-3 inline-flex">🔥 이번 주 인기</span>
              <h2 className="text-4xl font-black text-ink-900">트렌딩 리포트</h2>
            </div>
            <Link to="/browse"
              className="hidden sm:flex items-center gap-2 text-sm text-paper-400 hover:text-gold-500 transition-colors font-medium">
              전체 보기 →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {topReports.length > 0
              ? topReports.map((r, i) => <TrendingCard key={r.id} report={r} rank={i} delay={i * 80} />)
              : [0, 1, 2].map(i => <TrendingSkeleton key={i} />)
            }
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-white section-divider">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-sky mb-4 inline-flex">How it works</span>
            <h2 className="text-4xl font-black text-ink-900">5단계 구조화 템플릿</h2>
            <p className="text-paper-400 mt-3">30분이면 완성됩니다.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { n: '01', icon: '📍', t: '배경', d: '업종·규모·초기 투자' },
              { n: '02', icon: '🚀', t: '시도', d: '채널·전략·투입 기간' },
              { n: '03', icon: '🔍', t: '실패 원인', d: '핵심 원인 정량 분석' },
              { n: '04', icon: '💸', t: '손실 규모', d: '금전·시간 정량화' },
              { n: '05', icon: '💡', t: '교훈', d: '구체적 행동 지침' },
            ].map((step) => (
              <div key={step.n} className="paper-card p-6 text-center group hover:border-gold-200 transition-colors">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-xs font-mono text-gold-500 mb-2">STEP {step.n}</div>
                <div className="font-bold mb-1.5 text-ink-900">{step.t}</div>
                <div className="text-xs text-paper-400 leading-relaxed">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 px-6 bg-hero-gradient">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(245,158,11,0.20) 0%, transparent 65%)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="badge bg-gold-500/10 border border-gold-500/25 text-gold-400 mb-6 inline-flex">
            Join FailBank
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-8 text-white leading-[1.04] tracking-tight">
            당신의 시행착오가<br />
            누군가의{' '}
            <span className="text-gold-400">성공 전략</span>이 됩니다.
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            실패 경험을 데이터로 자산화하세요.
            초기 100명 파트너에게는 3개월간 수수료 0%를 보장합니다.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/sell" className="btn-gold text-base px-10 py-4">
              판매자 혜택 보기 →
            </Link>
            <Link to="/submit"
              className="inline-flex items-center gap-2 border border-white/25 text-white px-10 py-4 rounded-xl font-medium hover:bg-white/10 transition-all">
              바로 작성하기
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

/* ── 서브컴포넌트 ─────────────────────────────────────── */

function HeroStat({ num, label }) {
  return (
    <div>
      <div className="text-2xl font-black text-white tabular-nums">{num}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

function EcosystemCard({ icon, tag, title, desc, cta, accentClass, highlight = false }) {
  return (
    <div className={`ecosystem-card flex flex-col ${
      highlight
        ? 'bg-ink-900 border-ink-800 shadow-[0_4px_24px_-4px_rgb(0_0_0/0.3)]'
        : 'bg-white border-paper-100 shadow-card hover:shadow-card-hover'
    }`}>
      {/* 아이콘 박스 */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 ${
        highlight ? 'bg-white/8' : 'bg-paper-50'
      }`}>
        {icon}
      </div>

      <div className={`text-xs font-mono tracking-widest uppercase mb-2 ${accentClass}`}>{tag}</div>
      <h3 className={`text-xl font-bold mb-3 ${highlight ? 'text-white' : 'text-ink-900'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed mb-6 flex-1 ${highlight ? 'text-slate-400' : 'text-paper-500'}`}>{desc}</p>

      <Link
        to={cta.to}
        className={`text-sm font-semibold transition-colors ${
          highlight ? 'text-gold-400 hover:text-gold-300' : `${accentClass} opacity-90 hover:opacity-100`
        }`}
      >
        {cta.label}
      </Link>
    </div>
  )
}

function MarketStat({ number, label, sub, gold = false }) {
  return (
    <div className="bg-ink-800 rounded-2xl p-7">
      <div className={`text-4xl md:text-5xl font-black tabular-nums mb-2 leading-none ${gold ? 'text-gold-400' : 'text-white'}`}>
        {number}
      </div>
      <div className="text-sm font-semibold text-slate-300 mb-1">{label}</div>
      <div className="text-xs text-slate-600">{sub}</div>
    </div>
  )
}

const GRADE_COLOR = {
  S: '#f59e0b',
  A: '#0ea5e9',
  B: '#94a3b8',
  C: '#94a3b8',
  D: '#f43f5e',
}

function TrendingCard({ report: r, rank, delay }) {
  const borderColor = GRADE_COLOR[r.grade] || '#94a3b8'

  return (
    <Link
      to={`/report/${r.id}`}
      className="group post-card flex flex-col animate-fade-up"
      style={{ animationDelay: `${delay}ms`, borderLeftColor: borderColor }}
      aria-label={`${r.title} — ${r.category}, ${r.price.toLocaleString()}원`}
    >
      <div className="p-6 flex flex-col flex-1">
        {/* 상단 뱃지 + 등급 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="badge bg-paper-100 text-paper-500 text-xs">{r.category}</span>
            {rank === 0 && (
              <span className="badge bg-gold-100 text-gold-600 border border-gold-200 text-xs">🔥 HOT</span>
            )}
          </div>
          <div className={`grade-stamp shrink-0 ${r.grade === 'S' ? 'text-gold-500' : 'text-paper-300'}`}>
            {r.grade}
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-base font-bold leading-snug text-ink-800 group-hover:text-ink-900 transition-colors line-clamp-3 flex-1 mb-4">
          {r.title}
        </h3>

        {/* 작성자 + 조회수 */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-ink-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            {r.seller_nickname?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="text-xs text-paper-400 font-mono">@{r.seller_nickname}</span>
          <span className="text-xs text-paper-300 ml-auto font-mono">👁 {r.view_count}</span>
        </div>

        <div className="divider-gold mb-4" />

        {/* 가격 */}
        <div className="flex items-baseline justify-between">
          <div className="tabular-nums">
            <span className="text-2xl font-black text-ink-900">{r.price.toLocaleString()}</span>
            <span className="text-sm text-paper-400 ml-1">원</span>
          </div>
          <span className="text-xs text-paper-300 font-mono">{r.score}점</span>
        </div>
      </div>
    </Link>
  )
}

function TrendingSkeleton() {
  return (
    <div className="post-card p-6 animate-pulse" style={{ borderLeftColor: '#f1f5f9' }}>
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-paper-100 rounded-full w-16" />
        <div className="w-9 h-9 bg-paper-100 rounded-xl" />
      </div>
      <div className="h-4 bg-paper-100 rounded mb-2" />
      <div className="h-4 bg-paper-100 rounded w-4/5 mb-2" />
      <div className="h-4 bg-paper-100 rounded w-3/5 mb-4" />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-paper-100 rounded-full" />
        <div className="h-3 bg-paper-100 rounded w-20" />
      </div>
      <div className="h-px bg-paper-100 mb-4" />
      <div className="h-7 bg-paper-100 rounded w-28" />
    </div>
  )
}
