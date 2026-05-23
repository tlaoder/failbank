import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function SellPage() {
  const [score, setScore] = useState(85)
  const [monthlySales, setMonthlySales] = useState(20)
  const [tier, setTier] = useState('basic')

  const calc = useMemo(() => {
    const tierData = {
      basic:      { name: '기본형',       basePrice: 10000,  commissionBase: 0.20, premium: 0 },
      premium:    { name: '프리미엄형',   basePrice: 25000,  commissionBase: 0.20, premium: 30000 },
      enterprise: { name: '엔터프라이즈', basePrice: 500000, commissionBase: 0.15, premium: 0 },
    }
    const t = tierData[tier]
    const commission = score >= 90 ? t.commissionBase - 0.05 : score >= 80 ? t.commissionBase : score >= 70 ? t.commissionBase + 0.02 : t.commissionBase + 0.05
    const priceAdjust = score >= 90 ? 1.4 : score >= 80 ? 1.0 : score >= 70 ? 0.7 : 0.4
    const reportPrice = Math.round(t.basePrice * priceAdjust)
    const perSale = Math.round(reportPrice * (1 - commission)) + t.premium
    const monthly = perSale * monthlySales
    const bootstrapBonus = Math.round(reportPrice * commission) * monthlySales
    return { tierName: t.name, reportPrice, perSale, monthly, annual: monthly * 12, commission: (commission * 100).toFixed(0), bootstrapBonus }
  }, [score, monthlySales, tier])

  return (
    <div className="bg-paper-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <header className="border-b border-paper-300 pb-12 mb-16">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-4">For Sellers</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tightest leading-[1.05] mb-6 text-ink-900">
            폐업했는데<br /><span className="italic text-gold-500">왜 글까지 써야</span> 합니까?
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed max-w-2xl">
            솔직히 말합니다. 1건당 4,000원 받자고 시간 쓸 사람은 없습니다.
            그래서 FailBank는 판매자 유인을 4단으로 설계했습니다.
          </p>
        </header>

        <section className="mb-20">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">The Four Motives</div>
          <h2 className="text-4xl font-black tracking-tightest mb-10 text-ink-900">판매자가 글을 쓰는 4가지 이유</h2>
          <div className="grid md:grid-cols-2 gap-px bg-paper-200">
            <MotiveCard n="01" title="진짜 수익" subtitle="프리미엄 티어 도입" body="기본 리포트만으론 부족합니다. 1:1 상담·영상 인터뷰 옵션을 추가해 회당 25,000~30,000원, 엔터프라이즈는 50만원 이상까지 가능합니다." highlight />
            <MotiveCard n="02" title="경험의 자산화" subtitle="실패가 데이터가 됨" body="구두로 한 번 친구에게 한탄하고 끝날 경험을, 구조화된 리포트로 영구 보존합니다. 5년 후에도 누군가 당신의 이야기를 읽고 같은 실수를 피합니다." />
            <MotiveCard n="03" title="후배 창업자 기여" subtitle="익명도 가능" body="이름을 드러내고 싶지 않아도 됩니다. 익명·업종 공개·실명 검증의 3단계 중 선택할 수 있습니다." />
            <MotiveCard n="04" title="정부 정책과의 연동" subtitle="재도전펀드 1,333억원" body="중소벤처기업부 재도전펀드 수혜자는 의무 활동의 일부로 본 플랫폼 등록을 인정받을 수 있도록 협의 중입니다." />
          </div>
        </section>

        <section className="mb-20 -mx-6 px-6 py-16 bg-ink-900">
          <div className="max-w-4xl">
            <div className="text-[9px] tracking-[0.4em] text-paper-400 uppercase font-mono mb-4">Bootstrap Campaign</div>
            <h2 className="text-5xl font-black tracking-tightest mb-6 leading-tight text-paper-50">
              처음 100명, 수수료 <span className="italic text-gold-400">0%</span>.
            </h2>
            <p className="text-paper-400 text-lg leading-relaxed mb-10 max-w-2xl">
              양면 플랫폼은 초기 공급자가 가장 어렵습니다 (Rochet & Tirole, 2003).
              그래서 첫 100명 판매자에게 <strong className="text-paper-100">수수료를 받지 않습니다.</strong>
            </p>
            <div className="grid sm:grid-cols-3 gap-px bg-ink-700">
              <BootstrapStat n="0%" l="첫 100명 수수료" />
              <BootstrapStat n="3개월" l="캠페인 기간" />
              <BootstrapStat n="100%" l="판매자 정산" />
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">Earnings Calculator</div>
          <h2 className="text-4xl font-black tracking-tightest mb-3 text-ink-900">내 수익은 얼마일까?</h2>
          <p className="text-ink-500 mb-10 max-w-2xl">품질 점수와 월 판매량을 조절해보세요.</p>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="text-[9px] tracking-[0.3em] text-paper-500 uppercase font-mono mb-3">티어 선택</div>
                <div className="grid grid-cols-3 gap-2">
                  <TierButton active={tier === 'basic'} onClick={() => setTier('basic')} label="기본형" sub="~10,000원" />
                  <TierButton active={tier === 'premium'} onClick={() => setTier('premium')} label="프리미엄형" sub="1:1 상담 포함" />
                  <TierButton active={tier === 'enterprise'} onClick={() => setTier('enterprise')} label="엔터프라이즈" sub="VC·기업용" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-[9px] tracking-[0.3em] text-paper-500 uppercase font-mono">AI 품질 점수</span>
                  <span className="text-2xl font-black tabular-nums text-ink-900">{score}<span className="text-sm text-paper-500">/100</span></span>
                </div>
                <input type="range" min="50" max="100" value={score} onChange={e => setScore(Number(e.target.value))} className="w-full accent-gold-500" />
                <div className="flex justify-between text-[9px] text-paper-400 font-mono mt-1">
                  <span>D 50</span><span>C 60</span><span>B 70</span><span>A 80</span><span>S 90+</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-[9px] tracking-[0.3em] text-paper-500 uppercase font-mono">월 예상 판매량</span>
                  <span className="text-2xl font-black tabular-nums text-ink-900">{monthlySales}<span className="text-sm text-paper-500"> 건</span></span>
                </div>
                <input type="range" min="1" max="100" value={monthlySales} onChange={e => setMonthlySales(Number(e.target.value))} className="w-full accent-gold-500" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-paper-200 bg-white p-8 sticky top-24">
                <div className="text-[9px] tracking-[0.3em] text-gold-500 uppercase font-mono mb-6">예상 정산액 · {calc.tierName}</div>
                <div className="pb-5 border-b border-paper-200 mb-5">
                  <div className="text-xs text-paper-500 mb-1">리포트 1건당 가격</div>
                  <div className="text-3xl font-black tabular-nums text-ink-900">{calc.reportPrice.toLocaleString()}<span className="text-base text-paper-400 ml-1">원</span></div>
                  <div className="text-xs text-paper-400 font-mono mt-1">수수료 {calc.commission}% → 정산 {calc.perSale.toLocaleString()}원/건</div>
                </div>
                <div className="pb-5 border-b border-paper-200 mb-5">
                  <div className="text-xs text-paper-500 mb-1">월 정산 예상</div>
                  <div className="text-4xl font-black text-gold-500 tabular-nums">{calc.monthly.toLocaleString()}<span className="text-base text-paper-400 ml-1">원</span></div>
                </div>
                <div>
                  <div className="text-xs text-paper-500 mb-1">연간 정산 예상</div>
                  <div className="text-3xl font-black tabular-nums text-ink-900">{calc.annual.toLocaleString()}<span className="text-base text-paper-400 ml-1">원</span></div>
                </div>
                {calc.bootstrapBonus > 0 && (
                  <div className="mt-6 p-4 bg-gold-100 border-l-2 border-gold-400 text-xs text-ink-700">
                    부트스트랩 기간 추가 +{calc.bootstrapBonus.toLocaleString()}원/월
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="text-center py-16 border-t border-paper-300">
          <h2 className="text-3xl font-black tracking-tightest mb-6 text-ink-900">준비됐다면, 첫 리포트를 써보세요.</h2>
          <Link to="/submit" className="btn-primary inline-block text-base px-10 py-4">리포트 작성 시작하기 →</Link>
          <p className="text-xs text-paper-400 mt-4 font-mono">첫 100명 수수료 0% · 5단계 템플릿 30분 작성</p>
        </section>

      </div>
    </div>
  )
}

function MotiveCard({ n, title, subtitle, body, highlight = false }) {
  return (
    <div className={`p-8 ${highlight ? 'bg-paper-100' : 'bg-white'}`}>
      <div className="font-mono text-[9px] text-gold-500 tracking-widest mb-2">MOTIVE {n}</div>
      <div className="text-2xl font-bold mb-1 text-ink-900">{title}</div>
      <div className="text-[9px] text-paper-500 uppercase tracking-[0.15em] mb-4 font-mono">{subtitle}</div>
      <p className="text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  )
}

function BootstrapStat({ n, l }) {
  return (
    <div className="bg-ink-800 p-6">
      <div className="text-4xl font-black tabular-nums tracking-tightest text-paper-50">{n}</div>
      <div className="text-xs text-paper-500 mt-1">{l}</div>
    </div>
  )
}

function TierButton({ active, onClick, label, sub }) {
  return (
    <button onClick={onClick} className={`p-3 text-left transition-colors border-2 ${active ? 'bg-ink-900 text-paper-50 border-ink-900' : 'bg-white text-ink-700 border-paper-300 hover:border-ink-600'}`}>
      <div className="text-sm font-medium">{label}</div>
      <div className={`text-[9px] font-mono mt-0.5 ${active ? 'text-paper-400' : 'text-paper-500'}`}>{sub}</div>
    </button>
  )
}
