import { Request, Response } from 'express';

// Idempotency cache simulation (Redis in production)
const idempotencyStore: Map<string, { status: string; chargeId: string; timestamp: number }> = new Map();

export class PaymentController {
  public static async processPayment(req: Request, res: Response): Promise<void> {
    const idempotencyKey = req.headers['idempotency-key'] as string;
    const { amount, currency } = req.body;

    if (!idempotencyKey) {
      res.status(400).json({ error: 'MissingHeader', message: 'Idempotency-Key header is required.' });
      return;
    }

    // Check if charge was already processed
    const cachedCharge = idempotencyStore.get(idempotencyKey);
    if (cachedCharge) {
      res.status(200).json({
        success: true,
        replayed: true,
        message: 'Payment already processed with this key.',
        chargeId: cachedCharge.chargeId
      });
      return;
    }

    // Simulate charging credit card via Stripe
    const newChargeId = `ch_live_${crypto.randomUUID()}`;
    idempotencyStore.set(idempotencyKey, {
      status: 'succeeded',
      chargeId: newChargeId,
      timestamp: Date.now()
    });

    res.status(200).json({
      success: true,
      replayed: false,
      chargeId: newChargeId,
      amount,
      currency
    });
  }
}
