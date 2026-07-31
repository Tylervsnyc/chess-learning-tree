import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { captureFirstTouch } from '@/lib/growth/first-touch';

export async function middleware(request: NextRequest) {
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
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2|woff|ttf|mp3|wav|mp4|MP4|wasm|onnx|ico|task|js)$).*)',
  ],
};
