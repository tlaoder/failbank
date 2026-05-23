import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReport } from '../lib/reports'
import { requestPayment, hasPurchased } from '../lib/payment'

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
      setPurchased(hasPurchased(id))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  const handlePurchase = async () => {
    setPaying(true)
    try {
      // 토스페이먼츠 결제창 오픈 → 결제 완료 시 /payment/success 로 리다이렉트
      await requestPayment({
        reportId: id,
        title: report.title,
        price: report.price,
      })
      // 여기는 사용자가 결제창을 닫거나 취소한 경우에만 도달
    } catch (err) {
      console.error('결제 오류:', err)
    } finally {
      setPaying(false)
    }
  }

  if (loading) return (
    <div role="status" className="py-32 text-center text-paper-400 font-mono text-sm bg-paper-50 min-h-screen">
      <span className="sr-only">로딩 중</span><span aria-hidden>로딩 중...</span>
    </div>
  )

  if (!report) return (
    <div className="py-32 text-center bg-paper-50 min-h-screen">
      <div className="text-2xl font-bold text-ink-700 mb-4">리포트를 찾을 수 없습니다.</div>
      <Link to="/browse" className="text-gold-500 hover:text-gold-600">← 목록으로 돌아가기</Link>
    </div>
  )

  const locked = ['cause', 'loss', 'lesson']

  return (
    <div className="bg-paper-50 min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/browse" className="text-xs font-mono text-paper-500 hover:text-gold-500 transition-colors tracking-widest uppercase mb-8 inline-block">
          ← Browse
        </Link>

        <div className="border-b border-paper-300 pb-10 mb-12">
          <div className="text-[9px] tracking-[0.3em] text-paper-500 uppercase font-mono mb-4">
            <span>{report.category}</span>
            <span aria-hidden> · </span>
            <time dateTime={report.created_at}>{new Date(report.created_at).toLocaleDateString('ko-KR')}</time>
            <span aria-hidden> · </span>
            <span>@{report.seller_nickname}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tightest leading-tight mb-8 text-ink-900">
            {report.title}
          </h1>

          <div className="flex flex-wrap gap-4 items-center">
            <div className={`grade-stamp ${report.grade === 'S' ? 'text-gold-500' : 'text-ink-400'}`}>
              {report.grade}
            </div>
            <div className="text-sm text-paper-500 font-mono">{report.score}점</div>
            <div className="ml-auto flex items-center gap-4">
              {purchased ? (
                <span className="text-xs font-mono text-gold-600 border border-gold-300 bg-gold-100 px-4 py-2">✓ 구매 완료</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-ink-900 tabular-nums">
                    {report.price.toLocaleString()}<span className="text-sm font-normal text-paper-500 ml-1">원</span>
                  </span>
                  <button onClick={() => setShowModal(true)} className="btn-primary px-6 py-3">구매하기 →</button>
                </>
              )}
            </div>
          </div>

          {report.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {report.keywords.map(k => (
                <span key={k} className="text-[9px] px-2 py-1 bg-paper-100 text-ink-600 font-mono border border-paper-200">#{k}</span>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-12">
          {Object.entries(SECTIONS).map(([key, label]) => {
            const isLocked = !purchased && locked.includes(key)
            return (
              <section key={key} aria-labelledby={`section-${key}`}>
                <h2 id={`section-${key}`} className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-6">
                  {label}
                </h2>
                {isLocked ? (
                  <div className="relative border border-paper-200 bg-white">
                    <p className="text-[15px] leading-[1.9] text-ink-700 blur-[6px] select-none pointer-events-none p-6" aria-hidden>
                      {report[key]?.slice(0, 150)}...
                    </p>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
                      <p className="text-sm text-ink-600 mb-1 text-center">
                        {key === 'cause' && '핵심 실패 원인'}
                        {key === 'loss' && '정확한 손실 규모'}
                        {key === 'lesson' && '행동 가능한 교훈'}
                        은 구매 후 열람 가능합니다
                      </p>
                      <button onClick={() => setShowModal(true)} className="mt-4 btn-primary px-6 py-2.5 text-sm">
                        구매하기 — {report.price.toLocaleString()}원
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
      </article>

      {showModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" aria-hidden />
          <div className="relative bg-white border border-paper-200 w-full max-w-md p-10 animate-fade-up shadow-xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-paper-400 hover:text-ink-900 p-2 font-mono" aria-label="닫기">✕</button>

            <div className="text-[9px] tracking-[0.3em] text-gold-500 uppercase font-mono mb-6">결제 확인</div>
            <h2 id="modal-title" className="text-xl font-bold mb-2 text-ink-900 leading-snug">{report.title}</h2>
            <p className="text-sm text-paper-500 mb-8">구매 후 실패 원인 · 손실 규모 · 교훈 전체가 즉시 열람됩니다.</p>

            <div className="border border-paper-200 divide-y divide-paper-100 mb-8 text-sm">
              <div className="flex justify-between px-5 py-3">
                <span className="text-paper-500">결제 수단</span>
                <span className="font-mono text-ink-700">**** 1234</span>
              </div>
              <div className="flex justify-between px-5 py-3">
                <span className="text-paper-500">결제 금액</span>
                <span className="font-bold text-ink-900 tabular-nums">{report.price.toLocaleString()}원</span>
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
