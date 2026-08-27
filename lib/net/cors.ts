import { NextResponse, type NextRequest } from 'next/server';

/**
 * Cross-origin access for the native app shells.
 *
 * On the web the app and the API share an origin, so none of this applies.
 * The Chess Boxing iOS app serves its pages off the device, so every call to
 * chesspath.app/api is cross-origin and needs an explicit grant.
 *
 * The allowlist is exact-match and tiny on purpose — these are the only origins
 * Capacitor can produce for our shells, and `*` would open the API to every
 * site on the internet.
 */
const ALLOWED_ORIGINS = new Set([
  'capacitor://localhost', // iOS
  'http://localhost',      // Android
  'ionic://localhost',     // older Capacitor iOS shells
]);

export function isAllowedAppOrigin(origin: string | null): origin is string {
  return !!origin && ALLOWED_ORIGINS.has(origin);
}

export function applyCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set('Access-Control-Allow-Origin', origin);
  // The app authenticates with a bearer token, not cookies — but credentials
  // stays on so an origin that CAN send cookies isn't silently downgraded.
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Vary', 'Origin');
  return response;
}

/**
 * Answer the preflight the browser sends before any request carrying an
 * Authorization header. Without this every app write fails before it is made.
 */
export function preflightResponse(request: NextRequest, origin: string) {
  const response = new NextResponse(null, { status: 204 });
  applyCorsHeaders(response, origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    request.headers.get('access-control-request-headers') || 'authorization,content-type'
  );
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}
