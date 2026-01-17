import type { UserProfile } from "~/server/types";
import {
  getUserByAccessToken,
  extractBearerToken,
} from "~/server/services/auth.service";
import { deleteOnboardingSession } from "~/server/services/onboarding.service";

interface CompleteOnboardingRequest {
  session_id: string;
  profile: UserProfile;
}

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
  const body = await readBody<CompleteOnboardingRequest>(event);

  if (!body.session_id) {
    throw createError({
      statusCode: 400,
      message: "세션 ID가 필요합니다",
    });
  }

  // 프로필 저장 및 온보딩 완료 처리
  const profile = body.profile || {};

  await db
    .prepare(
      `UPDATE users
       SET onboarding_completed = 1,
           profile_region = ?,
           profile_life_cycle = ?,
           profile_interests = ?
       WHERE id = ?`
    )
    .bind(
      profile.region || null,
      profile.life_cycle || null,
      profile.interests || null,
      user.id
    )
    .run();

  // 세션 삭제
  deleteOnboardingSession(body.session_id);

  // 업데이트된 사용자 정보 조회
  const updatedUser = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(user.id)
    .first();

  return {
    message: "온보딩이 완료되었습니다.",
    user: {
      id: updatedUser?.id,
      email: updatedUser?.email,
      name: updatedUser?.name,
      onboarding_completed: true,
      profile: {
        region: updatedUser?.profile_region,
        life_cycle: updatedUser?.profile_life_cycle,
        interests: updatedUser?.profile_interests,
      },
    },
  };
});
