import type { LoginRequest, TokenResponse } from "~/server/types";
import { login, toUserResponse } from "~/server/services/auth.service";
import { ValidationError } from "~/server/utils/exceptions";

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginRequest>(event);

  // 유효성 검증
  if (!body.email) {
    throw new ValidationError("이메일을 입력해주세요", { field: "email" });
  }

  if (!body.password) {
    throw new ValidationError("비밀번호를 입력해주세요", { field: "password" });
  }

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const { user, tokens } = await login(db, body.email, body.password);

  return {
    ...tokens,
    user: toUserResponse(user),
  } as TokenResponse;
});
