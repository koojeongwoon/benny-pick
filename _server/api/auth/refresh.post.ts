import type { RefreshTokenRequest, TokenResponse } from "~/server/types";
import { refreshAccessToken } from "~/server/services/auth.service";
import { ValidationError } from "~/server/utils/exceptions";

export default defineEventHandler(async (event) => {
  const body = await readBody<RefreshTokenRequest>(event);

  if (!body.refresh_token) {
    throw new ValidationError("리프레시 토큰이 필요합니다", {
      field: "refresh_token",
    });
  }

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const tokens = await refreshAccessToken(db, body.refresh_token);

  return tokens as TokenResponse;
});
