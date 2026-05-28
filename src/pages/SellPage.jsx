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
    const commission = score >= 90 ? t.commissionBase - 0.05
      : score >= 80 ? t.commissionBase
      : score >= 70 ? t.commissionBase + 0.02
      : t.commissionBase + 0.05
    const priceAdjust = score >= 90 ? 1.4 : score >= 80 ? 1.0 : score >= 70 ? 0.7 : 0.4
    const reportPrice = Math.round(t.basePrice * priceAdjust)
    const perSale = Math.round(reportPrice * (1 - commission)) + t.premium
    const monthly = perSale * monthlySales
    const bootstrapBonus = Math.round(reportPrice * commission) * monthlySales
    return {
      tierName: t.name, reportPrice, perSale, monthly,
      annual: monthly * 12, commission: (commission * 100).toFixed(0), bootstrapBonus,
    }
  }, [score, monthlySales, tier])

  return (
    <div className="bg-paper-50 dark:bg-[#070d1a] min-h-screen">

      {/* ── HERO ── */}
      <div className="bg-hero-gradient px-6 pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-[15%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <span className="badge bg-gold-500/10 border border-gold-500/25 text-gold-400 mb-6 inline-flex">
            For Sellers
          </span>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-6 text-white">
            폐업했는데<br />
            <span className="text-gold-400 italic">왜 글까지 써야</span> 합니까?
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            솔직히 말합니다. 1건당 4,000원 받자고 시간 쓸 사람은 없습니다.
            그래서 FailBank는 판매자 유인을 4단으로 설계했습니다.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ── 4가지 이유 ── */}
        <section className="mb-20">
          <span className="badge-gold mb-4 inline-flex">The Four Motives</span>
          <h2 className="text-4xl font-black mb-10 text-ink-900 dark:text-paper-50">판매자가 글을 쓰는 4가지 이유</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <MotiveCard n="01" title="진짜 수익" subtitle="프리미엄 티어 도입" highlight
              body="기본 리포트만으론 부족합니다. 1:1 상담·영상 인터뷰 옵션을 추가해 회당 25,000~30,000원, 엔터프라이즈는 50만원 이상까지 가능합니다." />
            <MotiveCard n="02" title="경험의 자산화" subtitle="실패가 데이터가 됨"
              body="구두로 한 번 친구에게 한탄하고 끝날 경험을, 구조화된 리포트로 영구 보존합니다. 5년 후에도 누군가 당신의 이야기를 읽고 같은 실수를 피합니다." />
            <MotiveCard n="03" title="후배 창업자 기여" subtitle="익명도 가능"
              body="이름을 드러내고 싶지 않아도 됩니다. 익명·업종 공개·실명 검증의 3단계 중 선택할 수 있습니다." />
            <MotiveCard n="04" title="정부 정책과의 연동" subtitle="재도전펀드 1,333억원"
              body="중소벤처기업부 재도전펀드 수혜자는 의무 활동의 일부로 본 플랫폼 등록을 인정받을 수 있도록 협의 중입니다." />
          </div>
        </section>

        {/* ── 부트스트랩 캠페인 ── */}
        <section className="mb-20">
          <div className="bg-ink-900 rounded-3xl px-10 py-14 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />
            <div className="max-w-3xl relative z-10">
              <span className="badge bg-gold-500/15 border border-gold-500/30 text-gold-400 mb-5 inline-flex">
                Bootstrap Campaign
              </span>
              <h2 className="text-5xl font-black mb-5 leading-tight text-white">
                처음 100명, 수수료 <span className="text-gold-400 italic">0%</span>.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl">
                양면 플랫폼은 초기 공급자가 가장 어렵습니다 (Rochet & Tirole, 2003).
                그래서 첫 100명 판매자에게{' '}
                <strong className="text-white">수수료를 받지 않습니다.</strong>
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <BootstrapStat n="0%" l="첫 100명 수수료" />
                <BootstrapStat n="3개월" l="캠페인 기간" />
                <BootstrapStat n="100%" l="판매자 정산" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 수익 계산기 ── */}
        <section className="mb-20">
          <span className="badge-sky mb-4 inline-flex">Earnings Calculator</span>
          <h2 className="text-4xl font-black mb-2 text-ink-900 dark:text-paper-50">내 수익은 얼마일까?</h2>
          <p className="text-paper-400 dark:text-paper-500 mb-10">품질 점수와 월 판매량을 조절해보세요.</p>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              {/* 티어 선택 */}
              <div>
                <div className="text-xs font-semibold text-paper-400 uppercase tracking-wider mb-3">티어 선택</div>
                <div className="grid grid-cols-3 gap-2">
                  <TierButton active={tier === 'basic'} onClick={() => setTier('basic')} label="기본형" sub="~10,000원" />
                  <TierButton active={tier === 'premium'} onClick={() => setTier('premium')} label="프리미엄형" sub="1:1 상담 포함" />
                  <TierButton active={tier === 'enterprise'} onClick={() => setTier('enterprise')} label="엔터프라이즈" sub="VC·기업용" />
                </div>
              </div>

              {/* 점수 슬라이더 */}
              <div className="paper-card p-6">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-sm font-semibold text-ink-700 dark:text-paper-200">AI 품질 점수</span>
                  <span className="text-3xl font-black tabular-nums text-ink-900 dark:text-paper-50">
                    {score}<span className="text-base text-paper-400 ml-1">/100</span>
                  </span>
                </div>
                <input
                  type="range" min="50" max="100" value={score}
                  onChange={e => setScore(Number(e.target.value))}
                  className="w-full accent-gold-500 mb-3"
                />
                <div className="flex justify-between text-xs text-paper-400 font-mono">
                  <span>D 50</span><span>C 60</span><span>B 70</span><span>A 80</span><span>S 90+</span>
                </div>
              </div>

              {/* 판매량 슬라이더 */}
              <div className="paper-card p-6">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-sm font-semibold text-ink-700 dark:text-paper-200">월 예상 판매량</span>
                  <span className="text-3xl font-black tabular-nums text-ink-900 dark:text-paper-50">
                    {monthlySales}<span className="text-base text-paper-400 ml-1">건</span>
                  </span>
                </div>
                <input
                  type="range" min="1" max="100" value={monthlySales}
                  onChange={e => setMonthlySales(Number(e.target.value))}
                  className="w-full accent-gold-500"
                />
              </div>
            </div>

            {/* 결과 카드 */}
            <div className="lg:col-span-5">
              <div className="paper-card p-8 sticky top-24">
                <div className="text-xs font-semibold text-paper-400 uppercase tracking-wider mb-6">
                  예상 정산액 · {calc.tierName}
                </div>

                <div className="space-y-5">
                  <div className="pb-5 border-b border-paper-100 dark:border-ink-600">
                    <div className="text-xs text-paper-400 mb-1">리포트 1건당 가격</div>
                    <div className="text-3xl font-black tabular-nums text-ink-900 dark:text-paper-50">
                      {calc.reportPrice.toLocaleString()}
                      <span className="text-base text-paper-400 ml-1">원</span>
                    </div>
                    <div className="text-xs text-paper-400 font-mono mt-1">
                      수수료 {calc.commission}% → 정산 {calc.perSale.toLocaleString()}원/건
                    </div>
                  </div>

                  <div className="pb-5 border-b border-paper-100 dark:border-ink-600">
                    <div className="text-xs text-paper-400 mb-1">월 정산 예상</div>
                    <div className="text-4xl font-black text-gold-500 tabular-nums">
                      {calc.monthly.toLocaleString()}
                      <span className="text-base text-paper-400 ml-1">원</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-paper-400 mb-1">연간 정산 예상</div>
                    <div className="text-3xl font-black tabular-nums text-ink-900 dark:text-paper-50">
                      {calc.annual.toLocaleString()}
                      <span className="text-base text-paper-400 ml-1">원</span>
                    </div>
                  </div>
                </div>

                {calc.bootstrapBonus > 0 && (
                  <div className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-xl text-xs text-ink-700">
                    🎁 부트스트랩 기간 추가 +{calc.bootstrapBonus.toLocaleString()}원/월
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── B2B 패키지 ── */}
        <section id="b2b" className="mb-20 scroll-mt-24">
          <span className="badge-gold mb-4 inline-flex">B2B Package</span>
          <h2 className="text-4xl font-black mb-2 text-ink-900 dark:text-paper-50">기관 단위 도입</h2>
          <p className="text-paper-400 dark:text-paper-500 mb-10">
            액셀러레이터·대학·VC를 위한 전용 패키지. 멤버 전체가 실패 데이터를 활용합니다.
          </p>
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <B2BCard
              tag="Accelerator" label="액셀러레이터" price="490,000" unit="월"
              items={[
                '배치 전체 멤버 무제한 접근',
                '포트폴리오사 업종 필터 대시보드',
                '월간 실패 트렌드 브리핑',
                '전담 계정 매니저',
              ]}
            />
            <B2BCard
              tag="University" label="대학 창업지원단" price="3,900,000" unit="연" highlight
              items={[
                '재학생·졸업생 전원 계정',
                '창업 강의 자료 공유 라이선스',
                '학기별 실패 사례 리포트 큐레이션',
                '현장실습·캡스톤 연계 가능',
              ]}
            />
            <B2BCard
              tag="VC" label="VC · 투자사" price="2,000,000" unit="건"
              items={[
                '투자 검토 업종 맞춤 리포트 팩',
                '포트폴리오 실패 패턴 분석',
                '익명 데이터 커스텀 리포트',
                '1:1 데이터 컨설팅 1회 포함',
              ]}
            />
          </div>

          <div className="bg-ink-900 rounded-2xl p-8 text-center">
            <p className="text-slate-400 text-sm mb-4">도입 문의 · 시범 사용 신청 · 커스텀 견적</p>
            <a
              href="mailto:b2b@failbank.kr"
              className="btn-gold inline-flex px-8 py-3"
            >
              b2b@failbank.kr 로 문의하기 →
            </a>
          </div>
        </section>

        {/* ── 최종 CTA ── */}
        <section className="text-center py-16 border-t border-paper-100">
          <h2 className="text-3xl font-black mb-4 text-ink-900 dark:text-paper-50">준비됐다면, 첫 리포트를 써보세요.</h2>
          <p className="text-paper-400 dark:text-paper-500 mb-8">첫 100명 수수료 0% · 5단계 템플릿 30분 작성</p>
          <Link to="/submit" className="btn-gold inline-flex text-base px-10 py-4">
            리포트 작성 시작하기 →
          </Link>
        </section>
      </div>
    </div>
  )
}

function MotiveCard({ n, title, subtitle, body, highlight = false }) {
  return (
    <div className={`paper-card p-8 ${highlight ? 'ring-2 ring-gold-400/50' : ''}`}>
      <div className="font-mono text-xs text-gold-500 tracking-widest mb-3">MOTIVE {n}</div>
      <div className="text-2xl font-bold mb-1 text-ink-900 dark:text-paper-50">{title}</div>
      <div className="text-xs text-paper-400 uppercase tracking-wider mb-4 font-mono">{subtitle}</div>
      <p className="text-sm text-paper-500 dark:text-paper-400 leading-relaxed">{body}</p>
    </div>
  )
}

function BootstrapStat({ n, l }) {
  return (
    <div className="bg-white/8 border border-white/10 rounded-xl p-6">
      <div className="text-4xl font-black tabular-nums text-white">{n}</div>
      <div className="text-sm text-slate-400 mt-1">{l}</div>
    </div>
  )
}

function B2BCard({ label, price, unit, tag, items, highlight = false }) {
  return (
    <div className={`rounded-2xl p-8 ${highlight
      ? 'bg-ink-900 border border-ink-800'
      : 'bg-white dark:bg-ink-800 border border-paper-100 dark:border-ink-700 shadow-card'}`}
    >
      <div className={`text-xs tracking-wider uppercase font-mono mb-2 ${highlight ? 'text-gold-400' : 'text-gold-500'}`}>
        {tag}
      </div>
      <div className={`text-xl font-bold mb-2 ${highlight ? 'text-white' : 'text-ink-900 dark:text-paper-50'}`}>{label}</div>
      <div className={`text-3xl font-black tabular-nums mb-1 ${highlight ? 'text-gold-400' : 'text-ink-900 dark:text-paper-50'}`}>
        {price}
        <span className={`text-sm font-normal ml-1 ${highlight ? 'text-slate-400' : 'text-paper-400'}`}>원/{unit}</span>
      </div>
      <ul className={`mt-5 space-y-2 text-sm ${highlight ? 'text-slate-400' : 'text-paper-500 dark:text-paper-400'}`}>
        {items.map(item => (
          <li key={item} className="flex gap-2">
            <span className={highlight ? 'text-gold-400' : 'text-gold-500'}>→</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TierButton({ active, onClick, label, sub }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 text-left rounded-xl transition-all border-2 ${
        active
          ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
          : 'bg-white dark:bg-ink-800 text-ink-700 dark:text-paper-200 border-paper-200 dark:border-ink-600 hover:border-paper-400 dark:hover:border-ink-500'
      }`}
    >
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs mt-0.5 text-paper-400">{sub}</div>
    </button>
  )
}
