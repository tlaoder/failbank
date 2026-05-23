import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConnected } from '../lib/supabase'
import { getProfile } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConnected()) {
      setLoading(false)
      return
    }

    // 현재 세션 확인
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) setProfile(await getProfile(session.user.id))
      setLoading(false)
    })

    // 인증 상태 변화 구독 (로그인 / 로그아웃 / 토큰 갱신)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null
        setUser(u)
        setProfile(u ? await getProfile(u.id) : null)
      }
    )

    return () => subscription.unsubscribe()
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
