export default defineEventHandler(async (event) => {
  try {
    // 0. Rate Limiting
    const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
    if (!checkRateLimit(ip)) {
      throw createError({
        statusCode: 429,
        statusMessage: "Too Many Requests",
        message: "잠시 후 다시 시도해주세요.",
      });
    }

    const body = await readBody(event);
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid messages format",
      });
    }

    // 1. Parse Intent
    const ai = event.context.cloudflare?.env?.AI;
    if (!ai) {
      console.warn("Missing AI Binding. Falling back to default.");
      // We might want to handle this gracefully or throw
    }

    const intent = await parseIntent(ai, messages);

    // 2. Match Policies
    const db = event.context.cloudflare?.env?.DB;
    if (!db) {
      console.warn(
        "Missing D1 Binding. Falling back to empty or throwing error."
      );
      // For now, let's throw to see if this is the cause
      throw createError({
        statusCode: 500,
        message: "Database binding not found",
      });
    }
    const matchedPolicies = await matchPolicies(db, intent);

    // 3. Generate Response
    const aiResponse = await generateResponse(
      ai,
      messages,
      intent,
      matchedPolicies
    );

    return {
      reply: aiResponse,
      intent: intent,
      policies: matchedPolicies,
    };
  } catch (error: any) {
    // Rethrow known errors (H3 errors)
    if (error.statusCode) {
      throw error;
    }

    // Handle unknown errors
    console.error("API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "서버 내부 오류가 발생했습니다.",
    });
  }
});
