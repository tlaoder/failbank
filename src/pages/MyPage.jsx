import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile, getMyPurchases, getMyReports } from '../lib/auth'

const TABS = [
  { key: 'purchases', label: '구매 내역', icon: '🛒' },
  { key: 'reports',   label: '내 리포트', icon: '📄' },
  { key: 'profile',   label: '프로필',    icon: '⚙️' },
]

function SubscriptionBadge({ profile }) {
  const isActive = profile?.subscription_status === 'active'
  const expires = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at).toLocaleDateString('ko-KR')
    : null
  return isActive ? (
    <div className="inline-flex items-center gap-2 badge bg-gold-100 text-gold-700 border border-gold-200 px-4 py-2">
      <span>⭐</span>
      <span className="font-semibold">Pro 구독 중</span>
      {expires && <span className="text-gold-500 font-normal">· {expires} 만료</span>}
    </div>
  ) : (
    <Link
      to="/subscription"
      className="inline-flex items-center gap-2 badge bg-paper-100 text-paper-500 border border-paper-200 px-4 py-2 hover:border-gold-400 hover:text-gold-600 transition-colors"
    >
      <span>⭐</span>
      <span>판매자 구독 29,900원/월 →</span>
    </Link>
  )
}

export default function MyPage() {
  const { user, profile, setProfile, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('purchases')

  useEffect(() => {
    if (!loading && !user) navigate('/', { replace: true })
  }, [user, loading, navigate])

  if (loading || !user) {
    return (
      <div className="bg-paper-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-paper-400">로딩 중...</p>
        </div>
      </div>
    )
  }

  const displayName = profile?.nickname ?? user.email?.split('@')[0] ?? '사용자'

  return (
    <div className="bg-paper-50 dark:bg-[#070d1a] min-h-screen">

      {/* ── 프로필 헤더 ── */}
      <div className="bg-white dark:bg-ink-900 border-b border-paper-100 dark:border-ink-800">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-5">
            {/* 아바타 */}
            <div className="w-16 h-16 bg-ink-900 text-white text-2xl font-black flex items-center justify-center rounded-2xl select-none shrink-0">
              {displayName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-ink-900">{displayName}</h1>
                <SubscriptionBadge profile={profile} />
              </div>
              <p className="text-sm text-paper-400 mt-1 font-mono">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── 탭 네비 ── */}
        <div className="flex gap-1.5 bg-paper-100 dark:bg-ink-800 p-1.5 rounded-xl mb-10 w-fit">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-white dark:bg-ink-700 shadow-sm text-ink-900 dark:text-paper-50'
                  : 'text-paper-500 dark:text-paper-400 hover:text-ink-700 dark:hover:text-paper-100'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── 탭 내용 ── */}
        {tab === 'purchases' && <PurchasesTab userId={user.id} />}
        {tab === 'reports'   && <ReportsTab userId={user.id} />}
        {tab === 'profile'   && (
          <ProfileTab userId={user.id} profile={profile} onSaved={(updated) => setProfile(updated)} />
        )}
      </div>
    </div>
  )
}

/* ── 구매 내역 ── */

function PurchasesTab({ userId }) {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyPurchases(userId).then(setPurchases).finally(() => setLoading(false))
  }, [userId])

  if (loading) return <LoadingSpinner />

  if (purchases.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="구매한 리포트가 없습니다"
        sub="거래소에서 마음에 드는 리포트를 찾아보세요."
        cta={{ to: '/browse', label: '거래소 보러가기' }}
      />
    )
  }

  return (
    <div className="space-y-3">
      {purchases.map(p => {
        const r = p.report
        return (
          <div key={p.id} className="paper-card p-5 flex items-center gap-5">
            <div className={`grade-stamp shrink-0 ${r?.grade === 'S' ? 'text-gold-500' : 'text-paper-300'}`}>
              {r?.grade ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink-800 dark:text-paper-100 truncate">{r?.title ?? '(삭제된 리포트)'}</div>
              <div className="text-xs text-paper-400 font-mono mt-0.5">
                {r?.category} · {new Date(p.created_at).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-ink-900 dark:text-paper-50 tabular-nums">{p.amount.toLocaleString()}원</div>
              {r && (
                <Link to={`/report/${r.id}`} className="text-xs text-gold-500 hover:text-gold-600 font-mono mt-1 inline-block">
                  열람하기 →
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── 내 리포트 ── */

function ReportsTab({ userId }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyReports(userId).then(setReports).finally(() => setLoading(false))
  }, [userId])

  if (loading) return <LoadingSpinner />

  if (reports.length === 0) {
    return (
      <EmptyState
        icon="✏️"
        title="등록한 리포트가 없습니다"
        sub="경험을 공유하고 수익을 만들어보세요."
        cta={{ to: '/submit', label: '첫 리포트 등록하기' }}
      />
    )
  }

  const totalViews = reports.reduce((s, r) => s + (r.view_count || 0), 0)
  const avgScore = Math.round(reports.reduce((s, r) => s + r.score, 0) / reports.length)
  const commissionRate = avgScore >= 90 ? 15 : 20

  return (
    <>
      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="paper-card p-5 text-center">
          <div className="text-3xl font-black text-ink-900 dark:text-paper-50 tabular-nums">{reports.length}</div>
          <div className="text-xs text-paper-400 mt-1">등록 리포트</div>
        </div>
        <div className="paper-card p-5 text-center">
          <div className="text-3xl font-black text-ink-900 dark:text-paper-50 tabular-nums">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-paper-400 mt-1">총 조회수</div>
        </div>
        <div className="paper-card p-5 text-center">
          <div className="text-3xl font-black text-gold-500 tabular-nums">{commissionRate}%</div>
          <div className="text-xs text-paper-400 mt-1">적용 수수료</div>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map(r => {
          const rate = r.score >= 90 ? 0.15 : 0.20
          const payout = Math.round(r.price * (1 - rate))
          return (
            <Link
              key={r.id}
              to={`/report/${r.id}`}
              className="group paper-card p-5 flex items-center gap-5 block"
            >
              <div className={`grade-stamp shrink-0 ${r.grade === 'S' ? 'text-gold-500' : 'text-paper-300'}`}>
                {r.grade}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-ink-800 dark:text-paper-100 truncate group-hover:text-ink-900 dark:group-hover:text-paper-50 transition-colors">
                  {r.is_priority && <span className="text-gold-500 mr-1">⭐</span>}
                  {r.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="badge bg-paper-100 text-paper-500 text-[10px]">{r.category}</span>
                  <span className="text-xs text-paper-400 font-mono">
                    조회 {r.view_count ?? 0} · {new Date(r.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-ink-900 dark:text-paper-50 tabular-nums">{r.price.toLocaleString()}원</div>
                <div className="text-xs text-gold-600 font-mono">정산 {payout.toLocaleString()}원</div>
                <div className="text-xs text-paper-400 font-mono">{r.score}점 · {(rate * 100).toFixed(0)}%</div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

/* ── 프로필 편집 ── */

function ProfileTab({ userId, profile, onSaved }) {
  const [nickname, setNickname] = useState(profile?.nickname ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (e) => {
    e.preventDefault()
    if (nickname.trim().length < 2) { setError('닉네임은 2자 이상이어야 합니다'); return }
    setSaving(true); setError(''); setSuccess(false)
    try {
      const updated = await updateProfile({ userId, nickname: nickname.trim(), bio: bio.trim() })
      onSaved(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message.includes('duplicate') ? '이미 사용 중인 닉네임입니다' : err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-6">
      <div className="paper-card p-8 space-y-6">
        <div>
          <label className="text-xs font-semibold text-paper-400 uppercase tracking-wider block mb-2">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            maxLength={20}
            className="input-field"
          />
          <p className="text-xs text-paper-400 font-mono mt-1">{nickname.length}/20</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-paper-400 uppercase tracking-wider block mb-2">한 줄 소개</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={100}
            rows={3}
            placeholder="예: 외식업 3번 창업, 2번 폐업 경험자"
            className="textarea-field"
          />
          <p className="text-xs text-paper-400 font-mono mt-1">{bio.length}/100</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
          ✓ 프로필이 저장되었습니다
        </div>
      )}

      <button type="submit" disabled={saving} aria-busy={saving} className="btn-gold px-8 py-3">
        {saving
          ? <span role="status" className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
              저장 중...
            </span>
          : '저장하기'
        }
      </button>
    </form>
  )
}

/* ── 공용 UI ── */

function LoadingSpinner() {
  return (
    <div className="py-24 flex items-center justify-center gap-3 text-paper-400">
      <div className="w-5 h-5 border-2 border-paper-300 border-t-gold-400 rounded-full animate-spin" />
      <span className="text-sm">로딩 중...</span>
    </div>
  )
}

function EmptyState({ icon, title, sub, cta }) {
  return (
    <div className="paper-card py-24 text-center">
      <div className="text-5xl mb-5">{icon}</div>
      <div className="text-xl font-bold text-ink-700 dark:text-paper-100 mb-2">{title}</div>
      <p className="text-sm text-paper-400 mb-8">{sub}</p>
      <Link to={cta.to} className="btn-gold inline-flex px-8 py-3">{cta.label} →</Link>
    </div>
  )
}
