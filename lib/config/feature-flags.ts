/**
 * Feature Flags
 *
 * Toggle features on/off without removing code.
 * Set to `true` to enable, `false` to disable.
 */

export const FEATURE_FLAGS = {
  /** Show streak counter in header on / and /daily-challenge */
  SHOW_STREAK_COUNTER: false,
  /** Show share buttons/cards on lesson complete and daily challenge screens */
  SHOW_SHARING: true,
  /** Show block intro popups (the "Welcome to Forks!" style popups at block boundaries) */
  SHOW_BLOCK_INTROS: false,
  /** Show Openings feature (v1 archived — new version TBD) */
  SHOW_OPENINGS: true,
  /**
   * Fold the daily "you showed up today" streak into the completion screen
   * (campfire + tick-up + share, inline) instead of firing it as a separate
   * modal via DailyWorkoutWatcher. When true: completion screens own the claim
   * and the watcher stays inert. When false: legacy modal-on-navigation.
   */
  STREAK_ON_COMPLETE: true,
  /**
   * CHE-370 — show the "Chess Path ELO" rising day-by-day graph inside the
   * activity completion popup (the legible progress-pride mechanic). Dark by
   * default; flip on after verifying on real data.
   */
  CHESS_PATH_ELO: true,
} as const;

/**
 * IG Funnel Sprint (CHE-359, 2026-06-03 → 2026-06-13).
 *
 * One flag per day's experiment. EVERY flag here is additionally gated by
 * `isIgCohort()` (lib/growth/ig-cohort.ts), so flipping one on only affects
 * cold Instagram-ad traffic — existing users never see these. Default ON =
 * "live for the IG cohort." Flip to false to kill an experiment.
 *
 * Plan + per-day spec: data/growth/ig-ad-sprint-2026-06.md.
 */
export const IG_SPRINT_FLAGS = {
  /** Day 1 — skip the staged power-on entrance so the CTAs are instant. */
  IG_LANDING_FASTPATH: true,
  /**
   * Day 2 (CHE-359) — value-led landing for cold traffic. Day 1 made the CTAs
   * instant and ALL 18 paid clicks saw them, yet only 2 tapped: speed wasn't the
   * cliff, the missing value prop was. This replaces the Play/Learn fork with a
   * single dominant "Start playing" CTA under a "Learn chess in 5 minutes. Free."
   * headline (basics demoted to a link). Existing users never see it.
   */
  IG_LANDING_VALUE_CTA: true,
  /**
   * Day 3 — landing copy echoes the ad hook. The value-led headline already
   * shipped in `ColdLanding` (Day 2); this swaps it to challenge-framed copy
   * that continues the paid IG creative ("Beat me in 60 seconds?") instead of a
   * generic "learn" promise — reframing work → game to lift picked-a-path.
   * Copy-only, inside the existing ColdLanding (no competing landing). Flip to
   * false to fall back to the Day-2 value headline. IG cohort only.
   */
  IG_LANDING_COPY: true,
  /**
   * Day 5 (CHE-359) — message-match the ad. The paid creative shows lesson
   * 1.1.1's highlighted checkmate-in-1, but the landing showed a menu: 47/48
   * paid clicks (2026-06-04) tapped nothing. This drops cold IG traffic STRAIGHT
   * onto that exact board (Qd3→h7#, h7 glows green) — the product starts before
   * they choose anything — then captures signup at the win. Takes precedence over
   * IG_LANDING_VALUE_CTA (which becomes the fallback if this is off). Existing
   * users + non-IG traffic never see it. Attempt log: data/growth/landing-page-log.md.
   */
  IG_LANDING_CHECKMATE: true,
  /**
   * Day 4 (CHE-359) — autoplay. For the IG cohort, the landing's Play CTA routes
   * to `/play?autostart=1` and the game starts immediately, skipping the
   * color/level setup screen — land cold traffic as close to the first move as
   * possible (the product starts before they pick anything). Gated by
   * `isIgCohort()` + the `?autostart=1` query the cohort's CTA passes, so
   * existing users always see the normal setup screen. Metric: `game_started`.
   */
  IG_AUTOPLAY: true,
  /**
   * Day 5 (CHE-359) — rigged first win. For the IG cohort's FIRST game of the
   * session, swap Rookie's engine for an extra-easy, blunder-prone config (and
   * skip the opening book) so a cold beginner gets a fast, satisfying win and
   * hits the already-live one-tap signup at the dopamine peak. Engine-only: the
   * displayed level stays 1, only the under-the-hood strength drops. Gated by
   * `isIgCohort()` + first-game-of-session, so existing users + non-IG traffic
   * are never affected, and only the IG cohort's opening game is eased (later
   * games play normally). Metric: new-session win-rate, prompt-shown.
   */
  IG_EASY_FIRST_WIN: true,
  /**
   * Day 6 (CHE-359) — win-prompt timing + copy. The one-tap signup prompt
   * (`win_signup_capture`) waited a flat 3s after game-over for everyone, so for
   * the IG cohort it landed AFTER the win dopamine had cooled. For a cold IG WIN
   * this fires the prompt fast (~1.1s — at the celebration peak, not after it)
   * and makes the ask more concrete ("Save your first win" instead of the generic
   * "win"). Win-only: a loss keeps the original gentle 3s timing so we never rush
   * a discouraging moment. Gated by `isIgCohort()`, so existing users + non-IG
   * traffic see the unchanged 3s/generic behavior. Metric: prompt-shown → oauth_started.
   */
  IG_WIN_PROMPT: true,
  /**
   * Day 7 (CHE-359) — post-signup activation. A cold IG user who signs up at the
   * win moment used to get dropped straight back where they were (one-and-done
   * risk). For the IG cohort, the win-moment signup prompt now returns them to
   * `/play?ig_activate=1`, and on arrival — once authenticated — we show a single
   * activation nudge that frames a concrete 2nd action ("Play one more — keep your
   * streak alive"). Tapping it starts another game. Gated by `isIgCohort()` + the
   * `?ig_activate=1` query the post-signup return carries, so existing users + the
   * normal autoplay path are untouched. Metric: D0 second-action rate.
   */
  IG_ACTIVATION: true,
} as const;
