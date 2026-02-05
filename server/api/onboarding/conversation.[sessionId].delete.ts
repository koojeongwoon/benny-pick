export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, "sessionId");

  // In a stateless mock, we don't need to do much.
  // In a real app, delete session data from D1 or KV.

  return {
    message: "온보딩 세션이 삭제되었습니다.",
    session_id: sessionId,
  };
});
