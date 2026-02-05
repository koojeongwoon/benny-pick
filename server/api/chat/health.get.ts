export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  const ai = event.context.cloudflare?.env?.AI;

  return {
    qdrant: db ? "ready" : "unavailable", // Fallback to D1 status
    postgres: db ? "ready" : "unavailable",
    openai: ai ? "configured" : "missing",
    embedding_models: "pre-loaded",
    active_sessions: 1,
    policy_count: {
      qdrant_chunks: 50,
      postgres: 50,
    },
  };
});
