import { Request, Response, NextFunction } from 'express';
import { tenantStorage } from '../context/tenantContext';
import crypto from 'crypto';

export function tenantIsolationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const tenantId = (req.headers['x-tenant-id'] as string) || 'default_tenant';
  const correlationId = (req.headers['x-correlation-id'] as string) || crypto.randomUUID();

  const store = {
    tenantId,
    schema: `tenant_${tenantId.replace(/[^a-zA-Z0-9_]/g, '')}`,
    correlationId
  };

  // Run the rest of the request within the isolated async context
  tenantStorage.run(store, () => {
    res.setHeader('X-Tenant-ID', tenantId);
    res.setHeader('X-Correlation-ID', correlationId);
    next();
  });
}
