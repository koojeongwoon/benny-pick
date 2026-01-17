import {
  getUserByAccessToken,
  extractBearerToken,
} from "~/server/services/auth.service";
import { deleteOnboardingSession } from "~/server/services/onboarding.service";

export default defineEventHandler(async (event) => {
  // 인증 확인
  const authHeader = getHeader(event, "authorization");
  const accessToken = extractBearerToken(authHeader ?? null);

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  // 사용자 인증 확인
  await getUserByAccessToken(db, accessToken);

  const sessionId = getRouterParam(event, "sessionId");

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      message: "세션 ID가 필요합니다",
    });
  }

  deleteOnboardingSession(sessionId);

  return {
    message: "온보딩 세션이 삭제되었습니다.",
  };
});
