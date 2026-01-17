import type { SearchHealthResponse } from "~/server/types";
import { getSearchHealth } from "~/server/services/search.service";

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    return {
      embedding_service: "not_loaded",
      qdrant: "unavailable",
      collection_count: 0,
    } as SearchHealthResponse;
  }

  const health = await getSearchHealth(db);

  return health as SearchHealthResponse;
});
