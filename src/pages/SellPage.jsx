export default function AboutPage() {
  return (
    <div className="bg-paper-50 min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-16">

      {/* Headline */}
      <header className="border-b border-paper-300 pb-10 mb-12">
        <div className="text-xs tracking-[0.3em] text-gold-500 uppercase font-mono mb-4">
          About
        </div>
        <h1 className="serif-display text-5xl md:text-6xl font-black tracking-tightest leading-[1.05] mb-6">
          실패가 자산이 되는<br/>세상을 만듭니다.
        </h1>
        <p className="text-lg text-ink-600 leading-relaxed max-w-2xl">
          FailBank는 소규모 사업자·1인 창업자의 시행착오 경험을 5단계 구조화 리포트로
          자산화하여 거래하는 국내 최초의 마켓플레이스입니다.
        </p>
      </header>

      {/* The Discovery */}
      <section className="mb-16">
        <div className="text-xs tracking-[0.3em] text-gold-500 uppercase font-mono mb-3">
          The Discovery
        </div>
        <h2 className="serif-display text-3xl font-black tracking-tightest mb-6">
          결정적 발견
        </h2>
        <div className="border border-paper-200 bg-white p-8 border-l-4 border-gold-500 mb-6">
          <div className="serif-display text-2xl italic leading-relaxed text-ink-800">
            “재창업 기업의 5년 생존율 <span className="text-gold-500 font-black not-italic">73.3%</span>
            {' '}vs 일반 창업 <span className="font-black not-italic">29.2%</span>”
          </div>
          <div className="text-xs text-paper-500 mt-4 font-mono">
            — 통계청 기업생멸행정통계 · 중소벤처기업연구원
          </div>
        </div>
        <p className="text-ink-600 leading-[1.85] text-[17px]">
          한 번 실패한 경험을 가진 창업자가 다시 창업할 경우, 첫 창업자 대비 2.5배 높은 생존율을 보입니다.
          즉, “실패 경험” 그 자체가 가장 강력한 학습 자산이라는 것을 정부 통계가 직접 입증합니다.
        </p>
        <p className="text-ink-600 leading-[1.85] text-[17px] mt-4">
          그렇다면 자연스러운 질문이 제기됩니다 —
          <span className="serif-display italic text-gold-500">
            {' '}“내가 직접 실패하지 않고도, 다른 사람의 실패 경험을 구매하여 학습할 수 있다면?”
          </span>
          {' '}이 질문에 답하는 플랫폼이 FailBank입니다.
        </p>
      </section>

      {/* Why now */}
      <section className="mb-16">
        <div className="text-xs tracking-[0.3em] text-gold-500 uppercase font-mono mb-3">
          Why now
        </div>
        <h2 className="serif-display text-3xl font-black tracking-tightest mb-6">
          한국 창업 시장의 구조적 위기
        </h2>
        <div className="grid sm:grid-cols-3 gap-px bg-ink-900/10">
          <Stat n="29.2%" l="창업 5년 생존율" s="OECD 28개국 중 26위" />
          <Stat n="100.8만" l="2024 폐업자" s="사상 첫 100만 돌파 (국세청)" />
          <Stat n="1.3회" l="평균 창업 횟수" s="미·중 2.8회 대비 절반" />
        </div>
      </section>

      {/* Academic */}
      <section className="mb-16">
        <div className="text-xs tracking-[0.3em] text-gold-500 uppercase font-mono mb-3">
          Academic Basis
        </div>
        <h2 className="serif-display text-3xl font-black tracking-tightest mb-6">
          학술적 근거
        </h2>
        <ul className="space-y-6">
          {[
            { y: '2011', a: 'Cope, J.', t: 'Entrepreneurial Learning from Failure', j: 'Journal of Business Venturing', n: '실패는 기업가에게 가장 풍부한 학습 경험을 제공한다 (피인용 2,000회+).' },
            { y: '2020', a: 'Diáz-García et al.', t: 'Lessons from Entrepreneurial Failure through Vicarious Learning', j: 'Journal of Small Business & Entrepreneurship', n: '대리 학습(Vicarious Learning) 효과를 실증. 타인의 실패만 분석해도 학습 가능.' },
            { y: '2020', a: 'Funken et al.', t: 'Entrepreneurial Learning from Failure: A Systematic Review', j: 'Int. J. of Entrepreneurial Behavior & Research', n: '실패 학습은 구조화된 회고가 있을 때 가장 효과적.' },
            { y: '2003', a: 'Rochet & Tirole', t: 'Platform Competition in Two-Sided Markets', j: 'Journal of the European Economic Association', n: '양면 시장 이론 (Tirole은 2014 노벨경제학상 수상자).' },
            { y: '2015', a: 'Yamakawa et al.', t: 'Rising from the Ashes', j: 'Entrepreneurship Theory and Practice', n: '실패 후 인지적 학습이 후속 벤처의 성장을 결정.' },
          ].map((p, i) => (
            <li key={i} className="border-l-2 border-ink-900/20 pl-6 pb-6">
              <div className="font-mono text-xs text-gold-500 tracking-widest mb-1">
                {p.y} · {p.a}
              </div>
              <div className="serif-display text-lg font-bold mb-1">{p.t}</div>
              <div className="text-xs text-paper-500 italic mb-2">{p.j}</div>
              <div className="text-sm text-ink-600 leading-relaxed">{p.n}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Tech */}
      <section className="mb-16">
        <div className="text-xs tracking-[0.3em] text-gold-500 uppercase font-mono mb-3">
          Technology
        </div>
        <h2 className="serif-display text-3xl font-black tracking-tightest mb-6">
          4차산업혁명 기술 활용
        </h2>
        <div className="grid sm:grid-cols-2 gap-px bg-ink-900/10">
          {[
            { t: 'AI · 자연어 처리', d: '리포트 5대 품질 기준 자동 평가, 키워드 추출, 진부 표현 감지' },
            { t: '빅데이터', d: '5단계 구조화 데이터베이스 (Supabase PostgreSQL)' },
            { t: '클라우드', d: 'Netlify + Supabase 기반 Serverless 자동 확장 인프라' },
            { t: '자동화', d: '품질 점수 기반 수수료·가격 동적 산출 시스템' },
          ].map((it, i) => (
            <div key={i} className="bg-white p-6">
              <div className="serif-display text-xl font-bold mb-2">{it.t}</div>
              <div className="text-sm text-ink-600 leading-relaxed">{it.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tagline */}
      <section className="text-center py-16 border-t border-paper-200">
        <p className="serif-display text-3xl md:text-4xl italic text-gold-500 leading-relaxed">
          실패가 자산이 되는 세상을 만듭니다.
        </p>
      </section>
    </article>
  </div>
  )
}

function Stat({ n, l, s }) {
  return (
    <div className="bg-white p-6">
      <div className="serif-display text-4xl font-black tabular-nums tracking-tightest mb-1">
        {n}
      </div>
      <div className="text-sm font-medium mb-1">{l}</div>
      <div className="text-xs text-paper-500">{s}</div>
    </div>
  )
}
