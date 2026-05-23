// ─────────────────────────────────────────────
//  Netlify Function: 토스페이먼츠 결제 승인 + Supabase 기록
//
//  환경변수 (Netlify 대시보드 > Site settings > Environment):
//    TOSS_SECRET_KEY        : 토스 시크릿 키 (기본값: 테스트 키)
//    SUPABASE_URL           : Supabase 프로젝트 URL
//    SUPABASE_SERVICE_KEY   : Supabase Service Role Key (비공개)
// ─────────────────────────────────────────────

const TOSS_SECRET_KEY =
  process.env.TOSS_SECRET_KEY ?? 'test_sk_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: '잘못된 요청 형식' }) }
  }

  const { paymentKey, orderId, amount, reportId } = body

  if (!paymentKey || !orderId || !amount) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'paymentKey, orderId, amount는 필수입니다' }),
    }
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
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: payment.message ?? '결제 승인에 실패했습니다',
          code: payment.code,
        }),
      }
    }
  } catch (err) {
    console.error('[Toss] 네트워크 오류:', err)
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: '토스 서버와 통신 중 오류가 발생했습니다' }),
    }
  }

  // ── 2. Supabase purchases 테이블에 기록 ──────────────
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
          report_id: reportId ?? null,
          payment_key: paymentKey,
          order_id: orderId,
          amount: Number(amount),
          status: payment.status,        // DONE | WAITING_FOR_DEPOSIT 등
          method: payment.method ?? null, // 카드 | 가상계좌 등
          paid_at: payment.approvedAt ?? new Date().toISOString(),
        }),
      })
    } catch (err) {
      // DB 저장 실패해도 결제는 이미 승인됨 → 로그만 남기고 성공 반환
      console.error('[Supabase] purchases 저장 실패:', err)
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      paymentKey,
      orderId,
      amount: Number(amount),
      reportId,
    }),
  }
}
