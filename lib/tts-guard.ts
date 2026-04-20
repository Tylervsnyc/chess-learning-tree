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
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function rollover() {
  const d = today();
  if (state.day !== d) {
    state.day = d;
    state.charsUsed = 0;
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
}

export function getTtsUsage(): { day: string; charsUsed: number; budget: number } {
  rollover();
  return {
    day: state.day,
    charsUsed: state.charsUsed,
    budget: Number(process.env.TTS_DAILY_BUDGET_CHARS ?? DEFAULT_BUDGET),
  };
}
