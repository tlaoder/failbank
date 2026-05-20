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
    placeholder: '예: 강남 역삼동 1층에 36㎡(11평) 디저트 카페를 2023년 3월 오픈했다. 초기 투자금 1억 2,000만원, 목표 고객은 20대 직장인 여성...',
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
    placeholder: '예: 광고 ROAS를 한 번도 측정하지 않았다. 팔로워 8,000명 대비 실제 방문 전환율 1% 미만...',
    min: 50,
  },
  {
    key: 'loss',
    n: '04',
    title: '손실 규모 (Loss)',
    desc: '금전적·시간적 손실의 정량적 기술 — 금액 구간, 투입 시간, 기회비용',
    placeholder: '예: 광고비 3,000만원, 적자 4,200만원, 권리금 회수 실패 2,000만원. 총 9,200만원, 14개월...',
    min: 50,
  },
  {
    key: 'lesson',
    n: '05',
    title: '교훈 (Lesson)',
    desc: '이 경험에서 얻은 핵심 인사이트 — 다음에 다를 행동, 추천 대상 업종',
    placeholder: '예: 다음에는 첫 3개월 광고비를 월 30만원으로 제한하고 ROAS를 주 단위로 측정할 것. 외식업 신규 진입자에게는 추천하지 않는다...',
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
    background: '', attempt: '', cause: '', loss: '', lesson: '',
  })
  const [activeStep, setActiveStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const evaluation = useMemo(() => evaluateReport(content), [content])

  const canSubmit = meta.title.trim().length >= 5 &&
    meta.seller_nickname.trim().length >= 2 &&
    STEPS.every(s => content[s.key].trim().length >= s.min)

  const handleEvaluate = () => {
    setShowResult(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const keywords = extractKeywords(
        Object.values(content).join(' '), 5
      )
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
      alert('등록에 실패했습니다: ' + e.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="border-b-2 border-ink-900 pb-8 mb-10">
        <div className="text-xs tracking-[0.3em] text-terra-600 uppercase mb-3 font-mono">
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
          <section className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-2 block">
                제목
              </label>
              <input
                type="text"
                value={meta.title}
                onChange={e => setMeta({ ...meta, title: e.target.value })}
                placeholder="예: 인스타 광고 3,000만원 태우고 폐업한 디저트 카페"
                className="input-field serif-display text-xl"
                maxLength={80}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-2 block">
                  카테고리
                </label>
                <select
                  value={meta.category}
                  onChange={e => setMeta({ ...meta, category: e.target.value })}
                  className="input-field"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-2 block">
                  닉네임 (익명)
                </label>
                <input
                  type="text"
                  value={meta.seller_nickname}
                  onChange={e => setMeta({ ...meta, seller_nickname: e.target.value })}
                  placeholder="예: 강남디저트"
                  className="input-field"
                  maxLength={20}
                />
              </div>
            </div>
          </section>

          {/* Step navigator */}
          <div className="flex gap-1 sticky top-20 z-20 bg-paper-50/95 backdrop-blur-sm py-3 -mx-4 px-4 border-y border-ink-900/10">
            {STEPS.map((s, i) => {
              const filled = content[s.key].trim().length >= s.min
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveStep(i)}
                  className={`flex-1 py-2 text-xs tracking-tight transition-colors border-b-2 ${
                    activeStep === i
                      ? 'border-terra-500 text-terra-600 font-medium'
                      : filled
                      ? 'border-sage-500 text-sage-600'
                      : 'border-ink-900/20 text-ink-500'
                  }`}
                >
                  <div className="font-mono text-[10px]">STEP {s.n}</div>
                  <div className="hidden sm:block">{s.title.split(' ')[0]}</div>
                </button>
              )
            })}
          </div>

          {/* Active step */}
          {STEPS.map((s, i) => (
            <section key={s.key} className={i === activeStep ? '' : 'hidden'}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-xs text-terra-600 tracking-widest">STEP {s.n}</span>
                <h2 className="serif-display text-2xl font-bold">{s.title}</h2>
              </div>
              <p className="text-sm text-ink-500 mb-4 leading-relaxed">{s.desc}</p>
              <textarea
                value={content[s.key]}
                onChange={e => setContent({ ...content, [s.key]: e.target.value })}
                placeholder={s.placeholder}
                rows={10}
                className="textarea-field text-[15px] leading-[1.8]"
                maxLength={3000}
              />
              <div className="flex items-center justify-between mt-2 text-xs font-mono">
                <span className={content[s.key].length >= s.min ? 'text-sage-600' : 'text-ink-500'}>
                  {content[s.key].length} / 3,000자 (최소 {s.min}자)
                </span>
                <div className="flex gap-2">
                  {i > 0 && (
                    <button onClick={() => setActiveStep(i - 1)} className="text-ink-700 hover:text-terra-600">
                      ← 이전
                    </button>
                  )}
                  {i < STEPS.length - 1 && (
                    <button onClick={() => setActiveStep(i + 1)} className="text-terra-600 hover:underline ml-3">
                      다음 →
                    </button>
                  )}
                </div>
              </div>
            </section>
          ))}

          {/* Actions */}
          <div className="border-t border-ink-900/10 pt-8 flex flex-wrap gap-3">
            <button
              onClick={handleEvaluate}
              className="btn-secondary"
            >
              AI 평가 받기
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="btn-primary"
            >
              {submitting ? '등록 중...' : '리포트 등록하기'}
            </button>
          </div>
        </div>

        {/* Live evaluation sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 paper-card p-6">
            <div className="text-[10px] tracking-[0.2em] text-terra-600 uppercase font-mono mb-4">
              AI 실시간 평가
            </div>

            <div className="flex items-center justify-between mb-6 pb-6 border-b border-ink-900/10">
              <div>
                <div className="serif-display text-5xl font-black tabular-nums">
                  {evaluation.total}
                </div>
                <div className="text-xs text-ink-500 font-mono">/ 100점</div>
              </div>
              <div className={`grade-stamp ${
                evaluation.grade === 'S' ? 'text-terra-600' :
                evaluation.grade === 'A' ? 'text-gold-600' :
                evaluation.grade === 'B' ? 'text-sage-600' : 'text-ink-500'
              }`}>
                {evaluation.grade}
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-ink-900/10">
              {Object.values(evaluation.breakdown).map(b => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-700">{b.label}</span>
                    <span className="font-mono tabular-nums text-ink-500">
                      {b.score} / {b.max}
                    </span>
                  </div>
                  <div className="h-1 bg-paper-200 overflow-hidden">
                    <div
                      className="h-full bg-terra-500 transition-all duration-500"
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
                  {evaluation.recommendedPrice.toLocaleString()}<span className="text-sm text-ink-500">원</span>
                </span>
              </div>
              <div className="flex justify-between text-xs text-ink-500">
                <span>수수료 {(evaluation.commissionRate * 100).toFixed(0)}%</span>
                <span className="font-mono">→ 정산 {evaluation.sellerEarning.toLocaleString()}원</span>
              </div>
            </div>

            {showResult && evaluation.total < 60 && (
              <div className="mt-6 p-3 bg-terra-500/10 border-l-2 border-terra-500 text-xs text-ink-700">
                점수가 낮습니다. 정량적 데이터(금액·기간·수치)와 구체적인 행동 가능한 교훈을 추가해보세요.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
