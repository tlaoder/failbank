import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listReports, CATEGORIES } from '../lib/reports'

export default function BrowsePage() {
  const [reports, setReports] = useState([])
  const [category, setCategory] = useState(null)
  const [sortBy, setSortBy] = useState('recent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    listReports({ category, sortBy })
      .then(r => { setReports(r); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, sortBy])

  const sortLabels = { recent: '최신순', popular: '인기순', score: '점수순' }

  return (
    <div className="bg-void-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="border-b border-void-500/30 pb-12 mb-12">
          <div className="text-[9px] tracking-[0.4em] text-gold-400 uppercase mb-4 font-mono">Marketplace</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tightest mb-4 text-cream-900">
            실패 리포트 거래소
          </h1>
          <p className="text-cream-600 max-w-2xl">
            검증된 시행착오 데이터. 5단계 구조화 + AI 자동 평가 + 동적 가격.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="flex-1">
            <div id="category-label" className="text-[9px] tracking-[0.3em] text-void-100 uppercase font-mono mb-4">카테고리</div>
            <div role="group" aria-labelledby="category-label" className="flex flex-wrap gap-2">
              <Chip active={category === null} onClick={() => setCategory(null)}>전체</Chip>
              {CATEGORIES.map(c => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
              ))}
            </div>
          </div>
          <div>
            <div id="sort-label" className="text-[9px] tracking-[0.3em] text-void-100 uppercase font-mono mb-4">정렬</div>
            <div role="group" aria-labelledby="sort-label" className="flex gap-px bg-void-500/20">
              {Object.entries(sortLabels).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setSortBy(k)}
                  aria-pressed={sortBy === k}
                  className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                    sortBy === k
                      ? 'bg-gold-500 text-void-900 font-semibold'
                      : 'bg-void-800 text-void-50 hover:text-cream-900 hover:bg-void-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 스크린리더용 */}
        <p className="sr-only" aria-live="polite">
          {category ? `${category} 카테고리` : '전체'}, {sortLabels[sortBy]} —
          {loading ? ' 로딩 중' : ` ${reports.length}건`}
        </p>

        {/* List */}
        {loading ? (
          <div role="status" className="py-32 text-center text-void-100 font-mono text-sm tracking-widest">
            <span className="sr-only">로딩 중</span>
            <span aria-hidden>LOADING...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-32 text-center border border-void-500/30">
            <div className="text-5xl mb-6 opacity-30">◎</div>
            <div className="text-2xl font-bold text-cream-700 mb-3">
              {category ? `${category} 리포트가 아직 없습니다` : '아직 등록된 리포트가 없습니다'}
            </div>
            <p className="text-sm text-void-100 mb-8">첫 번째 리포트를 올리면 다른 창업자들에게 큰 도움이 됩니다.</p>
            <Link to="/submit" className="btn-primary">첫 리포트 등록하기 →</Link>
          </div>
        ) : (
          <ol className="divide-y divide-void-500/20 list-none">
            {reports.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/report/${r.id}`}
                  className="group flex p-6 hover:bg-void-800 transition-colors"
                  aria-label={`${r.title} — ${r.category}, ${r.price.toLocaleString()}원, ${r.grade}등급`}
                >
                  <div className="grid md:grid-cols-12 gap-4 items-center w-full">
                    {/* Grade */}
                    <div className="md:col-span-1">
                      <div className={`grade-stamp ${
                        r.grade === 'S' ? 'text-gold-400 border-gold-500/50' : 'text-cream-600 border-void-300'
                      }`}>
                        {r.grade}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-7">
                      <div className="text-[9px] tracking-[0.3em] text-void-100 uppercase font-mono mb-2">
                        <span>{r.category}</span>
                        <span aria-hidden> · </span>
                        <time dateTime={r.created_at}>{new Date(r.created_at).toLocaleDateString('ko-KR')}</time>
                      </div>
                      <h2 className="text-xl font-bold leading-tight mb-3 text-cream-800 group-hover:text-cream-900 transition-colors">
                        {r.title}
                      </h2>
                      {r.keywords?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.keywords.slice(0, 4).map(k => (
                            <span key={k} className="text-[9px] px-2 py-0.5 bg-void-700 text-void-100 font-mono border border-void-400/30">
                              #{k}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Seller */}
                    <div className="md:col-span-2 text-sm text-void-50">
                      <div className="font-mono text-xs">@{r.seller_nickname}</div>
                      <div className="font-mono text-xs mt-1 text-void-100">조회 {r.view_count || 0}</div>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 md:text-right">
                      <div className="tabular-nums">
                        <span className="text-2xl font-bold text-gold-400">{r.price.toLocaleString()}</span>
                        <span className="text-sm text-void-100 ml-1">원</span>
                      </div>
                      <div className="text-xs text-void-100 font-mono mt-1">{r.score}점</div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors border ${
        active
          ? 'bg-gold-500 text-void-900 border-gold-500 font-semibold'
          : 'bg-transparent text-void-50 border-void-400/40 hover:border-gold-500/40 hover:text-cream-900'
      }`}
    >
      {children}
    </button>
  )
}
