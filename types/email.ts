// Email system types for The Chess Path

export type EmailType =
  | 'welcome'
  | 'drip_day1'
  | 'drip_day3'
  | 'drip_day7'
  | 'winback'
  | 'update_april_2026'
  | 'rating_reveal'
  | 'patron_thank_you'
  | 'streak_science'
  | 'knicks_takeover';

export interface EmailPreferences {
  user_id: string;
  streak_warnings: boolean;
  weekly_digest: boolean;
  marketing: boolean;
  unsubscribed_all: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  user_id: string | null;
  email_type: EmailType;
  email_address: string;
  resend_id: string | null;
  status: 'sent' | 'delivered' | 'bounced' | 'failed';
  metadata: Record<string, unknown> | null;
  sent_at: string;
}

export interface SendEmailParams {
  to: string;
  userId?: string;
  type: EmailType;
  subject: string;
  react: React.ReactElement;
  metadata?: Record<string, unknown>;
}

export interface EmailRecipient {
  id: string;
  email: string;
  display_name: string | null;
  current_streak: number;
  last_activity_date: string | null;
  email_preferences: EmailPreferences | null;
}

// Template-specific props
export interface WelcomeProps {
  displayName: string;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface StreakScienceProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface DripDay3Props {
  displayName: string;
  currentLevel: string;
  currentLesson: string;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface DripDay1Props {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface DripDay7Props {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
  // Optional progress signals to personalize the week-one check-in.
  currentStreak?: number;
}

export interface WinbackProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}
