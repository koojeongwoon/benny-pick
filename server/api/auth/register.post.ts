export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, message: "Database binding missing" });
  }

  const body = await readBody(event);
  const { email, password, name } = body;

  if (!email || !password || !name) {
    throw createError({
      statusCode: 400,
      message: "Email, password, and name are required",
    });
  }

  // Check if user exists
  const existingUser = await db
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();
  if (existingUser) {
    throw createError({ statusCode: 400, message: "Email already registered" });
  }

  const passwordHash = await hashPassword(password);

  try {
    const result = await db
      .prepare(
        "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?) RETURNING id, email, name, created_at, is_active, onboarding_completed",
      )
      .bind(email, passwordHash, name)
      .first();

    const accessToken = await generateToken(result.id, result.email);
    const refreshToken = await generateToken(result.id, result.email, "7d");

    setResponseStatus(event, 201);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "bearer",
      expires_in: 1800,
      user: {
        ...result,
        is_active: !!result.is_active,
        onboarding_completed: !!result.onboarding_completed,
        created_at: new Date(result.created_at * 1000).toISOString(),
      },
    };
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      message: e.message || "Failed to register user",
    });
  }
});
