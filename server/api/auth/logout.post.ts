export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);

  // In a stateless JWT implementation, logout usually happens on the client side by deleting the token.
  // However, we satisfy the API spec here.

  return {
    message: "로그아웃 되었습니다",
    user_id: payload ? parseInt(payload.sub as string) : null,
  };
});
