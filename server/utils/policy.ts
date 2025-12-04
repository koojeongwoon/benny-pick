export const matchPolicies = async (db: any, criteria: any) => {
  // Construct SQL Query
  let query = "SELECT * FROM policies WHERE 1=1";
  const params: any[] = [];

  // 1. Age Check
  if (criteria.age) {
    query +=
      " AND (age_min <= ? OR age_min IS NULL) AND (age_max >= ? OR age_max IS NULL)";
    params.push(criteria.age, criteria.age);
  }

  // 2. Region Check (Simple inclusion)
  if (criteria.region && criteria.region !== "전국") {
    query += " AND (region = '전국' OR region LIKE ?)";
    params.push(`%${criteria.region}%`);
  }

  // 3. Category Check
  if (criteria.category && criteria.category !== "unknown") {
    query += " AND category = ?";
    params.push(criteria.category);
  }

  // Limit results
  query += " LIMIT 5";

  try {
    const { results } = await db
      .prepare(query)
      .bind(...params)
      .all();
    return results || [];
  } catch (e) {
    console.error("Database Error:", e);
    return [];
  }
};
