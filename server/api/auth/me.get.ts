export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, message: "Database binding missing" });
  }

  const authHeader = getHeader(event, "Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);
  if (!payload) {
    throw createError({ statusCode: 401, message: "Invalid or expired token" });
  }

  const userId = parseInt(payload.sub as string);

  const user = await db
    .prepare(
      "SELECT u.id, u.email, u.name, u.created_at, u.is_active, u.onboarding_completed, p.region, p.life_cycle, p.interests " +
        "FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.id = ?",
    )
    .bind(userId)
    .first();

  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: new Date(user.created_at * 1000).toISOString(),
    is_active: !!user.is_active,
    onboarding_completed: !!user.onboarding_completed,
    profile: {
      region: user.region,
      life_cycle: user.life_cycle,
      interests: user.interests,
    },
  };
});
