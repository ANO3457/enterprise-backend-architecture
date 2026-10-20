import { Request, Response, NextFunction } from 'express';
import { PIISanitizer } from '../utils/piiSanitizer';

export function auditLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const safeBody = PIISanitizer.sanitize(req.body);
  const safeHeaders = PIISanitizer.sanitize(req.headers);

  // In production, dispatched to structured audit stream
  if (process.env.NODE_ENV !== 'test') {
    console.log(JSON.stringify({
      level: 'info',
      type: 'AUDIT_REQUEST',
      method: req.method,
      url: req.originalUrl,
      headers: safeHeaders,
      body: safeBody,
      timestamp: new Date().toISOString()
    }));
  }

  next();
}
