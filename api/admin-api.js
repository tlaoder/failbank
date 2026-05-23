// ─────────────────────────────────────────────────────────────
//  Vercel API Route: 어드민 전용 API
//
//  필수 환경변수 (Vercel 대시보드 > Settings > Environment Variables):
//    SUPABASE_URL         : Supabase 프로젝트 URL
//    SUPABASE_SERVICE_KEY : Service Role Key (절대 프론트에 노출 금지)
//
//  호출 예) POST /api/admin-api
//           Body: { action: "stats" | "users" | "reports" | "purchases" | "deleteUser" | "setRole" }
//           Header: Authorization: Bearer <user_jwt>
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // ── 1. JWT에서 요청자 확인 ──────────────────────────────────
  const jwt = (req.headers.authorization || '').replace('Bearer ', '')
  if (!jwt) return res.status(401).json({ error: '인증이 필요합니다' })

  // JWT로 사용자 정보 가져오기 (Supabase Auth API)
  const userRes = await supabaseFetch('/auth/v1/user', 'GET', null, jwt)
  if (!userRes.ok) return res.status(401).json({ error: '유효하지 않은 토큰' })
  const userData = await userRes.json()

  // ── 2. 어드민 권한 확인 ────────────────────────────────────
  const profileRes = await supabaseFetch(`/rest/v1/profiles?id=eq.${userData.id}&select=role`, 'GET')
  const profiles = await profileRes.json()
  if (!profiles?.[0] || profiles[0].role !== 'admin') {
    return res.status(403).json({ error: '어드민 권한이 없습니다' })
  }

  // ── 3. 요청 처리 ───────────────────────────────────────────
  const body = req.body
    ? (typeof req.body === 'string' ? JSON.parse(req.body) : req.body)
    : {}

  try {
    switch (body.action) {

      case 'stats': {
        const [usersR, reportsR, purchasesR] = await Promise.all([
          supabaseFetch('/rest/v1/profiles?select=id,role,created_at', 'GET'),
          supabaseFetch('/rest/v1/reports?select=id,price,score,created_at', 'GET'),
          supabaseFetch('/rest/v1/purchases?select=id,amount,status,created_at', 'GET'),
        ])
        const [users, reports, purchases] = await Promise.all([
          usersR.json(), reportsR.json(), purchasesR.json(),
        ])
        const revenue = purchases
          .filter(p => p.status === 'DONE')
          .reduce((s, p) => s + p.amount, 0)
        return res.status(200).json({ users: users.length, reports: reports.length, purchases: purchases.length, revenue })
      }

      case 'users': {
        const [profilesR, authUsersR] = await Promise.all([
          supabaseFetch('/rest/v1/profiles?select=*&order=created_at.desc', 'GET'),
          supabaseFetch('/auth/v1/admin/users?per_page=1000', 'GET'),
        ])
        const profileList = await profilesR.json()
        const authData    = await authUsersR.json()
        const authMap = Object.fromEntries((authData.users || []).map(u => [u.id, u]))
        const merged = profileList.map(p => ({
          ...p,
          email: authMap[p.id]?.email ?? '—',
          last_sign_in: authMap[p.id]?.last_sign_in_at ?? null,
        }))
        return res.status(200).json({ users: merged })
      }

      case 'reports': {
        const r = await supabaseFetch(
          '/rest/v1/reports?select=id,title,category,score,grade,price,view_count,created_at,seller_nickname&order=created_at.desc',
          'GET'
        )
        return res.status(200).json({ reports: await r.json() })
      }

      case 'purchases': {
        const r = await supabaseFetch(
          '/rest/v1/purchases?select=*,report:report_id(title)&order=created_at.desc&limit=100',
          'GET'
        )
        return res.status(200).json({ purchases: await r.json() })
      }

      case 'deleteUser': {
        if (!body.userId) return res.status(400).json({ error: 'userId 필요' })
        await supabaseFetch(`/auth/v1/admin/users/${body.userId}`, 'DELETE')
        return res.status(200).json({ deleted: body.userId })
      }

      case 'setRole': {
        if (!body.userId || !body.role) return res.status(400).json({ error: 'userId, role 필요' })
        await supabaseFetch(`/rest/v1/profiles?id=eq.${body.userId}`, 'PATCH', { role: body.role })
        return res.status(200).json({ updated: body.userId })
      }

      default:
        return res.status(400).json({ error: '알 수 없는 action' })
    }
  } catch (err) {
    console.error('[admin-api]', err)
    return res.status(500).json({ error: '서버 오류' })
  }
}

// ── 헬퍼 ───────────────────────────────────────────────────────
function supabaseFetch(path, method, body = null, userJwt = null) {
  return fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${userJwt || SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
}
