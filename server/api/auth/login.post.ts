export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, message: "Database binding missing" });
  }

  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  const user = await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first();
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  if (!user.is_active) {
    throw createError({ statusCode: 401, message: "Account is disabled" });
  }

  const accessToken = await generateToken(user.id, user.email);
  const refreshToken = await generateToken(user.id, user.email, "7d");

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "bearer",
    expires_in: 1800,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: new Date(user.created_at * 1000).toISOString(),
      is_active: !!user.is_active,
      onboarding_completed: !!user.onboarding_completed,
    },
  };
});
