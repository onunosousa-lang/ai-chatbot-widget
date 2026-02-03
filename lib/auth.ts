import bcrypt from 'bcryptjs';

export interface Session {
  authenticated: boolean;
  username?: string;
}

export function validateCredentials(username: string, password: string): boolean {
  const envUsername = process.env.ADMIN_USERNAME || 'admin';
  const envPassword = process.env.ADMIN_PASSWORD || 'admin123';

  return username === envUsername && password === envPassword;
}

export function createSession(): Session {
  return {
    authenticated: true,
    username: process.env.ADMIN_USERNAME || 'admin',
  };
}

export function verifySession(session: any): boolean {
  return session?.authenticated === true;
}
