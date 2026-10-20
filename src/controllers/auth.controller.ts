import { Request, Response } from 'express';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password || password.length < 8) {
      res.status(400).json({ error: 'ValidationError', message: 'Password must be at least 8 characters long.' });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      accessToken: 'jwt_access_mock_token_15m',
      refreshToken: 'jwt_refresh_mock_token_7d'
    });
  }

  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (email === 'admin@example.com' && password === 'admin1234') {
      res.status(200).json({
        success: true,
        accessToken: 'jwt_access_mock_token_15m',
        refreshToken: 'jwt_refresh_mock_token_7d'
      });
      return;
    }

    res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
  }
}
