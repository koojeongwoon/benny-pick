import type { SearchResponse } from "~/server/types";
import { semanticSearch } from "~/server/services/search.service";
import { ValidationError } from "~/server/utils/exceptions";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const q = String(query.q || "");
  const sourceType = query.source_type as "central" | "regional" | undefined;
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

  if (!q) {
    throw new ValidationError("검색어(q)가 필요합니다", { field: "q" });
  }

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const ai = event.context.cloudflare?.env?.AI;

  const result = await semanticSearch(db, ai, q, sourceType, limit);

  return result as SearchResponse;
});
