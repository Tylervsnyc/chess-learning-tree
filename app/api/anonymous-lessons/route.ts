import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'anon_lessons';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * API for tracking anonymous user lesson limits via httpOnly cookies.
 * This prevents users from bypassing limits by clearing localStorage.
 */

// GET - Returns the current anonymous lesson count from cookie
export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);

  let count = 0;
  if (cookie?.value) {
    try {
      count = parseInt(cookie.value, 10) || 0;
    } catch {
      count = 0;
    }
  }

  return NextResponse.json({ lessonsCompleted: count });
}

// POST - Increments the anonymous lesson count
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(COOKIE_NAME);

  let currentCount = 0;
  if (existingCookie?.value) {
    try {
      currentCount = parseInt(existingCookie.value, 10) || 0;
    } catch {
      currentCount = 0;
    }
  }

  const newCount = currentCount + 1;

  // Create response and set httpOnly cookie
  const response = NextResponse.json({ lessonsCompleted: newCount });

  response.cookies.set(COOKIE_NAME, newCount.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}
