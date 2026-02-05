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
  const body = await readBody(event);
  const { profile } = body;

  try {
    // Save profile and update user status in a transaction (not fully supported in prepare, but we can do sequential)
    await db
      .prepare(
        "INSERT OR REPLACE INTO profiles (user_id, region, life_cycle, interests) VALUES (?, ?, ?, ?)",
      )
      .bind(
        userId,
        profile?.region || null,
        profile?.life_cycle || null,
        profile?.interests || null,
      )
      .run();

    await db
      .prepare("UPDATE users SET onboarding_completed = 1 WHERE id = ?")
      .bind(userId)
      .run();

    const user = await db
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(userId)
      .first();

    return {
      message: "온보딩이 완료되었습니다.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboarding_completed: true,
        profile: profile,
      },
    };
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      message: "Failed to complete onboarding",
    });
  }
});
