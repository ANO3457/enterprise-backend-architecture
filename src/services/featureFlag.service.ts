import crypto from 'crypto';

export class FeatureFlagEngine {
  private static readonly SALT = process.env.FEATURE_FLAG_HASH_SALT || 'enterprise_salt_v1';

  /**
   * Deterministic 0-100 bucketing using consistent SHA256/Murmur-like hashing
   */
  public static getUserBucket(userId: string, flagName: string): number {
    const combined = `${this.SALT}:${flagName}:${userId}`;
    const hash = crypto.createHash('sha256').update(combined).digest('hex');
    const numericValue = parseInt(hash.substring(0, 8), 16);
    return numericValue % 100; // Returns 0 - 99
  }

  /**
   * Evaluate if user falls within the target rollout percentage
   */
  public static isEnabled(flagName: string, userId: string, percentage: number): boolean {
    if (percentage <= 0) return false;
    if (percentage >= 100) return true;

    const userBucket = this.getUserBucket(userId, flagName);
    return userBucket < percentage;
  }
}
