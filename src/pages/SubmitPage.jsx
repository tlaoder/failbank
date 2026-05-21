import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { evaluateReport, extractKeywords } from '../lib/scoring'
import { createReport, CATEGORIES } from '../lib/reports'

const STEPS = [
  {
    key: 'background',
    n: '01',
    title: '배경 (Background)',
    desc: '어떤 사업을 시도했는지 맥락 — 업종 카테고리, 사업 시작 시기, 초기 투자 규모, 목표 고객군',
    placeholder:
      '예: 강남 역삼동 1층에 36㎡(11평) 디저트 카페를 2023년 3월 오픈했다. 초기 투자금 1억 2,000만원, 목표 고객은 20대 직장인 여성...',
    min: 50,
  },
  {
    key: 'attempt',
    n: '02',
    title: '시도 (Attempt)',
    desc: '구체적으로 어떤 전략과 방법을 시도했는지 — 사용 채널, 마케팅 방식, 투입 기간',
    placeholder: '예: 인스타그램 광고에 월 250만원씩 12개월간 집행. 인플루언서 협찬 5명...',
    min: 50,
  },
  {
    key: 'cause',
    n: '03',
    title: '실패 원인 (Cause)',
    desc: '가장 핵심적인 실패 원인 분석 — 실패 유형, 외부 요인, 인지 시점',
    placeholder:
      '예: 광고 ROAS를 한 번도 측정하지 않았다. 팔로워 8,000명 대비 실제 방문 전환율 1% 미만...',
    min: 50,
  },
  {
    key: 'loss',
    n: '04',
    title: '손실 규모 (Loss)',
    desc: '금전적·시간적 손실의 정량적 기술 — 금액 구간, 투입 시간, 기회비용',
    placeholder:
      '예: 광고비 3,000만원, 적자 4,200만원, 권리금 회수 실패 2,000만원. 총 9,200만원, 14개월...',
    min: 50,
  },
  {
    key: 'lesson',
    n: '05',
    title: '교훈 (Lesson)',
    desc: '이 경험에서 얻은 핵심 인사이트 — 다음에 다를 행동, 추천 대상 업종',
    placeholder:
      '예: 다음에는 첫 3개월 광고비를 월 30만원으로 제한하고 ROAS를 주 단위로 측정할 것. 외식업 신규 진입자에게는 추천하지 않는다...',
    min: 50,
  },
]

export default function SubmitPage() {
  const navigate = useNavigate()
  const [meta, setMeta] = useState({
    title: '',
    category: CATEGORIES[0],
    seller_nickname: '',
  })
  const [content, setContent] = useState({
    background: '',
    attempt: '',
    cause: '',
    loss: '',
    lesson: '',
  })
  const [activeStep, setActiveStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const evaluation = useMemo(() => evaluateReport(content), [content])

  const canSubmit =
    meta.title.trim().length >= 5 &&
    meta.seller_nickname.trim().length >= 2 &&
    STEPS.every(s => content[s.key].trim().length >= s.min)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const keywords = extractKeywords(Object.values(content).join(' '), 5)
      const created = await createReport({
        ...meta,
        ...content,
        price: evaluation.recommendedPrice,
        score: evaluation.total,
        grade: evaluation.grade,
        keywords,
      })
      navigate(`/report/${created.id}`)
    } catch (e) {
      setSubmitError('등록에 실패했습니다: ' + e.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="border-b-2 border-ink-900 pb-8 mb-10">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-3 font-mono" aria-hidden="true">
          New Report
        </div>
        <h1 className="serif-display text-5xl font-black tracking-tightest mb-3">
          시행착오 리포트 작성
        </h1>
        <p className="text-ink-700">
          5단계 구조화 템플릿에 따라 작성하세요. AI가 실시간으로 품질을 평가하고 가격을 추천합니다.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Form */}
        <div className="lg:col-span-8 space-y-10">
          {/* Meta */}
          <section aria-labelledby="meta-section-title">
            <h2 id="meta-section-title" className="sr-only">기본 정보</h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="report-title"
                  className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-2 block"
                >
                  제목
                </label>
                <input
                  id="report-title"
                  type="text"
                  value={meta.title}
                  onChange={e => setMeta({ ...meta, title: e.target.value })}
                  placeholder="예: 인스타 광고 3,000만원 태우고 폐업한 디저트 카페"
                  className="input-field serif-display text-xl"
                  maxLength={80}
                  aria-describedby="title-hint"
                  required
                />
                <p id="title-hint" className="text-xs text-ink-400 mt-1 font-mono">
                  {meta.title.length}/80자
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="report-category"
                    className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-2 block"
                  >
                    카테고리
                  </label>
                  <select
                    id="report-category"
                    value={meta.category}
                    onChange={e => setMeta({ ...meta, category: e.target.value })}
                    className="input-field"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="seller-nickname"
                    className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-2 block"
                  >
                    닉네임 (익명 가능)
                  </label>
                  <input
                    id="seller-nickname"
                    type="text"
                    value={meta.seller_nickname}
                    onChange={e => setMeta({ ...meta, seller_nickname: e.target.value })}
                    placeholder="예: 강남디저트"
                    className="input-field"
                    maxLength={20}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Step navigator */}
          <nav
            aria-label="작성 단계"
            className="flex gap-1 sticky top-20 z-20 bg-white/95 backdrop-blur-sm py-3 -mx-4 px-4 border-y border-ink-900/10"
          >
            {STEPS.map((s, i) => {
              const filled = content[s.key].trim().length >= s.min
              const isCurrent = activeStep === i
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveStep(i)}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${s.title} ${filled ? '(작성 완료)' : ''}`}
                  className={`flex-1 py-2 text-xs tracking-tight transition-colors border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 ${
                    isCurrent
                      ? 'border-navy-700 text-navy-800 font-medium'
                      : filled
                      ? 'border-ink-300 text-ink-700'
                      : 'border-ink-900/20 text-ink-500'
                  }`}
                >
                  <div className="font-mono text-[10px]">STEP {s.n}</div>
                  <div className="hidden sm:block">{s.title.split(' ')[0]}</div>
                </button>
              )
            })}
          </nav>

          {/* Active step */}
          {STEPS.map((s, i) => (
            <section
              key={s.key}
              className={i === activeStep ? '' : 'hidden'}
              aria-labelledby={`step-title-${s.key}`}
              aria-hidden={i !== activeStep}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-xs text-navy-800 tracking-widest" aria-hidden="true">
                  STEP {s.n}
                </span>
                <h2 id={`step-title-${s.key}`} className="serif-display text-2xl font-bold">
                  {s.title}
                </h2>
              </div>
              <p className="text-sm text-ink-500 mb-4 leading-relaxed" id={`step-desc-${s.key}`}>
                {s.desc}
              </p>
              <textarea
                id={`textarea-${s.key}`}
                value={content[s.key]}
                onChange={e => setContent({ ...content, [s.key]: e.target.value })}
                placeholder={s.placeholder}
                rows={10}
                className="textarea-field text-[15px] leading-[1.8]"
                maxLength={3000}
                aria-describedby={`step-desc-${s.key} char-count-${s.key}`}
                aria-required="true"
                aria-invalid={content[s.key].length > 0 && content[s.key].trim().length < s.min}
              />
              <div className="flex items-center justify-between mt-2 text-xs font-mono">
                <span
                  id={`char-count-${s.key}`}
                  className={content[s.key].length >= s.min ? 'text-ink-700' : 'text-ink-400'}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {content[s.key].length} / 3,000자
                  {content[s.key].length < s.min && ` (최소 ${s.min}자)`}
                </span>
                <div className="flex gap-2">
                  {i > 0 && (
                    <button
                      onClick={() => setActiveStep(i - 1)}
                      className="text-ink-700 hover:text-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-sm px-1"
                    >
                      ← 이전
                    </button>
                  )}
                  {i < STEPS.length - 1 && (
                    <button
                      onClick={() => setActiveStep(i + 1)}
                      className="text-navy-800 hover:underline ml-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-sm px-1"
                    >
                      다음 →
                    </button>
                  )}
                </div>
              </div>
            </section>
          ))}

          {/* Error */}
          {submitError && (
            <div role="alert" className="p-3 bg-red-50 border-l-2 border-red-500 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-ink-900/10 pt-8 flex flex-wrap gap-3 items-center">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-700"
              aria-busy={submitting}
              aria-disabled={!canSubmit}
            >
              {submitting ? (
                <span role="status">등록 중...</span>
              ) : (
                '리포트 등록하기'
              )}
            </button>
            {!canSubmit && (
              <p className="text-xs text-ink-400 font-mono" aria-live="polite">
                모든 단계를 최소 {50}자 이상 작성해야 등록할 수 있습니다.
              </p>
            )}
          </div>
        </div>

        {/* Live evaluation sidebar */}
        <aside aria-label="AI 실시간 품질 평가" className="lg:col-span-4">
          <div className="sticky top-24 paper-card p-6">
            <div
              className="text-[10px] tracking-[0.2em] text-navy-800 uppercase font-mono mb-4"
              aria-hidden="true"
            >
              AI 실시간 평가
            </div>

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-ink-900/10">
              <div>
                <div
                  className="serif-display text-5xl font-black tabular-nums"
                  aria-label={`현재 점수 ${evaluation.total}점`}
                >
                  {evaluation.total}
                </div>
                <div className="text-xs text-ink-500 font-mono">/ 100점</div>
              </div>
              <div
                className={`grade-stamp ${
                  evaluation.grade === 'S'
                    ? 'text-navy-800'
                    : evaluation.grade === 'A'
                    ? 'text-ink-700'
                    : evaluation.grade === 'B'
                    ? 'text-ink-700'
                    : 'text-ink-500'
                }`}
                aria-label={`등급 ${evaluation.grade}`}
              >
                {evaluation.grade}
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-ink-900/10" role="list" aria-label="평가 항목별 점수">
              {Object.values(evaluation.breakdown).map(b => (
                <div key={b.label} role="listitem">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-700">{b.label}</span>
                    <span className="font-mono tabular-nums text-ink-500">
                      {b.score} / {b.max}
                    </span>
                  </div>
                  <div
                    className="h-1 bg-ink-100 overflow-hidden rounded-full"
                    role="progressbar"
                    aria-valuenow={b.score}
                    aria-valuemin={0}
                    aria-valuemax={b.max}
                    aria-label={`${b.label} ${b.score}/${b.max}점`}
                  >
                    <div
                      className="h-full bg-navy-700 transition-all duration-500"
                      style={{ width: `${(b.score / b.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-ink-500 tracking-[0.2em] uppercase font-mono">추천 가격</span>
                <span className="serif-display text-2xl font-bold tabular-nums">
                  {evaluation.recommendedPrice.toLocaleString()}
                  <span className="text-sm text-ink-500">원</span>
                </span>
              </div>
              <div className="flex justify-between text-xs text-ink-500">
                <span>수수료 {(evaluation.commissionRate * 100).toFixed(0)}%</span>
                <span className="font-mono">→ 정산 {evaluation.sellerEarning.toLocaleString()}원</span>
              </div>
            </div>

            {evaluation.total < 60 && (
              <div
                role="alert"
                className="mt-6 p-3 bg-navy-700/10 border-l-2 border-navy-700 text-xs text-ink-700"
              >
                점수가 낮습니다. 정량적 데이터(금액·기간·수치)와 구체적인 행동 가능한 교훈을 추가해보세요.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
