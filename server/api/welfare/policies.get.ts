export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, message: "Database binding missing" });
  }

  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 10;
  const offset = parseInt(query.offset as string) || 0;

  try {
    const totalCount = await db
      .prepare("SELECT COUNT(*) as count FROM policies")
      .first("count");
    const policies = await db
      .prepare("SELECT * FROM policies LIMIT ? OFFSET ?")
      .bind(limit, offset)
      .all();

    return {
      total: totalCount,
      limit: limit,
      offset: offset,
      policies: policies.results.map((p: any) => ({
        policy_id: p.id,
        title: p.title,
        summary: p.benefit_summary,
        ministry: p.region === "전국" ? "중앙정부" : "지방정부",
        source_type: p.region === "전국" ? "central" : "regional",
        ctpv_nm: p.region !== "전국" ? p.region : null,
        sgg_nm: null,
        support_provision: p.income_limit,
        phone: null,
        website: p.apply_url,
      })),
    };
  } catch (e: any) {
    throw createError({ statusCode: 500, message: "Failed to fetch policies" });
  }
});
