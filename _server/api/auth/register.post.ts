import type { UserCreate, TokenResponse } from "~/server/types";
import {
  createUser,
  createTokens,
  toUserResponse,
} from "~/server/services/auth.service";
import { ValidationError } from "~/server/utils/exceptions";

export default defineEventHandler(async (event) => {
  const body = await readBody<UserCreate>(event);

  // 유효성 검증
  if (!body.email || !body.email.includes("@")) {
    throw new ValidationError("유효한 이메일 주소를 입력해주세요", {
      field: "email",
    });
  }

  if (!body.password || body.password.length < 8) {
    throw new ValidationError("비밀번호는 최소 8자 이상이어야 합니다", {
      field: "password",
    });
  }

  if (!body.name || body.name.length < 2 || body.name.length > 50) {
    throw new ValidationError("이름은 2-50자 사이여야 합니다", {
      field: "name",
    });
  }

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const user = await createUser(db, body.email, body.password, body.name);
  const tokens = createTokens(user.id);

  setResponseStatus(event, 201);

  return {
    ...tokens,
    user: toUserResponse(user),
  } as TokenResponse;
});
