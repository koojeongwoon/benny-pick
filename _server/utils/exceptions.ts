import { H3Error, createError } from "h3";

// Base exception class
export class TQBaseException extends Error {
  statusCode: number;
  errorCode: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = "INTERNAL_ERROR",
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }

  toH3Error(): H3Error {
    return createError({
      statusCode: this.statusCode,
      statusMessage: this.errorCode,
      message: this.message,
      data: this.details,
    });
  }
}

// 404 - Resource not found
export class NotFoundError extends TQBaseException {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 404, "NOT_FOUND", details);
  }
}

// 400 - Validation error
export class ValidationError extends TQBaseException {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

// 401 - Authentication error
export class AuthenticationError extends TQBaseException {
  constructor(
    message: string = "인증에 실패했습니다",
    details?: Record<string, unknown>
  ) {
    super(message, 401, "AUTHENTICATION_ERROR", details);
  }
}

// 403 - Authorization error
export class AuthorizationError extends TQBaseException {
  constructor(
    message: string = "권한이 없습니다",
    details?: Record<string, unknown>
  ) {
    super(message, 403, "AUTHORIZATION_ERROR", details);
  }
}

// 503 - Service unavailable
export class ServiceUnavailableError extends TQBaseException {
  constructor(
    message: string = "서비스를 일시적으로 이용할 수 없습니다",
    details?: Record<string, unknown>
  ) {
    super(message, 503, "SERVICE_UNAVAILABLE", details);
  }
}

// Helper to format error response
export function formatErrorResponse(
  error: TQBaseException | Error,
  path: string
) {
  if (error instanceof TQBaseException) {
    return {
      error: {
        code: error.errorCode,
        message: error.message,
        details: error.details,
        path,
      },
    };
  }

  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "서버 내부 오류가 발생했습니다",
      path,
    },
  };
}
