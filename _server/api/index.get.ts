import type { RootResponse } from "~/server/types";

export default defineEventHandler((): RootResponse => {
  return {
    message: "TQ Data Platform API",
    version: "0.1.0",
    status: "running",
  };
});
