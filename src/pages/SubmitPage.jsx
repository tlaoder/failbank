import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { evaluateReport, extractKeywords } from '../lib/scoring'
import { createReport, CATEGORIES } from '../lib/reports'

const STEPS = [
  { key: 'background', n: '01', title: '배경 (Background)', desc: '업종 카테고리, 사업 시작 시기, 초기 투자 규모, 목표 고객군', placeholder: '예: 강남 역삼동 1층에 36㎡ 디저트 카페를 2023년 3월 오픈. 초기 투자금 1억 2,000만원...', min: 50 },
  { key: 'attempt', n: '02', title: '시도 (Attempt)', desc: '사용 채널, 마케팅 방식, 투입 기간', placeholder: '예: 인스타그램 광고에 월 250만원씩 12개월간 집행. 인플루언서 협찬 5명...', min: 50 },
  { key: 'cause', n: '03', title: '실패 원인 (Cause)', desc: '핵심 실패 원인 분석, 외부 요인, 인지 시점', placeholder: '예: 광고 ROAS를 한 번도 측정하지 않았다. 팔로워 8,000명 대비 방문 전환율 1% 미만...', min: 50 },
  { key: 'loss', n: '04', title: '손실 규모 (Loss)', desc: '금전적·시간적 손실의 정량적 기술', placeholder: '예: 광고비 3,000만원, 적자 4,200만원, 총 9,200만원, 14개월...', min: 50 },
  { key: 'lesson', n: '05', title: '교훈 (Lesson)', desc: '핵심 인사이트, 다음에 다를 행동, 추천 대상', placeholder: '예: 첫 3개월 광고비를 월 30만원으로 제한하고 ROAS를 주 단위로 측정할 것...', min: 50 },
]

export default function SubmitPage() {
  const navigate = useNavigate()
  const [meta, setMeta] = useState({ title: '', category: CATEGORIES[0], seller_nickname: '' })
  const [content, setContent] = useState({ background: '', attempt: '', cause: '', loss: '', lesson: '' })
  const [activeStep, setActiveStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const evaluation = useMemo(() => evaluateReport(content), [content])

  const canSubmit = meta.title.trim().length >= 5 &&
    meta.seller_nickname.trim().length >= 2 &&
    STEPS.every(s => content[s.key].trim().length >= s.min)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const keywords = extractKeywords(Object.values(content).join(' '), 5)
      const created = await createReport({ ...meta, ...content, price: evaluation.recommendedPrice, score: evaluation.total, grade: evaluation.grade, keywords })
      navigate(`/report/${created.id}`)
    } catch (e) {
      setSubmitError('등록에 실패했습니다: ' + e.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-void-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="border-b border-void-500/30 pb-12 mb-12">
          <div className="text-[9px] tracking-[0.4em] text-gold-400 uppercase mb-4 font-mono">New Report</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tightest mb-4 text-cream-900">시행착오 리포트 작성</h1>
          <p className="text-cream-600">5단계 구조화 템플릿에 따라 작성하세요. AI가 실시간으로 품질을 평가하고 가격을 추천합니다.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-8 space-y-10">
            {/* Meta */}
            <section className="space-y-6">
              <div>
                <label htmlFor="report-title" className="text-[9px] tracking-[0.3em] text-void-100 uppercase font-mono mb-3 block">제목</label>
                <input id="report-title" type="text" value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })} placeholder="예: 인스타 광고 3,000만원 태우고 폐업한 디저트 카페" className="input-field text-lg font-bold" maxLength={80} />
                <p className="text-xs text-void-100 mt-1 font-mono">{meta.title.length}/80</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="report-category" className="text-[9px] tracking-[0.3em] text-void-100 uppercase font-mono mb-3 block">카테고리</label>
                  <select id="report-category" value={meta.category} onChange={e => setMeta({ ...meta, category: e.target.value })} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="seller-nickname" className="text-[9px] tracking-[0.3em] text-void-100 uppercase font-mono mb-3 block">닉네임 (익명 가능)</label>
                  <input id="seller-nickname" type="text" value={meta.seller_nickname} onChange={e => setMeta({ ...meta, seller_nickname: e.target.value })} placeholder="예: 강남디저트" className="input-field" maxLength={20} />
                </div>
              </div>
            </section>

            {/* Step nav */}
            <nav aria-label="작성 단계" className="flex gap-px bg-void-500/20 sticky top-20 z-20">
              {STEPS.map((s, i) => {
                const filled = content[s.key].trim().length >= s.min
                const isCurrent = activeStep === i
                return (
                  <button key={s.key} onClick={() => setActiveStep(i)} aria-current={isCurrent ? 'step' : undefined}
                    className={`flex-1 py-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${
                      isCurrent ? 'border-gold-500 text-gold-400 bg-void-800' :
                      filled ? 'border-gold-500/30 text-void-50 bg-void-900' :
                      'border-void-500/30 text-void-100 bg-void-900'
                    }`}>
                    <div className="text-[9px] opacity-60">{s.n}</div>
                    <div className="hidden sm:block text-[10px]">{s.title.split(' ')[0]}</div>
                  </button>
                )
              })}
            </nav>

            {/* Step content */}
            {STEPS.map((s, i) => (
              <section key={s.key} className={i === activeStep ? '' : 'hidden'} aria-hidden={i !== activeStep}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-[9px] text-gold-400 tracking-widest">STEP {s.n}</span>
                  <h2 className="text-2xl font-bold text-cream-900">{s.title}</h2>
                </div>
                <p className="text-sm text-void-50 mb-5 leading-relaxed" id={`desc-${s.key}`}>{s.desc}</p>
                <textarea
                  value={content[s.key]}
                  onChange={e => setContent({ ...content, [s.key]: e.target.value })}
                  placeholder={s.placeholder}
                  rows={10}
                  className="textarea-field text-[15px] leading-[1.9]"
                  maxLength={3000}
                  aria-describedby={`desc-${s.key}`}
                />
                <div className="flex items-center justify-between mt-2 text-xs font-mono">
                  <span className={content[s.key].length >= s.min ? 'text-gold-400/70' : 'text-void-100'}>
                    {content[s.key].length} / 3,000 {content[s.key].length < s.min && `(최소 ${s.min}자)`}
                  </span>
                  <div className="flex gap-4">
                    {i > 0 && <button onClick={() => setActiveStep(i - 1)} className="text-void-50 hover:text-cream-900">← 이전</button>}
                    {i < STEPS.length - 1 && <button onClick={() => setActiveStep(i + 1)} className="text-gold-400 hover:text-gold-300">다음 →</button>}
                  </div>
                </div>
              </section>
            ))}

            {submitError && <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 text-sm text-red-400">{submitError}</div>}

            <div className="border-t border-void-500/30 pt-8 flex flex-wrap gap-4 items-center">
              <button onClick={handleSubmit} disabled={!canSubmit || submitting} className="btn-primary px-10 py-4" aria-busy={submitting}>
                {submitting ? <span role="status">등록 중...</span> : '리포트 등록하기'}
              </button>
              {!canSubmit && <p className="text-xs text-void-100 font-mono">모든 단계를 50자 이상 작성해야 등록 가능합니다.</p>}
            </div>
          </div>

          {/* Sidebar */}
          <aside aria-label="AI 실시간 품질 평가" className="lg:col-span-4">
            <div className="sticky top-24 border border-void-500/30 bg-void-800 p-8">
              <div className="text-[9px] tracking-[0.3em] text-gold-400 uppercase font-mono mb-6">AI 실시간 평가</div>

              <div className="flex items-center justify-between mb-8 pb-8 border-b border-void-500/30">
                <div>
                  <div className="text-6xl font-black tabular-nums text-cream-900" aria-label={`현재 점수 ${evaluation.total}점`}>
                    {evaluation.total}
                  </div>
                  <div className="text-xs text-void-100 font-mono">/ 100점</div>
                </div>
                <div className={`grade-stamp text-2xl ${evaluation.grade === 'S' ? 'text-gold-400 border-gold-500/50' : 'text-cream-600 border-void-300'}`}>
                  {evaluation.grade}
                </div>
              </div>

              <div className="space-y-4 mb-8 pb-8 border-b border-void-500/30">
                {Object.values(evaluation.breakdown).map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-cream-700">{b.label}</span>
                      <span className="font-mono text-void-100">{b.score} / {b.max}</span>
                    </div>
                    <div className="h-0.5 bg-void-600" role="progressbar" aria-valuenow={b.score} aria-valuemin={0} aria-valuemax={b.max}>
                      <div className="h-full bg-gold-500 transition-all duration-500" style={{ width: `${(b.score / b.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] text-void-100 tracking-[0.3em] uppercase font-mono">추천 가격</span>
                  <span className="text-2xl font-bold text-gold-400 tabular-nums">
                    {evaluation.recommendedPrice.toLocaleString()}<span className="text-sm text-void-100">원</span>
                  </span>
                </div>
                <div className="flex justify-between text-xs text-void-100 font-mono">
                  <span>수수료 {(evaluation.commissionRate * 100).toFixed(0)}%</span>
                  <span>→ 정산 {evaluation.sellerEarning.toLocaleString()}원</span>
                </div>
              </div>

              {evaluation.total < 60 && (
                <div role="alert" className="mt-6 p-4 border-l-2 border-gold-500 bg-gold-500/5 text-xs text-cream-700 leading-relaxed">
                  점수가 낮습니다. 정량적 데이터(금액·기간·수치)와 구체적인 행동 가능한 교훈을 추가해보세요.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
