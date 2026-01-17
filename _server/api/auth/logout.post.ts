import { logout, extractBearerToken } from "~/server/services/auth.service";

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization");
  const accessToken = extractBearerToken(authHeader ?? null);

  const result = logout(accessToken);

  return {
    message: "로그아웃 되었습니다",
    user_id: result?.userId ?? null,
  };
});
