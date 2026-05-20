import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { listReports } from '../lib/reports'

export default function HomePage() {
  const [topReports, setTopReports] = useState([])

  useEffect(() => {
    listReports({ sortBy: 'popular' }).then(r => setTopReports(r.slice(0, 3)))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6">

      {/* HERO — editorial newspaper style */}
      <section className="pt-16 pb-20 border-b border-ink-900/20">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-6 font-mono">
              Vol. 01 — 시행착오 자산화 플랫폼
            </div>
            <h1 className="serif-display text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tightest text-ink-900 mb-8">
              성공 확률을 높이는<br/>
              <span className="italic text-navy-800">리스크</span>관리,<br/>
              실패 리포트에서 답을 찾으세요.
            </h1>
            <p className="text-lg text-ink-700 leading-relaxed max-w-xl mb-10">
              FailBank는 소규모 사업자의 실패 경험을 5단계로 구조화하여 거래하는
              국내 최초의 마켓플레이스입니다. 평균 5,000~30,000원으로
              수백만 원의 시행착오를 피하세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/browse" className="btn-primary inline-block">리포트 둘러보기</Link>
              <Link to="/sell" className="btn-secondary inline-block">판매자 안내</Link>
            </div>
          </div>

          <div className="md:col-span-4">
            {/* Sidebar pull quote */}
            <div className="paper-card p-6 border-l-4 border-navy-700">
              <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-3">
                Government Statistics 2024
              </div>
              <div className="serif-display text-5xl font-black text-navy-800 mb-1 tabular-nums">
                73.3<span className="text-2xl">%</span>
              </div>
              <div className="text-sm text-ink-700 mb-4">
                재창업 기업의 5년 생존율
              </div>
              <div className="text-xs text-ink-500 border-t border-ink-900/10 pt-3">
                일반 창업 29.2% 대비 <span className="text-navy-800 font-medium">2.5배</span>.
                <br/>실패 경험은 가장 강력한 학습 자산입니다.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY STATS BAND */}
      <section className="py-16 border-b border-ink-900/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-900/10">
          <Stat number="29.2%" label="창업 5년 생존율" sub="OECD 28개국 중 26위" />
          <Stat number="100.8만" label="2024년 폐업자 수" sub="국세청 사상 첫 100만 돌파" />
          <Stat number="2.5배" label="재창업자 생존율" sub="실패 경험 = 학습 자산" />
          <Stat number="0개" label="실패 데이터 거래소" sub="국내·해외 모두 부재" highlight />
        </div>
      </section>

      {/* TOP REPORTS */}
      <section className="py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-3 font-mono">
              This week's reports
            </div>
            <h2 className="serif-display text-4xl font-black tracking-tightest">
              이번 주 인기 리포트
            </h2>
          </div>
          <Link to="/browse" className="text-sm text-ink-700 hover:text-navy-800 hidden sm:block">
            전체 보기 →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {topReports.map((r, i) => (
            <Link
              key={r.id}
              to={`/report/${r.id}`}
              className="group paper-card p-6 hover:border-navy-700 transition-colors animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono">
                  {r.category}
                </div>
                <div className={`grade-stamp text-sm ${
                  r.grade === 'S' ? 'text-navy-800' :
                  r.grade === 'A' ? 'text-ink-700' : 'text-ink-700'
                }`} style={{ width: '2.25rem', height: '2.25rem', fontSize: '1rem' }}>
                  {r.grade}
                </div>
              </div>
              <h3 className="serif-display text-xl font-bold leading-tight mb-4 group-hover:text-navy-800 transition-colors line-clamp-3">
                {r.title}
              </h3>
              <div className="flex items-baseline justify-between pt-4 border-t border-ink-900/10">
                <div className="tabular-nums">
                  <span className="text-2xl font-bold text-ink-900">{r.price.toLocaleString()}</span>
                  <span className="text-sm text-ink-500">원</span>
                </div>
                <div className="text-xs text-ink-500 font-mono">
                  조회 {r.view_count}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-t border-ink-900/10">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-3 font-mono">
          How it works
        </div>
        <h2 className="serif-display text-4xl font-black tracking-tightest mb-12">
          5단계 구조화 템플릿
        </h2>
        <div className="grid md:grid-cols-5 gap-6">
          {[
            { n: '01', t: '배경', d: '어떤 사업을 시도했는지 맥락' },
            { n: '02', t: '시도', d: '어떤 전략과 방법을 시도했는지' },
            { n: '03', t: '실패 원인', d: '핵심 실패 원인 분석' },
            { n: '04', t: '손실 규모', d: '금전적·시간적 손실 정량 기술' },
            { n: '05', t: '교훈', d: '다음에는 다를 행동' },
          ].map((step, i) => (
            <div key={step.n} className="relative">
              <div className="font-mono text-xs text-navy-800 mb-3 tracking-widest">
                STEP {step.n}
              </div>
              <div className="serif-display text-2xl font-bold mb-2">{step.t}</div>
              <div className="text-sm text-ink-500 leading-relaxed">{step.d}</div>
              {i < 4 && (
                <div className="hidden md:block absolute top-4 -right-3 text-ink-300">→</div>
              )}
            </div>
          ))}
        </div>
      </section>

     {/* CTA - 배경색을 없애고 문구를 더 프로페셔널하게 다듬은 버전 */}
<section className="py-20 mt-12 text-ink-900 px-6">
  <div className="max-w-3xl mx-auto"> {/* 중앙 정렬을 위해 mx-auto 추가 */}
    <div className="text-xs tracking-[0.3em] text-navy-600 uppercase mb-4 font-mono">
      Join FailBank
    </div>
    <h2 className="serif-display text-4xl sm:text-5xl font-black tracking-tightest mb-6 leading-tight">
      당신의 시행착오가<br/>누군가의 가장 확실한 <span className="text-navy-600">성공 전략</span>이 됩니다.
    </h2>
    <p className="text-ink-700 mb-8 leading-relaxed"> {/* 배경이 밝아져서 글자색을 어둡게 변경 */}
      과거의 위기 극복 경험을 정형화된 데이터 리포트로 자산화하세요.<br />
      초기 100명의 파트너에게는 플랫폼 수수료 0% — 정산 100% 혜택을 전액 보장합니다.
    </p>
    <div className="flex flex-wrap gap-4">
      <Link
        to="/sell"
        className="inline-block bg-navy-700 text-white px-8 py-4 font-medium tracking-tight hover:bg-navy-600 transition-colors"
      >
        판매자 혜택 보기 →
      </Link>
      <Link
        to="/submit"
        className="inline-block bg-transparent text-ink-900 border border-ink-400 px-8 py-4 font-medium tracking-tight hover:bg-ink-100 transition-colors"
      > {/* 밝은 배경에 맞게 버튼 스타일 수정 */}
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
    <div className={`p-6 ${highlight ? 'bg-navy-700 text-white' : 'bg-white'}`}>
      <div className={`serif-display text-3xl md:text-4xl font-black mb-1 tabular-nums tracking-tightest ${
        highlight ? '' : 'text-ink-900'
      }`}>
        {number}
      </div>
      <div className={`text-sm font-medium mb-1 ${highlight ? '' : 'text-ink-900'}`}>
        {label}
      </div>
      <div className={`text-xs ${highlight ? 'text-ink-200' : 'text-ink-500'}`}>
        {sub}
      </div>
    </div>
  )
}
