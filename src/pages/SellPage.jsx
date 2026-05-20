import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function SellPage() {
  // 정산 계산기 — 점수와 판매량 따라 동적 계산
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

    // 점수 보정: 90+ 수수료 -5%p, 80+ 0, 70+ +2%p
    const commission = score >= 90 ? t.commissionBase - 0.05 :
                       score >= 80 ? t.commissionBase :
                       score >= 70 ? t.commissionBase + 0.02 :
                       t.commissionBase + 0.05

    const priceAdjust = score >= 90 ? 1.4 : score >= 80 ? 1.0 : score >= 70 ? 0.7 : 0.4
    const reportPrice = Math.round(t.basePrice * priceAdjust)
    const perSale = Math.round(reportPrice * (1 - commission)) + t.premium
    const monthly = perSale * monthlySales

    // 부트스트랩 캠페인 적용 시 (수수료 0%)
    const bootstrapBonus = Math.round(reportPrice * commission) * monthlySales

    return {
      tierName: t.name,
      reportPrice,
      perSale,
      monthly,
      annual: monthly * 12,
      commission: (commission * 100).toFixed(0),
      bootstrapBonus,
    }
  }, [score, monthlySales, tier])

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* HERO — 솔직한 톤으로 시작 */}
      <header className="border-b-2 border-ink-900 pb-10 mb-12">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase font-mono mb-4">
          For Sellers · 판매자 안내
        </div>
        <h1 className="serif-display text-5xl md:text-6xl font-black tracking-tightest leading-[1.05] mb-6">
          폐업했는데<br/>
          <span className="italic text-navy-800">왜 글까지 써야</span> 합니까?
        </h1>
        <p className="text-lg text-ink-700 leading-relaxed max-w-2xl">
          솔직히 말합니다. 1건당 4,000원 받자고 시간 쓸 사람은 없습니다.
          그래서 FailBank는 판매자 유인을 4단으로 설계했습니다.
        </p>
      </header>

      {/* 4대 동기 — 솔직하게 */}
      <section className="mb-20">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-3 font-mono">
          The Four Motives
        </div>
        <h2 className="serif-display text-4xl font-black tracking-tightest mb-10">
          판매자가 글을 쓰는 4가지 이유
        </h2>

        <div className="grid md:grid-cols-2 gap-px bg-ink-900/10">
          <MotiveCard
            n="01"
            title="진짜 수익"
            subtitle="프리미엄 티어 도입"
            body="기본 리포트만으론 부족합니다. 그래서 1:1 상담·영상 인터뷰 옵션을 추가해 회당 25,000원~3만원, 엔터프라이즈는 50만원 이상까지 가능합니다. 월 20건 거래 시 연 300만원+가 현실적입니다."
            highlight
          />
          <MotiveCard
            n="02"
            title="경험의 자산화"
            subtitle="실패가 데이터가 됨"
            body="구두로 한 번 친구에게 한탄하고 끝날 경험을, 구조화된 리포트로 영구 보존합니다. 5년 후에도 누군가 당신의 이야기를 읽고 같은 실수를 피합니다."
          />
          <MotiveCard
            n="03"
            title="후배 창업자 기여"
            subtitle="익명도 가능"
            body="이름을 드러내고 싶지 않아도 됩니다. 익명·업종 공개·실명 검증의 3단계 중 선택할 수 있습니다. 본인은 안전하면서 후배는 같은 함정을 피합니다."
          />
          <MotiveCard
            n="04"
            title="정부 정책과의 연동"
            subtitle="재도전펀드 1,333억원"
            body="중소벤처기업부 재도전펀드 수혜자는 의무 활동의 일부로 본 플랫폼 등록을 인정받을 수 있도록 협의 중입니다 (2026년 하반기 시범)."
          />
        </div>
      </section>

      {/* 부트스트랩 캠페인 — 핵심 차별점 */}
      <section className="mb-20 -mx-6 px-6 py-16 bg-navy-700 text-white">
        <div className="max-w-4xl">
          <div className="text-xs tracking-[0.3em] text-ink-200 uppercase font-mono mb-4">
            Bootstrap Campaign · 초기 부트스트랩
          </div>
          <h2 className="serif-display text-5xl font-black tracking-tightest mb-6 leading-tight">
            처음 100명, 수수료 <span className="italic">0%</span>.
          </h2>
          <p className="text-ink-100 text-lg leading-relaxed mb-8 max-w-2xl">
            양면 플랫폼은 초기 공급자가 가장 어렵습니다 (Rochet & Tirole, 2003).
            그래서 첫 100명 판매자에게 <strong className="text-white">수수료를 받지 않습니다.</strong>
            대신 정부 재도전 지원사업·폐업 사업자 커뮤니티와 제휴해 모집합니다.
          </p>

          <div className="grid sm:grid-cols-3 gap-px bg-white/20">
            <BootstrapStat n="0%" l="첫 100명 수수료" />
            <BootstrapStat n="3개월" l="캠페인 기간" />
            <BootstrapStat n="100%" l="판매자 정산" />
          </div>

          <p className="text-ink-200 text-sm mt-6 italic">
            * 캠페인 종료 후에도 기본 정산률 80%, 품질 90점 이상 85%는 유지됩니다.
          </p>
        </div>
      </section>

      {/* 정산 계산기 — 인터랙티브 */}
      <section className="mb-20">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-3 font-mono">
          Earnings Calculator
        </div>
        <h2 className="serif-display text-4xl font-black tracking-tightest mb-3">
          내 수익은 얼마일까?
        </h2>
        <p className="text-ink-700 mb-10 max-w-2xl">
          품질 점수와 월 판매량을 조절해보세요. 실제 정산액이 즉시 계산됩니다.
        </p>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* 조작부 */}
          <div className="lg:col-span-7 space-y-8">

            {/* 티어 선택 */}
            <div>
              <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-3">
                티어 선택
              </div>
              <div className="grid grid-cols-3 gap-2">
                <TierButton active={tier === 'basic'} onClick={() => setTier('basic')}
                  label="기본형" sub="~10,000원" />
                <TierButton active={tier === 'premium'} onClick={() => setTier('premium')}
                  label="프리미엄형" sub="1:1 상담 포함" />
                <TierButton active={tier === 'enterprise'} onClick={() => setTier('enterprise')}
                  label="엔터프라이즈" sub="VC·기업용" />
              </div>
            </div>

            {/* 점수 슬라이더 */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono">
                  AI 품질 점수
                </span>
                <span className="serif-display text-2xl font-black tabular-nums">
                  {score}<span className="text-sm text-ink-500">/100</span>
                </span>
              </div>
              <input
                type="range"
                min="50" max="100" value={score}
                onChange={e => setScore(Number(e.target.value))}
                className="w-full accent-navy-700"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono mt-1">
                <span>D 50</span><span>C 60</span><span>B 70</span>
                <span>A 80</span><span>S 90+</span>
              </div>
            </div>

            {/* 월 판매량 */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono">
                  월 예상 판매량
                </span>
                <span className="serif-display text-2xl font-black tabular-nums">
                  {monthlySales}<span className="text-sm text-ink-500"> 건</span>
                </span>
              </div>
              <input
                type="range"
                min="1" max="100" value={monthlySales}
                onChange={e => setMonthlySales(Number(e.target.value))}
                className="w-full accent-navy-700"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono mt-1">
                <span>1</span><span>25</span><span>50</span>
                <span>75</span><span>100</span>
              </div>
            </div>
          </div>

          {/* 결과 카드 */}
          <div className="lg:col-span-5">
            <div className="paper-card p-6 sticky top-24">
              <div className="text-[10px] tracking-[0.2em] text-navy-800 uppercase font-mono mb-4">
                예상 정산액 · {calc.tierName}
              </div>

              <div className="pb-5 border-b border-ink-900/10 mb-5">
                <div className="text-xs text-ink-500 mb-1">리포트 1건당 책정 가격</div>
                <div className="serif-display text-3xl font-black tabular-nums">
                  {calc.reportPrice.toLocaleString()}<span className="text-base text-ink-500">원</span>
                </div>
                <div className="text-xs text-ink-500 font-mono mt-1">
                  수수료 {calc.commission}% → 정산 {calc.perSale.toLocaleString()}원/건
                </div>
              </div>

              <div className="pb-5 border-b border-ink-900/10 mb-5">
                <div className="text-xs text-ink-500 mb-1">월 정산 예상</div>
                <div className="serif-display text-4xl font-black text-navy-800 tabular-nums">
                  {calc.monthly.toLocaleString()}<span className="text-base text-ink-500">원</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-ink-500 mb-1">연간 정산 예상</div>
                <div className="serif-display text-3xl font-black tabular-nums">
                  {calc.annual.toLocaleString()}<span className="text-base text-ink-500">원</span>
                </div>
              </div>

              {calc.bootstrapBonus > 0 && (
                <div className="mt-5 p-3 bg-navy-700/10 border-l-2 border-navy-700 text-xs text-ink-700">
                  💡 부트스트랩 기간(첫 3개월)에는 수수료 0%로
                  추가 <strong>+{calc.bootstrapBonus.toLocaleString()}원/월</strong> 정산됩니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 프리미엄 티어 비교표 */}
      <section className="mb-20">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-3 font-mono">
          Premium Tiers
        </div>
        <h2 className="serif-display text-4xl font-black tracking-tightest mb-10">
          판매 티어 — 3단계
        </h2>

        <div className="grid md:grid-cols-3 gap-px bg-ink-900/10">
          <TierCard
            name="기본형"
            price="5,000~10,000원"
            commission="20%"
            features={[
              '5단계 구조화 리포트',
              'AI 자동 평가',
              '익명 판매 가능',
              '월 1회 자동 정산',
            ]}
            note="시간 부담이 적은 진입 옵션. 폐업 직후 부담 없이 시작."
          />
          <TierCard
            name="프리미엄형"
            price="15,000~30,000원"
            commission="20% (S등급 15%)"
            features={[
              '기본형 모든 기능',
              '구매자와 1:1 채팅 30분',
              '영상 인터뷰 첨부 옵션',
              '메인 페이지 우선 노출',
            ]}
            note="진짜 수익이 나오는 구간. 시간당 25,000~50,000원 가치."
            highlight
          />
          <TierCard
            name="엔터프라이즈"
            price="500,000원~"
            commission="15%"
            features={[
              '액셀러레이터·VC 대상',
              '폐업 경험자와 직접 미팅',
              '심층 케이스 스터디',
              '맞춤형 데이터 분석',
            ]}
            note="기관 고객 전용. 실명·검증된 판매자만 참여 가능."
          />
        </div>
      </section>

      {/* 신뢰 신호 — 검증 배지 */}
      <section className="mb-20">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-3 font-mono">
          Trust & Verification
        </div>
        <h2 className="serif-display text-4xl font-black tracking-tightest mb-3">
          신원 공개 — 본인이 선택합니다.
        </h2>
        <p className="text-ink-700 mb-10 max-w-2xl">
          익명이라 신뢰가 떨어진다면, 단계적으로 공개 수준을 올릴 수 있습니다.
          판매자는 본인 상황에 맞게 선택하고, 구매자는 배지로 신뢰도를 확인합니다.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <VerifyTier
            level="익명"
            badge="○"
            badgeColor="text-ink-500"
            description="닉네임만 공개. 가장 가벼운 옵션. 수수료 동일."
            tradeoff="구매자 신뢰도 ↓"
          />
          <VerifyTier
            level="업종 공개"
            badge="◐"
            badgeColor="text-ink-700"
            description="업종·지역·운영 기간만 공개. 신원은 비공개."
            tradeoff="신뢰도 중간, 가격 +20%"
          />
          <VerifyTier
            level="실명 검증"
            badge="●"
            badgeColor="text-navy-800"
            description="사업자등록증·세금 신고 기록 인증. 실명 또는 활동명 공개."
            tradeoff="신뢰도 ↑, 가격 +50%, 엔터프라이즈 거래 가능"
          />
        </div>
      </section>

      {/* 솔직한 약점 인정 + 대응 — 학술적 견고함 */}
      <section className="mb-20 paper-card p-8 border-l-4 border-ink-900">
        <div className="text-xs tracking-[0.3em] text-ink-500 uppercase font-mono mb-3">
          Honest Assessment
        </div>
        <h2 className="serif-display text-3xl font-black tracking-tightest mb-6">
          저희가 인지하고 있는 한계
        </h2>
        <div className="space-y-5 text-ink-700 leading-relaxed">
          <div>
            <div className="font-bold mb-1">초기 임계 질량 (Cold Start)</div>
            <p className="text-sm">
              Rochet & Tirole (2003)이 입증한 양면 시장의 본질적 문제. 판매자 500명 미달 시 플랫폼 작동 불가.
              → 부트스트랩 캠페인(수수료 0%) + 정부·커뮤니티 협력으로 대응.
            </p>
          </div>
          <div>
            <div className="font-bold mb-1">시급 대비 보상</div>
            <p className="text-sm">
              기본형(1건 4,000원) 만으로는 충분한 유인이 안 됩니다.
              → 프리미엄 티어와 영상 옵션으로 시간당 25,000~50,000원대까지 상향.
            </p>
          </div>
          <div>
            <div className="font-bold mb-1">콘텐츠 진위 검증</div>
            <p className="text-sm">
              완전 익명 시 허위 리포트 가능성. → 3단계 검증 배지 + AI 패턴 분석 + 커뮤니티 평점 3중 검증.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 border-t border-ink-900/10">
        <h2 className="serif-display text-3xl font-black tracking-tightest mb-6">
          준비됐다면, 첫 리포트를 써보세요.
        </h2>
        <Link to="/submit" className="btn-primary inline-block text-base px-10 py-4">
          리포트 작성 시작하기 →
        </Link>
        <p className="text-xs text-ink-500 mt-4 font-mono">
          첫 100명 수수료 0% · 5단계 템플릿 30분 작성
        </p>
      </section>
    </div>
  )
}

function MotiveCard({ n, title, subtitle, body, highlight = false }) {
  return (
    <div className={`p-8 ${highlight ? 'bg-ink-50' : 'bg-white'}`}>
      <div className="font-mono text-xs text-navy-800 tracking-widest mb-2">
        MOTIVE {n}
      </div>
      <div className="serif-display text-2xl font-bold mb-1">{title}</div>
      <div className="text-xs text-ink-500 uppercase tracking-[0.15em] mb-4 font-mono">
        {subtitle}
      </div>
      <p className="text-sm text-ink-700 leading-relaxed">{body}</p>
    </div>
  )
}

function BootstrapStat({ n, l }) {
  return (
    <div className="bg-navy-700 p-5">
      <div className="serif-display text-4xl font-black tabular-nums tracking-tightest leading-none">
        {n}
      </div>
      <div className="text-xs text-ink-200 mt-1">{l}</div>
    </div>
  )
}

function TierButton({ active, onClick, label, sub }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 text-left transition-colors border-2 ${
        active
          ? 'bg-ink-900 text-white border-ink-900'
          : 'bg-white text-ink-700 border-ink-900/20 hover:border-navy-700'
      }`}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className={`text-[10px] font-mono mt-0.5 ${active ? 'text-ink-200' : 'text-ink-500'}`}>
        {sub}
      </div>
    </button>
  )
}

function TierCard({ name, price, commission, features, note, highlight = false }) {
  return (
    <div className={`p-8 ${highlight ? 'bg-ink-50 border-t-4 border-navy-700' : 'bg-white'}`}>
      {highlight && (
        <div className="text-[10px] tracking-[0.2em] text-navy-800 uppercase font-mono mb-2">
          Recommended
        </div>
      )}
      <div className="serif-display text-2xl font-bold mb-2">{name}</div>
      <div className="serif-display text-3xl font-black tabular-nums mb-1">{price}</div>
      <div className="text-xs text-ink-500 font-mono mb-6">수수료 {commission}</div>
      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i} className="text-sm text-ink-700 flex gap-2">
            <span className="text-navy-800">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-ink-500 italic leading-relaxed border-t border-ink-900/10 pt-4">
        {note}
      </p>
    </div>
  )
}

function VerifyTier({ level, badge, badgeColor, description, tradeoff }) {
  return (
    <div className="paper-card p-6">
      <div className={`text-5xl font-black mb-3 ${badgeColor}`}>{badge}</div>
      <div className="serif-display text-xl font-bold mb-2">{level}</div>
      <p className="text-sm text-ink-700 leading-relaxed mb-3">{description}</p>
      <div className="text-xs text-ink-500 font-mono pt-3 border-t border-ink-900/10">
        {tradeoff}
      </div>
    </div>
  )
}
