// ─────────────────────────────────────────────────────────────
//  Netlify Function: 어드민 전용 API
//
//  필수 환경변수 (Netlify 대시보드 > Environment variables):
//    SUPABASE_URL         : Supabase 프로젝트 URL
//    SUPABASE_SERVICE_KEY : Service Role Key (절대 프론트에 노출 금지)
//
//  호출 예) POST /.netlify/functions/admin-api
//           Body: { action: "stats" | "users" | "deleteUser", ... }
//           Header: Authorization: Bearer <user_jwt>
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) }

  // ── 1. JWT에서 요청자 확인 ──────────────────────────────────
  const jwt = (event.headers.authorization || '').replace('Bearer ', '')
  if (!jwt) return { statusCode: 401, headers, body: JSON.stringify({ error: '인증이 필요합니다' }) }

  // JWT로 사용자 정보 가져오기 (Supabase Auth API)
  const userRes = await supabaseFetch('/auth/v1/user', 'GET', null, jwt)
  if (!userRes.ok) return { statusCode: 401, headers, body: JSON.stringify({ error: '유효하지 않은 토큰' }) }
  const userData = await userRes.json()

  // ── 2. 어드민 권한 확인 ────────────────────────────────────
  const profileRes = await supabaseFetch(`/rest/v1/profiles?id=eq.${userData.id}&select=role`, 'GET')
  const profiles = await profileRes.json()
  if (!profiles?.[0] || profiles[0].role !== 'admin') {
    return { statusCode: 403, headers, body: JSON.stringify({ error: '어드민 권한이 없습니다' }) }
  }

  // ── 3. 요청 처리 ───────────────────────────────────────────
  const body = JSON.parse(event.body || '{}')

  try {
    switch (body.action) {

      case 'stats': {
        const [usersR, reportsR, purchasesR] = await Promise.all([
          supabaseFetch('/rest/v1/profiles?select=id,role,created_at', 'GET'),
          supabaseFetch('/rest/v1/reports?select=id,price,score,created_at', 'GET'),
          supabaseFetch('/rest/v1/purchases?select=id,amount,status,created_at', 'GET'),
        ])
        const [users, reports, purchases] = await Promise.all([usersR.json(), reportsR.json(), purchasesR.json()])
        const revenue = purchases.filter(p => p.status === 'DONE').reduce((s, p) => s + p.amount, 0)
        return ok({ users: users.length, reports: reports.length, purchases: purchases.length, revenue })
      }

      case 'users': {
        // profiles + auth.users 이메일 조합
        const [profilesR, authUsersR] = await Promise.all([
          supabaseFetch('/rest/v1/profiles?select=*&order=created_at.desc', 'GET'),
          supabaseFetch('/auth/v1/admin/users?per_page=1000', 'GET'),  // service role 필요
        ])
        const profileList = await profilesR.json()
        const authData    = await authUsersR.json()
        const authMap = Object.fromEntries((authData.users || []).map(u => [u.id, u]))
        const merged = profileList.map(p => ({
          ...p,
          email: authMap[p.id]?.email ?? '—',
          last_sign_in: authMap[p.id]?.last_sign_in_at ?? null,
        }))
        return ok({ users: merged })
      }

      case 'reports': {
        const r = await supabaseFetch('/rest/v1/reports?select=id,title,category,score,grade,price,view_count,created_at,seller_nickname&order=created_at.desc', 'GET')
        return ok({ reports: await r.json() })
      }

      case 'purchases': {
        const r = await supabaseFetch('/rest/v1/purchases?select=*,report:report_id(title)&order=created_at.desc&limit=100', 'GET')
        return ok({ purchases: await r.json() })
      }

      case 'deleteUser': {
        if (!body.userId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId 필요' }) }
        await supabaseFetch(`/auth/v1/admin/users/${body.userId}`, 'DELETE')
        return ok({ deleted: body.userId })
      }

      case 'setRole': {
        if (!body.userId || !body.role) return { statusCode: 400, headers, body: JSON.stringify({ error: 'userId, role 필요' }) }
        await supabaseFetch(`/rest/v1/profiles?id=eq.${body.userId}`, 'PATCH', { role: body.role })
        return ok({ updated: body.userId })
      }

      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: '알 수 없는 action' }) }
    }
  } catch (err) {
    console.error('[admin-api]', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: '서버 오류' }) }
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

function ok(data) {
  return { statusCode: 200, headers, body: JSON.stringify(data) }
}
