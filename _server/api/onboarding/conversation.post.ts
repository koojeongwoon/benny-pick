import type { OnboardingRequest, OnboardingResponse } from "~/server/services/onboarding.service";
import { onboardingConversation } from "~/server/services/onboarding.service";
import {
  getUserByAccessToken,
  extractBearerToken,
} from "~/server/services/auth.service";

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

  const user = await getUserByAccessToken(db, accessToken);

  const body = await readBody<Omit<OnboardingRequest, "user_id">>(event);

  const result = await onboardingConversation(db, {
    ...body,
    user_id: user.id,
  });

  return result as OnboardingResponse;
});
