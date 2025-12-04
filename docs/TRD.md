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
