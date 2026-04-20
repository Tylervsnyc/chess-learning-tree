/**
 * Guard for ElevenLabs TTS calls. Two layers:
 *   1. Dev-mode kill switch — in non-production, skip live TTS unless TTS_FORCE_LIVE=true
 *   2. Daily character budget — block once TTS_DAILY_BUDGET_CHARS (default 50000) is used
 *
 * All synth paths (route, scripts, hooks) must call assertTtsAllowed(text) before
 * hitting ElevenLabs. Cache hits bypass this entirely.
 */

const DEFAULT_BUDGET = 50000;
const state = {
  day: '',
  charsUsed: 0,
  warnedAt80: false,
  warnedAt90: false,
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextUtcMidnight(): string {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.toISOString();
}

function rollover() {
  const d = today();
  if (state.day !== d) {
    state.day = d;
    state.charsUsed = 0;
    state.warnedAt80 = false;
    state.warnedAt90 = false;
  }
}

export class TtsBlockedError extends Error {
  constructor(public reason: 'dev-mode' | 'budget', message: string) {
    super(message);
    this.name = 'TtsBlockedError';
  }
}

export function assertTtsAllowed(text: string): void {
  if (process.env.NODE_ENV !== 'production' && process.env.TTS_FORCE_LIVE !== 'true') {
    throw new TtsBlockedError(
      'dev-mode',
      `[TTS] dev-mode skip (set TTS_FORCE_LIVE=true to override): ${text.slice(0, 60)}`,
    );
  }

  rollover();
  const budget = Number(process.env.TTS_DAILY_BUDGET_CHARS ?? DEFAULT_BUDGET);
  if (state.charsUsed + text.length > budget) {
    throw new TtsBlockedError(
      'budget',
      `[TTS] daily budget exceeded (${state.charsUsed}/${budget} chars used today)`,
    );
  }
}

export function recordTtsUsage(text: string): void {
  rollover();
  state.charsUsed += text.length;

  const budget = Number(process.env.TTS_DAILY_BUDGET_CHARS ?? DEFAULT_BUDGET);
  const pct = state.charsUsed / budget;
  if (pct >= 0.9 && !state.warnedAt90) {
    state.warnedAt90 = true;
    console.error(`[TTS] daily usage crossed 90% (${state.charsUsed}/${budget} chars)`);
  } else if (pct >= 0.8 && !state.warnedAt80) {
    state.warnedAt80 = true;
    console.warn(`[TTS] daily usage crossed 80% (${state.charsUsed}/${budget} chars)`);
  }
}

export function getTtsUsage(): {
  day: string;
  charsUsed: number;
  budget: number;
  percentUsed: number;
  resetsAt: string;
} {
  rollover();
  const budget = Number(process.env.TTS_DAILY_BUDGET_CHARS ?? DEFAULT_BUDGET);
  return {
    day: state.day,
    charsUsed: state.charsUsed,
    budget,
    percentUsed: budget > 0 ? state.charsUsed / budget : 0,
    resetsAt: nextUtcMidnight(),
  };
}
