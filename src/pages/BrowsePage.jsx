import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listReports, CATEGORIES } from '../lib/reports'

export default function BrowsePage() {
  const [reports, setReports] = useState([])
  const [category, setCategory] = useState(null)
  const [sortBy, setSortBy] = useState('recent')
  const [isMeta, setIsMeta] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    listReports({ category, sortBy, isMeta })
      .then(r => { setReports(r); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, sortBy, isMeta])

  const sortLabels = { recent: '최신순', popular: '인기순', score: '점수순' }

  return (
    <div className="bg-paper-50 min-h-screen">

      {/* ── PAGE HEADER ── */}
      <div className="bg-white border-b border-paper-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <span className="badge-gold mb-3 inline-flex">Marketplace</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-ink-900">
            실패 리포트 거래소
          </h1>
          <p className="text-paper-500 max-w-2xl">
            검증된 시행착오 데이터. 5단계 구조화 + AI 자동 평가 + 동적 가격.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── FILTERS ── */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* 카테고리 칩 */}
          <div className="flex-1">
            <div id="category-label" className="text-xs font-semibold text-paper-400 uppercase tracking-wider mb-3">
              카테고리
            </div>
            <div role="group" aria-labelledby="category-label" className="flex flex-wrap gap-2">
              <Chip active={category === null && !isMeta} onClick={() => { setCategory(null); setIsMeta(false) }}>
                전체
              </Chip>
              <Chip active={isMeta} onClick={() => { setIsMeta(v => !v); setCategory(null) }}>
                📈 데이터 리포트
              </Chip>
              {CATEGORIES.map(c => (
                <Chip key={c} active={category === c && !isMeta} onClick={() => { setCategory(c); setIsMeta(false) }}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>

          {/* 정렬 */}
          <div className="shrink-0">
            <div id="sort-label" className="text-xs font-semibold text-paper-400 uppercase tracking-wider mb-3">
              정렬
            </div>
            <div role="group" aria-labelledby="sort-label" className="flex gap-1.5">
              {Object.entries(sortLabels).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setSortBy(k)}
                  aria-pressed={sortBy === k}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    sortBy === k
                      ? 'bg-ink-900 text-white shadow-sm'
                      : 'bg-white border border-paper-200 text-paper-500 hover:text-ink-900 hover:border-paper-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 수 */}
        <p className="text-sm text-paper-400 mb-6" aria-live="polite">
          {loading ? '로딩 중...' : `${reports.length}개의 리포트`}
        </p>

        {/* ── REPORT LIST ── */}
        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="paper-card p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-5 bg-paper-100 rounded-full w-16" />
                  <div className="h-9 w-9 bg-paper-100 rounded-xl" />
                </div>
                <div className="h-4 bg-paper-100 rounded mb-2" />
                <div className="h-4 bg-paper-100 rounded w-4/5 mb-2" />
                <div className="h-4 bg-paper-100 rounded w-2/3 mb-6" />
                <div className="h-px bg-paper-100 mb-4" />
                <div className="flex justify-between">
                  <div className="h-7 bg-paper-100 rounded w-24" />
                  <div className="h-4 bg-paper-100 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="paper-card py-24 text-center">
            <div className="text-5xl mb-5">🗂️</div>
            <div className="text-xl font-bold text-ink-700 mb-3">
              {category ? `${category} 리포트가 아직 없습니다` : '아직 등록된 리포트가 없습니다'}
            </div>
            <p className="text-sm text-paper-400 mb-8">
              첫 번째 리포트를 올리면 다른 창업자들에게 큰 도움이 됩니다.
            </p>
            <Link to="/submit" className="btn-gold">첫 리포트 등록하기 →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {reports.map((r, i) => (
              <ReportCard key={r.id} report={r} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReportCard({ report: r, index }) {
  return (
    <Link
      to={`/report/${r.id}`}
      className="group paper-card p-6 flex flex-col animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
      aria-label={`${r.title} — ${r.category}, ${r.price.toLocaleString()}원, ${r.grade}등급`}
    >
      {/* 상단: 뱃지 + 등급 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge bg-paper-100 text-paper-600 text-xs">{r.category}</span>
          {r.is_priority && (
            <span className="badge bg-gold-100 text-gold-600 border border-gold-200 text-xs">⭐ PRO</span>
          )}
          {r.is_meta && (
            <span className="badge bg-sky-100 text-sky-600 border border-sky-200 text-xs">📈 DATA</span>
          )}
        </div>
        <div className={`grade-stamp shrink-0 ${r.grade === 'S' ? 'text-gold-500' : 'text-paper-400'}`}>
          {r.grade}
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-base font-bold leading-snug mb-1 text-ink-800 group-hover:text-ink-900 transition-colors line-clamp-3 flex-1">
        {r.title}
      </h2>

      {/* 판매자 & 날짜 */}
      <div className="flex items-center gap-2 mt-2 mb-4 text-xs text-paper-400">
        <span className="font-mono">@{r.seller_nickname}</span>
        <span>·</span>
        <time dateTime={r.created_at}>{new Date(r.created_at).toLocaleDateString('ko-KR')}</time>
      </div>

      {/* 키워드 */}
      {r.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {r.keywords.slice(0, 3).map(k => (
            <span key={k} className="text-[10px] px-2 py-0.5 bg-paper-50 text-paper-500 rounded-md border border-paper-200 font-mono">
              #{k}
            </span>
          ))}
        </div>
      )}

      <div className="divider-gold mb-4" />

      {/* 가격 & 조회 */}
      <div className="flex items-baseline justify-between">
        <div className="tabular-nums">
          <span className="text-2xl font-black text-ink-900">{r.price.toLocaleString()}</span>
          <span className="text-sm text-paper-400 ml-1">원</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-paper-400 font-mono">조회 {r.view_count || 0}</div>
          <div className="text-xs text-paper-300 font-mono">{r.score}점</div>
        </div>
      </div>
    </Link>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all border ${
        active
          ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
          : 'bg-white text-paper-500 border-paper-200 hover:border-paper-400 hover:text-ink-800'
      }`}
    >
      {children}
    </button>
  )
}
