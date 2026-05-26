// ─────────────────────────────────────────────
//  Vercel API Route: 토스페이먼츠 결제 승인 + Supabase 기록
//
//  환경변수 (Vercel 대시보드 > Settings > Environment Variables):
//    TOSS_SECRET_KEY        : 토스 시크릿 키 (기본값: 테스트 키)
//    SUPABASE_URL           : Supabase 프로젝트 URL
//    SUPABASE_SERVICE_KEY   : Supabase Service Role Key (비공개)
// ─────────────────────────────────────────────

const TOSS_SECRET_KEY =
  process.env.TOSS_SECRET_KEY ?? 'test_sk_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // Vercel은 Content-Type: application/json이면 req.body를 자동 파싱
  const body = req.body
    ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body)
    : {}

  const { paymentKey, orderId, amount, reportId, userId } = body

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ error: 'paymentKey, orderId, amount는 필수입니다' })
  }

  // ── 1. 토스페이먼츠 결제 승인 ───────────────────────
  const authHeader =
    'Basic ' + Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')

  let payment
  try {
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    })

    payment = await tossRes.json()

    if (!tossRes.ok) {
      console.error('[Toss] 결제 승인 실패:', payment)
      return res.status(400).json({
        error: payment.message ?? '결제 승인에 실패했습니다',
        code: payment.code,
      })
    }
  } catch (err) {
    console.error('[Toss] 네트워크 오류:', err)
    return res.status(502).json({ error: '토스 서버와 통신 중 오류가 발생했습니다' })
  }

  // ── 2. 수수료 계산 (리포트 점수 기반) ───────────────
  let commissionRate = 0.20
  let sellerPayout = 0

  if (SUPABASE_URL && SUPABASE_SERVICE_KEY && reportId) {
    try {
      const reportRes = await fetch(
        `${SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}&select=score`,
        { headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` } }
      )
      const reportData = await reportRes.json()
      const score = reportData?.[0]?.score ?? 0
      commissionRate = score >= 90 ? 0.15 : 0.20
    } catch {}
  }
  sellerPayout = Math.round(Number(amount) * (1 - commissionRate))

  // ── 3. Supabase purchases 테이블에 기록 ──────────────
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/purchases`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          report_id:       reportId       ?? null,
          user_id:         userId         ?? null,
          payment_key:     paymentKey,
          order_id:        orderId,
          amount:          Number(amount),
          status:          payment.status,
          method:          payment.method ?? null,
          paid_at:         payment.approvedAt ?? new Date().toISOString(),
          commission_rate: commissionRate,
          seller_payout:   sellerPayout,
        }),
      })
    } catch (err) {
      // DB 저장 실패해도 결제는 이미 승인됨 → 로그만 남기고 성공 반환
      console.error('[Supabase] purchases 저장 실패:', err)
    }
  }

  return res.status(200).json({
    success: true,
    paymentKey,
    orderId,
    amount: Number(amount),
    reportId,
  })
}
