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

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-gradient px-6 pt-24 pb-32">
        {/* 앰비언트 글로우 */}
        <div className="absolute top-[-20%] right-[10%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
          <div className="md:col-span-7">
            {/* 배지 */}
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/25 px-4 py-2 rounded-full text-gold-400 text-sm font-medium mb-8">
              <span>🏦</span> 국내 최초 실패 데이터 마켓플레이스
            </div>

            <h1 className="text-[clamp(2.6rem,5.5vw,5.5rem)] font-black leading-[1.05] text-white mb-6">
              리스크 관리의 해답,<br />
              <span className="text-gold-400">실패 리포트</span>에<br />있습니다.
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-xl mb-10">
              FailBank는 소규모 사업자의 실패 경험을 5단계로 구조화하여 거래하는
              국내 최초의 마켓플레이스입니다. 평균 5,000~30,000원으로
              수백만 원의 시행착오를 피하세요.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/browse" className="btn-gold text-base px-8 py-4">
                리포트 둘러보기 →
              </Link>
              <Link to="/sell"
                className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-medium text-base hover:bg-white/20 transition-all">
                판매자 안내
              </Link>
            </div>

            {/* 신뢰 지표 */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
              <TrustItem num="3+" label="업종 리포트" />
              <div className="w-px h-8 bg-white/10" />
              <TrustItem num="5단계" label="구조화 템플릿" />
              <div className="w-px h-8 bg-white/10" />
              <TrustItem num="AI" label="자동 품질 평가" />
            </div>
          </div>

          {/* 글래스 스탯 카드 */}
          <div className="md:col-span-5">
            <div className="glass rounded-3xl p-8 glow-gold">
              <div className="text-xs text-slate-400 tracking-widest uppercase font-mono mb-5">
                Government Statistics 2024
              </div>
              <div className="text-8xl font-black text-gold-400 mb-2 tabular-nums leading-none">
                73.3<span className="text-4xl">%</span>
              </div>
              <div className="text-white font-semibold text-lg mb-5">재창업 기업의 5년 생존율</div>
              <div className="divider-gold mb-5" />
              <div className="text-slate-400 text-sm leading-relaxed">
                일반 창업 29.2% 대비{' '}
                <span className="text-gold-400 font-bold">2.5배</span>.
                <br />실패 경험은 가장 강력한 학습 자산입니다.
              </div>

              {/* 미니 통계 */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <MiniStat num="100.8만" label="연간 폐업자" />
                <MiniStat num="29.2%" label="창업 생존율" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────── */}
      <section className="py-16 px-6 bg-white section-divider">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard number="29.2%" label="창업 5년 생존율" sub="OECD 28개국 중 26위" />
          <StatCard number="100.8만" label="2024년 폐업자 수" sub="국세청 사상 첫 100만 돌파" />
          <StatCard number="2.5배" label="재창업자 생존율" sub="실패 경험 = 학습 자산" />
          <StatCard number="최초" label="실패 데이터 거래소" sub="국내·해외 모두 부재" highlight />
        </div>
      </section>

      {/* ── TOP REPORTS ───────────────────────────── */}
      <section className="py-24 px-6 section-divider">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge-gold mb-3 inline-flex">이번 주 인기</span>
              <h2 className="text-4xl font-black text-ink-900">인기 리포트</h2>
            </div>
            <Link to="/browse"
              className="text-sm text-paper-500 hover:text-gold-500 transition-colors hidden sm:flex items-center gap-2 font-medium">
              전체 보기 →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topReports.length > 0 ? topReports.map((r, i) => (
              <Link
                key={r.id}
                to={`/report/${r.id}`}
                className="group paper-card p-8 flex flex-col animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="badge bg-paper-100 text-paper-600 text-xs">{r.category}</span>
                  <div className={`grade-stamp shrink-0 ${r.grade === 'S' ? 'text-gold-500' : 'text-paper-400'}`}>
                    {r.grade}
                  </div>
                </div>
                <h3 className="text-lg font-bold leading-snug mb-6 text-ink-800 group-hover:text-ink-900 transition-colors line-clamp-3 flex-1">
                  {r.title}
                </h3>
                <div className="divider-gold mb-5" />
                <div className="flex items-baseline justify-between">
                  <div className="tabular-nums">
                    <span className="text-2xl font-black text-ink-900">{r.price.toLocaleString()}</span>
                    <span className="text-sm text-paper-400 ml-1">원</span>
                  </div>
                  <span className="text-xs text-paper-400 font-mono">조회 {r.view_count}</span>
                </div>
              </Link>
            )) : (
              // 스켈레톤
              [0,1,2].map(i => (
                <div key={i} className="paper-card p-8 animate-pulse">
                  <div className="h-4 bg-paper-100 rounded-lg mb-4 w-1/3" />
                  <div className="h-5 bg-paper-100 rounded-lg mb-2" />
                  <div className="h-5 bg-paper-100 rounded-lg mb-2 w-4/5" />
                  <div className="h-5 bg-paper-100 rounded-lg w-3/5" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section className="py-24 px-6 bg-white section-divider">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-sky mb-4 inline-flex">How it works</span>
            <h2 className="text-4xl font-black text-ink-900">5단계 구조화 템플릿</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { n: '01', icon: '📍', t: '배경', d: '어떤 사업을 시도했는지 맥락과 초기 투자 규모' },
              { n: '02', icon: '🚀', t: '시도', d: '어떤 전략과 채널로 어떻게 시도했는지' },
              { n: '03', icon: '🔍', t: '실패 원인', d: '핵심 실패 원인 정량 분석' },
              { n: '04', icon: '💸', t: '손실 규모', d: '금전적·시간적 손실 정량 기술' },
              { n: '05', icon: '💡', t: '교훈', d: '다음엔 달리할 구체적 행동 지침' },
            ].map((step, i) => (
              <div key={step.n} className="paper-card p-6 text-center group">
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-xs font-mono text-gold-500 mb-2">STEP {step.n}</div>
                <div className="text-base font-bold mb-2 text-ink-900">{step.t}</div>
                <div className="text-xs text-paper-500 leading-relaxed">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 px-6 bg-hero-gradient">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="badge bg-gold-500/10 border border-gold-500/25 text-gold-400 mb-6 inline-flex">
            Join FailBank
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-8 text-white leading-tight">
            당신의 시행착오가<br />
            누군가의 가장 확실한{' '}
            <span className="text-gold-400">성공 전략</span>이 됩니다.
          </h2>
          <p className="text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto text-lg">
            과거의 위기 극복 경험을 정형화된 데이터 리포트로 자산화하세요.
            초기 100명 파트너에게는 플랫폼 수수료 0% 혜택을 전액 보장합니다.
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

function TrustItem({ num, label }) {
  return (
    <div>
      <div className="text-xl font-black text-white">{num}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

function MiniStat({ num, label }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 text-center">
      <div className="text-lg font-black text-white tabular-nums">{num}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

function StatCard({ number, label, sub, highlight = false }) {
  return (
    <div className={`rounded-2xl p-6 ${highlight
      ? 'bg-ink-900 border border-ink-800'
      : 'bg-white border border-paper-100 shadow-card'}`}>
      <div className={`text-4xl md:text-5xl font-black mb-2 tabular-nums ${highlight ? 'text-gold-400' : 'text-ink-900'}`}>
        {number}
      </div>
      <div className={`text-sm font-semibold mb-1 ${highlight ? 'text-white' : 'text-ink-800'}`}>{label}</div>
      <div className="text-xs text-paper-400">{sub}</div>
    </div>
  )
}
