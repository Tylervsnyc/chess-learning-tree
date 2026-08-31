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
  | 'knicks_takeover'
  | 'chess_boxing_launch'
  | 'cb_welcome'
  | 'cb_weekly_report'
  | 'cb_comeback'
  | 'cb_highscore'
  | 'cb_launch_party';

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

// --- Chess Boxing lifecycle ---
// All four are triggered on BOXING behavior (bout_sessions / workout_sessions),
// not general Chess Path activity. See app/api/cron/drip/route.ts.

export interface BoxingLaunchPartyProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
}

export interface BoxingWelcomeProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
  /** Outcome of their first ever bout, so Rookie can react to it. */
  result?: 'win' | 'loss' | 'draw';
  punches?: number;
}

export interface BoxingWeeklyReportProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
  /** Workout sessions in the trailing 7 days (3+ or this email never sends). */
  workouts: number;
  /** Punches thrown across workouts + bouts, trailing 7 days. */
  punches?: number;
  /** Best single round score, trailing 7 days. */
  bestRound?: number;
  currentStreak?: number;
  /** Bout record for the week, only shown if they bouted. */
  wins?: number;
  losses?: number;
  draws?: number;
}

export interface BoxingComebackProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
  bestRound?: number;
  punches?: number;
  bouts?: number;
}

export interface BoxingHighScoreProps {
  displayName?: string;
  appUrl: string;
  unsubscribeUrl: string;
  /** The new personal-best workout score. */
  score: number;
  /** The record it beat, when one existed. */
  previousBest?: number;
}
