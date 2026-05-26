import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * 로그인이 필요한 페이지를 감싸는 컴포넌트.
 * 비로그인 상태면 홈으로 리다이렉트 + 로그인 모달 자동 오픈.
 */
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', {
        state: { openAuth: 'login', from: location.pathname },
        replace: true,
      })
    }
  }, [user, loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // 인증 확인 중 스피너
  if (loading) {
    return (
      <div className="min-h-screen bg-paper-50 flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="로딩 중"
        />
      </div>
    )
  }

  // 리다이렉트 중엔 아무것도 렌더하지 않음
  if (!user) return null

  return children
}
