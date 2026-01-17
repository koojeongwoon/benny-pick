import { deleteRegistrationSession } from "~/server/services/registration.service";
import { NotFoundError } from "~/server/utils/exceptions";

export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, "session_id");

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      message: "세션 ID가 필요합니다",
    });
  }

  const deleted = deleteRegistrationSession(sessionId);

  if (!deleted) {
    throw new NotFoundError("세션을 찾을 수 없습니다", {
      session_id: sessionId,
    });
  }

  return {
    message: "회원가입 세션이 삭제되었습니다.",
  };
});
