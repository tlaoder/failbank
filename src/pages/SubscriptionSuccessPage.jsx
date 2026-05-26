import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SubscriptionSuccessPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('confirming')
  const [expiresAt, setExpiresAt] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const paymentKey = params.get('paymentKey')
  const orderId    = params.get('orderId')
  const amount     = params.get('amount')
  const userId     = params.get('userId')

  useEffect(() => {
    if (!paymentKey || !orderId || !amount || !userId) {
      setStatus('error')
      setErrorMsg('결제 정보가 올바르지 않습니다.')
      return
    }

    async function confirm() {
      try {
        // JWT 가져오기
        const { data } = await supabase.auth.getSession()
        const jwt = data.session?.access_token ?? null

        const res = await fetch('/api/confirm-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            userId,
          }),
        })
        const data2 = await res.json()
        if (data2.success) {
          setExpiresAt(data2.expiresAt
            ? new Date(data2.expiresAt).toLocaleDateString('ko-KR')
            : null)
          setStatus('done')
        } else {
          setStatus('error')
          setErrorMsg(data2.error || '구독 확인 중 오류가 발생했습니다.')
        }
      } catch {
        setStatus('error')
        setErrorMsg('네트워크 오류가 발생했습니다.')
      }
    }

    confirm()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-paper-50 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center py-24">

        {status === 'confirming' && (
          <>
            <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-8" role="status" aria-label="처리 중" />
            <p className="text-ink-500 font-mono text-sm tracking-widest">구독 처리 중...</p>
          </>
        )}

        {status === 'done' && (
          <>
            <div className="text-gold-500 text-6xl mb-6" aria-hidden>⭐</div>
            <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-4">Subscription Active</div>
            <h1 className="text-3xl font-black mb-4 text-ink-900">구독 완료!</h1>
            <p className="text-ink-500 mb-2 leading-relaxed">
              판매자 구독이 활성화되었습니다.<br />
              내 리포트가 거래소 최상단에 노출됩니다.
            </p>
            {expiresAt && (
              <p className="text-sm font-mono text-paper-400 mb-10">만료일: {expiresAt}</p>
            )}
            <div className="space-y-3">
              <Link to="/mypage" className="btn-primary w-full py-4 block text-center">
                마이페이지 확인하기 →
              </Link>
              <Link to="/browse" className="block text-sm text-ink-500 hover:text-gold-500 transition-colors py-2 font-mono">
                거래소 보러가기
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-400 text-5xl mb-6" aria-hidden>✕</div>
            <h1 className="text-3xl font-black mb-4 text-ink-900">구독 오류</h1>
            <p className="text-ink-500 mb-10 leading-relaxed">{errorMsg}</p>
            <Link to="/subscription" className="btn-primary inline-block px-8 py-4">다시 시도하기</Link>
          </>
        )}

      </div>
    </div>
  )
}
