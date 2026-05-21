import React from 'react'

export default function AboutPage() {
  return (
    <div className="bg-paper-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* 헤더 섹션 */}
        <header className="border-b border-paper-300 pb-12 mb-16">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-4">
            Our Mission · 플랫폼 소개
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tightest leading-[1.05] mb-6 text-ink-900">
            실패는 쓰지만,<br />
            <span className="italic text-gold-500">데이터는 달콤합니다.</span>
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed max-w-2xl">
            FailBank는 세상의 모든 부도, 폐업, 프로젝트 중단 경험을 구조화된 자산으로 전환하는 
            국내 최초의 '실패 데이터 거래소'입니다. 함정을 미리 안다면 다음 도전의 성공률은 비약적으로 상승합니다.
          </p>
        </header>

        {/* 미션 및 비전 섹션 */}
        <section className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-2xl font-black tracking-tightest text-ink-900 mb-4"> 왜 실패 데이터인가?</h2>
            <p className="text-sm text-ink-600 leading-relaxed space-y-4">
              매년 수많은 창업자가 유사한 이유로 무너집니다. 자금 고갈, 팀원 불화, 시장 검증 실패 등 
              패인은 통계적으로 정형화되어 있지만, 개별 경험은 파편화된 채 사라집니다. 
              FailBank는 이 귀중한 오답노트를 양지라 이끌어내어 건강한 창업 생태계를 만듭니다.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tightest text-ink-900 mb-4">안전한 익명성 보장</h2>
            <p className="text-sm text-ink-600 leading-relaxed">
              경험을 공유하는 과정에서 발생할 수 있는 평판 리스크를 철저히 방어합니다. 
              판매자는 인적사항을 완전히 숨긴 채 오직 업종, 타임라인, 수치, 교훈만을 정제하여 
              안전하게 수익을 창출할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 플랫폼 주요 지표 및 통계 섹션 */}
        <section className="mb-20">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase mb-3 font-mono">
            Platform Status
          </div>
          <h2 className="text-4xl font-black tracking-tightest mb-10 text-ink-900">
            데이터로 입증하는 가치
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper-200">
            <Stat 
              n="1,240+" 
              l="등록된 누적 리포트" 
              s="다양한 업종의 실제 폐업 및 중단 사례가 엄격한 심사를 거쳐 등록되었습니다." 
            />
            <Stat 
              n="84.2%" 
              l="유료 구매자 만족도" 
              s="리포트를 구매한 예비 창업자 및 VC 심사역들이 평가한 주관적 유용성 지표입니다." 
            />
            <Stat 
              n="4,200 만원" 
              l="최대 판매자 누적 정산액" 
              s="양질의 연쇄 실패 리포트와 1:1 프리미엄 상담을 통해 최고 수익을 올린 판매자의 정산 가치입니다." 
            />
            <Stat 
              n="0 건" 
              l="신원 노출 보안 사고" 
              s="철저한 데이터 비식별화 아키텍처를 도입하여 단 한 건의 개인정보 유출도 허용하지 않았습니다." 
            />
          </div>
        </section>

      </div>
    </div>
  )
}

// 하단 지표 항목들을 공통으로 렌더링하는 서브 컴포넌트
function Stat({ n, l, s }) {
  return (
    <div className="bg-white p-6">
      <div className="text-4xl font-black tabular-nums tracking-tightest mb-1 text-ink-900">
        {n}
      </div>
      <div className="text-xs font-bold text-ink-900 mb-2">{l}</div>
      <p className="text-xs text-ink-500 leading-relaxed">{s}</p>
    </div>
  )
}
