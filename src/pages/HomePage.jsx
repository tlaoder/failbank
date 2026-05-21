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

      {/* HERO */}
      <section className="border-b border-paper-300 px-6 pt-20 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-6 font-mono">
              Vol. 01 — 시행착오 자산화 플랫폼
            </div>
            <h1 className="text-[clamp(2.8rem,7vw,6rem)] font-black leading-[0.92] tracking-tightest text-ink-900 mb-8">
              리스크 관리의 해답,<br />
              <span className="text-gold-500">실패 리포트</span>에<br />있습니다.
            </h1>
            <p className="text-lg text-ink-500 leading-relaxed max-w-xl mb-10">
              FailBank는 소규모 사업자의 실패 경험을 5단계로 구조화하여 거래하는
              국내 최초의 마켓플레이스입니다. 평균 5,000~30,000원으로
              수백만 원의 시행착오를 피하세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/browse" className="btn-primary text-base px-8 py-4">리포트 둘러보기</Link>
              <Link to="/sell" className="btn-secondary text-base px-8 py-4">판매자 안내</Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="border border-paper-300 bg-white p-8">
              <div className="text-[9px] tracking-[0.3em] text-paper-500 uppercase font-mono mb-4">
                Government Statistics 2024
              </div>
              <div className="text-7xl font-black text-gold-500 mb-2 tabular-nums tracking-tightest">
                73.3<span className="text-3xl">%</span>
              </div>
              <div className="text-sm text-ink-600 mb-5">재창업 기업의 5년 생존율</div>
              <div className="divider-gold mb-5" />
              <div className="text-xs text-paper-600 leading-relaxed">
                일반 창업 29.2% 대비{' '}
                <span className="text-gold-500 font-semibold">2.5배</span>.
                <br />실패 경험은 가장 강력한 학습 자산입니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-paper-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-paper-300">
            <Stat number="29.2%" label="창업 5년 생존율" sub="OECD 28개국 중 26위" />
            <Stat number="100.8만" label="2024년 폐업자 수" sub="국세청 사상 첫 100만 돌파" />
            <Stat number="2.5배" label="재창업자 생존율" sub="실패 경험 = 학습 자산" />
            <Stat number="0개" label="실패 데이터 거래소" sub="국내·해외 모두 부재" highlight />
          </div>
        </div>
      </section>

      {/* TOP REPORTS */}
      <section className="py-24 px-6 border-b border-paper-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">This week</div>
              <h2 className="text-4xl font-black tracking-tightest text-ink-900">이번 주 인기 리포트</h2>
            </div>
            <Link to="/browse" className="text-sm text-ink-400 hover:text-gold-500 transition-colors hidden sm:flex items-center gap-2 font-mono">
              전체 보기 →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-paper-200">
            {topReports.map((r, i) => (
              <Link
                key={r.id}
                to={`/report/${r.id}`}
                className="group bg-white hover:bg-paper-50 transition-colors p-8 flex flex-col animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="text-[9px] tracking-[0.3em] text-paper-500 uppercase font-mono">{r.category}</div>
                  <div className={`grade-stamp ${r.grade === 'S' ? 'text-gold-500' : 'text-ink-400'}`}
                    style={{ width: '2.25rem', height: '2.25rem', fontSize: '1rem' }}>
                    {r.grade}
                  </div>
                </div>
                <h3 className="text-xl font-bold leading-tight mb-6 text-ink-800 group-hover:text-ink-900 transition-colors line-clamp-3 flex-1">
                  {r.title}
                </h3>
                <div className="divider-gold mb-5" />
                <div className="flex items-baseline justify-between">
                  <div className="tabular-nums">
                    <span className="text-2xl font-bold text-ink-900">{r.price.toLocaleString()}</span>
                    <span className="text-sm text-paper-500 ml-1">원</span>
                  </div>
                  <div className="text-xs text-paper-500 font-mono">조회 {r.view_count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 border-b border-paper-300 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">How it works</div>
          <h2 className="text-4xl font-black tracking-tightest text-ink-900 mb-16">5단계 구조화 템플릿</h2>
          <div className="grid md:grid-cols-5 divide-x divide-paper-200">
            {[
              { n: '01', t: '배경', d: '어떤 사업을 시도했는지 맥락' },
              { n: '02', t: '시도', d: '어떤 전략과 방법을 시도했는지' },
              { n: '03', t: '실패 원인', d: '핵심 실패 원인 분석' },
              { n: '04', t: '손실 규모', d: '금전적·시간적 손실 정량 기술' },
              { n: '05', t: '교훈', d: '다음에는 다를 행동' },
            ].map(step => (
              <div key={step.n} className="px-6 py-2">
                <div className="font-mono text-[9px] text-gold-500/70 mb-4 tracking-widest">STEP {step.n}</div>
                <div className="text-xl font-bold mb-2 text-ink-900">{step.t}</div>
                <div className="text-sm text-ink-500 leading-relaxed">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-ink-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[9px] tracking-[0.4em] text-gold-400 uppercase mb-6 font-mono">Join FailBank</div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tightest mb-8 text-paper-50 leading-tight">
            당신의 시행착오가<br />
            누군가의 가장 확실한{' '}
            <span className="text-gold-400">성공 전략</span>이 됩니다.
          </h2>
          <p className="text-paper-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            과거의 위기 극복 경험을 정형화된 데이터 리포트로 자산화하세요.
            초기 100명의 파트너에게는 플랫폼 수수료 0% — 정산 100% 혜택을 전액 보장합니다.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/sell" className="bg-gold-400 text-ink-900 px-10 py-4 font-semibold hover:bg-gold-300 transition-colors text-base">
              판매자 혜택 보기 →
            </Link>
            <Link to="/submit" className="border border-paper-600 text-paper-300 px-10 py-4 font-medium hover:border-paper-400 hover:text-paper-100 transition-colors text-base">
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
    <div className={`px-8 py-12 ${highlight ? 'bg-ink-900' : 'bg-paper-50'}`}>
      <div className={`text-4xl md:text-5xl font-black mb-2 tabular-nums tracking-tightest ${highlight ? 'text-gold-400' : 'text-ink-900'}`}>
        {number}
      </div>
      <div className={`text-sm font-semibold mb-1 ${highlight ? 'text-paper-200' : 'text-ink-800'}`}>{label}</div>
      <div className={`text-xs ${highlight ? 'text-paper-500' : 'text-paper-500'}`}>{sub}</div>
    </div>
  )
}
