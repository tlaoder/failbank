/**
 * FailBank AI 자동 평가 엔진
 * 5대 품질 기준 100점 만점 자동 채점
 *
 * 평가 항목 (각 20점)
 * 1. 구조적 완결성 (Structure)   — 5단계 모두 충실히 작성되었는가
 * 2. 정량적 구체성 (Quantitative) — 금액·기간·수치가 포함되어 있는가
 * 3. 진정성 (Authenticity)        — 진부한 표현 없이 구체적 묘사가 있는가
 * 4. 학습 가치 (Lesson)           — 교훈이 행동 가능한 수준으로 정리되어 있는가
 * 5. 가독성 (Readability)         — 적정 길이와 균형
 *
 * @param {object} report - { background, attempt, cause, loss, lesson }
 * @returns {object} - { total, grade, breakdown, recommendedPrice }
 */
export function evaluateReport(report) {
  const { background = '', attempt = '', cause = '', loss = '', lesson = '' } = report
  const all = `${background} ${attempt} ${cause} ${loss} ${lesson}`

  // 1. 구조적 완결성 — 각 단계가 비어있지 않고 최소 50자 이상
  const structureScore = (() => {
    const sections = [background, attempt, cause, loss, lesson]
    const filled = sections.filter(s => s.trim().length >= 50).length
    return Math.round((filled / 5) * 20)
  })()

  // 2. 정량적 구체성 — 금액·기간·수치 패턴 카운트
  const quantitativeScore = (() => {
    const patterns = [
      /\d+\s*(원|만원|억|천만)/g,                  // 금액
      /\d+\s*(개월|달|년|일|주)/g,                  // 기간
      /\d+\s*(%|퍼센트|배|건|명|회)/g,              // 비율·횟수
      /\d{2,}/g,                                   // 두 자리 이상 숫자
    ]
    let hits = 0
    patterns.forEach(p => {
      const m = all.match(p)
      if (m) hits += m.length
    })
    // 10개 이상이면 만점
    return Math.min(20, Math.round((hits / 10) * 20))
  })()

  // 3. 진정성 — 진부한 표현 감점
  const authenticityScore = (() => {
    const cliches = [
      '열심히 했지만', '최선을 다했지만', '아쉽게도',
      '많이 배웠다', '성장의 발판', '값진 경험',
      '뼈저리게 느꼈', '뒤늦게 깨달', '인생의 교훈',
    ]
    const hits = cliches.filter(c => all.includes(c)).length
    const base = 20
    return Math.max(0, base - hits * 4)
  })()

  // 4. 학습 가치 — 교훈 단계에 "다음엔", "추천", "피해야" 같은 행동 동사
  const lessonScore = (() => {
    if (lesson.trim().length < 50) return 0
    const actionable = [
      '다음엔', '다음에는', '피해야', '추천', '권하지',
      '하지 말', '주의', '먼저 ', '반드시', '꼭 ',
      '체크', '확인', '검증',
    ]
    const hits = actionable.filter(a => lesson.includes(a)).length
    const base = 10  // 교훈만 충실히 작성해도 기본 10점
    return Math.min(20, base + hits * 3)
  })()

  // 5. 가독성 — 총 길이가 800~3000자 범위가 이상적
  const readabilityScore = (() => {
    const len = all.replace(/\s+/g, '').length
    if (len < 300) return 5
    if (len < 600) return 10
    if (len < 800) return 15
    if (len <= 3000) return 20
    if (len <= 5000) return 16
    return 12  // 너무 길면 가독성 저하
  })()

  const total = structureScore + quantitativeScore + authenticityScore + lessonScore + readabilityScore

  const grade =
    total >= 90 ? 'S' :
    total >= 80 ? 'A' :
    total >= 70 ? 'B' :
    total >= 60 ? 'C' : 'D'

  // 동적 가격 추천 — 품질 점수 기반
  const recommendedPrice =
    total >= 90 ? 30000 :
    total >= 80 ? 20000 :
    total >= 70 ? 15000 :
    total >= 60 ? 10000 : 5000

  // 수수료 (90점 이상은 15%, 미만은 20%)
  const commissionRate = total >= 90 ? 0.15 : 0.20

  return {
    total,
    grade,
    breakdown: {
      structure: { score: structureScore, max: 20, label: '구조적 완결성' },
      quantitative: { score: quantitativeScore, max: 20, label: '정량적 구체성' },
      authenticity: { score: authenticityScore, max: 20, label: '진정성' },
      lesson: { score: lessonScore, max: 20, label: '학습 가치' },
      readability: { score: readabilityScore, max: 20, label: '가독성' },
    },
    recommendedPrice,
    commissionRate,
    sellerEarning: Math.round(recommendedPrice * (1 - commissionRate)),
  }
}

/**
 * 키워드 자동 추출 (간단한 TF 기반)
 */
export function extractKeywords(text, topN = 5) {
  const stopwords = new Set([
    '그리고', '하지만', '그래서', '나는', '이런', '그런', '저런', '이것',
    '있다', '없다', '하다', '되다', '같다', '많이', '정말', '아주', '매우',
    '입니다', '습니다', '있는', '없는', '하는', '되는', '같은', '있어', '없어',
    '내가', '나의', '나를', '우리', '저는', '제가',
  ])
  const tokens = text
    .replace(/[^\w가-힣\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 2 && !stopwords.has(t))
  const counts = {}
  tokens.forEach(t => { counts[t] = (counts[t] || 0) + 1 })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word)
}
