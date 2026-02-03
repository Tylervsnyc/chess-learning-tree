// Email system types for The Chess Path

export type EmailType =
  | 'streak_warning'
  | 'streak_lost'
  | 'weekly_digest'
  | 'welcome'
  | 're_engagement';

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
export interface StreakWarningProps {
  displayName: string;
  currentStreak: number;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface StreakLostProps {
  displayName: string;
  lostStreak: number;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface WeeklyDigestProps {
  displayName: string;
  puzzlesSolved: number;
  accuracy: number;
  currentStreak: number;
  eloChange: number;
  topTheme: string | null;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface WelcomeProps {
  displayName: string;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface ReEngagementProps {
  displayName: string;
  daysSinceLastPlay: number;
  previousStreak: number;
  appUrl: string;
  unsubscribeUrl: string;
}
