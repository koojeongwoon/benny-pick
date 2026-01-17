import type { ChatRequest, ChatResponse } from "~/server/types";
import { chat } from "~/server/services/chat.service";

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

  const result = await chat(db, ai, body);

  return result as ChatResponse;
});
