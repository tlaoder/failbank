-- ─────────────────────────────────────────────
--  purchases 테이블: 결제 완료 기록 저장
--  Supabase 대시보드 > SQL Editor 에서 실행
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS purchases (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id       TEXT        REFERENCES reports(id) ON DELETE SET NULL,
  payment_key     TEXT        UNIQUE NOT NULL,
  order_id        TEXT        UNIQUE NOT NULL,
  amount          INTEGER     NOT NULL CHECK (amount > 0),
  status          TEXT        NOT NULL DEFAULT 'DONE',
  method          TEXT,                        -- 카드 | 가상계좌 | 간편결제 등
  paid_at         TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 리포트별 구매 조회 인덱스
CREATE INDEX IF NOT EXISTS idx_purchases_report_id ON purchases (report_id);

-- 서버 측에서만 쓰기 (Service Role Key 사용)
-- 클라이언트(anon)는 읽기 불가 → RLS 활성화
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- 아무도 SELECT/INSERT 못함 (서버 전용)
CREATE POLICY "no_public_access" ON purchases
  FOR ALL USING (false);

-- ─────────────────────────────────────────────
--  (선택) 리포트 판매 통계 뷰
-- ─────────────────────────────────────────────
CREATE OR REPLACE VIEW report_sales AS
SELECT
  r.id,
  r.title,
  r.price,
  COUNT(p.id)    AS total_sales,
  SUM(p.amount)  AS total_revenue
FROM reports r
LEFT JOIN purchases p ON p.report_id = r.id AND p.status = 'DONE'
GROUP BY r.id, r.title, r.price;
