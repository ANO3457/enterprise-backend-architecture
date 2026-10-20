import crypto from 'crypto';

export class WebhookDispatcher {
  /**
   * Signs payload using HMAC-SHA256 with timestamp to mitigate replay attacks
   */
  public static signPayload(payload: string, secret: string, timestamp: number): string {
    const signaturePayload = `${timestamp}.${payload}`;
    return crypto.createHmac('sha256', secret).update(signaturePayload).digest('hex');
  }

  /**
   * Constant-time signature verification preventing timing attacks
   */
  public static verifySignature(payload: string, signature: string, secret: string, timestamp: number, toleranceSeconds: number = 300): boolean {
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > toleranceSeconds) {
      return false; // Replay attack prevention: expired timestamp
    }

    const expectedSignature = this.signPayload(payload, secret, timestamp);
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const actualBuffer = Buffer.from(signature, 'hex');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  }
}
