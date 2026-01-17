import type { HealthResponse } from "~/server/types";

export default defineEventHandler((): HealthResponse => {
  return {
    status: "healthy",
  };
});
