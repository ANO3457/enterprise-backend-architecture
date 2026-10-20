import { Request, Response, NextFunction } from 'express';

// In-memory sliding window rate tracker
const rateLimitStore: Map<string, number[]> = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

export function slidingWindowRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || '127.0.0.1';
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = rateLimitStore.get(ip) || [];
  const validTimestamps = timestamps.filter(ts => ts > windowStart);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    res.setHeader('Retry-After', '60');
    res.status(429).json({
      error: 'TooManyRequests',
      message: 'Rate limit exceeded. Please wait 60 seconds before retrying.'
    });
    return;
  }

  validTimestamps.push(now);
  rateLimitStore.set(ip, validTimestamps);

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
  res.setHeader('X-RateLimit-Remaining', (MAX_REQUESTS_PER_WINDOW - validTimestamps.length).toString());

  next();
}
