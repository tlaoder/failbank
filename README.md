# FailBank — 시행착오 자산화 플랫폼

> 먼저 망해본 사람의 리포트로 시행착오를 줄이세요.

소규모 사업자의 실패 경험을 5단계 구조화 리포트로 자산화하여 거래하는
국내 최초의 마켓플레이스 MVP.

## 기술 스택

- **Frontend**: React 18 + Vite 5 + React Router 6
- **Styling**: Tailwind CSS 3 (커스텀 편집 디자인 팔레트)
- **Backend**: Supabase (PostgreSQL + 자동 REST API)
- **Deployment**: Netlify

## 핵심 기능

- ✅ 5단계 구조화 입력 폼 (배경 → 시도 → 원인 → 손실 → 교훈)
- ✅ AI 자동 평가 엔진 (5대 기준 100점 만점, 실시간)
- ✅ 동적 가격 추천 (품질 점수 기반 5,000~30,000원)
- ✅ 동적 수수료 (90점 이상 15%, 미만 20%)
- ✅ 리포트 검색·필터·정렬 (카테고리·인기·최신·점수)
- ✅ 페이월 (구매 전엔 STEP 3~5 잠금)
- ✅ 가짜 결제 (발표 데모용)
- ✅ 반응형 디자인 (모바일·태블릿·PC)
- ✅ Supabase 미연동 시 로컬 데모 모드로 자동 fallback

---

## 빠른 시작 (로컬)

```bash
npm install
npm run dev
```

→ `http://localhost:5173` 접속

**Supabase 환경변수가 없어도 작동합니다.** 자동으로 데모 모드로 진입하여
브라우저 localStorage에 데이터를 저장합니다. 시드 리포트 3개가 미리 들어있습니다.

---

## 배포 가이드 (Supabase + Netlify)

### 1단계. Supabase 설정 (10분)

1. https://supabase.com 가입
2. **New project** 클릭, 프로젝트 이름·DB 비밀번호 입력
3. 프로젝트 생성 완료 후 좌측 메뉴에서 **SQL Editor** 클릭
4. `supabase/schema.sql` 내용 전체 복사 → 붙여넣기 → **Run** 클릭
5. 좌측 메뉴 **Project Settings → API** 에서 아래 두 값 복사:
   - `Project URL` (예: `https://xxxx.supabase.co`)
   - `anon public` 키 (긴 JWT 문자열)

### 2단계. GitHub 푸시

```bash
git init
git add .
git commit -m "FailBank MVP"
git remote add origin https://github.com/<your-username>/failbank.git
git push -u origin main
```

### 3단계. Netlify 배포 (5분)

1. https://app.netlify.com 가입·로그인
2. **Add new site → Import an existing project**
3. GitHub 저장소 선택 (`failbank`)
4. 빌드 설정은 자동 인식됨 (`netlify.toml` 덕분)
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Add environment variables** 클릭, 아래 두 개 추가:
   - `VITE_SUPABASE_URL` = 1단계에서 복사한 Project URL
   - `VITE_SUPABASE_ANON_KEY` = 1단계에서 복사한 anon key
6. **Deploy site** 클릭

→ `https://<random-name>.netlify.app` 으로 배포 완료.
**Site settings → Change site name** 에서 `failbank` 같은 이름으로 변경 가능.

---

## 프로젝트 구조

```
failbank/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js          # 커스텀 컬러 팔레트 (terra/sage/paper/ink)
├── netlify.toml                # SPA 라우팅 fallback
├── supabase/
│   └── schema.sql              # DB 스키마 + RLS + 시드 데이터
├── src/
│   ├── main.jsx
│   ├── App.jsx                 # 라우팅
│   ├── index.css               # 글로벌 스타일 + Tailwind
│   ├── components/
│   │   └── Layout.jsx          # 헤더·푸터·데모 배너
│   ├── pages/
│   │   ├── HomePage.jsx        # 랜딩 (히어로·통계·인기 리포트)
│   │   ├── BrowsePage.jsx      # 리포트 목록·필터
│   │   ├── ReportDetailPage.jsx # 리포트 상세·페이월·가짜 결제
│   │   ├── SubmitPage.jsx      # 5단계 입력 + 실시간 AI 평가
│   │   └── AboutPage.jsx       # 비즈니스 모델 소개
│   └── lib/
│       ├── supabase.js         # Supabase 클라이언트
│       ├── scoring.js          # AI 평가 엔진 (5대 기준)
│       └── reports.js          # CRUD API + 데모 fallback
```

---

## AI 평가 엔진 — 5대 기준

| 항목 | 배점 | 평가 방식 |
|---|---|---|
| 구조적 완결성 | 20 | 5단계 모두 50자 이상 작성 여부 |
| 정량적 구체성 | 20 | 금액·기간·비율·수치 패턴 카운트 |
| 진정성 | 20 | 진부한 표현 감점 |
| 학습 가치 | 20 | 교훈에 행동 가능한 동사 포함 여부 |
| 가독성 | 20 | 적정 글자 수 (800~3,000자) |

**등급**: 90+ S · 80+ A · 70+ B · 60+ C · 그 이하 D
**가격**: 등급별 5,000원 ~ 30,000원
**수수료**: S등급 15%, 나머지 20%

---

## 발표 데모 시나리오

1. **홈** → 통계 73.3%·29.2%로 문제 정의 임팩트
2. **리포트 찾기** → 시드 리포트 3종 노출 (카페·쿠팡·SaaS)
3. **리포트 상세** → 페이월 → "결제하기" 클릭 → 가짜 결제 모달 → 잠금 해제
4. **리포트 쓰기** → 5단계 입력하면서 우측 사이드바에 점수가 실시간 변동
5. **소개** → 학술 근거 5편·BMC 핵심 정리

---

## 라이선스

2026학년도 1학기 플랫폼 비즈니스 과제용 프로토타입.
