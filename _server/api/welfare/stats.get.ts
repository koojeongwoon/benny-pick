import type { PolicyStatsResponse } from "~/server/types";
import { getPolicyStats } from "~/server/services/welfare.service";

export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const stats = await getPolicyStats(db);

  return stats as PolicyStatsResponse;
});
