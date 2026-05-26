/**
 * FailBank 리포트 라이브러리
 * Supabase PostgREST 직접 fetch 방식 (sb_publishable 키 호환)
 */
import { supabase } from './supabase'

const SUPA_URL = import.meta.env.VITE_SUPABASE_URL
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const DEMO_KEY = 'failbank_demo_reports'

function isConnected() { return !!(SUPA_URL && SUPA_KEY) }

async function getToken() {
  try {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  } catch { return null }
}

async function restFetch(path, { method = 'GET', body, useToken = false } = {}) {
  const token = useToken ? await getToken() : null
  const res = await fetch(`${SUPA_URL}/rest/v1${path}`, {
    method,
    headers: {
      apikey: SUPA_KEY,
      Authorization: `Bearer ${token || SUPA_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ── 데모 데이터 ────────────────────────────────────
function getDemoReports() {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY) || '[]') } catch { return [] }
}
function setDemoReports(reports) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(reports))
}

const SEED_REPORTS = [
  {
    id: 'seed-1',
    title: '인스타 광고 3,000만원 태우고 폐업한 디저트 카페',
    category: '외식·카페',
    background: '강남 역삼동 1층에 36㎡(11평) 디저트 카페를 2023년 3월 오픈했다. 초기 투자금은 보증금 5,000만원, 인테리어 3,800만원, 집기 1,200만원 등 총 1억 2,000만원이었다. 목표 고객은 20대 후반 직장인 여성으로 잡았다.',
    attempt: '오픈 직후 인스타그램 광고에 월 250만원씩 집행했다. 12개월간 총 3,000만원을 태웠다. "감성 카페" 콘셉트로 디저트 비주얼 위주의 피드를 운영했고, 인플루언서 협찬도 5명 진행했다.',
    cause: '광고 ROAS(투자수익률)를 한 번도 측정하지 않았다. 팔로워는 8,000명까지 늘었지만 실제 방문 전환율은 1% 미만이었다. 핵심 실패 원인은 "인스타에서 예쁘다"와 "실제로 사 먹는다"가 완전히 다른 행동이라는 것을 몰랐던 것이다.',
    loss: '광고비 3,000만원, 임차료·인건비 적자 4,200만원, 권리금 회수 실패 2,000만원. 총 손실 약 9,200만원. 폐업까지 14개월 소요.',
    lesson: '다음에는 첫 3개월 광고비를 월 30만원으로 제한하고 ROAS를 주 단위로 측정할 것. 인스타 마케팅은 "재방문 도구"지 "신규 유입 도구"가 아니다. 외식업 신규 진입자에게는 절대 추천하지 않는다.',
    price: 25000, score: 88, grade: 'A',
    seller_nickname: '강남디저트',
    keywords: ['인스타광고', 'ROAS', '디저트카페', '폐업'],
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    view_count: 342, is_priority: false, is_meta: false,
  },
  {
    id: 'seed-2',
    title: '쿠팡 입점 후 6개월만에 마진 -8% 찍은 의류 셀러',
    category: '온라인 쇼핑몰',
    background: '여성 캐주얼 의류 자체 브랜드를 운영하던 1인 셀러였다. 자사몰 월 매출 1,200만원 수준에서 쿠팡 로켓그로스 입점을 결정했다. 2024년 1월 입점, 같은 해 8월 입점 철수.',
    attempt: '로켓그로스 입점 후 상위 노출 광고에 월 80만원, 인입 단가 인하 프로모션, 무료 배송까지 적용했다. 매출은 월 3,500만원까지 늘었다.',
    cause: '매출은 늘었지만 마진율이 -8%로 역전됐다. 쿠팡 수수료 11%, 광고비 2.3%, 무료배송 3.5%, 반품률 14% 처리비용까지 합치니 자사몰 마진 28%가 -8%로 깎였다.',
    loss: '7개월 누적 영업손실 1,800만원. 자사몰 운영 시간 부족으로 자사몰 매출도 월 600만원으로 감소. 기회비용 포함 약 3,000만원 손실.',
    lesson: '쿠팡 입점 전 반드시 손익분기 시뮬레이션을 할 것. 1인 셀러는 자사몰 마진 30% 이상이 아니면 쿠팡 입점 시 마진이 마이너스가 된다. 반품률 10% 이상 카테고리(의류·신발)는 특히 주의.',
    price: 20000, score: 82, grade: 'A',
    seller_nickname: '여성복마진',
    keywords: ['쿠팡', '로켓그로스', '의류', '마진'],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    view_count: 218, is_priority: false, is_meta: false,
  },
  {
    id: 'seed-3',
    title: '공동창업자와 지분 50:50으로 시작했다가 18개월만에 갈라선 SaaS',
    category: 'IT·스타트업',
    background: '대학 동기와 B2B SaaS(중소기업 회계 자동화)를 공동창업했다. 둘 다 개발자였고 지분은 50:50으로 균등 분배. 2022년 5월 법인 설립.',
    attempt: '제품 개발은 6개월만에 완료했다. 시드 투자 5,000만원도 유치했다. 그러나 영업 방향성, 가격 정책, 채용 결정에서 모든 안건이 매번 한쪽 거부권으로 막혔다.',
    cause: '의사결정 구조 부재가 본질이었다. 50:50 지분은 "공정"한 게 아니라 "교착"이다. 갈등 해결 메커니즘(이사회·외부 자문) 없이 시작했고 18개월간 어떤 큰 결정도 합의되지 못했다.',
    loss: '시드 투자금 4,200만원 소진(인건비). 18개월 시간. 둘 다 회사 떠남. 친구 관계도 끝남.',
    lesson: '공동창업 시 지분 차이를 반드시 둘 것 (예: 51:49). 의사결정 갈등 시 시니어 이사·외부 자문 회부 조항을 주주간계약서에 명시.',
    price: 28000, score: 91, grade: 'S',
    seller_nickname: '5050함정',
    keywords: ['공동창업', '지분', '의사결정', 'SaaS'],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    view_count: 487, is_priority: false, is_meta: false,
  },
]

// ── 초기 시드 ──────────────────────────────────────
async function seedIfEmpty() {
  if (!isConnected()) return
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/reports?select=id&limit=1`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
    })
    const rows = await res.json()
    if (!rows?.length) {
      await fetch(`${SUPA_URL}/rest/v1/reports`, {
        method: 'POST',
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(SEED_REPORTS.map(({ is_priority, is_meta, ...r }) => r)),
      })
    }
  } catch (e) { console.warn('seed failed:', e) }
}

if (typeof window !== 'undefined') {
  if (!isConnected()) {
    if (!getDemoReports().length) setDemoReports(SEED_REPORTS)
  } else {
    seedIfEmpty()
  }
}

// ── 리포트 목록 ────────────────────────────────────
export async function listReports({ category = null, sortBy = 'recent', isMeta = false } = {}) {
  if (isConnected()) {
    try {
      const cols = 'id,title,category,price,score,grade,seller_nickname,keywords,created_at,view_count,is_priority,is_meta'
      const params = [`select=${cols}`]
      if (category) params.push(`category=eq.${encodeURIComponent(category)}`)
      if (isMeta) params.push('is_meta=eq.true')
      // 구독 판매자(is_priority) 우선, 그 다음 선택한 정렬
      const sortMap = { recent: 'created_at.desc', popular: 'view_count.desc', score: 'score.desc' }
      params.push(`order=is_priority.desc,${sortMap[sortBy] || 'created_at.desc'}`)
      return await restFetch(`/reports?${params.join('&')}`)
    } catch (e) {
      console.warn('listReports fetch failed:', e)
      return []
    }
  }
  let reports = getDemoReports()
  if (category) reports = reports.filter(r => r.category === category)
  if (isMeta) reports = reports.filter(r => r.is_meta)
  if (sortBy === 'recent') reports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  if (sortBy === 'popular') reports.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
  if (sortBy === 'score') reports.sort((a, b) => (b.score || 0) - (a.score || 0))
  return reports
}

// ── 리포트 단건 ────────────────────────────────────
export async function getReport(id) {
  if (isConnected()) {
    try {
      const rows = await restFetch(`/reports?id=eq.${id}&select=*`)
      const report = rows?.[0] ?? null
      if (report) {
        // 조회수 +1 (오류 무시)
        fetch(`${SUPA_URL}/rest/v1/reports?id=eq.${id}`, {
          method: 'PATCH',
          headers: {
            apikey: SUPA_KEY,
            Authorization: `Bearer ${SUPA_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ view_count: (report.view_count || 0) + 1 }),
        }).catch(() => {})
      }
      return report
    } catch (e) { console.warn('getReport failed:', e); return null }
  }
  const reports = getDemoReports()
  const report = reports.find(r => r.id === id)
  if (report) { report.view_count = (report.view_count || 0) + 1; setDemoReports(reports) }
  return report || null
}

// ── 리포트 생성 ────────────────────────────────────
export async function createReport(report) {
  const newReport = {
    ...report,
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
    view_count: 0,
    is_priority: false,
    is_meta: false,
  }

  if (isConnected()) {
    try {
      const { id, is_priority, is_meta, ...payload } = newReport
      const token = await getToken()
      const rows = await restFetch('/reports', {
        method: 'POST',
        body: payload,
        useToken: !!token,
      })
      return Array.isArray(rows) ? rows[0] : rows
    } catch (e) { throw new Error(e.message) }
  }
  const reports = getDemoReports()
  reports.unshift(newReport)
  setDemoReports(reports)
  return newReport
}

export const CATEGORIES = [
  '외식·카페', '온라인 쇼핑몰', 'IT·스타트업', '뷰티·헬스',
  '교육·과외', '제조·도매', '서비스업', '프랜차이즈', '기타',
]
