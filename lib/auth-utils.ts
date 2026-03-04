/**
 * Convert Supabase auth error messages to user-friendly text.
 * Shared between login and signup pages.
 */
export function humanizeAuthError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Wrong email or password. Please try again.';
  if (msg.includes('Email not confirmed')) return 'Please check your email to confirm your account.';
  if (msg.includes('Password should be at least')) return 'Password must be at least 6 characters.';
  if (msg.includes('Unable to validate email')) return 'Please enter a valid email address.';
  if (msg.includes('User already registered')) return 'An account with this email already exists.';
  if (msg.includes('Email rate limit exceeded')) return 'Too many attempts. Please wait a minute and try again.';
  if (msg.includes('For security purposes')) return 'Too many attempts. Please wait a moment and try again.';
  return msg;
}
