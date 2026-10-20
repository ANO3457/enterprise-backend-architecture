import { Request, Response } from 'express';
import { DistributedLockService } from '../services/redlock.service';

const inventoryDatabase: Record<string, number> = {
  'SKU-IPHONE-16': 1
};

export class OrderController {
  public static async reserveStock(req: Request, res: Response): Promise<void> {
    const { sku, quantity = 1 } = req.body;
    const lockKey = `lock:inventory:${sku}`;

    const lock = await DistributedLockService.acquire(lockKey, 5000);
    if (!lock.acquired) {
      res.status(409).json({
        error: 'Conflict',
        message: 'Stock is currently being processed by another transaction. Please try again.'
      });
      return;
    }

    try {
      const currentStock = inventoryDatabase[sku] ?? 0;
      if (currentStock < quantity) {
        res.status(400).json({ error: 'OutOfStock', message: 'Requested quantity exceeds available stock.' });
        return;
      }

      inventoryDatabase[sku] -= quantity;
      res.status(200).json({
        success: true,
        message: 'Stock successfully reserved.',
        remainingStock: inventoryDatabase[sku]
      });
    } finally {
      await DistributedLockService.release(lockKey, lock.token);
    }
  }
}
