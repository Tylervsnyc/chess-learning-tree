import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { captureFirstTouch } from '@/lib/growth/first-touch';
import { isAllowedAppOrigin, applyCorsHeaders, preflightResponse } from '@/lib/net/cors';

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  // The native app shells call this API cross-origin (their pages are served
  // from the device). Browsers preflight anything carrying an Authorization
  // header, so answer that before doing any session work.
  if (isAllowedAppOrigin(origin)) {
    if (request.method === 'OPTIONS') return preflightResponse(request, origin);

    const response = await updateSession(request);
    captureFirstTouch(request, response);
    return applyCorsHeaders(response, origin);
  }

  const response = await updateSession(request);
  // CHE-387: freeze first-touch attribution in a cookie on the first landing
  // (pure cookie/header reads — no extra network calls).
  captureFirstTouch(request, response);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - .bin/.json under public/models (MoveNet weights — no auth call per shard)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|woff|ttf|mp3|wav|mp4|MP4|wasm|onnx|ico|task|js|bin|json)$).*)',
  ],
};
