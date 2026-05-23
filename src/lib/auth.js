// ─────────────────────────────────────────────
//  Supabase Auth 헬퍼
// ─────────────────────────────────────────────
import { supabase, isSupabaseConnected } from './supabase'

function requireSupabase() {
  if (!isSupabaseConnected()) throw new Error('Supabase가 연결되지 않았습니다.')
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
  if (!isSupabaseConnected()) return null
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data ?? null
}

// ── 프로필 수정 ───────────────────────────────
export async function updateProfile({ userId, nickname, bio }) {
  requireSupabase()
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, nickname, bio, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

// ── 내 구매 내역 ──────────────────────────────
export async function getMyPurchases(userId) {
  if (!isSupabaseConnected()) return []
  const { data } = await supabase
    .from('purchases')
    .select('*, report:report_id(id, title, category, price, score, grade)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

// ── 내가 등록한 리포트 ────────────────────────
export async function getMyReports(userId) {
  if (!isSupabaseConnected()) return []
  const { data } = await supabase
    .from('reports')
    .select('id, title, category, price, score, grade, view_count, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}
