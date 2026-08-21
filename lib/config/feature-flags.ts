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
   * CHE-370 — show the "Chess Path ELO" rising day-by-day graph inside the
   * activity completion popup (the legible progress-pride mechanic). Dark by
   * default; flip on after verifying on real data.
   */
  CHESS_PATH_ELO: true,
  /**
   * CHE-390 — webview-safe auth. Inside social in-app browsers (Instagram,
   * Facebook, TikTok), Google blocks OAuth outright (`disallowed_useragent`) —
   * during the 2026-06 paid IG probe every webview OAuth tap died. When ON,
   * auth surfaces detect the webview (`lib/auth/webview.ts`), hide the dead
   * Google button, and lead with email (works everywhere); Apple stays as
   * secondary. Normal browsers are unchanged.
   */
  WEBVIEW_SAFE_AUTH: true,
  /**
   * CHE — IG fast landing. Cold Instagram traffic lands on /welcome, which
   * renders the CLIENT <OnboardingFlow>: the screen is BLANK until ~1.2MB of JS
   * hydrates (measured FCP 8.4s on throttled mobile / IG in-app webview), and
   * ~346/384 cold-IG landers leave in under 3s — they bounce ~5s BEFORE the
   * board paints. When ON, cold-IG visitors get a SERVER-RENDERED checkmate
   * board (`ColdBoardLanding`) that is visible at FCP with a tiny client island
   * for tap-to-move — no chess.js / react-chessboard on the critical path.
   * Non-IG / desktop / existing users are unchanged. Gated additionally by
   * cold-IG detection in app/welcome/page.tsx.
   */
  IG_FAST_LANDING: true,
  /**
   * Camera punch counter in the Chess Boxing workout's exercise segments
   * (components/workout/PunchTracker). Fully on-device (MediaPipe pose,
   * self-hosted model — video never leaves the phone). Flag ON shows an
   * opt-in "Count my punches" toggle in the exercise segment; the camera
   * only ever starts after the user turns it on (preference remembered
   * per device in localStorage).
   *
   * OFF since 2026-08-05 (Tyler): the detector is too unreliable to put in
   * front of users — it miscounts in real conditions. With the flag off the
   * camera never appears anywhere: the workout runs timer + Combo Coach, the
   * bout's boxing round uses the tap-per-punch pad, onboarding drops its
   * camera-permission step, and Settings hides the camera row. Turn back on
   * once the detector is trustworthy.
   *
   * NOTE: this flag being off does NOT mean the app is camera-free. Quadrant
   * Fight (components/box/QuadrantFight.tsx) is a separate, live, opt-in camera
   * game in the workout's exercise segments and the bout's boxing rounds — it
   * is gated only by localStorage `cp_quadrant_fight_optin` (default off), not
   * by this flag. Its per-round FightStats feed the bout's judges' cards +
   * boxing bonus when BOUT_BOXING_CARDS is on. ios/App/App/Info.plist
   * therefore MUST keep NSCameraUsageDescription, or opting in hard-crashes
   * the native app.
   */
  WORKOUT_PUNCH_CAM: false,
  /**
   * Fight rounds in the Chess Boxing workout — instead of puzzle segments, the
   * user plays ONE continuous game vs Rookie across all chess segments. The
   * game freezes during exercise/break segments and resumes the next chess
   * segment, exactly like real chess boxing. Adds a "Puzzles vs Fight Rookie"
   * discipline picker to the workout setup screen.
   */
  WORKOUT_FIGHT_ROUNDS: true,
  /**
   * Combo Coach in the Chess Boxing workout's exercise segments — Rookie calls
   * boxing combos out loud (standard number system: 1 jab, 2 cross, …) with a
   * big visual cue, randomized so you react instead of memorize. Punches and
   * defenses unlock Duolingo-style over completed sessions (curriculum in
   * lib/workout/combo-coach.ts; pre-generated Rookie voice clips in
   * public/audio/combo-coach via scripts/generate-combo-voice.ts).
   */
  WORKOUT_COMBO_CALLS: false,
  /**
   * Chess Boxing leaderboards — daily/weekly/monthly boards ranked off workout
   * session points, with a global (opt-in) scope and crew boards joined by code
   * (launch crew: CHESSBOXING NYC). Shows the /leaderboard route + entry points.
   */
  LEADERBOARDS: true,
  /**
   * Daily-slot leaderboard scoring (2026-08-07, Tyler-approved): every user
   * gets ONE ranked slot per day — their best single effort (best workout
   * round or best bout) fills it — and the weekly/monthly boards are the SUM
   * of those daily slots instead of raw point totals. Equal opportunity: a
   * 5-session grind day contributes exactly one slot, so consistency beats
   * free time. Read-side only (computed in /api/leaderboard — no schema
   * change); OFF falls back to raw totals.
   */
  LEADERBOARD_DAILY_SLOT: true,
  /**
   * Bout mode (/box/bout) — the Chess Boxing app's flagship fight: ONE game vs
   * Rookie split across three 3:00 chess rounds with two 60s boxing rounds
   * between them. The board freezes at every bell; you resume the same
   * position. One real clock (the user's 9:00 bank — flagging is a real loss);
   * Rookie's clock is pacing/flavor only. Final bell with no mate is decided
   * on MATERIAL first; when the board is dead level the judges' cards decide
   * (see BOUT_BOXING_CARDS), tie to the user. Design:
   * docs/chess-boxing-app-structure.md.
   */
  BOUT_MODE: true,
  /**
   * Judges' cards + boxing bonus in a bout (2026-08-17, Tyler): when the
   * Quadrant Fight camera game is opted in, every boxing round is scored 0-100
   * for you (`cardScore`) and for Rookie (`rookieCard`, lib/bout/bout.ts).
   * The cards add half a point each to bout points (max 50/round), settle a
   * material-level final bell, and are stored in bout_sessions.user_cards /
   * rookie_cards with `punches` = landed punches. OFF: cards stay `[]`,
   * punches 0, and the bout scores exactly as before — the camera game itself
   * stays playable, it just doesn't count.
   */
  BOUT_BOXING_CARDS: true,
  /**
   * The "Living Ring" /box home (2026-08-07, Tyler-approved on
   * /test/boxing-landing): fight-night ring scene — crowd + flashbulbs,
   * chessboard canvas, Puzzle Boxing | Play Boxing corners, and live
   * Global/Squad leaderboards with a daily/weekly/monthly toggle. OFF falls
   * back to the locker-room scene (LockerHome).
   */
  BOX_RING_HOME: true,
  /**
   * Chess Boxing achievements (2026-08-09, Tyler-approved plan:
   * docs/chess-boxing-achievements-plan.md). Dungeon-Crawler-Carl-style
   * achievements in Rookie's voice — bout/puzzle/training/dedication medals
   * plus a secret "shame" category — with belt-band tiers (Amateur →
   * Undisputed) that upgrade as you re-earn them at higher Rookie levels.
   * Detection is server-side in the finish routes (lib/achievements/server.ts,
   * writes via service role); the client only renders. ON shows the trophy
   * case on /profile and /box/profile and plays unlock animations on the bout
   * and workout result screens. OFF: no UI, no detection, nothing written —
   * the user_achievements table just sits there. Requires the
   * 2026-08-09-user-achievements.sql migration; until it runs, every surface
   * degrades to empty/silent.
   */
  ACHIEVEMENTS: true,
  /**
   * Premove — queue your reply while it's the opponent's turn. Select one of
   * your pieces and a destination during Rookie's think (0.5s on /play and
   * fight rounds, a padded 2-4s in a bout); the instant it's your turn the move
   * plays if it's legal, and silently cancels if it isn't. One premove at a
   * time; a new one replaces it. Targeting is relaxed (blockers/check ignored),
   * execution is strict — see lib/chess/premove.ts. On puzzle/lesson lines a
   * premove that isn't the solution move cancels silently rather than counting
   * as a wrong answer.
   */
  PREMOVE: true,
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
  /**
   * Day 1 — skip the staged power-on entrance so the CTAs are instant.
   * KILLED at Day-10 lock-in: all 18 paid clicks saw instant CTAs, only 2
   * tapped — speed was not the cliff.
   */
  IG_LANDING_FASTPATH: false,
  /**
   * Day 2 (CHE-359) — value-led landing for cold traffic. Day 1 made the CTAs
   * instant and ALL 18 paid clicks saw them, yet only 2 tapped: speed wasn't the
   * cliff, the missing value prop was. This replaces the Play/Learn fork with a
   * single dominant "Start playing" CTA under a "Learn chess in 5 minutes. Free."
   * headline (basics demoted to a link). Existing users never see it.
   * KILLED at Day-10 lock-in: 48 paid landed → 1 tapped (98% bounce). A value
   * headline + single button is still a menu cold traffic won't choose from.
   */
  IG_LANDING_VALUE_CTA: false,
  /**
   * Day 3 — landing copy echoes the ad hook. The value-led headline already
   * shipped in `ColdLanding` (Day 2); this swaps it to challenge-framed copy
   * that continues the paid IG creative ("Beat me in 60 seconds?") instead of a
   * generic "learn" promise — reframing work → game to lift picked-a-path.
   * Copy-only, inside the existing ColdLanding (no competing landing). Flip to
   * false to fall back to the Day-2 value headline. IG cohort only.
   * KILLED at Day-10 lock-in: copy framing didn't move picked-a-path; the
   * checkmate-board landing superseded the whole ColdLanding shape.
   */
  IG_LANDING_COPY: false,
  /**
   * Day 5 (CHE-359) — message-match the ad. The paid creative shows lesson
   * 1.1.1's highlighted checkmate-in-1, but the landing showed a menu: 47/48
   * paid clicks (2026-06-04) tapped nothing. This drops cold IG traffic STRAIGHT
   * onto that exact board (Qd3→h7#, h7 glows green) — the product starts before
   * they choose anything — then captures signup at the win. Takes precedence over
   * IG_LANDING_VALUE_CTA (which becomes the fallback if this is off). Existing
   * users + non-IG traffic never see it. Attempt log: data/growth/landing-page-log.md.
   * Day-10 lock-in WINNER: lifted "did anything" ~2% → ~10% (18/193 touched the
   * board, 5 won the mate) — the only variant that moved a number. Stays ON.
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
  /**
   * Day 8 (CHE-359) — explicit "come back tomorrow" promise. At the IG win
   * moment the one-tap signup ask says what they get, but not the reason to
   * RETURN — and D1 is the North-Star metric. For a cold IG WIN this adds a
   * short, explicit promise line to the win-moment SignupPrompt ("Sign up — I'll
   * have a fresh challenge waiting tomorrow"), reinforcing the day-1 lifecycle
   * email that already fires for this cohort (verified: drip's day1 window has no
   * acquisition filter). Gated by `isIgCohort()` + win-only, so non-IG traffic +
   * existing users see the unchanged prompt. Metric: D1 (cohort read).
   */
  IG_D1_NUDGE: true,
  /**
   * Day 9 (CHE-359) — post-win share loop (viral coefficient). The share card
   * already renders post-win in `ActivityComplete`, but the only affordance is a
   * tiny corner icon almost nobody taps. For a cold IG **celebratory** finish
   * this adds ONE prominent "Share your win" button (above Continue) that fires
   * the existing `useShareOG` flow — same OG card, same `share_clicked` event —
   * so IG winners are actively nudged to post their checkmate back to the feed
   * they came from. Additive + gated by `isIgCohort()` + a win/success +
   * `shareConfig` present, so non-IG traffic + existing users see zero change.
   * Metric: `share_clicked` from the paid/IG cohort.
   */
  IG_SHARE_LOOP: true,
} as const;
