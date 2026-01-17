import type { User, UserResponse, TokenResponse } from "~/server/types";
import { AuthenticationError, ValidationError } from "~/server/utils/exceptions";

// JWT 설정
const ACCESS_TOKEN_EXPIRES = 30 * 60; // 30분 (초)
const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60; // 7일 (초)

// 간단한 세션 저장소 (실제로는 Redis나 DB 사용)
const sessions = new Map<string, { userId: number; expiresAt: number }>();
const refreshTokens = new Map<string, { userId: number; expiresAt: number }>();

// 비밀번호 해싱 (실제로는 bcrypt 사용)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt_key_here");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// 토큰 생성
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// User를 UserResponse로 변환
export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    is_active: user.is_active,
  };
}

// 사용자 생성
export async function createUser(
  db: D1Database,
  email: string,
  password: string,
  name: string
): Promise<User> {
  // 이메일 중복 확인
  const existing = await db
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (existing) {
    throw new ValidationError("이미 등록된 이메일입니다", { email });
  }

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  const result = await db
    .prepare(
      `INSERT INTO users (email, password_hash, name, created_at, is_active)
       VALUES (?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(email, passwordHash, name, now, true)
    .first<User>();

  if (!result) {
    throw new Error("사용자 생성에 실패했습니다");
  }

  return result;
}

// 로그인
export async function login(
  db: D1Database,
  email: string,
  password: string
): Promise<{ user: User; tokens: TokenResponse }> {
  const user = await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first<User>();

  if (!user) {
    throw new AuthenticationError("이메일 또는 비밀번호가 올바르지 않습니다");
  }

  if (!user.is_active) {
    throw new AuthenticationError("비활성화된 계정입니다");
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new AuthenticationError("이메일 또는 비밀번호가 올바르지 않습니다");
  }

  const tokens = createTokens(user.id);

  return { user, tokens };
}

// 토큰 생성
export function createTokens(userId: number): TokenResponse {
  const accessToken = generateToken();
  const refreshToken = generateToken();
  const now = Date.now();

  // 세션 저장
  sessions.set(accessToken, {
    userId,
    expiresAt: now + ACCESS_TOKEN_EXPIRES * 1000,
  });

  refreshTokens.set(refreshToken, {
    userId,
    expiresAt: now + REFRESH_TOKEN_EXPIRES * 1000,
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: "bearer",
    expires_in: ACCESS_TOKEN_EXPIRES,
  };
}

// 토큰 갱신
export async function refreshAccessToken(
  db: D1Database,
  refreshToken: string
): Promise<TokenResponse> {
  const session = refreshTokens.get(refreshToken);

  if (!session || session.expiresAt < Date.now()) {
    refreshTokens.delete(refreshToken);
    throw new AuthenticationError("유효하지 않거나 만료된 리프레시 토큰입니다");
  }

  // 기존 리프레시 토큰 무효화 (Rotation)
  refreshTokens.delete(refreshToken);

  // 새 토큰 쌍 생성
  return createTokens(session.userId);
}

// 액세스 토큰으로 사용자 조회
export async function getUserByAccessToken(
  db: D1Database,
  accessToken: string
): Promise<User> {
  const session = sessions.get(accessToken);

  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(accessToken);
    throw new AuthenticationError("유효하지 않거나 만료된 토큰입니다");
  }

  const user = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(session.userId)
    .first<User>();

  if (!user) {
    throw new AuthenticationError("사용자를 찾을 수 없습니다");
  }

  return user;
}

// 로그아웃
export function logout(accessToken: string): { userId: number } | null {
  const session = sessions.get(accessToken);
  if (session) {
    sessions.delete(accessToken);
    return { userId: session.userId };
  }
  return null;
}

// Authorization 헤더에서 토큰 추출
export function extractBearerToken(authHeader: string | null): string {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("인증 토큰이 필요합니다");
  }
  return authHeader.substring(7);
}
