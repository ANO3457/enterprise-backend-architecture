import { Request, Response, NextFunction } from 'express';
import zlib from 'zlib';

const COMPRESSION_THRESHOLD_BYTES = 1024; // 1 KB threshold

export function adaptiveCompressionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const acceptEncoding = req.headers['accept-encoding'] as string || '';
  const originalJson = res.json.bind(res);

  res.json = (body: unknown): Response => {
    const rawString = JSON.stringify(body);
    const byteLength = Buffer.byteLength(rawString);

    // Skip compression for tiny responses where compression header overhead increases payload size
    if (byteLength < COMPRESSION_THRESHOLD_BYTES) {
      res.setHeader('Content-Type', 'application/json');
      return res.send(rawString);
    }

    if (acceptEncoding.includes('br')) {
      res.setHeader('Content-Encoding', 'br');
      res.setHeader('Content-Type', 'application/json');
      const compressed = zlib.brotliCompressSync(rawString);
      return res.send(compressed);
    }

    if (acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Content-Type', 'application/json');
      const compressed = zlib.gzipSync(rawString);
      return res.send(compressed);
    }

    return originalJson(body);
  };

  next();
}
