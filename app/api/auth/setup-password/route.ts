import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName, sessionId } = await request.json();

    if (!email || !password || !sessionId) {
      return NextResponse.json(
        { error: 'Email, password, and session ID are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Verify the Stripe session is valid and matches the email
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const sessionEmail = session.customer_email || session.metadata?.guest_email;

    if (sessionEmail?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match the checkout session' },
        { status: 400 }
      );
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Find user by email via profiles table (avoids loading all users)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (!profile) {
      return NextResponse.json(
        { error: 'Account not found. Please wait a moment and try again.' },
        { status: 404 }
      );
    }

    // Fetch auth user for metadata
    const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
    const user = authUser?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Account not found. Please wait a moment and try again.' },
        { status: 404 }
      );
    }

    // Update user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      user_metadata: {
        ...user.user_metadata,
        display_name: displayName || user.user_metadata?.display_name,
        password_set: true,
      },
    });

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Failed to set password' },
        { status: 500 }
      );
    }

    // Update profile with display name
    if (displayName) {
      await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Setup password error:', error);
    return NextResponse.json(
      { error: 'Failed to set up account' },
      { status: 500 }
    );
  }
}
