import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReport } from '../lib/reports'

const STORAGE_KEY = 'failbank_purchased'

function getPurchased() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}
function addPurchased(id) {
  const arr = getPurchased()
  if (!arr.includes(id)) {
    arr.push(id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  }
}

export default function ReportDetailPage() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchased, setPurchased] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    setLoading(true)
    getReport(id).then(r => {
      setReport(r)
      setPurchased(getPurchased().includes(id))
      setLoading(false)
    })
  }, [id])

  const handleFakePay = () => {
    setPaying(true)
    setTimeout(() => {
      addPurchased(id)
      setPurchased(true)
      setPaying(false)
      setCheckoutOpen(false)
    }, 1500)
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-20 text-center text-ink-500 font-mono">로딩 중...</div>
  }
  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="serif-display text-3xl text-ink-500 mb-4">리포트를 찾을 수 없습니다.</div>
        <Link to="/browse" className="text-navy-800 hover:underline">목록으로 돌아가기 →</Link>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-xs font-mono tracking-tight text-ink-500">
        <Link to="/browse" className="hover:text-navy-800">리포트 거래소</Link>
        {' / '}
        <span>{report.category}</span>
      </div>

      {/* Headline */}
      <header className="border-b-2 border-ink-900 pb-8 mb-10">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase font-mono mb-4">
          Failure Report · {report.category}
        </div>
        <h1 className="serif-display text-4xl md:text-5xl font-black leading-[1.05] tracking-tightest mb-6">
          {report.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-700">
          <span className="font-mono">@{report.seller_nickname}</span>
          <span className="text-ink-500">·</span>
          <span>{new Date(report.created_at).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</span>
          <span className="text-ink-500">·</span>
          <span className="font-mono">조회 {report.view_count}</span>
        </div>
      </header>

      {/* AI Score Card */}
      <div className="paper-card p-6 mb-10 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
        <div className="flex items-center gap-4">
          <div className={`grade-stamp ${
            report.grade === 'S' ? 'text-navy-800' :
            report.grade === 'A' ? 'text-ink-700' :
            report.grade === 'B' ? 'text-ink-700' : 'text-ink-500'
          }`}>
            {report.grade}
          </div>
          <div>
            <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono">AI Score</div>
            <div className="serif-display text-3xl font-black tabular-nums">{report.score}<span className="text-base text-ink-500">/100</span></div>
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-1">가격</div>
          <div className="serif-display text-2xl font-bold tabular-nums">
            {report.price.toLocaleString()}<span className="text-sm text-ink-500">원</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-1">수수료</div>
          <div className="serif-display text-2xl font-bold tabular-nums">
            {report.score >= 90 ? '15' : '20'}<span className="text-sm text-ink-500">%</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-1">상태</div>
          <div className="text-sm font-medium">
            {purchased ? (
              <span className="text-ink-700">✓ 구매 완료</span>
            ) : (
              <span className="text-navy-800">미구매</span>
            )}
          </div>
        </div>
      </div>

      {/* Section 1 - Background (always visible) */}
      <Section number="01" title="배경 (Background)" body={report.background} />

      {/* Section 2 - Attempt (always visible) */}
      <Section number="02" title="시도 (Attempt)" body={report.attempt} />

      {/* PAYWALL */}
      {!purchased && (
        <div className="relative my-12">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent to-paper-50 pointer-events-none" />
          <div className="paper-card p-10 text-center border-2 border-navy-700">
            <div className="text-xs tracking-[0.3em] text-navy-800 uppercase font-mono mb-3">
              Paywall
            </div>
            <h3 className="serif-display text-3xl font-black tracking-tightest mb-4">
              나머지 3단계를 읽으려면 구매가 필요합니다.
            </h3>
            <p className="text-ink-700 mb-6 max-w-md mx-auto">
              실패 원인 · 손실 규모 · 교훈 — 가장 핵심적인 내용은 잠금 상태입니다.
            </p>
            <div className="serif-display text-4xl font-black tabular-nums mb-6">
              {report.price.toLocaleString()}<span className="text-lg text-ink-500">원</span>
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="btn-primary text-base px-10 py-4"
            >
              구매하기 →
            </button>
            <div className="text-[10px] text-ink-500 mt-4 font-mono tracking-wider">
              * 발표 데모용 — 실제 결제는 일어나지 않습니다
            </div>
          </div>
        </div>
      )}

      {/* Locked sections */}
      <Section number="03" title="실패 원인 (Cause)" body={report.cause} locked={!purchased} />
      <Section number="04" title="손실 규모 (Loss)" body={report.loss} locked={!purchased} />
      <Section number="05" title="교훈 (Lesson)" body={report.lesson} locked={!purchased} highlight />

      {/* Keywords */}
      {report.keywords && report.keywords.length > 0 && (
        <div className="mt-12 pt-8 border-t border-ink-900/10">
          <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-3">
            Keywords
          </div>
          <div className="flex flex-wrap gap-2">
            {report.keywords.map(k => (
              <span key={k} className="text-sm px-3 py-1 bg-ink-50 text-ink-700 font-mono">
                #{k}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-ink-900/10 text-center">
        <Link to="/browse" className="text-ink-700 hover:text-navy-800 text-sm">
          ← 다른 리포트 둘러보기
        </Link>
      </div>

      {/* Fake Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 bg-ink-900/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-up">
          <div className="bg-white max-w-md w-full p-8 shadow-2xl">
            <div className="text-xs tracking-[0.3em] text-navy-800 uppercase font-mono mb-3">
              Checkout · 데모
            </div>
            <h3 className="serif-display text-2xl font-bold mb-6">결제 확인</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-ink-900/10">
              <div className="flex justify-between text-sm gap-4">
                <span className="text-ink-500 whitespace-nowrap">리포트</span>
                <span className="font-medium text-right line-clamp-2">{report.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500 whitespace-nowrap">결제 수단</span>
                <span className="font-mono">**** 1234 (가상)</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-6">
              <span className="text-ink-700">결제 금액</span>
              <span className="serif-display text-3xl font-black tabular-nums">
                {report.price.toLocaleString()}<span className="text-base text-ink-500">원</span>
              </span>
            </div>

            <div className="bg-ink-50 border-l-2 border-navy-700 p-3 mb-6 text-xs text-ink-700">
              ⚠️ 본 결제는 발표 데모 목적의 시뮬레이션입니다. 실제 금액이 청구되지 않습니다.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCheckoutOpen(false)}
                disabled={paying}
                className="btn-secondary flex-1"
              >
                취소
              </button>
              <button
                onClick={handleFakePay}
                disabled={paying}
                className="btn-primary flex-1"
              >
                {paying ? '결제 중...' : '결제 진행'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

function Section({ number, title, body, locked = false, highlight = false }) {
  return (
    <section className={`mb-12 ${locked ? 'relative' : ''}`}>
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-mono text-xs text-navy-800 tracking-widest">STEP {number}</span>
        <h2 className={`serif-display font-bold tracking-tight ${
          highlight ? 'text-3xl text-navy-800' : 'text-2xl'
        }`}>
          {title}
        </h2>
      </div>
      <div className={`text-ink-800 leading-[1.85] text-[17px] whitespace-pre-wrap ${
        locked ? 'select-none blur-[6px] pointer-events-none' : ''
      }`}>
        {body || '(내용 없음)'}
      </div>
    </section>
  )
}
