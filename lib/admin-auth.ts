import { createClient } from '@/lib/supabase/server';

/**
 * Verify the requesting user is authenticated and has admin privileges.
 * Shared across all /api/admin/* routes.
 */
export async function verifyAdmin(): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { isAdmin: false, error: 'Unauthorized - please log in' };
    }

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
