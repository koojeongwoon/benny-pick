import type { Policy, PolicyListResponse, PolicyStatsResponse } from "~/server/types";
import { NotFoundError } from "~/server/utils/exceptions";

// 정책 목록 조회
export async function getPolicies(
  db: D1Database,
  limit: number = 100,
  offset: number = 0
): Promise<PolicyListResponse> {
  // 전체 개수 조회
  const countResult = await db
    .prepare("SELECT COUNT(*) as total FROM welfare_policies")
    .first<{ total: number }>();

  const total = countResult?.total ?? 0;

  // 정책 목록 조회
  const { results } = await db
    .prepare(
      `SELECT
        policy_id, title, summary, ministry, source_type,
        ctpv_nm, sgg_nm, support_content, support_provision,
        phone, website
      FROM welfare_policies
      ORDER BY policy_id
      LIMIT ? OFFSET ?`
    )
    .bind(limit, offset)
    .all<Policy>();

  return {
    total,
    limit,
    offset,
    policies: results ?? [],
  };
}

// 정책 상세 조회
export async function getPolicyById(
  db: D1Database,
  policyId: string
): Promise<Policy> {
  const policy = await db
    .prepare(
      `SELECT
        policy_id, title, summary, ministry, source_type,
        ctpv_nm, sgg_nm, support_content, support_provision,
        target_detail, application_method, application_detail,
        phone, website
      FROM welfare_policies
      WHERE policy_id = ?`
    )
    .bind(policyId)
    .first<Policy>();

  if (!policy) {
    throw new NotFoundError("정책을 찾을 수 없습니다", { policy_id: policyId });
  }

  return policy;
}

// 정책 통계 조회
export async function getPolicyStats(
  db: D1Database
): Promise<PolicyStatsResponse> {
  const stats = await db
    .prepare(
      `SELECT
        COUNT(*) as total_policies,
        SUM(CASE WHEN source_type = 'central' THEN 1 ELSE 0 END) as central_policies,
        SUM(CASE WHEN source_type = 'regional' THEN 1 ELSE 0 END) as regional_policies
      FROM welfare_policies`
    )
    .first<{
      total_policies: number;
      central_policies: number;
      regional_policies: number;
    }>();

  return {
    total_policies: stats?.total_policies ?? 0,
    central_policies: stats?.central_policies ?? 0,
    regional_policies: stats?.regional_policies ?? 0,
  };
}
