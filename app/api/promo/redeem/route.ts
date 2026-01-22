import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a promo code' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to redeem a code' },
        { status: 401 }
      );
    }

    // Normalize the code (uppercase, trim whitespace)
    const normalizedCode = code.trim().toUpperCase();

    // Find the promo code
    const { data: promoCode, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .single();

    if (promoError || !promoCode) {
      return NextResponse.json(
        { error: 'Invalid promo code' },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This promo code has expired' },
        { status: 400 }
      );
    }

    // Check if code has reached max uses
    if (promoCode.max_uses !== null && promoCode.current_uses >= promoCode.max_uses) {
      return NextResponse.json(
        { error: 'This promo code has reached its maximum uses' },
        { status: 400 }
      );
    }

    // Check if user already redeemed this code
    const { data: existingRedemption } = await supabase
      .from('promo_redemptions')
      .select('id')
      .eq('promo_code_id', promoCode.id)
      .eq('user_id', user.id)
      .single();

    if (existingRedemption) {
      return NextResponse.json(
        { error: 'You have already redeemed this code' },
        { status: 400 }
      );
    }

    // Calculate new expiration date
    const now = new Date();
    const expiresAt = new Date(now.getTime() + promoCode.premium_days * 24 * 60 * 60 * 1000);

    // Check if user already has premium - extend if so
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_expires_at')
      .eq('id', user.id)
      .single();

    let newExpiresAt = expiresAt;
    if (profile?.subscription_expires_at) {
      const currentExpiry = new Date(profile.subscription_expires_at);
      if (currentExpiry > now) {
        // Extend existing premium
        newExpiresAt = new Date(currentExpiry.getTime() + promoCode.premium_days * 24 * 60 * 60 * 1000);
      }
    }

    // Update or create user's profile with premium status using admin client (bypasses RLS)
    const adminClient = createAdminClient();
    const { error: updateError } = await adminClient
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        subscription_status: 'premium',
        subscription_expires_at: newExpiresAt.toISOString(),
      }, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to apply promo code. Please try again.' },
        { status: 500 }
      );
    }

    // Record the redemption
    const { error: redemptionError } = await supabase
      .from('promo_redemptions')
      .insert({
        promo_code_id: promoCode.id,
        user_id: user.id,
      });

    if (redemptionError) {
      console.error('Error recording redemption:', redemptionError);
      // Don't fail the whole request - the user already got premium
    }

    // Increment the usage count
    await supabase
      .from('promo_codes')
      .update({ current_uses: promoCode.current_uses + 1 })
      .eq('id', promoCode.id);

    return NextResponse.json({
      success: true,
      message: `Success! You now have ${promoCode.premium_days} days of premium access.`,
      expiresAt: newExpiresAt.toISOString(),
      premiumDays: promoCode.premium_days,
    });

  } catch (error) {
    console.error('Promo redemption error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
