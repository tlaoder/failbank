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

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="border-b border-ink-900/20 pb-8 mb-10">
        <div className="text-xs tracking-[0.3em] text-terra-600 uppercase mb-3 font-mono">
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
          <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-3">
            카테고리
          </div>
          <div className="flex flex-wrap gap-2">
            <CategoryChip active={category === null} onClick={() => setCategory(null)}>
              전체
            </CategoryChip>
            {CATEGORIES.map(c => (
              <CategoryChip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </CategoryChip>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-3">
            정렬
          </div>
          <div className="flex gap-2">
            {[
              ['recent', '최신순'],
              ['popular', '인기순'],
              ['score', '점수순'],
            ].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setSortBy(k)}
                className={`px-4 py-2 text-sm tracking-tight transition-colors ${
                  sortBy === k
                    ? 'bg-ink-900 text-paper-50'
                    : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports list */}
      {loading ? (
        <div className="py-20 text-center text-ink-500 font-mono text-sm">
          로딩 중...
        </div>
      ) : reports.length === 0 ? (
        <div className="py-20 text-center">
          <div className="serif-display text-2xl text-ink-500 mb-2">
            아직 등록된 리포트가 없습니다.
          </div>
          <Link to="/submit" className="text-terra-600 hover:underline">
            첫 리포트를 등록해보세요 →
          </Link>
        </div>
      ) : (
        <div className="grid gap-px bg-ink-900/10">
          {reports.map((r, i) => (
            <Link
              key={r.id}
              to={`/report/${r.id}`}
              className="bg-paper-50 hover:bg-paper-100 transition-colors p-6 group"
            >
              <div className="grid md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-1">
                  <div className={`grade-stamp ${
                    r.grade === 'S' ? 'text-terra-600' :
                    r.grade === 'A' ? 'text-gold-600' :
                    r.grade === 'B' ? 'text-sage-600' : 'text-ink-500'
                  }`}>
                    {r.grade}
                  </div>
                </div>

                <div className="md:col-span-7">
                  <div className="text-[10px] tracking-[0.2em] text-ink-500 uppercase font-mono mb-2">
                    {r.category} · {new Date(r.created_at).toLocaleDateString('ko-KR')}
                  </div>
                  <h3 className="serif-display text-xl font-bold leading-tight mb-3 group-hover:text-terra-600 transition-colors">
                    {r.title}
                  </h3>
                  {r.keywords && r.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.keywords.slice(0, 4).map(k => (
                        <span key={k} className="text-[10px] px-2 py-0.5 bg-paper-200 text-ink-700 font-mono">
                          #{k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 text-sm text-ink-500">
                  <div className="font-mono">@{r.seller_nickname}</div>
                  <div className="font-mono text-xs mt-1">조회 {r.view_count || 0}</div>
                </div>

                <div className="md:col-span-2 md:text-right">
                  <div className="tabular-nums">
                    <span className="text-2xl font-bold text-ink-900">
                      {r.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-ink-500">원</span>
                  </div>
                  <div className="text-xs text-ink-500 font-mono mt-1">
                    {r.score}점
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'bg-terra-500 text-paper-50'
          : 'bg-paper-100 text-ink-700 hover:bg-paper-200'
      }`}
    >
      {children}
    </button>
  )
}
