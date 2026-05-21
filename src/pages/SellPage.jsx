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
    const commission = score >= 90 ? t.commissionBase - 0.05 :
                       score >= 80 ? t.commissionBase :
                       score >= 70 ? t.commissionBase + 0.02 :
                       t.commissionBase + 0.05
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

        {/* HERO */}
        <header className="border-b border-paper-300 pb-12 mb-16">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-4">For Sellers · 판매자 안내</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tightest leading-[1.05] mb-6 text-ink-900">
            폐업했는데<br />
            <span className="italic text-gold-500">왜 글까지 써야</span> 합니까?
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed max-w-2xl">
            솔직히 말합니다. 1건당 4,000원 받자고 시간 쓸 사람은 없습니다.
            그래서 FailBank는 판매자 유인을 4단으로 설계했습니다.
          </p>
        </header>

        {/* 4대 동기 */}
        <section className="mb-20">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">The Four Motives</div>
          <h2 className="text-4xl font-black tracking-tightest mb-10 text-ink-900">판매자가 글을 쓰는 4가지 이유</h2>
          <div className="grid md:grid-cols-2 gap-px bg-paper-200">
            <MotiveCard n="01" title="진짜 수익" subtitle="프리미엄 티어 도입" body="기본 리포트만으론 부족합니다. 1:1 상담·영상 인터뷰 옵션을 추가해 회당 25,000~30,000원, 엔터프라이즈는 50만원 이상까지 가능합니다. 월 20건 거래 시 연 300만원+가 현실적입니다." highlight />
            <MotiveCard n="02" title="경험의 자산화" subtitle="실패가 데이터가 됨" body="구두로 한 번 친구에게 한탄하고 끝날 경험을, 구조화된 리포트로 영구 보존합니다. 5년 후에도 누군가 당신의 이야기를 읽고 같은 실수를 피합니다." />
            <MotiveCard n="03" title="후배 창업자 기여" subtitle="익명도 가능" body="이름을 드러내고 싶지 않아도 됩니다. 익명·업종 공개·실명 검증의 3단계 중 선택할 수 있습니다. 본인은 안전하면서 후배는 같은 함정을 피합니다." />
            <MotiveCard n="04" title="정부 정책과의 연동" subtitle="재도전펀드 1,333억원" body="중소벤처기업부 재도전펀드 수혜자는 의무 활동의 일부로 본 플랫폼 등록을 인정받을 수 있도록 협의 중입니다 (2026년 하반기 시범)." />
          </div>
        </section>

{/* 부트스트랩 캠페인 */}
<section className="mb-20 -mx-6 px-6 py-16 bg-offwhite"> {/* 배경색을 오프화이트(예: bg-slate-50 또는 bg-[#faf9f6] 등 기존 테마 컬러)로 변경 */}
  <div className="max-w-4xl">
    {/* text-paper-400(밝은색) -> text-ink-500(어두운 회색/네이비) */}
    <div className="text-[9px] tracking-[0.4em] text-ink-500 uppercase font-mono mb-4">Bootstrap Campaign · 초기 부트스트랩</div>
    
    {/* text-paper-50(흰색에 가까움) -> text-ink-900(깊은 흑색/네이비) */}
    <h2 className="text-5xl font-black tracking-tightest mb-6 leading-tight text-ink-900">
      처음 100명, 수수료 <span className="italic text-gold-600">0%</span>. {/* 황금색도 밝은 배경에선 조금 더 진한 600~700 톤이 좋습니다 */}
    </h2>
    
    {/* text-paper-400 -> text-ink-700 */}
    <p className="text-ink-700 text-lg leading-relaxed mb-10 max-w-2xl">
      양면 플랫폼은 초기 공급자가 가장 어렵습니다 (Rochet & Tirole, 2003).<br />
      그래서 첫 100명 판매자에게 <strong className="text-ink-900">수수료를 받지 않습니다.</strong><br />
      대신 정부 재도전 지원사업·폐업 사업자 커뮤니티와 제휴해 모집합니다.
    </p>
    
    {/* bg-ink-700(어두운 구분선) -> bg-ink-200(밝은 회색 구분선) */}
    <div className="grid sm:grid-cols-3 gap-px bg-ink-200">
      <BootstrapStat n="0%" l="첫 100명 수수료" />
      <BootstrapStat n="3개월" l="캠페인 기간" />
      <BootstrapStat n="100%" l="판매자 정산" />
    </div>
    
    {/* text-paper-600 -> text-ink-500 */}
    <p className="text-ink-500 text-sm mt-6 italic">
      * 캠페인 종료 후에도 기본 정산률 80%, 품질 90점 이상 85%는 유지됩니다.
    </p>
  </div>
</section>

        {/* 정산 계산기 */}
        <section className="mb-20">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">Earnings Calculator</div>
          <h2 className="text-4xl font-black tracking-tightest mb-3 text-ink-900">내 수익은 얼마일까?</h2>
          <p className="text-ink-500 mb-10 max-w-2xl">품질 점수와 월 판매량을 조절해보세요. 실제 정산액이 즉시 계산됩니다.</p>

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
                <div className="flex justify-between text-[9px] text-paper-400 font-mono mt-1">
                  <span>1</span><span>25</span><span>50</span><span>75</span><span>100</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-paper-200 bg-white p-8 sticky top-24">
                <div className="text-[9px] tracking-[0.3em] text-gold-500 uppercase font-mono mb-6">예상 정산액 · {calc.tierName}</div>
                <div className="pb-5 border-b border-paper-200 mb-5">
                  <div className="text-xs text-paper-500 mb-1">리포트 1건당 책정 가격</div>
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
                    💡 부트스트랩 기간(첫 3개월)에는 수수료 0%로 추가 <strong>+{calc.bootstrapBonus.toLocaleString()}원/월</strong> 정산됩니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 티어 비교 */}
        <section className="mb-20">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">Premium Tiers</div>
          <h2 className="text-4xl font-black tracking-tightest mb-10 text-ink-900">판매 티어 — 3단계</h2>
          <div className="grid md:grid-cols-3 gap-px bg-paper-200">
            <TierCard name="기본형" price="5,000~10,000원" commission="20%" features={['5단계 구조화 리포트', 'AI 자동 평가', '익명 판매 가능', '월 1회 자동 정산']} note="시간 부담이 적은 진입 옵션. 폐업 직후 부담 없이 시작." />
            <TierCard name="프리미엄형" price="15,000~30,000원" commission="20% (S등급 15%)" features={['기본형 모든 기능', '구매자와 1:1 채팅 30분', '영상 인터뷰 첨부 옵션', '메인 페이지 우선 노출']} note="진짜 수익이 나오는 구간. 시간당 25,000~50,000원 가치." highlight />
            <TierCard name="엔터프라이즈" price="500,000원~" commission="15%" features={['액셀러레이터·VC 대상', '폐업 경험자와 직접 미팅', '심층 케이스 스터디', '맞춤형 데이터 분석']} note="기관 고객 전용. 실명·검증된 판매자만 참여 가능." />
          </div>
        </section>

        {/* 신원 검증 */}
        <section className="mb-20">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">Trust & Verification</div>
          <h2 className="text-4xl font-black tracking-tightest mb-3 text-ink-900">신원 공개 — 본인이 선택합니다.</h2>
          <p className="text-ink-500 mb-10 max-w-2xl">익명이라 신뢰가 떨어진다면, 단계적으로 공개 수준을 올릴 수 있습니다.</p>
          <div className="grid md:grid-cols-3 gap-px bg-paper-200">
            <VerifyTier level="익명" badge="○" badgeColor="text-paper-400" description="닉네임만 공개. 가장 가벼운 옵션. 수수료 동일." tradeoff="구매자 신뢰도 ↓" />
            <VerifyTier level="업종 공개" badge="◐" badgeColor="text-ink-600" description="업종·지역·운영 기간만 공개. 신원은 비공개." tradeoff="신뢰도 중간, 가격 +20%" />
            <VerifyTier level="실명 검증" badge="●" badgeColor="text-gold-500" description="사업자등록증·세금 신고 기록 인증. 실명 또는 활동명 공개." tradeoff="신뢰도 ↑, 가격 +50%, 엔터프라이즈 가능" />
          </div>
        </section>

        {/* 한계 인정 */}
        <section className="mb-20 border border-paper-300 bg-white p-8 border-l-4 border-l-ink-900">
          <div className="text-[9px] tracking-[0.3em] text-paper-500 uppercase font-mono mb-3">Honest Assessment</div>
          <h2 className="text-3xl font-black tracking-tightest mb-6 text-ink-900">저희가 인지하고 있는 한계</h2>
          <div className="space-y-5 text-ink-600 leading-relaxed">
            {[
              { t: '초기 임계 질량 (Cold Start)', d: 'Rochet & Tirole (2003)이 입증한 양면 시장의 본질적 문제. 판매자 500명 미달 시 플랫폼 작동 불가. → 부트스트랩 캠페인(수수료 0%) + 정부·커뮤니티 협력으로 대응.' },
              { t: '시급 대비 보상', d: '기본형(1건 4,000원) 만으로는 충분한 유인이 안 됩니다. → 프리미엄 티어와 영상 옵션으로 시간당 25,000~50,000원대까지 상향.' },
              { t: '콘텐츠 진위 검증', d: '완전 익명 시 허위 리포트 가능성. → 3단계 검증 배지 + AI 패턴 분석 + 커뮤니티 평점 3중 검증.' },
            ].map(item => (
              <div key={item.t}>
                <div className="font-bold mb-1 text-ink-900">{item.t}</div>
                <p className="text-sm">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
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

function TierCard({ name, price, commission, features, note, highlight = false }) {
  return (
    <div className={`p-8 ${highlight ? 'bg-white border-t-4 border-t-gold-500' : 'bg-white'}`}>
      {highlight && <div className="text-[9px] tracking-[0.2em] text-gold-500 uppercase font-mono mb-2">Recommended</div>}
      <div className="text-2xl font-bold mb-2 text-ink-900">{name}</div>
      <div className="text-3xl font-black tabular-nums mb-1 text-ink-900">{price}</div>
      <div className="text-xs text-paper-500 font-mono mb-6">수수료 {commission}</div>
      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i} className="text-sm text-ink-600 flex gap-2">
            <span className="text-gold-500">✓</span><span>{f}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-paper-500 italic leading-relaxed border-t border-paper-200 pt-4">{note}</p>
    </div>
  )
}

function VerifyTier({ level, badge, badgeColor, description, tradeoff }) {
  return (
    <div className="bg-white p-8">
      <div className={`text-5xl font-black mb-3 ${badgeColor}`}>{badge}</div>
      <div className="text-xl font-bold mb-2 text-ink-900">{level}</div>
      <p className="text-sm text-ink-600 leading-relaxed mb-3">{description}</p>
      <div className="text-xs text-paper-500 font-mono pt-3 border-t border-paper-200">{tradeoff}</div>
    </div>
  )
}
