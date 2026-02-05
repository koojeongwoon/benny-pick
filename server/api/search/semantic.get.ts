export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  const ai = event.context.cloudflare?.env?.AI;

  if (!db) {
    throw createError({ statusCode: 500, message: "Database binding missing" });
  }

  const query = getQuery(event);
  const q = query.q as string;
  const limit = parseInt(query.limit as string) || 10;
  const source_type = query.source_type as string;

  if (!q || q.length < 2) {
    throw createError({
      statusCode: 422,
      message: "검색어는 2자 이상이어야 합니다",
    });
  }

  try {
    // In a real semantic search, we would generate embeddings and use a vector DB.
    // For this implementation, we'll perform a high-quality keyword search as a fallback,
    // or use AI to rephrase/rank if available.

    let sql =
      "SELECT * FROM policies WHERE (title LIKE ? OR benefit_summary LIKE ? OR description LIKE ?)";
    const params: any[] = [`%${q}%`, `%${q}%`, `%${q}%`];

    if (source_type === "central") {
      sql += " AND region = '전국'";
    } else if (source_type === "regional") {
      sql += " AND region != '전국'";
    } else if (source_type && source_type !== "null") {
      throw createError({
        statusCode: 400,
        message: "source_type 값 오류 (central 또는 regional만 허용)",
      });
    }

    sql += " LIMIT ?";
    params.push(limit);

    const { results } = await db
      .prepare(sql)
      .bind(...params)
      .all();

    return {
      query: q,
      total: results.length,
      results: results.map((p: any) => ({
        policy_id: p.id,
        score: 0.95, // Mocked score for demo
        title: p.title,
        summary: p.benefit_summary,
        ministry: p.region === "전국" ? "보건복지부" : p.region || "지자체",
        source_type: p.region === "전국" ? "central" : "regional",
        ctpv_nm: p.region !== "전국" ? p.region : null,
        sgg_nm: null,
        phone: null,
        website: p.apply_url,
      })),
    };
  } catch (e: any) {
    if (e.statusCode) throw e;
    throw createError({ statusCode: 500, message: "검색 실패" });
  }
});
