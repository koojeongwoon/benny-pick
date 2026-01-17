import { TQBaseException, formatErrorResponse } from "~/server/utils/exceptions";

export default defineEventHandler((event) => {
  // 에러 핸들링은 onError 훅에서 처리
  event.node.res.on("error", () => {
    // 에러 로깅
  });
});

// 에러 핸들러 플러그인
export function handleError(error: unknown, event: any) {
  const path = getRequestURL(event).pathname;

  if (error instanceof TQBaseException) {
    setResponseStatus(event, error.statusCode);
    return formatErrorResponse(error, path);
  }

  // H3 에러 처리
  if (error && typeof error === "object" && "statusCode" in error) {
    const h3Error = error as { statusCode: number; message?: string };
    setResponseStatus(event, h3Error.statusCode);
    return {
      error: {
        code: "HTTP_ERROR",
        message: h3Error.message || "오류가 발생했습니다",
        path,
      },
    };
  }

  // 기타 에러
  console.error("Unhandled error:", error);
  setResponseStatus(event, 500);
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "서버 내부 오류가 발생했습니다",
      path,
    },
  };
}
