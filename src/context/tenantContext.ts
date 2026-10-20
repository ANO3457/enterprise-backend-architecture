import { AsyncLocalStorage } from 'async_hooks';

export interface TenantStore {
  tenantId: string;
  schema: string;
  correlationId: string;
}

// Thread-safe async context storage preventing cross-tenant data leaks in Node.js
export const tenantStorage = new AsyncLocalStorage<TenantStore>();

export class TenantContext {
  public static current(): TenantStore {
    const store = tenantStorage.getStore();
    if (!store) {
      throw new Error('TenantContextError: Attempted to execute database operation without an active tenant context.');
    }
    return store;
  }

  public static getTenantId(): string {
    return this.current().tenantId;
  }
}
