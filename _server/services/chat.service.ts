import type {
  ChatRequest,
  ChatResponse,
  ConversationRequest,
  ConversationResponse,
  PolicySource,
  UserProfile,
  Intent,
  ChatHealthResponse,
} from "~/server/types";
import { ValidationError } from "~/server/utils/exceptions";

// 세션 저장소
interface ConversationSession {
  id: string;
  userProfile: UserProfile;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  createdAt: number;
}

const sessions = new Map<string, ConversationSession>();

// 세션 ID 생성
function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// 정책 검색 (간단한 구현)
async function searchPolicies(
  db: D1Database,
  query: string,
  filters?: { chunk_type?: string; province?: string },
  topK: number = 5
): Promise<PolicySource[]> {
  let sql = `
    SELECT
      policy_id, title, summary, ministry, source_type,
      ctpv_nm, sgg_nm, support_content, target_detail,
      application_method, phone, website
    FROM welfare_policies
    WHERE (title LIKE ? OR summary LIKE ? OR support_content LIKE ?)
  `;
  const searchPattern = `%${query}%`;
  const params: (string | number)[] = [searchPattern, searchPattern, searchPattern];

  if (filters?.province) {
    sql += " AND (ctpv_nm LIKE ? OR source_type = 'central')";
    params.push(`%${filters.province}%`);
  }

  sql += " LIMIT ?";
  params.push(topK);

  const { results } = await db
    .prepare(sql)
    .bind(...params)
    .all<PolicySource>();

  return (results ?? []).map((policy, index) => ({
    ...policy,
    score: Math.max(0.5, 1 - index * 0.08),
    chunk_type: filters?.chunk_type ?? "benefit",
    chunk_content: policy.summary ?? "",
  }));
}

// LLM으로 답변 생성
async function generateAnswer(
  ai: any,
  query: string,
  sources: PolicySource[]
): Promise<string> {
  if (!ai) {
    // AI 없을 때 간단한 응답 생성
    if (sources.length === 0) {
      return "죄송합니다. 검색 조건에 맞는 정책을 찾지 못했습니다. 다른 키워드로 다시 검색해보세요.";
    }

    const policyList = sources
      .slice(0, 3)
      .map((p, i) => `${i + 1}. ${p.title}`)
      .join("\n");

    return `관련 정책을 찾았습니다:\n\n${policyList}\n\n자세한 내용은 각 정책을 확인해주세요.`;
  }

  const systemPrompt = `당신은 복지 정책 안내 챗봇입니다.
사용자의 질문에 대해 제공된 정책 정보를 바탕으로 친절하게 답변해주세요.

참조 정책:
${JSON.stringify(sources.slice(0, 3), null, 2)}

답변 가이드라인:
1. 간결하고 명확하게 답변하세요
2. 관련 정책이 있으면 1-2개를 중점적으로 소개하세요
3. 신청 방법이나 문의처가 있으면 안내해주세요
4. 반드시 한국어로 답변하세요`;

  try {
    const response = await ai.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
    });
    return response.response || "답변을 생성하지 못했습니다.";
  } catch {
    return sources.length > 0
      ? `관련 정책 ${sources.length}건을 찾았습니다. 상세 내용은 정책 카드를 확인해주세요.`
      : "죄송합니다. 답변 생성 중 오류가 발생했습니다.";
  }
}

// 의도 파악
async function detectIntent(ai: any, message: string): Promise<Intent> {
  const lowerMessage = message.toLowerCase();

  // 간단한 규칙 기반 의도 분류
  if (
    lowerMessage.includes("정책") ||
    lowerMessage.includes("지원") ||
    lowerMessage.includes("혜택") ||
    lowerMessage.includes("복지")
  ) {
    return "welfare_search";
  }

  if (
    lowerMessage.includes("상세") ||
    lowerMessage.includes("자세히") ||
    lowerMessage.includes("신청방법")
  ) {
    return "policy_detail";
  }

  if (
    lowerMessage.includes("안녕") ||
    lowerMessage.includes("반가") ||
    lowerMessage.includes("고마워")
  ) {
    return "chitchat";
  }

  return "welfare_search"; // 기본값
}

// 슬롯 추출 (지역, 생애주기 등)
function extractSlots(
  message: string,
  currentProfile: UserProfile
): UserProfile {
  const profile = { ...currentProfile };

  // 지역 추출
  const regions = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
  ];
  for (const region of regions) {
    if (message.includes(region)) {
      profile.region = region;
      break;
    }
  }

  // 생애주기 추출
  const lifeCycles: Record<string, string> = {
    임신: "임신/출산",
    출산: "임신/출산",
    육아: "육아",
    아이: "육아",
    청년: "청년",
    취업: "취업/창업",
    창업: "취업/창업",
    노인: "노년",
    어르신: "노년",
    장애: "장애인",
  };

  for (const [keyword, cycle] of Object.entries(lifeCycles)) {
    if (message.includes(keyword)) {
      profile.life_cycle = cycle;
      break;
    }
  }

  return profile;
}

// 일반 채팅 API
export async function chat(
  db: D1Database,
  ai: any,
  request: ChatRequest
): Promise<ChatResponse> {
  if (!request.query || request.query.length < 2) {
    throw new ValidationError("질문은 2자 이상이어야 합니다", {
      field: "query",
    });
  }

  const sources = await searchPolicies(
    db,
    request.query,
    request.filters,
    request.top_k ?? 5
  );

  const answer = await generateAnswer(ai, request.query, sources);

  return {
    answer,
    sources,
    query: request.query,
    context_used: sources.length > 0,
  };
}

// 스트리밍 채팅 (SSE Generator)
export async function* chatStream(
  db: D1Database,
  ai: any,
  request: ChatRequest
): AsyncGenerator<string> {
  if (!request.query || request.query.length < 2) {
    yield `event: error\ndata: ${JSON.stringify({ error: "질문은 2자 이상이어야 합니다" })}\n\n`;
    return;
  }

  // 1. 먼저 sources 전송
  const sources = await searchPolicies(
    db,
    request.query,
    request.filters,
    request.top_k ?? 5
  );
  yield `event: sources\ndata: ${JSON.stringify(sources)}\n\n`;

  // 2. 답변 생성 및 청크 단위 전송
  const answer = await generateAnswer(ai, request.query, sources);

  // 답변을 청크로 나눠서 전송 (실제로는 스트리밍 API 사용)
  const words = answer.split(" ");
  for (const word of words) {
    yield `event: answer\ndata: ${JSON.stringify({ text: word + " " })}\n\n`;
  }

  // 3. 완료 신호
  yield `event: done\ndata: ${JSON.stringify({ query: request.query, context_used: sources.length > 0 })}\n\n`;
}

// 대화형 채팅
export async function conversation(
  db: D1Database,
  ai: any,
  request: ConversationRequest
): Promise<ConversationResponse> {
  if (!request.message || request.message.length < 1) {
    throw new ValidationError("메시지를 입력해주세요", { field: "message" });
  }

  // 세션 조회 또는 생성
  let session: ConversationSession;
  if (request.session_id && sessions.has(request.session_id)) {
    session = sessions.get(request.session_id)!;
  } else {
    session = {
      id: generateSessionId(),
      userProfile: {},
      messages: [],
      createdAt: Date.now(),
    };
    sessions.set(session.id, session);
  }

  // 메시지 추가
  session.messages.push({ role: "user", content: request.message });

  // 의도 파악
  const intent = await detectIntent(ai, request.message);

  // 슬롯 추출
  session.userProfile = extractSlots(request.message, session.userProfile);

  // 검색 준비 여부 판단
  const readyToSearch =
    intent === "welfare_search" &&
    !!(session.userProfile.region || session.userProfile.life_cycle);

  let response: string;
  let sources: PolicySource[] | undefined;

  if (intent === "chitchat") {
    response = "안녕하세요! 복지 정책에 대해 궁금한 점이 있으시면 말씀해주세요.";
  } else if (!session.userProfile.region && intent === "welfare_search") {
    response = "어느 지역에 거주하고 계신가요?";
  } else if (!session.userProfile.life_cycle && intent === "welfare_search") {
    response =
      "현재 상황에 해당하는 것이 있으신가요? (임신/출산, 육아, 취업, 청년 등)";
  } else if (readyToSearch) {
    // 검색 수행
    const searchQuery = `${session.userProfile.region || ""} ${session.userProfile.life_cycle || ""} ${request.message}`;
    sources = await searchPolicies(
      db,
      searchQuery,
      { province: session.userProfile.region },
      5
    );

    const answer = await generateAnswer(ai, request.message, sources);
    response = answer;
  } else {
    response = "어떤 복지 정책에 대해 알고 싶으신가요?";
  }

  // 응답 저장
  session.messages.push({ role: "assistant", content: response });

  return {
    response,
    session_id: session.id,
    intent,
    ready_to_search: readyToSearch,
    user_profile: session.userProfile,
    sources,
  };
}

// 대화형 스트리밍
export async function* conversationStream(
  db: D1Database,
  ai: any,
  request: ConversationRequest
): AsyncGenerator<string> {
  const result = await conversation(db, ai, request);

  // session 이벤트
  yield `event: session\ndata: ${JSON.stringify({ session_id: result.session_id })}\n\n`;

  // intent 이벤트
  yield `event: intent\ndata: ${JSON.stringify({ intent: result.intent })}\n\n`;

  // profile 이벤트
  yield `event: profile\ndata: ${JSON.stringify(result.user_profile)}\n\n`;

  // sources 이벤트 (있는 경우)
  if (result.sources) {
    yield `event: sources\ndata: ${JSON.stringify(result.sources)}\n\n`;
  }

  // 응답을 청크로 전송
  if (result.sources && result.sources.length > 0) {
    // RAG 답변인 경우 청크 단위 전송
    const words = result.response.split(" ");
    for (const word of words) {
      yield `event: answer\ndata: ${JSON.stringify({ text: word + " " })}\n\n`;
    }
  } else {
    // 일반 메시지
    yield `event: message\ndata: ${JSON.stringify({ text: result.response })}\n\n`;
  }

  // done 이벤트
  yield `event: done\ndata: ${JSON.stringify({ ready_to_search: result.ready_to_search })}\n\n`;
}

// 세션 삭제
export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

// 채팅 서비스 상태
export async function getChatHealth(db: D1Database): Promise<ChatHealthResponse> {
  let dbStatus: "ready" | "unavailable" = "ready";
  let policyCount = 0;

  try {
    const result = await db
      .prepare("SELECT COUNT(*) as count FROM welfare_policies")
      .first<{ count: number }>();
    policyCount = result?.count ?? 0;
  } catch {
    dbStatus = "unavailable";
  }

  return {
    qdrant: dbStatus, // 현재는 DB 상태로 대체
    postgres: dbStatus,
    openai: "configured",
    embedding_models: "pre-loaded",
    active_sessions: sessions.size,
    policy_count: {
      qdrant_chunks: policyCount * 4, // 청크 수 추정
      postgres: policyCount,
    },
  };
}
