export interface DatabasePool {
  query(sql: string, params?: unknown[]): Promise<{ rows: unknown[]; source: 'primary' | 'replica' }>;
}

export class DatabaseClusterManager {
  // Mock primary (write) and replica (read) pool connections
  private static primaryPool: DatabasePool = {
    async query(sql: string, params?: unknown[]) {
      return { rows: [{ executed: true, params }], source: 'primary' };
    }
  };

  private static replicaPool: DatabasePool = {
    async query(sql: string, params?: unknown[]) {
      return { rows: [{ executed: true, params }], source: 'replica' };
    }
  };

  public static getPool(preferPrimary: boolean = false): DatabasePool {
    if (preferPrimary) {
      return this.primaryPool;
    }
    return this.replicaPool;
  }
}
