'use client';

// Is the current visitor from the Instagram ad / IG? Every IG-sprint experiment
// (CHE-359, the 10-day funnel sprint) gates on this so changes only ever touch
// cold ad traffic — never existing users.
//
// The UTM is only on the first pageview, so we persist it for the session: once
// detected, every later page still counts as IG. Synchronous + client-only;
// returns false during SSR (callers should read it in an effect to avoid
// hydration mismatch).

const KEY = 'cp:ig_cohort';

export function isIgCohort(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const src = (params.get('utm_source') || '').toLowerCase();
    if (src === 'instagram') {
      sessionStorage.setItem(KEY, '1');
      return true;
    }
    // Organic IG (in-app browser) — referrer fallback when there's no UTM.
    if (document.referrer && /instagram\.com/i.test(document.referrer)) {
      sessionStorage.setItem(KEY, '1');
      return true;
    }
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/** True only for the PAID ad (utm_medium=paid) — the $5/day probe specifically. */
export function isPaidIgCohort(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const src = (params.get('utm_source') || '').toLowerCase();
    const medium = (params.get('utm_medium') || '').toLowerCase();
    if (src === 'instagram' && medium === 'paid') {
      sessionStorage.setItem(`${KEY}:paid`, '1');
      return true;
    }
    return sessionStorage.getItem(`${KEY}:paid`) === '1';
  } catch {
    return false;
  }
}
