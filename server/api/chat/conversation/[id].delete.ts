export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, "id");

  return {
    message: "세션이 삭제되었습니다.",
    session_id: sessionId,
  };
});
