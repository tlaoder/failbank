import { useSearchParams, Link } from 'react-router-dom'

export default function PaymentFailPage() {
  const [params] = useSearchParams()
  const code = params.get('code') || ''
  const message = params.get('message') || '결제가 취소되었거나 오류가 발생했습니다.'

  // 취소는 에러가 아니라 정상 흐름
  const isCancelled = code === 'PAY_PROCESS_CANCELED'

  return (
    <div className="bg-paper-50 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center py-24">

        <div className="text-ink-400 text-5xl mb-6" aria-hidden>
          {isCancelled ? '↩' : '✕'}
        </div>

        <div className="text-[9px] tracking-[0.4em] text-ink-400 uppercase font-mono mb-4">
          {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
        </div>

        <h1 className="text-3xl font-black mb-4 text-ink-900">
          {isCancelled ? '결제 취소' : '결제 실패'}
        </h1>

        <p className="text-ink-500 mb-10 leading-relaxed">
          {decodeURIComponent(message)}
        </p>

        {code && !isCancelled && (
          <p className="text-xs font-mono text-paper-400 mb-8">오류 코드: {code}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="btn-primary px-8 py-4"
          >
            다시 시도하기
          </button>
          <Link
            to="/browse"
            className="px-8 py-4 border border-paper-300 text-ink-600 hover:border-ink-600 hover:text-ink-900 transition-colors text-sm font-mono"
          >
            목록으로
          </Link>
        </div>

      </div>
    </div>
  )
}
