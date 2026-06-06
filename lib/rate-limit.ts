const requests = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple in-memory rate limiter for API routes
 * @param ip - Client IP address string
 * @param limit - Maximum number of requests per window (default 20)
 * @param windowMs - Time window in milliseconds (default 60000)
 * @returns true if request is allowed, false if rate limited
 */
export function rateLimit(ip: string, limit = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const record = requests.get(ip);
  if (!record || now > record.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}
