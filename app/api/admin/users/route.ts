import { NextRequest, NextResponse } from 'next/server';
import { createClient as createAdminClient, SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Lazy initialization of admin client (uses service role key for elevated access)
let supabaseAdmin: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient | null {
  if (supabaseAdmin) return supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  supabaseAdmin = createAdminClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

/**
 * Verify the requesting user is authenticated and has admin privileges
 */
async function verifyAdmin(): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { isAdmin: false, error: 'Unauthorized - please log in' };
    }

    // Check if user has admin flag
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { isAdmin: false, error: 'Could not verify admin status' };
    }

    if (!profile.is_admin) {
      return { isAdmin: false, error: 'Forbidden - admin access required' };
    }

    return { isAdmin: true };
  } catch {
    return { isAdmin: false, error: 'Authentication error' };
  }
}

export async function GET(request: NextRequest) {
  // First verify the user is an admin
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY not configured. Add it to your .env.local file.' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Search for user by email (case-insensitive partial match)
    const { data: users, error } = await admin
      .from('profiles')
      .select('id, email, display_name, subscription_status, subscription_expires_at, created_at')
      .ilike('email', `%${email}%`)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // First verify the user is an admin
  const { isAdmin, error: authError } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: authError },
      { status: authError?.includes('Unauthorized') ? 401 : 403 }
    );
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY not configured. Add it to your .env.local file.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { userId, subscriptionStatus, expiresAt } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (subscriptionStatus !== undefined) {
      const validStatuses = ['free', 'premium'];
      if (!validStatuses.includes(subscriptionStatus)) {
        return NextResponse.json({ error: 'Invalid subscription status' }, { status: 400 });
      }
      updateData.subscription_status = subscriptionStatus;
    }

    if (expiresAt !== undefined) {
      updateData.subscription_expires_at = expiresAt;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    const { data, error } = await admin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Error in admin users PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
