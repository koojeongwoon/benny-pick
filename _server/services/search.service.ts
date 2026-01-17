import type { SearchResult, SearchResponse, SearchHealthResponse } from "~/server/types";
import { ValidationError, ServiceUnavailableError } from "~/server/utils/exceptions";

// 임베딩 서비스 상태 (실제로는 Qdrant 연결 상태)
let embeddingServiceReady = true;

// 시맨틱 검색 수행
export async function semanticSearch(
  db: D1Database,
  ai: any,
  query: string,
  sourceType?: "central" | "regional",
  limit: number = 10
): Promise<SearchResponse> {
  // 유효성 검증
  if (!query || query.length < 2) {
    throw new ValidationError("검색어는 2자 이상이어야 합니다", {
      field: "q",
      value: query,
    });
  }

  if (sourceType && !["central", "regional"].includes(sourceType)) {
    throw new ValidationError(
      "source_type은 'central' 또는 'regional'만 허용됩니다",
      { field: "source_type", value: sourceType }
    );
  }

  // 임베딩 서비스 확인
  if (!embeddingServiceReady) {
    throw new ServiceUnavailableError("검색 서비스가 아직 준비되지 않았습니다");
  }

  // 기본 SQL 검색 (향후 벡터 검색으로 대체)
  // 현재는 LIKE 검색으로 구현
  let sql = `
    SELECT
      policy_id, title, summary, ministry, source_type,
      ctpv_nm, sgg_nm, phone, website
    FROM welfare_policies
    WHERE (title LIKE ? OR summary LIKE ? OR support_content LIKE ?)
  `;
  const searchPattern = `%${query}%`;
  const params: (string | number)[] = [searchPattern, searchPattern, searchPattern];

  if (sourceType) {
    sql += " AND source_type = ?";
    params.push(sourceType);
  }

  sql += " LIMIT ?";
  params.push(limit);

  const { results } = await db
    .prepare(sql)
    .bind(...params)
    .all<SearchResult>();

  // 점수 계산 (간단한 휴리스틱)
  const scoredResults = (results ?? []).map((policy, index) => ({
    ...policy,
    score: Math.max(0.5, 1 - index * 0.05), // 순서 기반 임시 점수
  }));

  return {
    query,
    total: scoredResults.length,
    results: scoredResults,
  };
}

// 검색 서비스 상태 확인
export async function getSearchHealth(
  db: D1Database
): Promise<SearchHealthResponse> {
  let qdrantStatus: "ready" | "unavailable" = "ready";
  let collectionCount = 0;

  try {
    const result = await db
      .prepare("SELECT COUNT(*) as count FROM welfare_policies")
      .first<{ count: number }>();
    collectionCount = result?.count ?? 0;
  } catch {
    qdrantStatus = "unavailable";
  }

  return {
    embedding_service: embeddingServiceReady ? "ready" : "not_loaded",
    qdrant: qdrantStatus,
    collection_count: collectionCount,
  };
}
