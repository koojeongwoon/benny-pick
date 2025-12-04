## 📅 Document Info

- **Project Name:** 복지집사 (Benefit Chat)
- **Version:** v1.0.0 (MVP)
- **Target Platform:** Mobile Web
- **Last Updated:** 2025-12-03

---

# [Part 1] PRD: 제품 요구사항 정의서

## 1. 프로젝트 개요 (Overview)

- **정의:** 복잡한 정부 지원금 공고를 읽지 않고, 자연어 대화를 통해 사용자가 받을 수 있는 '구체적인 금액'을 찾아주는 **AI 복지 비서**.
- **핵심 가치:** "검색과 공부는 AI가 대신, 당신은 돈만 받아가세요."
- **목표:** 2030 청년 타겟, 핵심 복지 혜택 50종 매칭 서비스 MVP 런칭.

## 2. 타겟 페르소나 (Target Persona)

- **Primary:** 김민수 (28세, 취업준비생)
  - **상황:** 경기도 거주, 소득 없음, 월세 부담 큼.
  - **Needs:** 긴 공고문을 읽기 귀찮아하며, "그래서 내가 얼마 받는데?"에 대한 즉답을 원함.

## 3. 사용자 시나리오 (User Flow)

1. **Onboarding:** 별도 가입 없이 "내 숨은 돈 조회하기" 버튼 클릭.
2. **Chatting:**
   - User: "나 용인 사는 28살 백수인데 월세 지원돼?"
   - Bot: "용인시 거주 28세 확인했습니다. 혹시 세대주로 분리되어 혼자 사시나요?" (역질문)
   - User: "어 맞아."
3. **Result:**
   - Bot: "축하합니다! **청년월세 특별지원** 대상이에요. 매달 **20만 원**씩 받을 수 있어요."
4. **Action:** 결과 페이지의 [신청하러 가기] 링크 클릭.

## 4. 핵심 기능 명세 (Feature Specs)

| ID       | 기능명                 | 상세 내용                                                                      | 우선순위 |
| :------- | :--------------------- | :----------------------------------------------------------------------------- | :------- |
| **F-01** | **하이브리드 채팅 UI** | 자연어 입력창과 퀵 리플라이(객관식 버튼) 동시 지원. 타이핑 애니메이션 적용.    | P0       |
| **F-02** | **AI 인텐트 파싱**     | 사용자 발화에서 [나이, 거주지, 직업] 변수를 추출하여 JSON화. (Workers AI 활용) | P0       |
| **F-03** | **정책 매칭 엔진**     | 파싱된 변수와 DB 내 정책 조건을 대조(Filtering)하여 수혜 가능 여부 판단.       | P0       |
| **F-04** | **AI 답변 생성**       | 매칭된 데이터를 바탕으로 공감하는 말투의 답변 생성 (RAG).                      | P0       |
| **F-05** | **결과 리포트**        | 수혜 가능 정책 리스트(카드 UI), 예상 수령액 총합 표시.                         | P1       |
| **F-06** | **면책 조항**          | "법적 효력이 없는 모의 계산 결과임"을 명시하는 하단 푸터.                      | P0       |

## 5. UI/UX 상세 설계 (Design Specs: Toss Style)

### A. 디자인 시스템 (Design System)

사용자에게 **신뢰감(Trust)**과 **친근함(Friendly)**을 동시에 주는 '토스(Toss)' 스타일을 지향합니다.

- **Color Palette:**
  - **Primary (Brand):** `#3182F6` (쨍하고 선명한 블루 - 신뢰감)
  - **Background:** `#F2F4F6` (눈이 편안한 옅은 웜그레이)
  - **Text (Title):** `#191F28` (완전한 검정보다는 짙은 차콜)
  - **Text (Body):** `#4E5968` (가독성 좋은 미디엄 그레이)
  - **White:** `#FFFFFF` (카드 및 말풍선 배경)
- **Typography:**
  - **Font:** `Pretendard` (모바일 가독성 최적화)
  - **Style:** 숫자는 **Bold**, 본문은 Medium 위주 사용.
- **Layout & Shape:**
  - **Super Rounded:** 버튼과 카드 모서리는 `rounded-2xl` (16px) 이상.
  - **Emoji First:** 텍스트 앞에 3D 느낌의 이모지를 배치하여 직관성 강화.

### B. 화면별 상세 구성 (Screen Details)

#### 1. 랜딩 페이지 (Onboarding)

사용자의 시선을 3초 안에 사로잡는 임팩트 있는 첫인상.

- **Background:** Clean White (`bg-white`)
- **Hero Section:**
  - **Visual:** 중앙에 큼지막한 **💸 (돈 날개)** 또는 **🕵️ (탐정)** 이모지 배치.
  - **Copy:**
    - Main: "숨어있는 내 돈, <span class='text-[#3182F6]'>240만 원</span>"
    - Sub: "복잡한 서류 없이 1분 대화로 찾아요."
- **CTA Button (Bottom Sticky):**
  - Style: 화면 하단 꽉 차는 버튼 (`w-full`, `rounded-xl`).
  - Color: Brand Blue (`#3182F6`).
  - Text: "내 지원금 조회하기 ✨"

#### 2. 메인 채팅 (Chat Room)

끊김 없는 대화 경험을 위한 '친구와의 카톡' 같은 인터페이스.

- **Background:** Light Gray (`#F2F4F6`) - 흰색 요소가 돋보이게 함.
- **Bot Bubble (AI):**
  - Style: White Background (`bg-white`), Soft Shadow (`shadow-sm`).
  - Avatar: 🤖 로봇 대신 **친근한 집사 이모지 (🤵 or 🐶)** 사용.
  - Content: "안녕하세요! 김민수 님, **경기도 용인**에 사시는군요? 🏠" (이모지로 문맥 강조)
- **User Bubble (Me):**
  - Style: Brand Blue (`bg-[#3182F6]`), White Text.
  - Shape: 말풍선 꼬리 디테일 (`rounded-2xl rounded-tr-none`).
- **Quick Reply (Chips):**
  - Position: 입력창 상단 가로 스크롤 영역.
  - Style: White Pill Button, `shadow-md`.
  - Content: `💰 소득 없음`, `🏠 월세 살아요`, `🎓 대학생`

#### 3. 결과 카드 (Result Card)

조회 결과를 '선물'처럼 느끼게 하는 카드 UI.

- **Layout:** 가로 스크롤 캐러셀 (Carousel).
- **Card Style:**
  - Size: 화면 너비 80%를 차지하는 대형 카드.
  - Effect: 붕 떠있는 느낌의 `shadow-lg` (Toss Shadow).
- **Card Content:**
  - **Badge:** `🔥 마감임박` (Red), `👍 강력추천` (Blue).
  - **Icon:** 정책 성격에 맞는 이모지 (예: 주거=🏠, 현금=💵).
  - **Title:** "청년월세 특별지원"
  - **Amount:** **"월 20만 원"** (가장 크고 굵게 강조).
  - **Description:** "12개월간 현금으로 꽂아드려요." (구어체).

### C. TailwindCSS 설정 가이드 (tailwind.config.ts)

아래 설정을 적용하여 색상과 폰트를 통일합니다.

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: "#3182F6", // Toss Blue
        background: "#F2F4F6", // Light Gray Bg
        text: {
          title: "#191F28", // Dark Charcoal
          body: "#4E5968", // Medium Gray
          light: "#8B95A1", // Light Gray
        },
      },
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      boxShadow: {
        toss: "0 4px 20px rgba(0, 0, 0, 0.08)", // 부드럽고 넓게 퍼지는 그림자
      },
    },
  },
};
```

---

# TRD: 복지집사 (Benefit Chat) Architecture

## 1. 기술 스택 (Tech Stack)

- **Framework:** Nuxt 4 (Vue 3 Composition API)
- **Deployment:** Cloudflare Pages
- **Backend Logic:** Cloudflare Workers (via Nuxt Nitro)
- **Database:** Cloudflare D1 (SQLite)
- **AI Model:** **Cloudflare Workers AI** (`@cf/meta/llama-3-8b-instruct`)
- **Language:** TypeScript
- **Styling:** TailwindCSS

## 2. 시스템 아키텍처 (System Architecture)

데이터의 흐름이 **[입력 파싱] -> [DB 조회] -> [답변 생성]** 순으로 이루어집니다.

[Client: Mobile Web]
│ (HTTPS Request)
▼
[Cloudflare Pages: Server API (/api/chat)]
│
├──▶ **Phase 1. 귀 (Parsing)**
│ │ [Workers AI] 호출
│ │ Input: "용인 28세 백수야"
│ │ Output: JSON `{age: 28, region: 'Yongin', job: 'unemployed'}`
│ ▼
├──▶ **Phase 2. 뇌 (Logic)**
│ │ [D1 Database] 쿼리 실행
│ │ Query: `SELECT * FROM policies WHERE ...`
│ │ Output: `[{ name: '청년월세지원', amount: 200000 }]` (Fact Data)
│ ▼
├──▶ **Phase 3. 입 (Generation)**
│ │ [Workers AI] 호출 (RAG)
│ │ Input: Fact Data + "친절하게 설명해줘"
│ │ Output: "용인에 사시는군요! 월세지원을 받을 수 있어요."
│ ▼
└──▶ Response 반환

## 3. 데이터베이스 스키마 (D1 Schema)

### `policies` 테이블

핵심 복지 정책 데이터를 저장합니다.

```sql
CREATE TABLE policies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,              -- 정책명 (예: 청년월세특별지원)
    category TEXT NOT NULL,           -- 카테고리 (housing, job, finance)

    -- 1차 필터링용 컬럼 (인덱싱)
    age_min INTEGER DEFAULT 0,        -- 최소 나이
    age_max INTEGER DEFAULT 99,       -- 최대 나이
    region_si TEXT DEFAULT 'All',     -- 광역 (Seoul, Gyeonggi, All)
    region_gu TEXT DEFAULT 'All',     -- 기초 (Yongin, Gangnam, All)
    job_status TEXT,                  -- 대상 직업 (job_seeker, worker, etc)

    -- 상세 조건 및 정보
    conditions JSON,                  -- 2차 필터링용 상세 조건 (소득구간 등)
    benefit_summary TEXT,             -- 혜택 요약 (예: 월 20만원 x 12개월)
    apply_url TEXT,                   -- 신청 링크
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_filter ON policies(region_si, region_gu, age_min, age_max);
```

## 4. API 명세 (Internal API)

### POST /api/chat

- 사용자의 메시지를 받아 AI 분석 -> DB 조회 -> AI 답변 생성을 수행합니다.

- Request Body:

```json
{
  "message": "저 경기도 용인 살고 28살인데 취준생이에요.",
  "history": []
}
```

### Process Logic (상세):

1. Intent Parsing (AI)

   - env.AI.run() 호출.

   - Prompt: "Extract age, region, and job from user input to JSON."

   - Result: {"age": 28, "region": "Yongin", ...}

2. Data Retrieval (DB)

   - 추출된 정보로 D1 쿼리 실행.

   - 결과가 없으면 -> Phase 3로 이동 (결과 없음 멘트 생성 요청).

   - 결과가 있으면 -> Fact Data로 가공.

3. Response Generation (AI)

   - env.AI.run() 재호출.

   - System Prompt: > "당신은 상담사입니다. 아래 [검색된 정책] 데이터를 바탕으로 사용자에게 답변하세요.

     - 주의: 정책 이름과 금액은 절대 변경하거나 지어내지 마세요. > 사용자의 상황(나이, 직업 등)에 공감하는 말투를 쓰세요."

   - User Prompt: [검색된 정책]: ${JSON.stringify(db_results)}

- Response Body

```json
{
  "status": "success",
  "data": {
    "parsed_intent": { "age": 28, "region": "Yongin" },
    "policies": [ ... ] // 프론트엔드에서 카드 UI로 보여줄 원본 데이터
  },
  "reply_text": "용인시에 거주하시는군요! 확인해보니 **청년월세지원**을 받으실 수 있어요. 취업 준비에 큰 도움이 될 것 같네요!" // AI가 생성한 말풍선 텍스트
}
```

## 5. 환경 설정 (Configuration)

- wrangler.toml (Project Root)
- [중요] [ai] 바인딩이 반드시 있어야 합니다.

```ini, TOML

name = "lynply"
pages_build_output_dir = ".output/public"
compatibility_date = "2024-12-03"

# D1 데이터베이스 연결
[[d1_databases]]
binding = "DB"
database_name = "lynply-db"
database_id = "<YOUR-D1-ID-HERE>"

# Workers AI 연결 (필수)
[ai]
binding = "AI"
```
