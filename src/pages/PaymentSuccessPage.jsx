import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { addPurchased } from '../lib/payment'

export default function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('confirming') // confirming | done | error
  const [errorMsg, setErrorMsg] = useState('')

  const paymentKey = params.get('paymentKey')
  const orderId = params.get('orderId')
  const amount = params.get('amount')
  const reportId = params.get('reportId')

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setStatus('error')
      setErrorMsg('결제 정보가 올바르지 않습니다. 다시 시도해주세요.')
      return
    }

    // Netlify Function으로 결제 최종 승인 요청
    fetch('/.netlify/functions/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
        reportId,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (reportId) addPurchased(reportId)
          setStatus('done')
        } else {
          setStatus('error')
          setErrorMsg(data.error || '결제 확인 중 오류가 발생했습니다.')
        }
      })
      .catch(() => {
        setStatus('error')
        setErrorMsg('네트워크 오류가 발생했습니다. 고객센터에 문의해주세요.')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-paper-50 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center py-24">

        {status === 'confirming' && (
          <>
            <div
              className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-8"
              role="status"
              aria-label="결제 확인 중"
            />
            <p className="text-ink-500 font-mono text-sm tracking-widest">결제 확인 중...</p>
          </>
        )}

        {status === 'done' && (
          <>
            <div className="text-gold-500 text-6xl mb-6" aria-hidden>✓</div>
            <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-4">
              Payment Complete
            </div>
            <h1 className="text-3xl font-black mb-4 text-ink-900">결제 완료</h1>
            <p className="text-ink-500 mb-10 leading-relaxed">
              리포트 잠금이 해제되었습니다.<br />
              실패 원인 · 손실 규모 · 교훈 전체를 확인하세요.
            </p>
            <div className="space-y-3">
              {reportId && (
                <Link
                  to={`/report/${reportId}`}
                  className="btn-primary w-full py-4 block text-center"
                >
                  리포트 보러가기 →
                </Link>
              )}
              <Link
                to="/browse"
                className="block text-sm text-ink-500 hover:text-gold-500 transition-colors py-2 font-mono"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-400 text-5xl mb-6" aria-hidden>✕</div>
            <h1 className="text-3xl font-black mb-4 text-ink-900">결제 오류</h1>
            <p className="text-ink-500 mb-10 leading-relaxed">{errorMsg}</p>
            {reportId && (
              <Link
                to={`/report/${reportId}`}
                className="btn-primary inline-block px-8 py-4 mb-3"
              >
                다시 시도하기
              </Link>
            )}
            <div>
              <Link
                to="/browse"
                className="text-sm text-ink-500 hover:text-gold-500 transition-colors font-mono"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
