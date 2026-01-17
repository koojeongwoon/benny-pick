import type { PolicyListResponse } from "~/server/types";
import { getPolicies } from "~/server/services/welfare.service";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const limit = Math.min(Math.max(Number(query.limit) || 100, 1), 1000);
  const offset = Math.max(Number(query.offset) || 0, 0);

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const result = await getPolicies(db, limit, offset);

  return result as PolicyListResponse;
});
