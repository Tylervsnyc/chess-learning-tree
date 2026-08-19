/**
 * create-demo-account.ts — idempotently create the Apple App Review demo login.
 *
 * Creates auth user appreview@chesspath.app (email confirmed, fixed password),
 * ensures the profiles row exists (the handle_new_user trigger creates it) with
 * display_name "App Review", then verifies email/password sign-in with the anon key.
 *
 * Does NOT touch subscription_status / is_patron / is_admin (trigger-protected;
 * bouts are not paywalled so Premium is not needed).
 *
 * Run: npx tsx scripts/create-demo-account.ts
 * Throwaway (e.g. to demo account deletion on video):
 *   DEMO_EMAIL=demo-delete@chesspath.app DEMO_PASSWORD=... DEMO_NAME=Throwaway npx tsx scripts/create-demo-account.ts
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const EMAIL = (process.env.DEMO_EMAIL ?? 'appreview@chesspath.app').toLowerCase();
const PASSWORD = process.env.DEMO_PASSWORD ?? 'ChessBoxing-Review-2026!';
const DISPLAY_NAME = process.env.DEMO_NAME ?? 'App Review';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/\s+/g, '');
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/\s+/g, '');
if (!url || !serviceKey || !anonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

async function main() {
  const admin = createClient(url!, serviceKey!, { auth: { persistSession: false } });

  // 1. Find or create the auth user.
  let userId: string | null = null;
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw listErr;
  const existing = list.users.find((u) => u.email?.toLowerCase() === EMAIL);

  if (existing) {
    userId = existing.id;
    const { error } = await admin.auth.admin.updateUserById(userId, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: DISPLAY_NAME },
    });
    if (error) throw error;
    console.log(`Auth user exists (${userId}) — password reset + email confirmed.`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: DISPLAY_NAME },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`Auth user created (${userId}).`);
  }

  // 2. Ensure profiles row (trigger should have made it) + display name.
  const { data: profile } = await admin.from('profiles').select('id, display_name').eq('id', userId).maybeSingle();
  if (!profile) {
    const { error } = await admin.from('profiles').insert({ id: userId, email: EMAIL, display_name: DISPLAY_NAME });
    if (error) throw error;
    console.log('Profile row inserted (trigger did not create it).');
  } else if (profile.display_name !== DISPLAY_NAME) {
    const { error } = await admin.from('profiles').update({ display_name: DISPLAY_NAME }).eq('id', userId);
    if (error) throw error;
    console.log('Profile display_name updated.');
  } else {
    console.log('Profile row OK.');
  }

  // 3. Verify sign-in with the anon key, exactly as the app does.
  const anon = createClient(url!, anonKey!, { auth: { persistSession: false } });
  const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
  if (signInErr || !signIn.session) {
    console.error('Sign-in FAILED:', signInErr?.message);
    process.exit(1);
  }
  console.log(`Sign-in OK — session for ${signIn.user.email}, expires ${new Date(signIn.session.expires_at! * 1000).toISOString()}`);
  console.log(`\nDemo login:\n  email:    ${EMAIL}\n  password: ${PASSWORD}\n  url:      /auth/login`);
}

main().catch((e) => { console.error(e); process.exit(1); });
