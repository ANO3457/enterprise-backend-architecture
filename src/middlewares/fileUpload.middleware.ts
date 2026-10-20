import { Request, Response, NextFunction } from 'express';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function fileUploadSecurityMiddleware(req: Request, res: Response, next: NextFunction): void {
  const mimeType = req.headers['content-type'];
  const contentLength = Number(req.headers['content-length']) || 0;

  if (contentLength > MAX_FILE_SIZE_BYTES) {
    res.status(413).json({ error: 'PayloadTooLarge', message: 'File size exceeds maximum allowed 5MB limit.' });
    return;
  }

  if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
    res.status(415).json({ error: 'UnsupportedMediaType', message: 'Only JPEG, PNG, WEBP and SVG are permitted.' });
    return;
  }

  next();
}
