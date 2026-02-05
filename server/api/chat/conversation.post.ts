export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, session_id } = body;

  const sessionId = session_id || crypto.randomUUID();

  // Mocking the LangGraph-style conversation logic
  const isReadyToSearch = message.includes("서울") || message.includes("청년");

  return {
    response: isReadyToSearch
      ? "서울, 청년 조건으로 검색합니다. [검색 결과 요약...]"
      : "원활한 추천을 위해 어느 지역에 거주하시는지 알려주실 수 있나요?",
    session_id: sessionId,
    intent: "welfare_search",
    ready_to_search: isReadyToSearch,
    user_profile: {
      region: message.includes("서울") ? "서울" : "",
      life_cycle: message.includes("청년") ? "청년" : "",
    },
    sources: isReadyToSearch ? [] : null,
  };
});
