import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { evaluateReport, extractKeywords } from '../lib/scoring'
import { createReport, CATEGORIES } from '../lib/reports'

const STEPS = [
  { key: 'background', n: '01', icon: '📍', title: '배경', sub: 'Background', desc: '업종 카테고리, 사업 시작 시기, 초기 투자 규모, 목표 고객군', placeholder: '예: 강남 역삼동 1층에 36㎡ 디저트 카페를 2023년 3월 오픈. 초기 투자금 1억 2,000만원...', min: 50 },
  { key: 'attempt', n: '02', icon: '🚀', title: '시도', sub: 'Attempt', desc: '사용 채널, 마케팅 방식, 투입 기간', placeholder: '예: 인스타그램 광고에 월 250만원씩 12개월간 집행. 인플루언서 협찬 5명...', min: 50 },
  { key: 'cause', n: '03', icon: '🔍', title: '실패 원인', sub: 'Root Cause', desc: '핵심 실패 원인 분석, 외부 요인, 인지 시점', placeholder: '예: 광고 ROAS를 한 번도 측정하지 않았다. 팔로워 8,000명 대비 방문 전환율 1% 미만...', min: 50 },
  { key: 'loss', n: '04', icon: '💸', title: '손실 규모', sub: 'Loss', desc: '금전적·시간적 손실의 정량적 기술', placeholder: '예: 광고비 3,000만원, 적자 4,200만원, 총 9,200만원, 14개월...', min: 50 },
  { key: 'lesson', n: '05', icon: '💡', title: '교훈', sub: 'Lesson', desc: '핵심 인사이트, 다음에 다를 행동, 추천 대상', placeholder: '예: 첫 3개월 광고비를 월 30만원으로 제한하고 ROAS를 주 단위로 측정할 것...', min: 50 },
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
      const created = await createReport({
        ...meta, ...content,
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
    <div className="bg-paper-50 dark:bg-[#070d1a] min-h-screen">

      {/* 페이지 헤더 */}
      <div className="bg-white dark:bg-ink-900 border-b border-paper-100 dark:border-ink-800">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <span className="badge-gold mb-3 inline-flex">New Report</span>
          <h1 className="text-4xl font-black mb-2 text-ink-900 dark:text-paper-50">시행착오 리포트 작성</h1>
          <p className="text-paper-400 dark:text-paper-500 text-sm">5단계 구조화 템플릿에 따라 작성하세요. AI가 실시간으로 품질을 평가하고 가격을 추천합니다.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-12 gap-10">

          {/* ── 작성 영역 ── */}
          <div className="lg:col-span-8 space-y-8">

            {/* 기본 정보 */}
            <div className="paper-card p-8 space-y-6">
              <h2 className="text-sm font-bold text-ink-800 dark:text-paper-100">기본 정보</h2>
              <div>
                <label htmlFor="report-title" className="text-xs font-semibold text-paper-400 uppercase tracking-wider mb-2 block">제목</label>
                <input
                  id="report-title"
                  type="text"
                  value={meta.title}
                  onChange={e => setMeta({ ...meta, title: e.target.value })}
                  placeholder="예: 인스타 광고 3,000만원 태우고 폐업한 디저트 카페"
                  className="input-field text-base font-bold"
                  maxLength={80}
                />
                <p className="text-xs text-paper-400 mt-1 font-mono">{meta.title.length}/80</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="report-category" className="text-xs font-semibold text-paper-400 uppercase tracking-wider mb-2 block">카테고리</label>
                  <select id="report-category" value={meta.category} onChange={e => setMeta({ ...meta, category: e.target.value })} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="seller-nickname" className="text-xs font-semibold text-paper-400 uppercase tracking-wider mb-2 block">닉네임 (익명 가능)</label>
                  <input
                    id="seller-nickname"
                    type="text"
                    value={meta.seller_nickname}
                    onChange={e => setMeta({ ...meta, seller_nickname: e.target.value })}
                    placeholder="예: 강남디저트"
                    className="input-field"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            {/* 5단계 탭 */}
            <nav
              aria-label="작성 단계"
              className="flex gap-1.5 bg-paper-100 dark:bg-ink-800 p-1.5 rounded-xl sticky top-20 z-20"
            >
              {STEPS.map((s, i) => {
                const filled = content[s.key].trim().length >= s.min
                const isCurrent = activeStep === i
                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveStep(i)}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`flex-1 py-2 px-1 rounded-lg text-center transition-all ${
                      isCurrent
                        ? 'bg-white dark:bg-ink-700 shadow-sm text-ink-900 dark:text-paper-50 font-semibold'
                        : filled
                        ? 'text-gold-600 hover:bg-white/60 dark:hover:bg-ink-700/60'
                        : 'text-paper-400 dark:text-paper-500 hover:bg-white/40 dark:hover:bg-ink-700/40'
                    }`}
                  >
                    <div className="text-lg">{s.icon}</div>
                    <div className="text-[10px] mt-0.5 hidden sm:block">
                      {filled && !isCurrent ? '✓' : s.title}
                    </div>
                  </button>
                )
              })}
            </nav>

            {/* 단계별 텍스트에어리어 */}
            {STEPS.map((s, i) => (
              <div key={s.key} className={`paper-card p-8 ${i === activeStep ? '' : 'hidden'}`} aria-hidden={i !== activeStep}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold text-ink-900 dark:text-paper-50">
                      {s.title} <span className="text-paper-300 font-normal text-sm">/ {s.sub}</span>
                    </h2>
                  </div>
                  <span className="ml-auto font-mono text-xs text-paper-400">STEP {s.n}</span>
                </div>
                <p className="text-sm text-paper-400 mb-4 leading-relaxed">{s.desc}</p>
                <textarea
                  value={content[s.key]}
                  onChange={e => setContent({ ...content, [s.key]: e.target.value })}
                  placeholder={s.placeholder}
                  rows={10}
                  className="textarea-field text-[15px] leading-[1.9]"
                  maxLength={3000}
                />
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className={`font-mono ${content[s.key].length >= s.min ? 'text-ink-500' : 'text-paper-400'}`}>
                    {content[s.key].length} / 3,000
                    {content[s.key].length < s.min && (
                      <span className="text-gold-600 ml-1">(최소 {s.min}자)</span>
                    )}
                  </span>
                  <div className="flex gap-4">
                    {i > 0 && (
                      <button onClick={() => setActiveStep(i - 1)} className="text-paper-400 hover:text-ink-700 transition-colors">
                        ← 이전
                      </button>
                    )}
                    {i < STEPS.length - 1 && (
                      <button onClick={() => setActiveStep(i + 1)} className="text-gold-500 hover:text-gold-600 font-medium transition-colors">
                        다음 →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 에러 */}
            {submitError && (
              <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {submitError}
              </div>
            )}

            {/* 제출 */}
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="btn-gold px-10 py-4 text-base"
                aria-busy={submitting}
              >
                {submitting
                  ? <span role="status" className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                      등록 중...
                    </span>
                  : '리포트 등록하기 →'
                }
              </button>
              {!canSubmit && (
                <p className="text-xs text-paper-400">모든 단계를 50자 이상 작성해야 등록 가능합니다.</p>
              )}
            </div>
          </div>

          {/* ── AI 평가 사이드바 ── */}
          <aside aria-label="AI 실시간 품질 평가" className="lg:col-span-4">
            <div className="paper-card p-8 sticky top-24">
              <span className="badge-gold mb-5 inline-flex">AI 실시간 평가</span>

              {/* 점수 + 등급 */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-paper-100 dark:border-ink-700">
                <div>
                  <div className="text-6xl font-black tabular-nums text-ink-900 dark:text-paper-50 leading-none">
                    {evaluation.total}
                  </div>
                  <div className="text-xs text-paper-400 font-mono mt-1">/ 100점</div>
                </div>
                <div className={`grade-stamp ${evaluation.grade === 'S' ? 'text-gold-500' : 'text-paper-400'}`}>
                  {evaluation.grade}
                </div>
              </div>

              {/* 세부 점수 */}
              <div className="space-y-4 mb-6 pb-6 border-b border-paper-100 dark:border-ink-700">
                {Object.values(evaluation.breakdown).map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-ink-700 dark:text-paper-300 font-medium">{b.label}</span>
                      <span className="font-mono text-paper-400">{b.score} / {b.max}</span>
                    </div>
                    <div className="h-1.5 bg-paper-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={b.score} aria-valuemin={0} aria-valuemax={b.max}>
                      <div
                        className="h-full bg-gold-400 rounded-full transition-all duration-500"
                        style={{ width: `${(b.score / b.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* 가격 추천 */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-paper-400 font-medium">추천 가격</span>
                  <span className="text-2xl font-black text-ink-900 dark:text-paper-50 tabular-nums">
                    {evaluation.recommendedPrice.toLocaleString()}
                    <span className="text-sm text-paper-400 ml-1 font-normal">원</span>
                  </span>
                </div>
                <div className="flex justify-between text-xs text-paper-400 font-mono">
                  <span>수수료 {(evaluation.commissionRate * 100).toFixed(0)}%</span>
                  <span>→ 정산 {evaluation.sellerEarning.toLocaleString()}원</span>
                </div>
              </div>

              {evaluation.total < 60 && (
                <div role="alert" className="mt-5 p-4 bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-xl text-xs text-ink-700 dark:text-paper-300 leading-relaxed">
                  💡 점수가 낮습니다. 정량적 데이터(금액·기간·수치)와 구체적인 교훈을 추가해보세요.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
