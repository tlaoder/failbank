import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReport } from '../lib/reports'

const PURCHASED_KEY = 'failbank_purchased'

function getPurchased() {
  try {
    return JSON.parse(localStorage.getItem(PURCHASED_KEY) || '[]')
  } catch {
    return []
  }
}

function addPurchased(id) {
  const list = getPurchased()
  if (!list.includes(id)) {
    localStorage.setItem(PURCHASED_KEY, JSON.stringify([...list, id]))
  }
}

const SECTION_LABELS = {
  background: '배경 (Background)',
  attempt: '시도 (Attempt)',
  cause: '실패 원인 (Cause)',
  loss: '손실 규모 (Loss)',
  lesson: '교훈 (Lesson)',
}

export default function ReportDetailPage() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchased, setPurchased] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    setLoading(true)
    getReport(id)
      .then(r => {
        setReport(r)
        setPurchased(getPurchased().includes(id))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  // 모달 열릴 때 스크롤 잠금
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  const handlePurchase = async () => {
    setPaying(true)
    await new Promise(r => setTimeout(r, 1200))
    addPurchased(id)
    setPurchased(true)
    setPaying(false)
    setShowModal(false)
  }

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="max-w-4xl mx-auto px-6 py-20 text-center text-ink-500 font-mono text-sm"
      >
        <span className="sr-only">리포트를 불러오는 중입니다</span>
        <span aria-hidden="true">로딩 중...</span>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center" role="alert">
        <div className="serif-display text-2xl font-bold mb-4">리포트를 찾을 수 없습니다.</div>
        <Link to="/browse" className="text-navy-800 hover:underline">
          목록으로 돌아가기 →
        </Link>
      </div>
    )
  }

  const lockedSections = ['cause', 'loss', 'lesson']

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <Link
          to="/browse"
          className="text-xs font-mono text-ink-500 hover:text-navy-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-sm"
          aria-label="리포트 거래소 목록으로 돌아가기"
        >
          ← 다른 리포트 둘러보기
        </Link>

        <div className="mt-6 mb-4 text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono">
          <span>{report.category}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={report.created_at}>
            {new Date(report.created_at).toLocaleDateString('ko-KR')}
          </time>
          <span aria-hidden="true"> · </span>
          <span>@{report.seller_nickname}</span>
        </div>

        <h1 className="serif-display text-4xl font-black tracking-tightest leading-tight mb-6">
          {report.title}
        </h1>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Grade */}
          <div
            className={`grade-stamp ${
              report.grade === 'S'
                ? 'text-navy-800'
                : report.grade === 'A'
                ? 'text-ink-700'
                : 'text-ink-500'
            }`}
            aria-label={`AI 품질 등급 ${report.grade}등급`}
          >
            {report.grade}
          </div>

          <div className="text-sm text-ink-500 font-mono">
            <span className="sr-only">품질 점수</span>
            {report.score}점
          </div>

          {/* Purchase status */}
          <div className="ml-auto flex items-center gap-3">
            {purchased ? (
              <span className="text-xs font-mono text-ink-500 bg-ink-100 px-3 py-1.5 rounded-sm">
                ✓ 구매 완료
              </span>
            ) : (
              <>
                <span className="tabular-nums text-2xl font-bold">
                  {report.price.toLocaleString()}
                  <span className="text-sm font-normal text-ink-500">원</span>
                </span>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary text-sm px-5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-700"
                  aria-label={`${report.title} 리포트 구매하기 — ${report.price.toLocaleString()}원`}
                >
                  구매하기 →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Keywords */}
        {report.keywords && report.keywords.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-4 list-none" aria-label="키워드">
            {report.keywords.map(k => (
              <li key={k} className="text-[10px] px-2 py-0.5 bg-ink-100 text-ink-700 font-mono">
                #{k}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Content sections */}
      <div className="space-y-10">
        {Object.entries(SECTION_LABELS).map(([key, label]) => {
          const isLocked = !purchased && lockedSections.includes(key)
          return (
            <section
              key={key}
              aria-labelledby={`section-${key}`}
              aria-hidden={isLocked ? 'true' : undefined}
            >
              <h2
                id={`section-${key}`}
                className="text-[10px] tracking-[0.3em] text-navy-800 uppercase font-mono mb-4"
              >
                {label}
              </h2>

              {isLocked ? (
                <div className="relative rounded-lg overflow-hidden">
                  {/* 흐림 미리보기 */}
                  <div
                    className="select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    <p className="text-[15px] leading-[1.9] text-ink-700 blur-[6px]">
                      {report[key]
                        ? report[key].slice(0, 120) + '...'
                        : '이 섹션의 내용은 구매 후 확인할 수 있습니다.'}
                    </p>
                  </div>
                  {/* Overlay CTA */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-lg">
                    <p className="text-sm font-medium text-ink-700 mb-1">
                      {key === 'cause' && '핵심 실패 원인'}
                      {key === 'loss' && '정확한 손실 규모'}
                      {key === 'lesson' && '행동 가능한 교훈'}
                      은 구매 후 열람 가능합니다
                    </p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-3 text-sm text-navy-800 border border-navy-800 px-4 py-2 hover:bg-navy-800 hover:text-white transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
                      aria-label={`리포트 구매 후 ${label} 열람하기`}
                    >
                      구매하기 → {report.price.toLocaleString()}원
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[15px] leading-[1.9] text-ink-700 whitespace-pre-wrap">
                  {report[key] || '(내용 없음)'}
                </p>
              )}
            </section>
          )
        })}
      </div>

      {/* 구매 모달 */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="absolute inset-0 bg-ink-900/40" aria-hidden="true" />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-8 animate-fade-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-ink-500 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-sm p-1"
              aria-label="결제 창 닫기"
            >
              ✕
            </button>

            <div className="text-[10px] tracking-[0.2em] text-navy-800 uppercase font-mono mb-6">
              결제 확인
            </div>

            <h2 id="modal-title" className="serif-display text-xl font-bold mb-1 leading-snug">
              {report.title}
            </h2>
            <p className="text-sm text-ink-500 mb-6">
              구매 후 실패 원인 · 손실 규모 · 교훈 전체가 즉시 열람됩니다.
            </p>

            <div className="border border-ink-200 rounded-lg divide-y divide-ink-100 mb-6 text-sm">
              <div className="flex justify-between px-4 py-3">
                <span className="text-ink-500">결제 수단</span>
                <span className="font-mono text-ink-700">**** 1234</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-ink-500">결제 금액</span>
                <span className="font-bold tabular-nums">{report.price.toLocaleString()}원</span>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={paying}
              className="btn-primary w-full justify-center flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-700"
              aria-busy={paying}
            >
              {paying ? (
                <span role="status">결제 처리 중...</span>
              ) : (
                `${report.price.toLocaleString()}원 결제하기`
              )}
            </button>
          </div>
        </div>
      )}
    </article>
  )
}
