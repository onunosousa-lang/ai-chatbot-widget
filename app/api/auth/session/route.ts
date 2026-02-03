import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const sessionCookie = (await cookies()).get('session');

  if (!sessionCookie) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    if (verifySession(session)) {
      return NextResponse.json(session);
    }
  } catch (error) {
    console.error('Session verification error:', error);
  }

  return NextResponse.json({ authenticated: false });
}
