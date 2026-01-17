import type { ConversationRequest, ConversationResponse } from "~/server/types";
import { conversation } from "~/server/services/chat.service";

export default defineEventHandler(async (event) => {
  const body = await readBody<ConversationRequest>(event);

  const db = event.context.cloudflare?.env?.DB;
  if (!db) {
    throw createError({
      statusCode: 500,
      message: "Database connection not available",
    });
  }

  const ai = event.context.cloudflare?.env?.AI;

  const result = await conversation(db, ai, body);

  return result as ConversationResponse;
});
