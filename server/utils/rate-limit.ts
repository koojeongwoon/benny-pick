const requestLog = new Map<string, number[]>();
const LIMIT = 5; // Requests
const WINDOW = 60 * 1000; // 1 Minute

export const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];

  // Filter out timestamps older than the window
  const validTimestamps = timestamps.filter((ts) => now - ts < WINDOW);

  if (validTimestamps.length >= LIMIT) {
    return false;
  }

  validTimestamps.push(now);
  requestLog.set(ip, validTimestamps);

  // Cleanup map periodically (optional optimization)
  if (requestLog.size > 1000) {
    for (const [key, tsList] of requestLog.entries()) {
      if (tsList.every((ts) => now - ts >= WINDOW)) {
        requestLog.delete(key);
      }
    }
  }

  return true;
};
