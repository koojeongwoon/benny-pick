export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { refresh_token } = body;

  if (!refresh_token) {
    throw createError({
      statusCode: 400,
      message: "Refresh token is required",
    });
  }

  const payload = await verifyToken(refresh_token);
  if (!payload) {
    throw createError({
      statusCode: 401,
      message: "Invalid or expired refresh token",
    });
  }

  const userId = parseInt(payload.sub as string);
  const email = payload.email as string;

  const accessToken = await generateToken(userId, email);
  const newRefreshToken = await generateToken(userId, email, "7d");

  return {
    access_token: accessToken,
    refresh_token: newRefreshToken,
    token_type: "bearer",
    expires_in: 1800,
  };
});
