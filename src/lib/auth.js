// ─────────────────────────────────────────────
//  Supabase Auth 헬퍼
//  Auth(로그인/회원가입)는 supabase-js 사용
//  DB 조회는 직접 fetch 사용 (sb_publishable 키 호환성)
// ─────────────────────────────────────────────
import { supabase, isSupabaseConnected } from './supabase'

const SUPA_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPA_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY

function requireSupabase() {
  if (!isSupabaseConnected()) throw new Error('Supabase가 연결되지 않았습니다.')
}

/** Supabase REST API 직접 호출 */
async function restFetch(path, { method = 'GET', body, token } = {}) {
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

/** 현재 세션의 access_token 가져오기 */
async function getToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

// ── 회원가입 ──────────────────────────────────
export async function signUp({ email, password, nickname }) {
  requireSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  })
  if (error) throw error
  return data
}

// ── 로그인 ────────────────────────────────────
export async function signIn({ email, password }) {
  requireSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// ── 로그아웃 ──────────────────────────────────
export async function signOut() {
  requireSupabase()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ── 프로필 조회 ───────────────────────────────
export async function getProfile(userId) {
  if (!SUPA_URL || !SUPA_KEY) return null
  try {
    const rows = await restFetch(`/profiles?id=eq.${userId}&select=*`)
    return rows?.[0] ?? null
  } catch {
    return null
  }
}

// ── 프로필 수정 ───────────────────────────────
export async function updateProfile({ userId, nickname, bio }) {
  requireSupabase()
  const token = await getToken()
  const rows = await restFetch(`/profiles?id=eq.${userId}`, {
    method: 'PATCH',
    body: { nickname, bio, updated_at: new Date().toISOString() },
    token,
  })
  return rows?.[0] ?? null
}

// ── 내 구매 내역 ──────────────────────────────
export async function getMyPurchases(userId) {
  if (!SUPA_URL || !SUPA_KEY) return []
  try {
    const token = await getToken()
    return await restFetch(
      `/purchases?user_id=eq.${userId}&select=*,report:report_id(id,title,category,price,score,grade)&order=created_at.desc`,
      { token }
    )
  } catch { return [] }
}

// ── 내가 등록한 리포트 ────────────────────────
export async function getMyReports(userId) {
  if (!SUPA_URL || !SUPA_KEY) return []
  try {
    const token = await getToken()
    return await restFetch(
      `/reports?user_id=eq.${userId}&select=id,title,category,price,score,grade,view_count,created_at&order=created_at.desc`,
      { token }
    )
  } catch { return [] }
}
