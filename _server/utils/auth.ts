import { SignJWT, jwtVerify } from "jose";

// In a real app, this should be in runtimeConfig or environment variables
const JWT_SECRET = new TextEncoder().encode(
  "your-very-secure-secret-key-change-this",
);

export const generateToken = async (
  userId: number,
  email: string,
  expiresIn: string = "30m",
) => {
  return await new SignJWT({ sub: userId.toString(), email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (e) {
    return null;
  }
};

export const hashPassword = async (password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const comparePassword = async (password: string, hash: string) => {
  const currentHash = await hashPassword(password);
  return currentHash === hash;
};
