// ─────────────────────────────────────────────
//  토스페이먼츠 결제 라이브러리 (V1 SDK)
//  실제 배포 시 VITE_TOSS_CLIENT_KEY 환경변수 설정 필요
// ─────────────────────────────────────────────

const CLIENT_KEY =
  import.meta.env.VITE_TOSS_CLIENT_KEY ?? 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

/** 토스페이먼츠 SDK를 동적으로 로드하고 인스턴스 반환 */
function loadTossPayments() {
  return new Promise((resolve, reject) => {
    if (window.TossPayments) {
      resolve(window.TossPayments(CLIENT_KEY))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v1/payment'
    script.onload = () => {
      if (window.TossPayments) resolve(window.TossPayments(CLIENT_KEY))
      else reject(new Error('TossPayments SDK 로드 실패'))
    }
    script.onerror = () => reject(new Error('토스페이먼츠 스크립트를 불러올 수 없습니다'))
    document.head.appendChild(script)
  })
}

/**
 * 결제창 열기
 * - 성공 시 Toss가 /payment/success 로 리다이렉트
 * - 실패/취소 시 /payment/fail 로 리다이렉트
 */
export async function requestPayment({ reportId, title, price }) {
  const toss = await loadTossPayments()
  const orderId = `fb_${reportId}_${Date.now()}`

  // requestPayment는 리다이렉트하므로 return값 없음
  // 사용자가 취소하면 failUrl로 이동
  await toss.requestPayment('카드', {
    amount: price,
    orderId,
    orderName: `FailBank · ${title.slice(0, 40)}`,
    customerName: '구매자',
    successUrl: `${window.location.origin}/payment/success?reportId=${reportId}`,
    failUrl: `${window.location.origin}/payment/fail`,
  })
}

/**
 * 판매자 구독 결제 (월 29,900원)
 * 성공 시 /subscription/success 로 리다이렉트
 */
export async function requestSubscription({ userId }) {
  const toss = await loadTossPayments()
  const orderId = `fb_sub_${userId}_${Date.now()}`
  await toss.requestPayment('카드', {
    amount: 29900,
    orderId,
    orderName: 'FailBank 판매자 구독 (1개월)',
    customerName: '구독자',
    successUrl: `${window.location.origin}/subscription/success?userId=${encodeURIComponent(userId)}`,
    failUrl: `${window.location.origin}/payment/fail`,
  })
}

// ─────────────────────────────────────────────
//  구매 기록 (localStorage)
//  서버 검증 완료 후 PaymentSuccessPage에서 호출
// ─────────────────────────────────────────────
const PURCHASED_KEY = 'failbank_purchased'

export function getPurchased() {
  try { return JSON.parse(localStorage.getItem(PURCHASED_KEY) || '[]') } catch { return [] }
}

export function addPurchased(reportId) {
  const list = getPurchased()
  if (!list.includes(reportId)) {
    localStorage.setItem(PURCHASED_KEY, JSON.stringify([...list, reportId]))
  }
}

export function hasPurchased(reportId) {
  return getPurchased().includes(reportId)
}
