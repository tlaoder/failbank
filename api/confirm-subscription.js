// ─────────────────────────────────────────────
//  Vercel API Route: 판매자 구독 결제 승인
//  Toss 결제 검증 후 profile subscription_status 업데이트
// ─────────────────────────────────────────────

const TOSS_SECRET_KEY =
  process.env.TOSS_SECRET_KEY ?? 'test_sk_D5GePWvyJnrK0W0k6q8gLzN97Eoq'
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const body = req.body
    ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body)
    : {}

  const { paymentKey, orderId, amount, userId } = body

  if (!paymentKey || !orderId || !amount || !userId) {
    return res.status(400).json({ error: 'paymentKey, orderId, amount, userId 필수' })
  }

  // ── 1. 금액 검증 (29,900원) ─────────────────────
  if (Number(amount) !== 29900) {
    return res.status(400).json({ error: '결제 금액이 올바르지 않습니다' })
  }

  // ── 2. 토스페이먼츠 결제 승인 ───────────────────
  const authHeader = 'Basic ' + Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')
  let payment
  try {
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: { Authorization: authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
    })
    payment = await tossRes.json()
    if (!tossRes.ok) {
      return res.status(400).json({ error: payment.message ?? '결제 승인 실패', code: payment.code })
    }
  } catch (err) {
    return res.status(502).json({ error: '토스 서버 통신 오류' })
  }

  // ── 3. 구독 만료일 계산 (30일) ──────────────────
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  // ── 4. profiles 구독 상태 업데이트 ──────────────
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      // 프로필 업데이트
      await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          subscription_status: 'active',
          subscription_expires_at: expiresAt,
        }),
      })

      // 해당 판매자 리포트 우선 노출 설정
      await fetch(`${SUPABASE_URL}/rest/v1/reports?user_id=eq.${userId}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ is_priority: true }),
      })
    } catch (err) {
      console.error('[Supabase] 구독 업데이트 실패:', err)
    }
  }

  return res.status(200).json({ success: true, expiresAt })
}
