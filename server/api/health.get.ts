export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;

  let databaseStatus = "unknown";
  if (db) {
    try {
      await db.prepare("SELECT 1").first();
      databaseStatus = "healthy";
    } catch (e) {
      databaseStatus = "unhealthy";
    }
  }

  return {
    status: databaseStatus === "healthy" ? "healthy" : "degraded",
    database: databaseStatus,
  };
});
