import type { Policy } from "~/server/types";
import { getPolicyById } from "~/server/services/welfare.service";

export default defineEventHandler(async (event) => {
  const policyId = getRouterParam(event, "policy_id");

  if (!policyId) {
    throw createError({
      statusCode: 400,
      message: "정책 ID가 필요합니다",
    });
  }

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const policy = await getPolicyById(db, policyId);

  return policy as Policy;
});
