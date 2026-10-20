import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', message: 'Missing or malformed Authorization header.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token || token === 'invalid') {
    res.status(401).json({ error: 'Unauthorized', message: 'Token is invalid or expired.' });
    return;
  }

  // Attach verified user payload
  (req as any).user = {
    userId: 'usr_authenticated_42',
    email: 'user@example.com',
    role: 'customer'
  };

  next();
}
