import type { UserResponse } from "~/server/types";
import {
  getUserByAccessToken,
  extractBearerToken,
  toUserResponse,
} from "~/server/services/auth.service";

export default defineEventHandler(async (event) => {
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

  return toUserResponse(user) as UserResponse;
});
