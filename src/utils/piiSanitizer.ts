export class PIISanitizer {
  private static readonly SENSITIVE_KEYS = new Set([
    'password',
    'token',
    'secret',
    'cardnumber',
    'creditcard',
    'cvv',
    'nationalid',
    'ssn',
    'tckn',
    'authorization'
  ]);

  private static readonly CREDIT_CARD_REGEX = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;

  /**
   * Deep recursive object sanitizer for KVKK / GDPR compliance
   */
  public static sanitize<T>(target: T): T {
    if (target === null || target === undefined) {
      return target;
    }

    if (typeof target === 'string') {
      return target.replace(this.CREDIT_CARD_REGEX, '****-****-****-****') as unknown as T;
    }

    if (Array.isArray(target)) {
      return target.map(item => this.sanitize(item)) as unknown as T;
    }

    if (typeof target === 'object') {
      const sanitizedObj: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(target)) {
        const lowerKey = key.toLowerCase();
        if (this.SENSITIVE_KEYS.has(lowerKey)) {
          sanitizedObj[key] = '***REDACTED***';
        } else {
          sanitizedObj[key] = this.sanitize(value);
        }
      }
      return sanitizedObj as T;
    }

    return target;
  }
}
