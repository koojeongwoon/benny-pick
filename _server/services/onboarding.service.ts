import type { UserProfile } from "~/server/types";
import { ValidationError } from "~/server/utils/exceptions";

// 온보딩 단계
type OnboardingStep =
  | "greeting"
  | "collect_region"
  | "collect_life_cycle"
  | "collect_interests"
  | "completed";

// 온보딩 세션
interface OnboardingSession {
  id: string;
  userId: number;
  profile: UserProfile;
  currentStep: OnboardingStep;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  createdAt: number;
}

// 세션 저장소
const onboardingSessions = new Map<string, OnboardingSession>();

// 세션 ID 생성
function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return "onb_" + Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// 지역 목록
const REGIONS = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

// 생애주기 목록
const LIFE_CYCLES = [
  { key: "pregnancy", label: "임신/출산", keywords: ["임신", "출산", "임산부", "산모"] },
  { key: "infant", label: "영유아 양육", keywords: ["영유아", "아기", "육아", "어린이집"] },
  { key: "child", label: "아동/청소년", keywords: ["아동", "청소년", "초등", "중고등"] },
  { key: "youth", label: "청년", keywords: ["청년", "20대", "30대", "취준"] },
  { key: "middle", label: "중장년", keywords: ["중장년", "40대", "50대"] },
  { key: "senior", label: "노년", keywords: ["노인", "어르신", "60대", "70대", "실버"] },
];

// 관심분야 목록
const INTERESTS = [
  { key: "housing", label: "주거/임대", emoji: "🏠" },
  { key: "job", label: "취업/창업", emoji: "💼" },
  { key: "education", label: "교육/장학", emoji: "📚" },
  { key: "health", label: "의료/건강", emoji: "🏥" },
  { key: "childcare", label: "육아/보육", emoji: "👶" },
  { key: "finance", label: "금융/대출", emoji: "💰" },
];

// 지역 추출
function extractRegion(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  for (const region of REGIONS) {
    if (lowerMessage.includes(region.toLowerCase())) {
      return region;
    }
  }
  return null;
}

// 생애주기 추출
function extractLifeCycle(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  for (const cycle of LIFE_CYCLES) {
    for (const keyword of cycle.keywords) {
      if (lowerMessage.includes(keyword)) {
        return cycle.label;
      }
    }
    if (lowerMessage.includes(cycle.label)) {
      return cycle.label;
    }
  }
  return null;
}

// 관심분야 추출 (복수 선택 가능)
function extractInterests(message: string): string[] {
  const interests: string[] = [];
  const lowerMessage = message.toLowerCase();

  for (const interest of INTERESTS) {
    if (lowerMessage.includes(interest.label) || lowerMessage.includes(interest.key)) {
      interests.push(interest.label);
    }
  }

  // 숫자로 선택한 경우 (예: "1, 3, 5" 또는 "1 3 5")
  const numbers = message.match(/\d+/g);
  if (numbers) {
    for (const num of numbers) {
      const index = parseInt(num) - 1;
      if (index >= 0 && index < INTERESTS.length) {
        const label = INTERESTS[index].label;
        if (!interests.includes(label)) {
          interests.push(label);
        }
      }
    }
  }

  return interests;
}

// 온보딩 응답 타입
export interface OnboardingResponse {
  response: string;
  session_id: string;
  step: OnboardingStep;
  profile: UserProfile;
  is_completed: boolean;
  quick_replies?: string[];
}

// 온보딩 요청 타입
export interface OnboardingRequest {
  message: string;
  session_id?: string;
  user_id: number;
}

// 메인 온보딩 대화 함수
export async function onboardingConversation(
  db: D1Database,
  request: OnboardingRequest
): Promise<OnboardingResponse> {
  // 세션 조회 또는 생성
  let session: OnboardingSession;

  if (request.session_id && onboardingSessions.has(request.session_id)) {
    session = onboardingSessions.get(request.session_id)!;
  } else {
    // 사용자 이름 조회
    const user = await db
      .prepare("SELECT name FROM users WHERE id = ?")
      .bind(request.user_id)
      .first<{ name: string }>();

    const userName = user?.name || "회원";

    session = {
      id: generateSessionId(),
      userId: request.user_id,
      profile: {},
      currentStep: "greeting",
      messages: [],
      createdAt: Date.now(),
    };
    onboardingSessions.set(session.id, session);

    // 첫 방문: 인사 메시지 반환
    const greetingResponse = `${userName}님, 가입을 축하해요! 🎉\n\n더 정확한 맞춤 혜택을 찾아드리기 위해 몇 가지만 여쭤볼게요.\n\n어느 지역에 거주하고 계신가요?`;
    session.messages.push({ role: "assistant", content: greetingResponse });
    session.currentStep = "collect_region";

    return {
      response: greetingResponse,
      session_id: session.id,
      step: "collect_region",
      profile: session.profile,
      is_completed: false,
      quick_replies: REGIONS.slice(0, 8), // 주요 지역만 표시
    };
  }

  // 사용자 메시지 저장
  const userMessage = request.message.trim();
  session.messages.push({ role: "user", content: userMessage });

  let response: string;
  let quickReplies: string[] | undefined;

  // 현재 단계에 따라 처리
  switch (session.currentStep) {
    case "collect_region": {
      const region = extractRegion(userMessage);
      if (region) {
        session.profile.region = region;
        session.currentStep = "collect_life_cycle";
        response = `${region}에 사시는군요! 👍\n\n현재 상황에 해당하는 것이 있으신가요?`;
        quickReplies = LIFE_CYCLES.map((c) => c.label);
      } else {
        response = "죄송해요, 지역을 잘 이해하지 못했어요. 거주하시는 시/도를 알려주세요.";
        quickReplies = REGIONS.slice(0, 8);
      }
      break;
    }

    case "collect_life_cycle": {
      const lifeCycle = extractLifeCycle(userMessage);
      if (lifeCycle) {
        session.profile.life_cycle = lifeCycle;
        session.currentStep = "collect_interests";
        response = `${lifeCycle} 관련 정책을 중점적으로 찾아드릴게요!\n\n마지막으로, 관심 있는 분야를 선택해주세요. (복수 선택 가능)`;
        quickReplies = INTERESTS.map((i) => `${i.emoji} ${i.label}`);
      } else if (userMessage.includes("없") || userMessage.includes("해당없음") || userMessage.includes("스킵")) {
        session.currentStep = "collect_interests";
        response = "알겠어요! 그럼 관심 있는 분야를 선택해주세요. (복수 선택 가능)";
        quickReplies = INTERESTS.map((i) => `${i.emoji} ${i.label}`);
      } else {
        response = "어떤 상황에 계신지 알려주시면 더 정확한 혜택을 찾아드릴 수 있어요.";
        quickReplies = [...LIFE_CYCLES.map((c) => c.label), "해당없음"];
      }
      break;
    }

    case "collect_interests": {
      const interests = extractInterests(userMessage);
      if (interests.length > 0) {
        session.profile.interest = interests.join(", ");
        session.currentStep = "completed";

        // 프로필 저장 (실제로는 DB에 저장)
        // await saveUserProfile(db, session.userId, session.profile);

        const summary = [
          session.profile.region && `📍 ${session.profile.region}`,
          session.profile.life_cycle && `👤 ${session.profile.life_cycle}`,
          session.profile.interest && `💡 ${session.profile.interest}`,
        ]
          .filter(Boolean)
          .join("\n");

        response = `완료됐어요! 입력해주신 정보를 바탕으로 맞춤 혜택을 찾아드릴게요.\n\n${summary}\n\n이제 베니픽을 시작해볼까요? 🚀`;

        // 세션 정리
        setTimeout(() => {
          onboardingSessions.delete(session.id);
        }, 60000);
      } else if (userMessage.includes("스킵") || userMessage.includes("건너뛰기")) {
        session.currentStep = "completed";
        response = "알겠어요! 나중에 설정에서 언제든 변경하실 수 있어요.\n\n이제 베니픽을 시작해볼까요? 🚀";

        setTimeout(() => {
          onboardingSessions.delete(session.id);
        }, 60000);
      } else {
        response = "관심 있는 분야를 선택해주세요. 여러 개 선택하셔도 돼요!";
        quickReplies = [...INTERESTS.map((i) => `${i.emoji} ${i.label}`), "건너뛰기"];
      }
      break;
    }

    default:
      response = "온보딩이 이미 완료되었어요!";
  }

  // 응답 저장
  session.messages.push({ role: "assistant", content: response });

  return {
    response,
    session_id: session.id,
    step: session.currentStep,
    profile: session.profile,
    is_completed: session.currentStep === "completed",
    quick_replies: quickReplies,
  };
}

// 세션 삭제
export function deleteOnboardingSession(sessionId: string): boolean {
  return onboardingSessions.delete(sessionId);
}
