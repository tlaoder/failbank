import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReport } from '../lib/reports'
import { requestPayment, hasPurchased } from '../lib/payment'

const SECTIONS = {
  background: { label: '배경', sub: 'Background', icon: '📍' },
  attempt:    { label: '시도', sub: 'Attempt',    icon: '🚀' },
  cause:      { label: '실패 원인', sub: 'Root Cause', icon: '🔍' },
  loss:       { label: '손실 규모', sub: 'Loss',      icon: '💸' },
  lesson:     { label: '교훈', sub: 'Lesson',    icon: '💡' },
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
      await requestPayment({ reportId: id, title: report.title, price: report.price })
    } catch (err) {
      console.error('결제 오류:', err)
    } finally {
      setPaying(false)
    }
  }

  if (loading) return (
    <div className="bg-paper-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-paper-400">불러오는 중...</p>
      </div>
    </div>
  )

  if (!report) return (
    <div className="bg-paper-50 min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <div className="text-5xl mb-6">🗂️</div>
        <div className="text-xl font-bold text-ink-700 mb-4">리포트를 찾을 수 없습니다.</div>
        <Link to="/browse" className="btn-gold">← 목록으로 돌아가기</Link>
      </div>
    </div>
  )

  const locked = ['cause', 'loss', 'lesson']

  return (
    <div className="bg-paper-50 min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12">

        {/* 뒤로가기 */}
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-paper-400 hover:text-gold-500 transition-colors mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          Browse로 돌아가기
        </Link>

        {/* ── 헤더 카드 ── */}
        <div className="paper-card p-8 mb-8">
          {/* 메타 */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="badge bg-paper-100 text-paper-600">{report.category}</span>
            {report.is_priority && (
              <span className="badge bg-gold-100 text-gold-600 border border-gold-200">⭐ PRO</span>
            )}
            <span className="text-xs text-paper-400 ml-auto font-mono">
              @{report.seller_nickname} · {new Date(report.created_at).toLocaleDateString('ko-KR')}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6 text-ink-900">
            {report.title}
          </h1>

          {/* 등급 + 점수 + 가격 */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`grade-stamp ${report.grade === 'S' ? 'text-gold-500' : 'text-paper-400'}`}>
              {report.grade}
            </div>
            <div className="text-sm text-paper-400 font-mono">{report.score}점</div>

            <div className="ml-auto flex items-center gap-4">
              {purchased ? (
                <span className="badge bg-green-50 text-green-700 border border-green-200 px-4 py-2">
                  ✓ 구매 완료 — 전체 열람 중
                </span>
              ) : (
                <>
                  <div className="tabular-nums text-right">
                    <span className="text-3xl font-black text-ink-900">{report.price.toLocaleString()}</span>
                    <span className="text-sm text-paper-400 ml-1">원</span>
                  </div>
                  <button onClick={() => setShowModal(true)} className="btn-gold px-6 py-3">
                    구매하기 →
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 키워드 */}
          {report.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-paper-100">
              {report.keywords.map(k => (
                <span key={k} className="text-[10px] px-2.5 py-1 bg-paper-50 text-paper-500 rounded-full border border-paper-200 font-mono">
                  #{k}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── 5단계 섹션 ── */}
        <div className="space-y-4">
          {Object.entries(SECTIONS).map(([key, { label, sub, icon }]) => {
            const isLocked = !purchased && locked.includes(key)
            return (
              <div key={key} className="paper-card overflow-hidden">
                {/* 섹션 헤더 */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-paper-100 bg-paper-50">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <div className="text-sm font-bold text-ink-800">{label}</div>
                    <div className="text-xs text-paper-400 font-mono">{sub}</div>
                  </div>
                  {isLocked && (
                    <span className="ml-auto badge bg-paper-100 text-paper-500 text-xs">🔒 구매 후 열람</span>
                  )}
                </div>

                {/* 섹션 내용 */}
                {isLocked ? (
                  <div className="relative p-6 min-h-[120px]">
                    <p className="text-[15px] leading-[1.9] text-ink-700 blur-[6px] select-none pointer-events-none" aria-hidden>
                      {report[key]?.slice(0, 200)}...
                    </p>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] px-6">
                      <p className="text-sm text-ink-600 mb-4 text-center">
                        이 섹션은 구매 후 열람할 수 있습니다
                      </p>
                      <button onClick={() => setShowModal(true)} className="btn-gold px-6 py-2.5 text-sm">
                        {report.price.toLocaleString()}원에 구매하기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-[15px] leading-[1.9] text-ink-700 whitespace-pre-wrap">
                      {report[key] || '(내용 없음)'}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </article>

      {/* ── 구매 모달 ── */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" aria-hidden />
          <div className="relative bg-white rounded-2xl w-full max-w-md p-8 animate-fade-up shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-paper-400 hover:text-ink-900 hover:bg-paper-100 rounded-lg transition-colors"
              aria-label="닫기"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="badge-gold mb-3 inline-flex">결제 확인</span>
              <h2 id="modal-title" className="text-lg font-bold text-ink-900 leading-snug">
                {report.title}
              </h2>
              <p className="text-sm text-paper-400 mt-2">
                구매 후 실패 원인 · 손실 규모 · 교훈 전체가 즉시 열람됩니다.
              </p>
            </div>

            <div className="bg-paper-50 rounded-xl divide-y divide-paper-100 mb-6 text-sm">
              <div className="flex justify-between px-5 py-3">
                <span className="text-paper-500">카테고리</span>
                <span className="text-ink-700">{report.category}</span>
              </div>
              <div className="flex justify-between px-5 py-3">
                <span className="text-paper-500">품질 등급</span>
                <span className="font-bold text-ink-900">{report.grade} ({report.score}점)</span>
              </div>
              <div className="flex justify-between px-5 py-3">
                <span className="text-paper-500">결제 금액</span>
                <span className="font-black text-xl text-ink-900 tabular-nums">{report.price.toLocaleString()}원</span>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={paying}
              className="btn-gold w-full py-4 text-center text-base"
              aria-busy={paying}
            >
              {paying
                ? <span role="status" className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                    처리 중...
                  </span>
                : `${report.price.toLocaleString()}원 결제하기`
              }
            </button>

            <p className="text-xs text-paper-400 text-center mt-3">
              토스페이먼츠 보안 결제 · 즉시 열람
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
