export default function AboutPage() {
  return (
    <div className="bg-paper-50 min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-16">

      <header className="border-b border-paper-300 pb-10 mb-12">
        <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-4">About</div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tightest leading-[1.05] mb-6 text-ink-900">
          실패가 자산이 되는<br/>세상을 만듭니다.
        </h1>
        <p className="text-lg text-ink-600 leading-relaxed max-w-2xl">
          FailBank





[200~cat > src/pages/AboutPage.jsx << 'ENDOFFILE'
export default function AboutPage() {
  return (
    <div className="bg-paper-50 min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-16">

      <header className="border-b border-paper-300 pb-10 mb-12">
        <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-4">About</div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tightest leading-[1.05] mb-6 text-ink-900">
          실패가 자산이 되는<br/>세상을 만듭니다.
        </h1>
        <p className="text-lg text-ink-600 leading-relaxed max-w-2xl">
          FailBank는 소규모 사업자·1인 창업자의 시행착오 경험을 5단계 구조화 리포트로
          자산화하여 거래하는 국내 최초의 마켓플레이스입니다.
        </p>
      </header>

      <section className="mb-16">
        <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-3">The Discovery</div>
        <h2 className="text-3xl font-black tracking-tightest mb-6 text-ink-900">결정적 발견</h2>
        <div className="border border-paper-200 bg-white p-8 border-l-4 border-gold-500 mb-6">
          <div className="text-2xl italic leading-relaxed text-ink-800">
            "재창업 기업의 5년 생존율 <span className="text-gold-500 font-black not-italic">73.3%</span>
            {' '}vs 일반 창업 <span className="font-black not-italic">29.2%</span>"
          </div>
          <div className="text-xs text-paper-500 mt-4 font-mono">— 통계청 기업생멸행정통계 · 중소벤처기업연구원</div>
        </div>
        <p className="text-ink-600 leading-[1.85] text-[17px]">
          한 번 실패한 경험을 가진 창업자가 다시 창업할 경우, 첫 창업자 대비 2.5배 높은 생존율을 보입니다.
          즉, 실패 경험 그 자체가 가장 강력한 학습 자산이라는 것을 정부 통계가 직접 입증합니다.
        </p>
      </section>

      <section className="mb-16">
        <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-3">Why now</div>
        <h2 className="text-3xl font-black tracking-tightest mb-6 text-ink-900">한국 창업 시장의 구조적 위기</h2>
        <div className="grid sm:grid-cols-3 gap-px bg-paper-200">
          <Stat n="29.2%" l="창업 5년 생존율" s="OECD 28개국 중 26위" />
          <Stat n="100.8만" l="2024 폐업자" s="사상 첫 100만 돌파" />
          <Stat n="1.3회" l="평균 창업 횟수" s="미·중 2.8회 대비 절반" />
        </div>
      </section>

      <section className="mb-16">
        <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-3">Academic Basis</div>
        <h2 className="text-3xl font-black tracking-tightest mb-6 text-ink-900">학술적 근거</h2>
        <ul className="space-y-6">
          {[
            { y: '2011', a: 'Cope, J.', t: 'Entrepreneurial Learning from Failure', j: 'Journal of Business Venturing', n: '실패는 기업가에게 가장 풍부한 학습 경험을 제공한다.' },
            { y: '2020', a: 'Diaz-Garcia et al.', t: 'Lessons from Entrepreneurial Failure through Vicarious Learning', j: 'Journal of Small Business', n: '타인의 실패만 분석해도 학습 가능.' },
            { y: '2003', a: 'Rochet & Tirole', t: 'Platform Competition in Two-Sided Markets', j: 'Journal of the European Economic Association', n: '양면 시장 이론 (Tirole은 2014 노벨경제학상 수상자).' },
          ].map((p, i) => (
            <li key={i} className="border-l-2 border-paper-300 pl-6 pb-6">
              <div className="font-mono text-[9px] text-gold-500 tracking-widest mb-1">{p.y} · {p.a}</div>
              <div className="text-lg font-bold mb-1 text-ink-900">{p.t}</div>
              <div className="text-xs text-paper-500 italic mb-2">{p.j}</div>
              <div className="text-sm text-ink-600 leading-relaxed">{p.n}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="text-center py-16 border-t border-paper-200">
        <p className="text-3xl md:text-4xl italic text-gold-500 leading-relaxed">
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
      <div className="text-4xl font-black tabular-nums tracking-tightest mb-1 text-ink-900">{n}</div>
      <div className="text-sm font-medium mb-1 text-ink-800">{l}</div>
      <div className="text-xs text-paper-500">{s}</div>
    </div>
  )
}
