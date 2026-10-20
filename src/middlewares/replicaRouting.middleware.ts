import { Request, Response, NextFunction } from 'express';
import { DatabaseClusterManager } from '../db/connectionManager';

// Temporary in-memory or Redis session pin tracking
const sessionPinStore: Map<string, number> = new Map();

export function replicaRoutingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const userId = req.headers['x-user-id'] as string || req.ip;
  const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
  const now = Date.now();

  if (isWriteMethod) {
    // Pin user reads to primary for the next 5000ms after any write operation
    sessionPinStore.set(userId, now + 5000);
    const db = DatabaseClusterManager.getPool(true);
    (req as any).db = db;
    res.setHeader('X-DB-Route', 'primary-write');
    next();
    return;
  }

  // Read request: check if user is pinned to primary
  const pinExpiration = sessionPinStore.get(userId);
  const isPinned = pinExpiration && pinExpiration > now;

  const db = DatabaseClusterManager.getPool(Boolean(isPinned));
  (req as any).db = db;
  res.setHeader('X-DB-Route', isPinned ? 'primary-pinned-read' : 'replica-read');

  next();
}
