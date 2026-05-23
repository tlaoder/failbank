-- ═══════════════════════════════════════════════════════
--  003_auth_profiles.sql
--  Supabase 대시보드 > SQL Editor 에서 순서대로 실행
-- ═══════════════════════════════════════════════════════

-- ── 1. profiles 테이블 ─────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    TEXT        UNIQUE NOT NULL,
  bio         TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. 회원가입 시 자동으로 profile 생성하는 트리거 ────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nickname',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 3. RLS (Row Level Security) ────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 누구나 프로필 조회 가능 (닉네임 표시용)
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT USING (true);

-- 본인만 프로필 수정 가능
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── 4. purchases 테이블에 user_id 컬럼 추가 ───────────
--    (002_purchases.sql 이후 실행)
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases (user_id);

-- 기존 "no_public_access" 정책 교체 → 본인 구매 내역 조회 허용
DROP POLICY IF EXISTS "no_public_access" ON purchases;

-- 서버(Service Role)만 INSERT 가능
CREATE POLICY "purchases_insert_service"
  ON purchases FOR INSERT WITH CHECK (false);   -- anon/authenticated 차단, service_role은 RLS 우회

-- 본인 구매 내역 SELECT 허용
CREATE POLICY "purchases_select_own"
  ON purchases FOR SELECT USING (auth.uid() = user_id);

-- ── 5. reports 테이블에 user_id 컬럼 추가 ─────────────
--    (판매자 본인 리포트 조회용)
ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports (user_id);
