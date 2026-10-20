import { User, usersDatabase } from '../models/user.model';

export interface OAuthProfile {
  provider: 'google' | 'github';
  providerId: string;
  email: string;
  emailVerified: boolean;
}

export class OAuthSecurityService {
  /**
   * Safe federated authentication preventing pre-account takeover
   */
  public static authenticateOAuth(profile: OAuthProfile): { status: 'SUCCESS' | 'REQUIRES_PASSWORD_LINK' | 'REJECTED'; user?: User; message?: string } {
    if (!profile.emailVerified) {
      return {
        status: 'REJECTED',
        message: 'Unverified email address from identity provider cannot be used for authentication.'
      };
    }

    // Find user by email
    for (const [, user] of usersDatabase) {
      if (user.email === profile.email) {
        // Check if identity already linked
        const isLinked = user.federatedIdentities.some(
          id => id.provider === profile.provider && id.providerId === profile.providerId
        );

        if (isLinked) {
          return { status: 'SUCCESS', user };
        }

        // Account exists with password or other provider -> require explicit password confirmation to link!
        return {
          status: 'REQUIRES_PASSWORD_LINK',
          message: 'Account with this email already exists. Password verification required before linking new provider.'
        };
      }
    }

    // New user auto-registration
    const newUser: User = {
      id: crypto.randomUUID(),
      email: profile.email,
      federatedIdentities: [{ provider: profile.provider, providerId: profile.providerId, linkedAt: new Date() }]
    };
    usersDatabase.set(newUser.id, newUser);
    return { status: 'SUCCESS', user: newUser };
  }
}
