export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  federatedIdentities: {
    provider: 'google' | 'github';
    providerId: string;
    linkedAt: Date;
  }[];
}

export const usersDatabase: Map<string, User> = new Map();
