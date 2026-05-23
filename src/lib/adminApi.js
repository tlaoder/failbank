// 어드민 API 클라이언트 (Netlify Function 호출)
import { supabase } from './supabase'

async function getJwt() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function call(action, extra = {}) {
  const jwt = await getJwt()
  const res = await fetch('/.netlify/functions/admin-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ action, ...extra }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || '요청 실패')
  return data
}

export const adminApi = {
  stats:      ()                         => call('stats'),
  users:      ()                         => call('users'),
  reports:    ()                         => call('reports'),
  purchases:  ()                         => call('purchases'),
  deleteUser: (userId)                   => call('deleteUser', { userId }),
  setRole:    (userId, role)             => call('setRole', { userId, role }),
}
