export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, message: "Database binding missing" });
  }

  const body = await readBody(event);
  const { message, session_id } = body;

  const authHeader = getHeader(event, "Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);
  if (!payload) {
    throw createError({ statusCode: 401, message: "Invalid or expired token" });
  }

  const userId = parseInt(payload.sub as string);
  const sessionId = session_id || `onb_${crypto.randomUUID()}`;

  // Simple state management for demo purposes
  // In a real app, this should be stored in D1 or KV
  const steps = {
    greeting: {
      next: "collect_region",
      question: "홍길동님, 가입을 축하해요! 🎉 어느 지역에 거주하고 계신가요?",
      replies: [
        "서울",
        "경기",
        "부산",
        "대구",
        "인천",
        "광주",
        "대전",
        "울산",
        "세종",
      ],
    },
    collect_region: {
      next: "collect_life_cycle",
      question: (region: string) =>
        `${region}에 사시는군요! 👍\n\n현재 상황에 해당하는 것이 있으신가요?`,
      replies: [
        "임신/출산",
        "영유아 양육",
        "아동/청소년",
        "청년",
        "중장년",
        "노년",
      ],
    },
    collect_life_cycle: {
      next: "collect_interests",
      question: (life: string) =>
        `${life} 관련 정책을 찾아드릴게요! 관심 있는 분야를 선택해주세요.`,
      replies: [
        "🏠 주거/임대",
        "💼 취업/창업",
        "📚 교육/장학",
        "🩺 건강/의료",
        "🧸 보육/교육",
      ],
    },
    collect_interests: {
      next: "completed",
      question:
        "완료됐어요! 입력해주신 정보를 바탕으로 맞춤 혜택을 찾아드릴게요.",
      replies: [],
    },
  };

  // Logic to determine current step and build response
  // This is a simplified mock for the onboarding flow
  let currentStep = "greeting";
  let profile: any = {};
  let responseText = steps.greeting.question;
  let quickReplies = steps.greeting.replies;

  if (message) {
    // Mocking step transition
    if (message.includes("서울") || message.includes("경기")) {
      currentStep = "collect_life_cycle";
      profile.region = message;
      responseText = steps.collect_region.question(message);
      quickReplies = steps.collect_region.replies;
    } else if (message.includes("청년") || message.includes("임신")) {
      currentStep = "collect_interests";
      profile.life_cycle = message;
      responseText = steps.collect_life_cycle.question(message);
      quickReplies = steps.collect_life_cycle.replies;
    } else {
      currentStep = "completed";
      profile.interests = message;
      responseText = steps.collect_interests.question;
      quickReplies = [];
    }
  }

  return {
    response: responseText,
    session_id: sessionId,
    step: currentStep,
    profile: profile,
    is_completed: currentStep === "completed",
    quick_replies: quickReplies,
  };
});
