import type { ChatHealthResponse } from "~/server/types";
import { getChatHealth } from "~/server/services/chat.service";

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    return {
      qdrant: "unavailable",
      postgres: "unavailable",
      openai: "not_configured",
      embedding_models: "not_loaded",
      active_sessions: 0,
      policy_count: {
        qdrant_chunks: 0,
        postgres: 0,
      },
    } as ChatHealthResponse;
  }

  const health = await getChatHealth(db);

  return health as ChatHealthResponse;
});
