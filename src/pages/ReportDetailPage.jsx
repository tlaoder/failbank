import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReport } from '../lib/reports'

const PURCHASED_KEY = 'failbank_purchased'
function getPurchased() {
  try { return JSON.parse(localStorage.getItem(PURCHASED_KEY) || '[]') } catch { return [] }
}
function addPurchased(id) {
  const list = getPurchased()
  if (!list.includes(id)) localStorage.setItem(PURCHASED_KEY, JSON.stringify([...list, id]))
}

const SECTIONS = {
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
    getReport(id).then(r => {
      setReport(r)
      setPurchased(getPurchased().includes(id))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : ''
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

  if (loading) return (
    <div role="status" className="py-32 text-center text-void-100 font-mono text-sm tracking-widest bg-void-900 min-h-screen">
      <span className="sr-only">로딩 중</span><span aria-hidden>LOADING...</span>
    </div>
  )

  if (!report) return (
    <div className="py-32 text-center bg-void-900 min-h-screen">
      <div className="text-2xl font-bold text-cream-700 mb-4">리포트를 찾을 수 없습니다.</div>
      <Link to="/browse" className="text-gold-400 hover:text-gold-300">← 목록으로 돌아가기</Link>
    </div>
  )

  const locked = ['cause', 'loss', 'lesson']

  return (
    <div className="bg-void-900 min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Back */}
        <Link to="/browse" className="text-xs font-mono text-void-100 hover:text-gold-400 transition-colors tracking-widest uppercase mb-8 inline-block">
          ← Browse
        </Link>

        {/* Header */}
        <div className="border-b border-void-500/30 pb-10 mb-12">
          <div className="text-[9px] tracking-[0.3em] text-void-100 uppercase font-mono mb-4">
            <span>{report.category}</span>
            <span aria-hidden> · </span>
            <time dateTime={report.created_at}>{new Date(report.created_at).toLocaleDateString('ko-KR')}</time>
            <span aria-hidden> · </span>
            <span>@{report.seller_nickname}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tightest leading-tight mb-8 text-cream-900">
            {report.title}
          </h1>

          <div className="flex flex-wrap gap-4 items-center">
            <div className={`grade-stamp ${report.grade === 'S' ? 'text-gold-400 border-gold-500/50' : 'text-cream-600 border-void-300'}`}>
              {report.grade}
            </div>
            <div className="text-sm text-void-100 font-mono">{report.score}점</div>

            <div className="ml-auto flex items-center gap-4">
              {purchased ? (
                <span className="text-xs font-mono text-gold-400 border border-gold-500/30 px-4 py-2">✓ 구매 완료</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-gold-400 tabular-nums">
                    {report.price.toLocaleString()}<span className="text-sm font-normal text-void-100 ml-1">원</span>
                  </span>
                  <button onClick={() => setShowModal(true)} className="btn-primary px-6 py-3">
                    구매하기 →
                  </button>
                </>
              )}
            </div>
          </div>

          {report.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {report.keywords.map(k => (
                <span key={k} className="text-[9px] px-2 py-1 bg-void-700 text-void-100 font-mono border border-void-400/30">#{k}</span>
              ))}
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {Object.entries(SECTIONS).map(([key, label]) => {
            const isLocked = !purchased && locked.includes(key)
            return (
              <section key={key} aria-labelledby={`section-${key}`}>
                <h2 id={`section-${key}`} className="text-[9px] tracking-[0.4em] text-gold-400 uppercase font-mono mb-6">
                  {label}
                </h2>

                {isLocked ? (
                  <div className="relative">
                    <p className="text-[15px] leading-[1.9] text-cream-700 blur-[7px] select-none pointer-events-none" aria-hidden>
                      {report[key]?.slice(0, 150)}...
                    </p>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-void-900/85 backdrop-blur-[2px]">
                      <p className="text-sm text-cream-700 mb-1 text-center">
                        {key === 'cause' && '핵심 실패 원인'}
                        {key === 'loss' && '정확한 손실 규모'}
                        {key === 'lesson' && '행동 가능한 교훈'}
                        은 구매 후 열람 가능합니다
                      </p>
                      <button onClick={() => setShowModal(true)} className="mt-4 border border-gold-500/50 text-gold-400 px-6 py-2.5 text-sm hover:bg-gold-500/10 transition-colors font-mono">
                        구매하기 — {report.price.toLocaleString()}원
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[15px] leading-[1.9] text-cream-700 whitespace-pre-wrap">
                    {report[key] || '(내용 없음)'}
                  </p>
                )}
              </section>
            )
          })}
        </div>
      </article>

      {/* Modal */}
      {showModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="absolute inset-0 bg-void-900/80 backdrop-blur-sm" aria-hidden />
          <div className="relative bg-void-800 border border-void-500/40 w-full max-w-md p-10 animate-fade-up">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-void-100 hover:text-cream-900 p-2 font-mono" aria-label="닫기">✕</button>

            <div className="text-[9px] tracking-[0.3em] text-gold-400 uppercase font-mono mb-6">결제 확인</div>
            <h2 id="modal-title" className="text-xl font-bold mb-2 text-cream-900 leading-snug">{report.title}</h2>
            <p className="text-sm text-void-50 mb-8">구매 후 실패 원인 · 손실 규모 · 교훈 전체가 즉시 열람됩니다.</p>

            <div className="border border-void-500/30 divide-y divide-void-500/30 mb-8 text-sm">
              <div className="flex justify-between px-5 py-3">
                <span className="text-void-100">결제 수단</span>
                <span className="font-mono text-cream-700">**** 1234</span>
              </div>
              <div className="flex justify-between px-5 py-3">
                <span className="text-void-100">결제 금액</span>
                <span className="font-bold text-gold-400 tabular-nums">{report.price.toLocaleString()}원</span>
              </div>
            </div>

            <button onClick={handlePurchase} disabled={paying} className="btn-primary w-full py-4 text-center" aria-busy={paying}>
              {paying ? <span role="status">결제 처리 중...</span> : `${report.price.toLocaleString()}원 결제하기`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
