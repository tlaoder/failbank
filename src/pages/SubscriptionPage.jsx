import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { requestSubscription } from '../lib/payment'

const BENEFITS = [
  { icon: '⭐', title: '우선 노출', desc: '내 리포트가 검색·목록 최상단에 고정됩니다' },
  { icon: '📊', title: '판매 분석 대시보드', desc: '조회수·전환율·수익을 한눈에 확인합니다' },
  { icon: '🏷️', title: '수수료 우대', desc: '점수 90점 미만도 수수료 15% 적용 (기본 20%)' },
  { icon: '🎖️', title: '구독자 배지', desc: '리포트에 "검증 판매자" 배지가 표시됩니다' },
]

export default function SubscriptionPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const isActive = profile?.subscription_status === 'active'
  const expiresAt = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at).toLocaleDateString('ko-KR')
    : null

  const handleSubscribe = async () => {
    if (!user) return navigate('/', { state: { openAuth: 'login' } })
    setPaying(true)
    setError('')
    try {
      await requestSubscription({ userId: user.id })
    } catch (err) {
      setError(err.message || '결제 중 오류가 발생했습니다')
      setPaying(false)
    }
  }

  return (
    <div className="bg-paper-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* 헤더 */}
        <div className="border-b border-paper-300 pb-12 mb-16 text-center">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-4">Seller Subscription</div>
          <h1 className="text-5xl font-black tracking-tightest mb-4 text-ink-900">
            판매자 구독
          </h1>
          <p className="text-ink-500 max-w-xl mx-auto">
            우선 노출·분석 대시보드·수수료 우대를 한 번에.
          </p>
        </div>

        {/* 현재 구독 상태 */}
        {isActive && (
          <div className="mb-10 p-6 bg-gold-100 border border-gold-300 flex items-center gap-4">
            <span className="text-2xl">✓</span>
            <div>
              <div className="font-bold text-ink-900">구독 활성 중</div>
              <div className="text-sm text-ink-600 font-mono">만료일: {expiresAt}</div>
            </div>
          </div>
        )}

        {/* 가격 카드 */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* 무료 플랜 */}
          <div className="border border-paper-300 bg-white p-10">
            <div className="text-[9px] tracking-[0.3em] text-paper-500 uppercase font-mono mb-4">Free</div>
            <div className="text-4xl font-black text-ink-900 mb-1">0<span className="text-base font-normal text-paper-400 ml-1">원</span></div>
            <p className="text-sm text-paper-500 mb-8">기본 판매 기능</p>
            <ul className="space-y-3 text-sm text-ink-600">
              <li className="flex gap-3"><span className="text-paper-400">○</span> 리포트 등록·판매</li>
              <li className="flex gap-3"><span className="text-paper-400">○</span> 수수료 20% (90점+ 15%)</li>
              <li className="flex gap-3"><span className="text-paper-400">○</span> 기본 통계 (조회수)</li>
              <li className="flex gap-3 text-paper-400"><span>✕</span> 우선 노출</li>
              <li className="flex gap-3 text-paper-400"><span>✕</span> 분석 대시보드</li>
              <li className="flex gap-3 text-paper-400"><span>✕</span> 수수료 우대</li>
            </ul>
          </div>

          {/* 구독 플랜 */}
          <div className="border-2 border-gold-400 bg-white p-10 relative">
            <div className="absolute -top-3 left-6 bg-gold-500 text-paper-50 text-[9px] font-bold tracking-widest px-3 py-1 uppercase font-mono">
              추천
            </div>
            <div className="text-[9px] tracking-[0.3em] text-gold-500 uppercase font-mono mb-4">Pro · 월 구독</div>
            <div className="text-4xl font-black text-ink-900 mb-1">
              29,900<span className="text-base font-normal text-paper-400 ml-1">원/월</span>
            </div>
            <p className="text-sm text-paper-500 mb-8">판매자 전용 혜택 풀패키지</p>
            <ul className="space-y-3 text-sm text-ink-700 mb-10">
              {BENEFITS.map(b => (
                <li key={b.title} className="flex gap-3">
                  <span className="text-gold-500 shrink-0">{b.icon}</span>
                  <div>
                    <span className="font-semibold">{b.title}</span>
                    <span className="text-paper-500"> — {b.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            {error && (
              <div role="alert" className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-3">
                {error}
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={paying || isActive}
              aria-busy={paying}
              className="btn-primary w-full py-4 text-center disabled:opacity-60"
            >
              {isActive
                ? '✓ 구독 중 (갱신은 만료 후 가능)'
                : paying
                  ? <span role="status">결제 처리 중...</span>
                  : '29,900원으로 구독 시작 →'}
            </button>
            <p className="text-[10px] text-paper-400 font-mono mt-3 text-center">
              토스페이먼츠 · 카드 결제 · 월 단위 수동 갱신
            </p>
          </div>
        </div>

        {/* B2B 안내 */}
        <div className="border border-paper-200 bg-white p-8 text-center">
          <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-3">B2B Package</div>
          <h2 className="text-2xl font-bold text-ink-900 mb-2">기관 단위 도입을 원하신다면?</h2>
          <p className="text-sm text-paper-500 mb-6">
            액셀러레이터 · 대학창업지원단 · VC 전용 패키지를 제공합니다.
          </p>
          <a
            href="/sell#b2b"
            className="inline-block border border-ink-900 text-ink-900 px-8 py-3 text-sm font-mono hover:bg-ink-900 hover:text-paper-50 transition-colors"
          >
            B2B 패키지 보기 →
          </a>
        </div>

      </div>
    </div>
  )
}
