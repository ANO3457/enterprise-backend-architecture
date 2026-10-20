import { Router, Request, Response } from 'express';
import { OAuthSecurityService } from '../services/oauth.service';

const router = Router();

router.post('/oauth/callback', (req: Request, res: Response) => {
  const { provider, providerId, email, emailVerified } = req.body;

  const result = OAuthSecurityService.authenticateOAuth({
    provider,
    providerId,
    email,
    emailVerified: Boolean(emailVerified)
  });

  if (result.status === 'REJECTED') {
    res.status(403).json({ error: 'Forbidden', message: result.message });
    return;
  }

  if (result.status === 'REQUIRES_PASSWORD_LINK') {
    res.status(409).json({ error: 'LinkingChallengeRequired', message: result.message });
    return;
  }

  res.status(200).json({ success: true, user: result.user });
});

export default router;
