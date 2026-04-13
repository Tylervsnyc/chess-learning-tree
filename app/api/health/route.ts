import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Returns status of all critical env vars and external services.
 * No auth required — only reports presence, never values.
 */

interface EnvCheck {
  name: string;
  set: boolean;
  critical: boolean;
}

export async function GET() {
  const checks: EnvCheck[] = [
    // Critical — app breaks without these
    { name: 'ANTHROPIC_API_KEY', set: !!process.env.ANTHROPIC_API_KEY, critical: true },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', set: !!process.env.NEXT_PUBLIC_SUPABASE_URL, critical: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, critical: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', set: !!process.env.SUPABASE_SERVICE_ROLE_KEY, critical: true },
    { name: 'STRIPE_SECRET_KEY', set: !!process.env.STRIPE_SECRET_KEY, critical: true },
    { name: 'STRIPE_WEBHOOK_SECRET', set: !!process.env.STRIPE_WEBHOOK_SECRET, critical: true },
    { name: 'CRON_SECRET', set: !!process.env.CRON_SECRET, critical: true },
    { name: 'RESEND_API_KEY', set: !!process.env.RESEND_API_KEY, critical: true },

    // Semi-critical — core features broken
    { name: 'HONCHO_API_KEY', set: !!process.env.HONCHO_API_KEY, critical: false },
    { name: 'LICHESS_TOKEN', set: !!process.env.LICHESS_TOKEN, critical: false },
    { name: 'ELEVENLABS_API_KEY', set: !!process.env.ELEVENLABS_API_KEY, critical: false },
    { name: 'ELEVENLABS_VOICE_ID', set: !!process.env.ELEVENLABS_VOICE_ID, critical: false },
    { name: 'POSTHOG_PERSONAL_API_KEY', set: !!process.env.POSTHOG_PERSONAL_API_KEY, critical: false },
    { name: 'LINEAR_API_KEY', set: !!process.env.LINEAR_API_KEY, critical: false },
    { name: 'LATE_API_KEY', set: !!process.env.LATE_API_KEY, critical: false },
  ];

  const missing = checks.filter(c => !c.set);
  const criticalMissing = missing.filter(c => c.critical);

  return NextResponse.json({
    status: criticalMissing.length === 0 ? 'ok' : 'critical',
    missing: missing.map(c => ({ name: c.name, critical: c.critical })),
    total: checks.length,
    set: checks.filter(c => c.set).length,
  });
}
