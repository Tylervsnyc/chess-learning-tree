import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { EmailType } from '@/types/email';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase configuration missing');
  return createClient(url, serviceKey);
}

// Map email types to preference columns
function getPreferenceColumn(emailType: EmailType | undefined): string | null {
  switch (emailType) {
    case 'streak_warning':
    case 'streak_lost':
      return 'streak_warnings';
    case 'weekly_digest':
      return 'weekly_digest';
    case 're_engagement':
      return 'marketing';
    default:
      return null; // Will unsubscribe from all
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const emailType = searchParams.get('type') as EmailType | null;

  if (!userId) {
    return new NextResponse(renderUnsubscribePage({
      success: false,
      message: 'Invalid unsubscribe link',
    }), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const supabase = getServiceClient();
    const preferenceColumn = getPreferenceColumn(emailType || undefined);

    if (preferenceColumn) {
      // Unsubscribe from specific email type
      await supabase
        .from('email_preferences')
        .upsert({
          user_id: userId,
          [preferenceColumn]: false,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });
    } else {
      // Unsubscribe from all emails
      await supabase
        .from('email_preferences')
        .upsert({
          user_id: userId,
          unsubscribed_all: true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });
    }

    return new NextResponse(renderUnsubscribePage({
      success: true,
      message: preferenceColumn
        ? `You've been unsubscribed from ${getEmailTypeName(emailType)} emails.`
        : "You've been unsubscribed from all emails.",
      emailType,
    }), {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse(renderUnsubscribePage({
      success: false,
      message: 'Something went wrong. Please try again.',
    }), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function getEmailTypeName(type: EmailType | null): string {
  switch (type) {
    case 'streak_warning':
    case 'streak_lost':
      return 'streak reminder';
    case 'weekly_digest':
      return 'weekly digest';
    case 're_engagement':
      return 'promotional';
    default:
      return 'these';
  }
}

function renderUnsubscribePage({
  success,
  message,
  emailType,
}: {
  success: boolean;
  message: string;
  emailType?: EmailType | null;
}): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chesspath.app';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - The Chess Path</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0D1A1F;
      color: #FFFFFF;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background-color: #131F24;
      border-radius: 16px;
      padding: 40px;
      max-width: 480px;
      text-align: center;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 16px;
    }
    p {
      color: #B8C5CC;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background-color: #58CC02;
      color: #131F24;
      font-weight: bold;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 16px;
    }
    .button:hover {
      background-color: #4CAF00;
    }
    .error {
      color: #FF4B4B;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${success ? '✓' : '✗'}</div>
    <h1>${success ? 'Unsubscribed' : 'Error'}</h1>
    <p class="${success ? '' : 'error'}">${message}</p>
    ${success ? `
      <p>You can manage your email preferences anytime in your account settings.</p>
    ` : ''}
    <a href="${appUrl}" class="button">Back to The Chess Path</a>
  </div>
</body>
</html>
  `;
}
