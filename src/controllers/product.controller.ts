import { Request, Response } from 'express';
import { mockProductDatabase } from '../models/product.model';

// In-memory cache simulation
const productCache: { data: unknown; expiresAt: number } | null = null;

export class ProductController {
  public static async getProducts(req: Request, res: Response): Promise<void> {
    const now = Date.now();

    // Check cache hit
    if (productCache && productCache.expiresAt > now) {
      res.setHeader('X-Cache', 'HIT');
      res.status(200).json({ success: true, source: 'cache', data: productCache.data });
      return;
    }

    // Single batch query resolving N+1
    const products = mockProductDatabase;

    res.setHeader('X-Cache', 'MISS');
    res.status(200).json({ success: true, source: 'database-batch', data: products });
  }
}
