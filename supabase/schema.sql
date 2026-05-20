-- ============================================================
-- FailBank Supabase 스키마
-- ============================================================
-- 사용법:
-- 1. supabase.com에서 프로젝트 생성
-- 2. Project Settings → Database → SQL Editor
-- 3. 이 파일 전체 복사 후 실행
-- 4. Project Settings → API에서 URL과 anon key 복사
-- 5. .env 파일에 환경변수로 추가

-- UUID 확장 (Supabase는 보통 기본 활성화되어 있음)
create extension if not exists "uuid-ossp";

-- ============================================================
-- reports 테이블
-- ============================================================
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  seller_nickname text not null,

  -- 5단계 구조화 본문
  background text not null,
  attempt text not null,
  cause text not null,
  loss text not null,
  lesson text not null,

  -- AI 평가 결과
  score integer not null check (score >= 0 and score <= 100),
  grade text not null check (grade in ('S', 'A', 'B', 'C', 'D')),
  price integer not null check (price >= 1000),
  keywords text[] default '{}',

  -- 메타
  view_count integer default 0,
  created_at timestamptz default now()
);

-- 카테고리·점수 인덱스 (필터링·정렬 최적화)
create index if not exists reports_category_idx on reports(category);
create index if not exists reports_created_at_idx on reports(created_at desc);
create index if not exists reports_view_count_idx on reports(view_count desc);
create index if not exists reports_score_idx on reports(score desc);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
-- MVP 단계에서는 익명 사용자 읽기·쓰기 허용
-- 실서비스 단계에서는 auth.uid() 기반으로 강화 필요

alter table reports enable row level security;

-- 누구나 리포트 조회 가능
create policy "Anyone can read reports"
  on reports for select
  using (true);

-- 누구나 리포트 등록 가능 (익명 판매 모델)
create policy "Anyone can insert reports"
  on reports for insert
  with check (true);

-- 조회수 증가만 허용 (UPDATE)
create policy "Anyone can increment view_count"
  on reports for update
  using (true)
  with check (true);

-- ============================================================
-- 시드 데이터 (선택 사항 — 빈 DB를 채우고 싶다면 실행)
-- ============================================================
insert into reports (title, category, seller_nickname, background, attempt, cause, loss, lesson, score, grade, price, keywords) values
(
  '인스타 광고 3,000만원 태우고 폐업한 디저트 카페',
  '외식·카페',
  '강남디저트',
  '강남 역삼동 1층에 36㎡(11평) 디저트 카페를 2023년 3월 오픈했다. 초기 투자금은 보증금 5,000만원, 인테리어 3,800만원, 집기 1,200만원 등 총 1억 2,000만원이었다. 목표 고객은 20대 후반 직장인 여성으로 잡았다.',
  '오픈 직후 인스타그램 광고에 월 250만원씩 집행했다. 12개월간 총 3,000만원을 태웠다. "감성 카페" 콘셉트로 디저트 비주얼 위주의 피드를 운영했고, 인플루언서 협찬도 5명 진행했다.',
  '광고 ROAS(투자수익률)를 한 번도 측정하지 않았다. 팔로워는 8,000명까지 늘었지만 실제 방문 전환율은 1% 미만이었다. 핵심 실패 원인은 "인스타에서 예쁘다"와 "실제로 사 먹는다"가 완전히 다른 행동이라는 것을 몰랐던 것이다.',
  '광고비 3,000만원, 임차료·인건비 적자 4,200만원, 권리금 회수 실패 2,000만원. 총 손실 약 9,200만원. 폐업까지 14개월 소요.',
  '다음에는 첫 3개월 광고비를 월 30만원으로 제한하고 ROAS를 주 단위로 측정할 것. 인스타 마케팅은 "재방문 도구"지 "신규 유입 도구"가 아니다. 외식업 신규 진입자에게는 절대 추천하지 않는다.',
  88, 'A', 25000, ARRAY['인스타광고','ROAS','디저트카페','폐업']
),
(
  '쿠팡 입점 후 6개월만에 마진 -8% 찍은 의류 셀러',
  '온라인 쇼핑몰',
  '여성복마진',
  '여성 캐주얼 의류 자체 브랜드를 운영하던 1인 셀러였다. 자사몰 월 매출 1,200만원 수준에서 쿠팡 로켓그로스 입점을 결정했다. 2024년 1월 입점, 같은 해 8월 입점 철수.',
  '로켓그로스 입점 후 상위 노출 광고에 월 80만원, 인입 단가 인하 프로모션, 무료 배송까지 적용했다. 매출은 월 3,500만원까지 늘었다.',
  '매출은 늘었지만 마진율이 -8%로 역전됐다. 쿠팡 수수료 11%, 광고비 2.3%, 무료배송 3.5%, 반품률 14% 처리비용까지 합치니 자사몰 마진 28%가 -8%로 깎였다. "쿠팡에 들어가면 돈 번다"는 통념이 1인 셀러에게는 함정이었다.',
  '7개월 누적 영업손실 1,800만원. 자사몰 운영 시간 부족으로 자사몰 매출도 월 600만원으로 감소. 기회비용 포함 약 3,000만원 손실.',
  '쿠팡 입점 전 반드시 손익분기 시뮬레이션을 할 것. 1인 셀러는 자사몰 마진 30% 이상이 아니면 쿠팡 입점 시 마진이 마이너스가 된다. 반품률 10% 이상 카테고리(의류·신발)는 특히 주의.',
  82, 'A', 20000, ARRAY['쿠팡','로켓그로스','의류','마진']
),
(
  '공동창업자와 지분 50:50으로 시작했다가 18개월만에 갈라선 SaaS',
  'IT·스타트업',
  '5050함정',
  '대학 동기와 B2B SaaS(중소기업 회계 자동화)를 공동창업했다. 둘 다 개발자였고 지분은 50:50으로 균등 분배. 2022년 5월 법인 설립.',
  '제품 개발은 6개월만에 완료했다. 시드 투자 5,000만원도 유치했다. 그러나 영업 방향성, 가격 정책, 채용 결정에서 모든 안건이 매번 한쪽 거부권으로 막혔다.',
  '의사결정 구조 부재가 본질이었다. 50:50 지분은 "공정"한 게 아니라 "교착"이다. 갈등 해결 메커니즘(이사회·외부 자문) 없이 시작했고 18개월간 어떤 큰 결정도 합의되지 못했다. 결국 둘 다 지쳤다.',
  '시드 투자금 4,200만원 소진(인건비). 18개월 시간. 둘 다 회사 떠남. 친구 관계도 끝남.',
  '공동창업 시 지분 차이를 반드시 둘 것 (예: 51:49). 의사결정 갈등 시 시니어 이사·외부 자문 회부 조항을 주주간계약서에 명시. "친구라서 괜찮을 것"이라는 가정은 가장 위험하다.',
  91, 'S', 28000, ARRAY['공동창업','지분','의사결정','SaaS']
);
