export default defineEventHandler(async (event) => {
  const ai = event.context.cloudflare?.env?.AI;
  const db = event.context.cloudflare?.env?.DB;

  return {
    embedding_service: ai ? "ready" : "not_loaded",
    qdrant: db ? "ready" : "unavailable", // Using D1 as the backend storage here
    collection_count: 50, // Mocked from seed data
  };
});
