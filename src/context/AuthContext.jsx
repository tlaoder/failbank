import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/auth'

const SUPA_URL = import.meta.env.VITE_SUPABASE_URL

const AuthContext = createContext(null)

/** localStorage에서 세션을 직접 읽어 user 반환 (네트워크 없이 즉시) */
function readSessionFromStorage() {
  try {
    const key = `sb-${SUPA_URL?.match(/\/\/([^.]+)/)?.[1]}-auth-token`
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // 만료 체크
    const exp = parsed?.expires_at
    if (exp && exp * 1000 < Date.now()) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!SUPA_URL) {
      setLoading(false)
      return
    }

    // ① localStorage에서 즉시 세션 읽기 (네트워크 불필요)
    const stored = readSessionFromStorage()
    const storedUser = stored?.user ?? null

    if (storedUser) {
      setUser(storedUser)
      // ② 프로필 비동기 로드
      getProfile(storedUser.id).then(p => {
        setProfile(p)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }

    // ③ Supabase auth 이벤트 구독 (로그인/로그아웃 감지)
    let subscription
    try {
      const result = supabase?.auth.onAuthStateChange(async (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        if (u) {
          const p = await getProfile(u.id)
          setProfile(p)
        } else {
          setProfile(null)
        }
      })
      subscription = result?.data?.subscription
    } catch (e) {
      console.warn('Auth subscription error:', e)
    }

    return () => {
      try { subscription?.unsubscribe() } catch {}
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다')
  return ctx
}
