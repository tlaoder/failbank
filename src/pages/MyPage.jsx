import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile, getMyPurchases, getMyReports } from '../lib/auth'

const TABS = [
  { key: 'purchases', label: '구매 내역' },
  { key: 'reports',   label: '내 리포트' },
  { key: 'profile',   label: '프로필 편집' },
]

function SubscriptionBadge({ profile }) {
  const isActive = profile?.subscription_status === 'active'
  const expires = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at).toLocaleDateString('ko-KR')
    : null
  return (
    <div className="flex items-center gap-3">
      {isActive ? (
        <div className="flex items-center gap-2 bg-gold-100 border border-gold-300 px-4 py-2 text-xs font-mono">
          <span className="text-gold-600">⭐</span>
          <span className="text-ink-700 font-semibold">Pro 구독 중</span>
          {expires && <span className="text-paper-500">· {expires} 만료</span>}
        </div>
      ) : (
        <Link
          to="/subscription"
          className="flex items-center gap-2 border border-paper-300 px-4 py-2 text-xs font-mono text-ink-500 hover:border-gold-400 hover:text-gold-600 transition-colors"
        >
          <span>⭐</span> 판매자 구독 29,900원/월 →
        </Link>
      )}
    </div>
  )
}

export default function MyPage() {
  const { user, profile, setProfile, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('purchases')

  // 비로그인 리다이렉트
  useEffect(() => {
    if (!loading && !user) navigate('/', { replace: true })
  }, [user, loading, navigate])

  if (loading || !user) {
    return (
      <div className="bg-paper-50 min-h-screen flex items-center justify-center">
        <div className="text-paper-400 font-mono text-sm tracking-widest">로딩 중...</div>
      </div>
    )
  }

  const displayName = profile?.nickname ?? user.email?.split('@')[0] ?? '사용자'

  return (
    <div className="bg-paper-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* 헤더 */}
        <div className="border-b border-paper-300 pb-10 mb-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[9px] tracking-[0.4em] text-gold-500 uppercase font-mono mb-3">My Account</div>
              <h1 className="text-4xl font-black tracking-tightest text-ink-900">{displayName}</h1>
              <p className="text-sm text-paper-500 font-mono mt-2">{user.email}</p>
            </div>
            <div className="w-14 h-14 bg-ink-900 text-paper-50 text-xl font-black flex items-center justify-center select-none">
              {displayName[0]?.toUpperCase()}
            </div>
          </div>
          <SubscriptionBadge profile={profile} />
        </div>

        {/* 탭 */}
        <div className="flex gap-px bg-paper-200 mb-10 w-fit">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                tab === t.key
                  ? 'bg-ink-900 text-paper-50'
                  : 'bg-white text-ink-500 hover:text-ink-900 hover:bg-paper-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 내용 */}
        {tab === 'purchases' && <PurchasesTab userId={user.id} />}
        {tab === 'reports'   && <ReportsTab userId={user.id} />}
        {tab === 'profile'   && (
          <ProfileTab
            userId={user.id}
            profile={profile}
            onSaved={(updated) => setProfile(updated)}
          />
        )}
      </div>
    </div>
  )
}

/* ── 구매 내역 ─────────────────────────────── */

function PurchasesTab({ userId }) {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    getMyPurchases(userId)
      .then(setPurchases)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <LoadingRow />

  if (purchases.length === 0) {
    return (
      <Empty
        icon="🛒"
        title="구매한 리포트가 없습니다"
        sub="거래소에서 마음에 드는 리포트를 찾아보세요."
        cta={{ to: '/browse', label: '거래소 보러가기' }}
      />
    )
  }

  return (
    <div className="space-y-1">
      {purchases.map(p => {
        const r = p.report
        return (
          <div key={p.id} className="bg-white border border-paper-200 p-5 flex items-center gap-5">
            <div className={`text-2xl font-black font-mono w-10 text-center ${r?.grade === 'S' ? 'text-gold-500' : 'text-ink-300'}`}>
              {r?.grade ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink-800 truncate">{r?.title ?? '(삭제된 리포트)'}</div>
              <div className="text-xs text-paper-500 font-mono mt-0.5">
                {r?.category} · {new Date(p.created_at).toLocaleDateString('ko-KR')}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-ink-900 tabular-nums">{p.amount.toLocaleString()}원</div>
              {r && (
                <Link
                  to={`/report/${r.id}`}
                  className="text-[10px] text-gold-500 hover:text-gold-600 font-mono mt-1 inline-block"
                >
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

/* ── 내 리포트 ─────────────────────────────── */

function ReportsTab({ userId }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyReports(userId)
      .then(setReports)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <LoadingRow />

  if (reports.length === 0) {
    return (
      <Empty
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
      {/* 수익 통계 */}
      <div className="grid grid-cols-3 gap-px bg-paper-200 mb-6">
        <div className="bg-white p-5 text-center">
          <div className="text-2xl font-black text-ink-900 tabular-nums">{reports.length}</div>
          <div className="text-[9px] text-paper-400 font-mono tracking-widest mt-1">등록 리포트</div>
        </div>
        <div className="bg-white p-5 text-center">
          <div className="text-2xl font-black text-ink-900 tabular-nums">{totalViews.toLocaleString()}</div>
          <div className="text-[9px] text-paper-400 font-mono tracking-widest mt-1">총 조회수</div>
        </div>
        <div className="bg-white p-5 text-center">
          <div className="text-2xl font-black text-gold-500 tabular-nums">{commissionRate}%</div>
          <div className="text-[9px] text-paper-400 font-mono tracking-widest mt-1">적용 수수료</div>
        </div>
      </div>

      <div className="space-y-1">
        {reports.map(r => {
          const rate = r.score >= 90 ? 0.15 : 0.20
          const payout = Math.round(r.price * (1 - rate))
          return (
            <Link
              key={r.id}
              to={`/report/${r.id}`}
              className="bg-white border border-paper-200 p-5 flex items-center gap-5 hover:bg-paper-50 transition-colors group block"
            >
              <div className={`text-2xl font-black font-mono w-10 text-center ${r.grade === 'S' ? 'text-gold-500' : 'text-ink-300'}`}>
                {r.grade}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-ink-800 truncate group-hover:text-ink-900">
                  {r.is_priority && <span className="text-gold-500 mr-1">⭐</span>}
                  {r.title}
                </div>
                <div className="text-xs text-paper-500 font-mono mt-0.5">
                  {r.category} · {new Date(r.created_at).toLocaleDateString('ko-KR')} · 조회 {r.view_count ?? 0}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-ink-900 tabular-nums">{r.price.toLocaleString()}원</div>
                <div className="text-[10px] text-gold-600 font-mono">정산 {payout.toLocaleString()}원</div>
                <div className="text-[10px] text-paper-400 font-mono">{r.score}점 · 수수료 {(rate * 100).toFixed(0)}%</div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

/* ── 프로필 편집 ────────────────────────────── */

function ProfileTab({ userId, profile, onSaved }) {
  const [nickname, setNickname] = useState(profile?.nickname ?? '')
  const [bio, setBio]           = useState(profile?.bio ?? '')
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

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
      <div>
        <label className="text-[9px] tracking-[0.3em] text-ink-500 uppercase font-mono block mb-2">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={20}
          className="w-full border border-paper-300 bg-paper-50 px-4 py-3 text-sm text-ink-800 focus:outline-none focus:border-ink-600 focus:bg-white transition-colors"
        />
        <p className="text-[10px] text-paper-400 font-mono mt-1">{nickname.length}/20</p>
      </div>
      <div>
        <label className="text-[9px] tracking-[0.3em] text-ink-500 uppercase font-mono block mb-2">한 줄 소개</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          maxLength={100}
          rows={3}
          placeholder="예: 외식업 3번 창업, 2번 폐업 경험자"
          className="w-full border border-paper-300 bg-paper-50 px-4 py-3 text-sm text-ink-800 focus:outline-none focus:border-ink-600 focus:bg-white transition-colors resize-none"
        />
        <p className="text-[10px] text-paper-400 font-mono mt-1">{bio.length}/100</p>
      </div>

      {error && (
        <div role="alert" className="text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-3">{error}</div>
      )}
      {success && (
        <div role="status" className="text-xs text-green-700 bg-green-50 border border-green-200 px-4 py-3">
          ✓ 프로필이 저장되었습니다
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        aria-busy={saving}
        className="btn-primary px-8 py-3"
      >
        {saving ? <span role="status">저장 중...</span> : '저장하기'}
      </button>
    </form>
  )
}

/* ── 공용 UI ─────────────────────────────────── */

function LoadingRow() {
  return (
    <div className="py-20 text-center text-paper-400 font-mono text-sm tracking-widest">
      로딩 중...
    </div>
  )
}

function Empty({ icon, title, sub, cta }) {
  return (
    <div className="py-24 text-center border border-paper-200 bg-white">
      <div className="text-4xl mb-5">{icon}</div>
      <div className="text-xl font-bold text-ink-700 mb-2">{title}</div>
      <p className="text-sm text-paper-500 mb-8">{sub}</p>
      <Link to={cta.to} className="btn-primary inline-block px-8 py-3">{cta.label} →</Link>
    </div>
  )
}
