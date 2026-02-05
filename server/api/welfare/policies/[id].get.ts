export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, message: "Database binding missing" });
  }

  const policyId = getRouterParam(event, "id");

  try {
    const p = await db
      .prepare("SELECT * FROM policies WHERE id = ?")
      .bind(policyId)
      .first();

    if (!p) {
      throw createError({ statusCode: 404, message: "Policy not found" });
    }

    return {
      policy_id: p.id,
      title: p.title,
      summary: p.benefit_summary,
      ministry: p.region === "전국" ? "중앙정부" : "지방정부",
      source_type: p.region === "전국" ? "central" : "regional",
      ctpv_nm: p.region !== "전국" ? p.region : null,
      sgg_nm: null,
      support_content: p.description,
      target_detail: `나이: ${p.age_min}~${p.age_max}세, 지역: ${p.region}`,
      application_method: "온라인 신청",
      application_detail: p.apply_url
        ? `홈페이지(${p.apply_url})에서 신청`
        : "공동센터 방문",
      phone: null,
      website: p.apply_url,
    };
  } catch (e: any) {
    if (e.statusCode) throw e;
    throw createError({
      statusCode: 500,
      message: "Failed to fetch policy detail",
    });
  }
});
