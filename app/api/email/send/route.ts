import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, getUnsubscribeUrl, getAppUrl } from '@/lib/email/send';
import { Welcome } from '@/lib/email/templates/Welcome';
import type { EmailType } from '@/types/email';

// This route is for internal use (triggered by signup, etc.)
// It should be protected by a secret or only called from server-side code

function verifyInternalSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET; // Reuse cron secret for internal calls
  return authHeader === `Bearer ${secret}`;
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase configuration missing');
  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  // Verify authorization
  if (!verifyInternalSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, emailType } = body as { userId: string; emailType: EmailType };

    if (!userId || !emailType) {
      return NextResponse.json(
        { error: 'Missing userId or emailType' },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    const appUrl = getAppUrl();

    // Get user data
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .eq('id', userId)
      .single();

    if (error || !user || !user.email) {
      return NextResponse.json(
        { error: 'User not found or no email' },
        { status: 404 }
      );
    }

    let result;

    switch (emailType) {
      case 'welcome':
        result = await sendEmail({
          to: user.email,
          userId: user.id,
          type: 'welcome',
          subject: 'Welcome to The Chess Path!',
          react: Welcome({
            displayName: user.display_name || 'Chess Player',
            appUrl,
            unsubscribeUrl: getUnsubscribeUrl(user.id),
          }),
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported email type: ${emailType}` },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
