import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { listReports } from '../lib/reports'

export default function HomePage() {
  const [topReports, setTopReports] = useState([])

  useEffect(() => {
    listReports({ sortBy: 'popular' }).then(r => setTopReports(r.slice(0, 3)))
  }, [])

  return (
    <div className="bg-void-900">

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col justify-end pb-20 px-6 border-b border-void-500/30 overflow-hidden">
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-br from-void-900 via-void-800 to-void-900" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="text-[9px] tracking-[0.4em] text-gold-400 uppercase mb-8 font-mono">
                Vol. 01 — 시행착오 자산화 플랫폼
              </div>
              <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tightest text-cream-900 mb-8">
                리스크 관리의<br />
                해답,{' '}
                <span className="gold-shimmer">실패 리포트</span>
                <br />에 있습니다.
              </h1>
              <p className="text-lg text-cream-600 leading-relaxed max-w-xl mb-10">
                FailBank는 소규모 사업자의 실패 경험을 5단계로 구조화하여 거래하는
                국내 최초의 마켓플레이스입니다. 평균 5,000~30,000원으로
                수백만 원의 시행착오를 피하세요.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/browse" className="btn-primary text-base px-8 py-4">
                  리포트 둘러보기
                </Link>
                <Link to="/sell" className="btn-secondary text-base px-8 py-4">
                  판매자 안내
                </Link>
              </div>
            </div>

            <div className="md:col-span-4">
              <div className="border border-gold-500/30 bg-void-800/80 backdrop-blur-sm p-8">
                <div className="text-[9px] tracking-[0.3em] text-gold-400/70 uppercase font-mono mb-4">
                  Government Statistics 2024
                </div>
                <div className="text-7xl font-black text-gold-400 mb-2 tabular-nums tracking-tightest">
                  73.3<span className="text-3xl">%</span>
                </div>
                <div className="text-sm text-cream-700 mb-5">재창업 기업의 5년 생존율</div>
                <div className="divider-gold mb-5" />
                <div className="text-xs text-void-50 leading-relaxed">
                  일반 창업 29.2% 대비{' '}
                  <span className="text-gold-400 font-semibold">2.5배</span>.
                  <br />실패 경험은 가장 강력한 학습 자산입니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="border-b border-void-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-void-500/30">
            <Stat number="29.2%" label="창업 5년 생존율" sub="OECD 28개국 중 26위" />
            <Stat number="100.8만" label="2024년 폐업자 수" sub="국세청 사상 첫 100만 돌파" />
            <Stat number="2.5배" label="재창업자 생존율" sub="실패 경험 = 학습 자산" />
            <Stat number="0개" label="실패 데이터 거래소" sub="국내·해외 모두 부재" highlight />
          </div>
        </div>
      </section>

      {/* TOP REPORTS */}
      <section className="py-24 px-6 border-b border-void-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-[9px] tracking-[0.4em] text-gold-400 uppercase mb-3 font-mono">
                This week's reports
              </div>
              <h2 className="text-4xl font-black tracking-tightest text-cream-900">
                이번 주 인기 리포트
              </h2>
            </div>
            <Link to="/browse" className="text-sm text-void-50 hover:text-gold-400 transition-colors hidden sm:flex items-center gap-2 font-mono">
              전체 보기 <span>→</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-void-500/20">
            {topReports.map((r, i) => (
              <Link
                key={r.id}
                to={`/report/${r.id}`}
                className="group bg-void-900 hover:bg-void-800 transition-colors p-8 animate-fade-up flex flex-col"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-[9px] tracking-[0.3em] text-void-100 uppercase font-mono">
                    {r.category}
                  </div>
                  <div
                    className={`grade-stamp text-sm ${
                      r.grade === 'S' ? 'text-gold-400 border-gold-500/50' : 'text-cream-600 border-void-300'
                    }`}
                    style={{ width: '2.25rem', height: '2.25rem', fontSize: '1rem' }}
                  >
                    {r.grade}
                  </div>
                </div>
                <h3 className="text-xl font-bold leading-tight mb-6 text-cream-800 group-hover:text-cream-900 transition-colors line-clamp-3 flex-1">
                  {r.title}
                </h3>
                <div className="divider-gold mb-5" />
                <div className="flex items-baseline justify-between">
                  <div className="tabular-nums">
                    <span className="text-2xl font-bold text-gold-400">{r.price.toLocaleString()}</span>
                    <span className="text-sm text-void-100 ml-1">원</span>
                  </div>
                  <div className="text-xs text-void-100 font-mono">
                    조회 {r.view_count}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 border-b border-void-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-[9px] tracking-[0.4em] text-gold-400 uppercase mb-3 font-mono">
            How it works
          </div>
          <h2 className="text-4xl font-black tracking-tightest text-cream-900 mb-16">
            5단계 구조화 템플릿
          </h2>
          <div className="grid md:grid-cols-5 gap-0 divide-x divide-void-500/30">
            {[
              { n: '01', t: '배경', d: '어떤 사업을 시도했는지 맥락' },
              { n: '02', t: '시도', d: '어떤 전략과 방법을 시도했는지' },
              { n: '03', t: '실패 원인', d: '핵심 실패 원인 분석' },
              { n: '04', t: '손실 규모', d: '금전적·시간적 손실 정량 기술' },
              { n: '05', t: '교훈', d: '다음에는 다를 행동' },
            ].map((step) => (
              <div key={step.n} className="px-6 py-4">
                <div className="font-mono text-[9px] text-gold-400/70 mb-4 tracking-widest">
                  STEP {step.n}
                </div>
                <div className="text-xl font-bold mb-2 text-cream-900">{step.t}</div>
                <div className="text-sm text-void-50 leading-relaxed">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-void-900 via-void-800 to-void-900" />
        <div className="absolute inset-0 bg-gold-500/3" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="text-[9px] tracking-[0.4em] text-gold-400 uppercase mb-6 font-mono">
            Join FailBank
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tightest mb-8 text-cream-900 leading-tight">
            당신의 시행착오가<br />
            누군가의 가장 확실한{' '}
            <span className="text-gold-400">성공 전략</span>
            이 됩니다.
          </h2>
          <p className="text-cream-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            과거의 위기 극복 경험을 정형화된 데이터 리포트로 자산화하세요.
            초기 100명의 파트너에게는 플랫폼 수수료 0% — 정산 100% 혜택을 전액 보장합니다.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/sell" className="btn-primary text-base px-10 py-4">
              판매자 혜택 보기 →
            </Link>
            <Link to="/submit" className="btn-secondary text-base px-10 py-4">
              바로 작성하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ number, label, sub, highlight = false }) {
  return (
    <div className={`px-8 py-12 ${highlight ? 'bg-gold-500/10' : ''}`}>
      <div className={`text-4xl md:text-5xl font-black mb-2 tabular-nums tracking-tightest ${
        highlight ? 'text-gold-400' : 'text-cream-900'
      }`}>
        {number}
      </div>
      <div className={`text-sm font-semibold mb-1 ${highlight ? 'text-gold-300' : 'text-cream-800'}`}>
        {label}
      </div>
      <div className="text-xs text-void-100">{sub}</div>
    </div>
  )
}
