import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../lib/adminApi'

const TABS = [
  { key: 'dashboard', label: '대시보드' },
  { key: 'users',     label: '회원 관리' },
  { key: 'reports',   label: '리포트 관리' },
  { key: 'purchases', label: '결제 내역' },
]

export default function AdminPage() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      navigate('/', { replace: true })
    }
  }, [user, profile, loading, navigate])

  if (loading || !user || profile?.role !== 'admin') {
    return (
      <div className="bg-paper-50 min-h-screen flex items-center justify-center">
        <div className="text-paper-400 font-mono text-sm tracking-widest">확인 중...</div>
      </div>
    )
  }

  return (
    <div className="bg-paper-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="border-b border-paper-300 pb-8 mb-10">
          <div className="text-[9px] tracking-[0.4em] text-red-500 uppercase font-mono mb-2">Admin Panel</div>
          <h1 className="text-4xl font-black tracking-tightest text-ink-900">관리자 대시보드</h1>
          <p className="text-sm text-paper-500 font-mono mt-1">접속자: {profile.nickname} ({user.email})</p>
        </div>

        {/* 탭 */}
        <div className="flex gap-px bg-paper-200 mb-10 w-fit">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-6 py-3 text-xs font-mono uppercase tracking-widest transition-colors ${
                tab === t.key ? 'bg-ink-900 text-paper-50' : 'bg-white text-ink-500 hover:text-ink-900 hover:bg-paper-50'
              }`}>{t.label}</button>
          ))}
        </div>

        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'users'     && <UsersTab />}
        {tab === 'reports'   && <ReportsTab />}
        {tab === 'purchases' && <PurchasesTab />}
      </div>
    </div>
  )
}

/* ── 대시보드 ─────────────────────────────────────── */
function DashboardTab() {
  const [stats, setStats] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    adminApi.stats()
      .then(setStats)
      .catch(e => setErr(e.message))
  }, [])

  if (err) return <ErrBox msg={err} />
  if (!stats) return <Loading />

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-paper-200">
        <StatCard label="총 회원" value={stats.users.toLocaleString()} unit="명" />
        <StatCard label="총 리포트" value={stats.reports.toLocaleString()} unit="건" />
        <StatCard label="총 결제" value={stats.purchases.toLocaleString()} unit="건" />
        <StatCard label="총 매출" value={stats.revenue.toLocaleString()} unit="원" gold />
      </div>
      <div className="p-6 bg-white border border-paper-200 text-sm text-ink-600 leading-relaxed">
        <div className="text-[9px] tracking-[0.3em] text-gold-500 uppercase font-mono mb-3">Quick Links</div>
        <ul className="space-y-2">
          <li>· <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-gold-500 underline">Supabase 대시보드</a> — DB 직접 조회 / 백업 / 로그</li>
          <li>· Authentication {'>'} Users — 이메일 인증 / 비밀번호 초기화 / 계정 삭제</li>
          <li>· Table Editor — profiles / reports / purchases 직접 편집</li>
        </ul>
      </div>
    </div>
  )
}

/* ── 회원 관리 ─────────────────────────────────────── */
function UsersTab() {
  const [users, setUsers] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(null)

  const load = useCallback(() => {
    adminApi.users().then(d => setUsers(d.users)).catch(e => setErr(e.message))
  }, [])

  useEffect(() => { load() }, [load])

  const handleRole = async (userId, role) => {
    setBusy(userId)
    try { await adminApi.setRole(userId, role); load() }
    catch (e) { setErr(e.message) }
    finally { setBusy(null) }
  }

  const handleDelete = async (userId, nickname) => {
    if (!confirm(`"${nickname}" 회원을 정말 삭제하시겠습니까? 되돌릴 수 없습니다.`)) return
    setBusy(userId)
    try { await adminApi.deleteUser(userId); load() }
    catch (e) { setErr(e.message) }
    finally { setBusy(null) }
  }

  if (err) return <ErrBox msg={err} />
  if (!users) return <Loading />

  return (
    <div>
      <div className="text-xs text-paper-500 font-mono mb-4">총 {users.length}명</div>
      <div className="bg-white border border-paper-200 divide-y divide-paper-100">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-[9px] tracking-widest text-paper-400 uppercase font-mono bg-paper-50">
          <div className="col-span-3">닉네임</div>
          <div className="col-span-4">이메일</div>
          <div className="col-span-2">가입일</div>
          <div className="col-span-1">권한</div>
          <div className="col-span-2 text-right">관리</div>
        </div>
        {users.map(u => (
          <div key={u.id} className="grid grid-cols-12 gap-2 px-5 py-4 items-center text-sm hover:bg-paper-50">
            <div className="col-span-3 font-medium text-ink-800 truncate flex items-center gap-2">
              {u.role === 'admin' && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 font-mono">ADMIN</span>}
              {u.nickname}
            </div>
            <div className="col-span-4 text-paper-500 font-mono text-xs truncate">{u.email}</div>
            <div className="col-span-2 text-paper-400 text-xs font-mono">
              {u.created_at ? new Date(u.created_at).toLocaleDateString('ko-KR') : '—'}
            </div>
            <div className="col-span-1">
              <select
                value={u.role}
                disabled={busy === u.id}
                onChange={e => handleRole(u.id, e.target.value)}
                className="text-xs border border-paper-200 px-2 py-1 bg-white w-full"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="col-span-2 text-right">
              <button
                onClick={() => handleDelete(u.id, u.nickname)}
                disabled={busy === u.id}
                className="text-xs text-red-400 hover:text-red-600 font-mono disabled:opacity-40"
              >
                {busy === u.id ? '처리 중...' : '삭제'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 리포트 관리 ───────────────────────────────────── */
function ReportsTab() {
  const [reports, setReports] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    adminApi.reports().then(d => setReports(d.reports)).catch(e => setErr(e.message))
  }, [])

  if (err) return <ErrBox msg={err} />
  if (!reports) return <Loading />

  return (
    <div>
      <div className="text-xs text-paper-500 font-mono mb-4">총 {reports.length}건</div>
      <div className="bg-white border border-paper-200 divide-y divide-paper-100">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-[9px] tracking-widest text-paper-400 uppercase font-mono bg-paper-50">
          <div className="col-span-1">등급</div>
          <div className="col-span-5">제목</div>
          <div className="col-span-2">카테고리</div>
          <div className="col-span-1">점수</div>
          <div className="col-span-1">가격</div>
          <div className="col-span-1">조회</div>
          <div className="col-span-1">등록일</div>
        </div>
        {reports.map(r => (
          <div key={r.id} className="grid grid-cols-12 gap-2 px-5 py-3 items-center text-sm hover:bg-paper-50">
            <div className={`col-span-1 font-black font-mono ${r.grade === 'S' ? 'text-gold-500' : 'text-ink-300'}`}>{r.grade}</div>
            <div className="col-span-5 font-medium text-ink-800 truncate text-xs">{r.title}</div>
            <div className="col-span-2 text-paper-500 text-xs font-mono truncate">{r.category}</div>
            <div className="col-span-1 text-ink-600 font-mono text-xs">{r.score}</div>
            <div className="col-span-1 text-ink-600 font-mono text-xs tabular-nums">{r.price.toLocaleString()}</div>
            <div className="col-span-1 text-paper-400 font-mono text-xs">{r.view_count ?? 0}</div>
            <div className="col-span-1 text-paper-400 font-mono text-xs">{new Date(r.created_at).toLocaleDateString('ko-KR')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 결제 내역 ─────────────────────────────────────── */
function PurchasesTab() {
  const [purchases, setPurchases] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    adminApi.purchases().then(d => setPurchases(d.purchases)).catch(e => setErr(e.message))
  }, [])

  if (err) return <ErrBox msg={err} />
  if (!purchases) return <Loading />

  const total = purchases.filter(p => p.status === 'DONE').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-paper-500 font-mono">총 {purchases.length}건</span>
        <span className="text-sm font-bold text-ink-900">총 매출 <span className="text-gold-500 tabular-nums">{total.toLocaleString()}원</span></span>
      </div>
      <div className="bg-white border border-paper-200 divide-y divide-paper-100">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-[9px] tracking-widest text-paper-400 uppercase font-mono bg-paper-50">
          <div className="col-span-4">리포트</div>
          <div className="col-span-2">금액</div>
          <div className="col-span-2">결제수단</div>
          <div className="col-span-2">상태</div>
          <div className="col-span-2">일시</div>
        </div>
        {purchases.map(p => (
          <div key={p.id} className="grid grid-cols-12 gap-2 px-5 py-3 items-center text-sm hover:bg-paper-50">
            <div className="col-span-4 text-ink-700 text-xs truncate">{p.report?.title ?? '(삭제된 리포트)'}</div>
            <div className="col-span-2 font-bold text-ink-900 tabular-nums text-xs">{p.amount.toLocaleString()}원</div>
            <div className="col-span-2 text-paper-500 font-mono text-xs">{p.method ?? '—'}</div>
            <div className="col-span-2">
              <span className={`text-[9px] font-mono px-2 py-0.5 ${p.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-paper-100 text-paper-500'}`}>
                {p.status}
              </span>
            </div>
            <div className="col-span-2 text-paper-400 font-mono text-xs">{new Date(p.paid_at).toLocaleDateString('ko-KR')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 공용 UI ──────────────────────────────────────── */
function StatCard({ label, value, unit, gold }) {
  return (
    <div className="bg-white p-8">
      <div className="text-[9px] tracking-[0.3em] text-paper-400 uppercase font-mono mb-3">{label}</div>
      <div className={`text-4xl font-black tabular-nums ${gold ? 'text-gold-500' : 'text-ink-900'}`}>
        {value}<span className="text-base font-normal text-paper-400 ml-1">{unit}</span>
      </div>
    </div>
  )
}

function Loading() {
  return <div className="py-20 text-center text-paper-400 font-mono text-sm tracking-widest">로딩 중...</div>
}

function ErrBox({ msg }) {
  return (
    <div className="p-6 bg-red-50 border border-red-200 text-sm text-red-700">
      <strong>오류:</strong> {msg}
      {msg.includes('Service') || msg.includes('service') || msg.includes('권한') ? (
        <p className="mt-2 text-xs text-red-500">
          Netlify 환경변수에 <code className="bg-red-100 px-1">SUPABASE_SERVICE_KEY</code>를 설정해야 합니다.
        </p>
      ) : null}
    </div>
  )
}
