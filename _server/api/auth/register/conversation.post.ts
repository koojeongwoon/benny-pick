import type { RegistrationRequest, RegistrationResponse } from "~/server/services/registration.service";
import { registrationConversation } from "~/server/services/registration.service";

export default defineEventHandler(async (event) => {
  const body = await readBody<RegistrationRequest>(event);

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const result = await registrationConversation(db, body);

  // 회원가입 완료 시 201 상태 코드
  if (result.is_completed) {
    setResponseStatus(event, 201);
  }

  return result as RegistrationResponse;
});
