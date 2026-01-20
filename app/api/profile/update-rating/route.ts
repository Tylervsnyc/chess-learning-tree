import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { elo_rating, onboarding_completed } = body;

    // Validate input
    if (typeof elo_rating !== 'number' || elo_rating < 400 || elo_rating > 2000) {
      return NextResponse.json(
        { error: 'Invalid ELO rating. Must be between 400 and 2000.' },
        { status: 400 }
      );
    }

    // Update the profile
    const updateData: { elo_rating: number; onboarding_completed?: boolean } = {
      elo_rating,
    };

    if (typeof onboarding_completed === 'boolean') {
      updateData.onboarding_completed = onboarding_completed;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: data,
    });
  } catch (error) {
    console.error('Error in update-rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
