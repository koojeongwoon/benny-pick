import type { ChatRequest } from "~/server/types";
import { chatStream } from "~/server/services/chat.service";

export default defineEventHandler(async (event) => {
  const body = await readBody<ChatRequest>(event);

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const ai = event.context.cloudflare?.env?.AI;

  // SSE 헤더 설정
  setHeader(event, "Content-Type", "text/event-stream");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");

  // ReadableStream 생성
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of chatStream(db, ai, body)) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        const errorEvent = `event: error\ndata: ${JSON.stringify({ error: "스트리밍 중 오류가 발생했습니다" })}\n\n`;
        controller.enqueue(encoder.encode(errorEvent));
      } finally {
        controller.close();
      }
    },
  });

  return stream;
});
