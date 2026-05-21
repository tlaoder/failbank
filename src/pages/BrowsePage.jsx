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

  const sortLabels = {
    recent: '최신순',
    popular: '인기순',
    score: '점수순',
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="border-b border-ink-900/20 pb-8 mb-10">
        <div className="text-xs tracking-[0.3em] text-navy-800 uppercase mb-3 font-mono" aria-hidden="true">
          Marketplace
        </div>
        <h1 className="serif-display text-5xl font-black tracking-tightest mb-3">
          실패 리포트 거래소
        </h1>
        <p className="text-ink-700 max-w-2xl">
          검증된 시행착오 데이터. 5단계 구조화 + AI 자동 평가 + 동적 가격.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="flex-1">
          <div
            id="category-label"
            className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-3"
          >
            카테고리
          </div>
          <div
            role="group"
            aria-labelledby="category-label"
            className="flex flex-wrap gap-2"
          >
            <CategoryChip
              active={category === null}
              onClick={() => setCategory(null)}
              aria-pressed={category === null}
            >
              전체
            </CategoryChip>
            {CATEGORIES.map(c => (
              <CategoryChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
              >
                {c}
              </CategoryChip>
            ))}
          </div>
        </div>

        <div>
          <div id="sort-label" className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-3">
            정렬
          </div>
          <div role="group" aria-labelledby="sort-label" className="flex gap-2">
            {Object.entries(sortLabels).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setSortBy(k)}
                aria-pressed={sortBy === k}
                className={`px-4 py-2 text-sm tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-sm ${
                  sortBy === k
                    ? 'bg-ink-900 text-white'
                    : 'bg-ink-50 text-ink-700 hover:bg-ink-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 현재 필터 상태 (스크린리더용) */}
      <p className="sr-only" aria-live="polite">
        {category ? `${category} 카테고리` : '전체 카테고리'}, {sortLabels[sortBy]} 기준으로
        {loading ? ' 로딩 중' : ` ${reports.length}건 표시 중`}
      </p>

      {/* Reports list */}
      {loading ? (
        <div
          role="status"
          aria-live="polite"
          className="py-20 text-center text-ink-500 font-mono text-sm"
        >
          <span className="sr-only">리포트를 불러오는 중입니다</span>
          <span aria-hidden="true">로딩 중...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="py-24 text-center" role="status">
          <div className="text-5xl mb-6" aria-hidden="true">📭</div>
          <div className="serif-display text-2xl text-ink-700 mb-2 font-bold">
            {category ? `${category} 리포트가 아직 없습니다` : '아직 등록된 리포트가 없습니다'}
          </div>
          <p className="text-sm text-ink-500 mb-6">
            첫 번째 리포트를 올리면 다른 창업자들에게 큰 도움이 됩니다.
          </p>
          <Link
            to="/submit"
            className="inline-block btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
          >
            첫 리포트 등록하기 →
          </Link>
        </div>
      ) : (
        <ol aria-label="리포트 목록" className="grid gap-px bg-ink-900/10 list-none">
          {reports.map(r => (
            <li key={r.id}>
              <Link
                to={`/report/${r.id}`}
                className="bg-white hover:bg-ink-50 transition-colors p-6 group flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-700"
                aria-label={`${r.title} — ${r.category}, ${r.price.toLocaleString()}원, ${r.grade}등급`}
              >
                <div className="grid md:grid-cols-12 gap-4 items-start w-full">
                  {/* Grade */}
                  <div className="md:col-span-1">
                    <div
                      className={`grade-stamp ${
                        r.grade === 'S'
                          ? 'text-navy-800'
                          : r.grade === 'A'
                          ? 'text-ink-700'
                          : r.grade === 'B'
                          ? 'text-ink-700'
                          : 'text-ink-500'
                      }`}
                      aria-label={`품질 등급 ${r.grade}`}
                    >
                      {r.grade}
                    </div>
                  </div>

                  {/* Title + keywords */}
                  <div className="md:col-span-7">
                    <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-2">
                      <span>{r.category}</span>
                      <span aria-hidden="true"> · </span>
                      <time dateTime={r.created_at}>
                        {new Date(r.created_at).toLocaleDateString('ko-KR')}
                      </time>
                    </div>
                    <h2 className="serif-display text-xl font-bold leading-tight mb-3 group-hover:text-navy-800 transition-colors">
                      {r.title}
                    </h2>
                    {r.keywords && r.keywords.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5 list-none" aria-label="키워드">
                        {r.keywords.slice(0, 4).map(k => (
                          <li
                            key={k}
                            className="text-[10px] px-2 py-0.5 bg-ink-100 text-ink-700 font-mono"
                          >
                            #{k}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Seller + views */}
                  <div className="md:col-span-2 text-sm text-ink-500">
                    <div className="font-mono">@{r.seller_nickname}</div>
                    <div className="font-mono text-xs mt-1">
                      <span className="sr-only">조회수</span>
                      조회 {r.view_count || 0}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 md:text-right">
                    <div className="tabular-nums">
                      <span className="text-2xl font-bold text-ink-900">
                        {r.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-ink-500">원</span>
                    </div>
                    <div className="text-xs text-ink-500 font-mono mt-1">
                      <span className="sr-only">품질 점수</span>
                      {r.score}점
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function CategoryChip({ active, onClick, children, ...rest }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 rounded-sm ${
        active
          ? 'bg-navy-700 text-white'
          : 'bg-ink-50 text-ink-700 hover:bg-ink-100'
      }`}
      {...rest}
    >
      {children}
    </button>
  )
}
