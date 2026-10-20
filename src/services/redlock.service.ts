import crypto from 'crypto';

export class DistributedLockService {
  private static locks: Map<string, { token: string; expiresAt: number }> = new Map();

  /**
   * Acquire a distributed lock with unique token
   */
  public static async acquire(resource: string, ttlMs: number = 5000): Promise<{ acquired: boolean; token: string }> {
    const token = crypto.randomUUID();
    const now = Date.now();
    const existing = this.locks.get(resource);

    if (existing && existing.expiresAt > now) {
      return { acquired: false, token: '' };
    }

    this.locks.set(resource, { token, expiresAt: now + ttlMs });
    return { acquired: true, token };
  }

  /**
   * Atomic Lua-like release: only delete if the token matches
   */
  public static async release(resource: string, token: string): Promise<boolean> {
    const current = this.locks.get(resource);
    if (!current) {
      return false;
    }

    // Prevents deleting another client's acquired lock
    if (current.token === token) {
      this.locks.delete(resource);
      return true;
    }

    return false;
  }
}
