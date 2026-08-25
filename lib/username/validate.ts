/**
 * lib/username/validate.ts
 *
 * ONE source of truth for what a fighter name may be. Imported by the client
 * (live feedback while typing in onboarding + settings) and by every server
 * route that writes `profiles.username`. Never re-implement any of these rules
 * at a call site — a name the client accepts and the server rejects is a dead
 * end the user cannot debug.
 *
 * Three gates, in order:
 *   1. FORMAT   — 3-20 chars, letters/numbers/underscore. Mirrored in the
 *                 profiles `username_format` CHECK constraint
 *                 (2026-07-31-leaderboards.sql) — keep the two in sync.
 *   2. RESERVED — handles that would impersonate us or a moderator.
 *   3. BLOCKED  — slurs and obscenity (see the matching note below).
 *
 * Availability (case-insensitive uniqueness) is NOT checked here — that needs
 * the DB. It is enforced atomically by the citext UNIQUE constraint on write.
 *
 * MATCHING NOTE (deliberate, do not "improve" without reading this):
 * we run the candidate through `normalizeForMatch` (lowercase, strip
 * underscores, undo common leetspeak) and then apply THREE tests:
 *
 *   - SLURS are matched as SUBSTRINGS. They effectively never occur inside an
 *     innocent English word, so the false-positive cost is near zero and
 *     catching `xx_slur_xx` matters more.
 *   - MILD PROFANITY is matched WHOLE-STRING only. Substring matching these is
 *     the Scunthorpe problem: it would reject "bassist", "Hitchcock",
 *     "analyst", "Cummings". A user whose real handle is `bassman` getting told
 *     his name is offensive is a worse outcome than someone naming themselves
 *     after a mild swear.
 *   - Each WORD of the handle is also held to the whole-string list. This is
 *     what catches `fat_ass` and `FatAss99` (Tyler's test, 2026-08-25) without
 *     re-opening the Scunthorpe problem: `bassist` is one token and stays fine.
 *     Glued-together compounds with no separator (`fatass`, `bullshit`) are
 *     covered by BLOCKED_COMPOUNDS instead.
 */

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;

/** Mirrored in the DB CHECK constraint. */
const FORMAT = /^[a-zA-Z0-9_]{3,20}$/;

/** Handles that would impersonate the app, its mascot, or a moderator. */
const RESERVED = new Set([
  'admin', 'rookie', 'chesspath', 'chessboxing', 'you', 'me',
  'mod', 'moderator', 'staff', 'support', 'official', 'gleasons',
  'chess_path', 'chess_boxing', 'system', 'root', 'null', 'undefined',
]);

/**
 * Slurs and sexual/violent terms — matched ANYWHERE in the normalized name.
 * Kept deliberately short and high-confidence: every entry here must be a
 * string that does not appear inside ordinary words.
 */
const BLOCKED_SUBSTRINGS = [
  // racial / ethnic / religious slurs
  'nigg', 'nigr', 'chink', 'gook', 'wetback', 'beaner',
  'kike', 'raghead', 'towelhead', 'sandnigger',
  'junglebunny', 'porchmonkey', 'zipperhead', 'redskin',
  // homophobic / transphobic slurs
  'faggot', 'fagot', 'tranny', 'shemale',
  // ableist slurs
  'retard', 'spastic', 'mongoloid', 'cripple',
  // hate ideology
  'hitler', 'nazi', 'heilhitler', 'kkk', 'whitepower', 'gaschamber',
  'holocaust', 'genocide', 'lynching',
  // sexual
  'rapist', 'pedo', 'paedo', 'molest', 'incest', 'cumshot',
  'blowjob', 'handjob', 'creampie', 'bukkake', 'hentai', 'porn',
  'cunt', 'whore', 'slut',
  // violence / self-harm
  'killurself', 'killyourself', 'suicide', 'selfharm',
];

/**
 * Compounds. These are the `fat_ass` family: a mild word from BLOCKED_EXACT
 * glued to another word, which the whole-string test can't see. Matched as
 * substrings — none of them occurs inside an innocent word.
 */
const BLOCKED_COMPOUNDS = [
  'fatass', 'dumbass', 'jackass', 'badass', 'bigass', 'smartass', 'lardass',
  'asshole', 'asshat', 'asswipe', 'assface', 'asslick', 'assmunch',
  'bullshit', 'dipshit', 'horseshit', 'shithead', 'shitface', 'shitbag',
  'dickhead', 'dickface', 'cocksucker', 'motherfuck', 'fuckface', 'fuckhead',
  'fuckboy', 'clusterfuck', 'twatwaffle', 'douchebag', 'jerkoff',
];

/**
 * Words that CONTAIN a blocked substring but are themselves innocent. Checked
 * before the substring pass. Scunthorpe is the canonical case; every entry
 * here should be a real word or place a person might reasonably be named.
 */
const SAFE_CONTAINERS = new Set(['scunthorpe', 'penistone', 'lightwater']);

/**
 * Blocked only when it is the WHOLE name. Two kinds live here:
 *
 *   - mild profanity (`ass` is banned as a handle; `bassist` is not), and
 *   - slurs that are ALSO substrings of ordinary words or real names. These
 *     cannot go in the substring list without collateral damage:
 *       spic → spice, spicy, suspicious   coon → raccoon, tycoon, cocoon
 *       tard → mustard, custard           rape → grape, scrape, trapeze
 *       paki → Pakistan (a nationality)
 *       dyke → Van Dyke                   squaw → squawk
 *       homo → homogeneous                kys  → luckys
 *       negro → negroni                   isis → Isis
 *     Blocking the exact handle still stops the actual slur usage.
 */
const BLOCKED_EXACT = new Set([
  // mild profanity
  'ass', 'asshole', 'arse', 'arsehole', 'bastard', 'bitch', 'bollocks',
  'boob', 'boobs', 'bugger', 'crap', 'cock', 'dick', 'dildo', 'douche',
  'fuck', 'fucker', 'fucking', 'fuk', 'jizz', 'nutsack', 'penis',
  'piss', 'prick', 'pussy', 'queer', 'shit', 'shite', 'tits', 'twat',
  'vagina', 'wank', 'wanker', 'rape',
  // slurs that collide with ordinary words — exact-match only
  'spic', 'spics', 'coon', 'coons', 'tard', 'tards', 'paki', 'pakis',
  'dyke', 'dykes', 'squaw', 'homo', 'homos', 'negro', 'negros',
  'negroes', 'kys', 'isis', 'jihad', 'yid', 'yids',
]);

/** Common leetspeak substitutions, applied before matching. */
const LEET: Record<string, string> = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's',
  '6': 'g', '7': 't', '8': 'b', '9': 'g', '@': 'a', '$': 's', '!': 'i',
};

/**
 * Fold a candidate down to the form the blocklists are written in: lowercase,
 * leetspeak undone, separators removed. Exported for tests.
 */
export function normalizeForMatch(raw: string): string {
  return raw
    .toLowerCase()
    .split('')
    .map((ch) => LEET[ch] ?? ch)
    .join('')
    .replace(/[^a-z]/g, '');
}

/**
 * Split a candidate into the words a human reads in it. Handles the two ways
 * people compose handles: separators (`fat_ass`, `fat99ass`) and camel case
 * (`FatAss99`). Each token is then held to the whole-word blocklist, which is
 * what catches `fat_ass` while leaving `bassist` — a single token — alone.
 *
 * ACCEPTED COST: this pass reads `VanDyke` as van + dyke and blocks it, so a
 * real surname loses to a slur. That is the deliberate call — a token standing
 * alone in a handle is far more often the slur than the Flemish painter, and
 * the cost of being wrong is one person picking another name, versus a slur
 * sitting on a public leaderboard. Revisit only on a real complaint.
 */
export function tokenize(raw: string): string[] {
  return raw
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // camelCase → camel Case
    .toLowerCase()
    .split('')
    .map((ch) => LEET[ch] ?? ch)
    .join('')
    .split(/[^a-z]+/)
    .filter(Boolean);
}

// Normalize the lists themselves so a leet-written entry can never slip past.
const NORMALIZED_SUBSTRINGS = [...BLOCKED_SUBSTRINGS, ...BLOCKED_COMPOUNDS]
  .map(normalizeForMatch)
  .filter(Boolean);
const NORMALIZED_EXACT = new Set([...BLOCKED_EXACT].map(normalizeForMatch).filter(Boolean));

/**
 * Undo stretched-letter evasion (`fuuuck`, `niiigger`) by collapsing runs of
 * THREE OR MORE identical letters to one. Three, not two, on purpose: `bassist`
 * and `assassin` keep their double letters and stay clean, while no ordinary
 * word has a letter three times in a row.
 */
function collapseRuns(s: string): string {
  return s.replace(/(.)\1{2,}/g, '$1');
}

export type UsernameProblem = 'format' | 'reserved' | 'blocked';

export interface UsernameOk {
  ok: true;
  /** The trimmed value to store. Case is preserved; uniqueness is citext. */
  value: string;
}
export interface UsernameBad {
  ok: false;
  problem: UsernameProblem;
  /** User-facing copy. Safe to render as-is. */
  message: string;
}

/**
 * Validate a candidate fighter name. Pure — no DB, no network. Returns the
 * exact message the UI should show, so client and server never disagree about
 * WHY a name was refused.
 *
 * A blocked name is told "pick another one" rather than "that's a slur": we
 * never repeat the offending term back, and we don't hand a probe a signal it
 * can iterate against.
 */
export function validateUsername(raw: unknown): UsernameOk | UsernameBad {
  const value = typeof raw === 'string' ? raw.trim() : '';

  if (!FORMAT.test(value)) {
    return {
      ok: false,
      problem: 'format',
      message: `${USERNAME_MIN}-${USERNAME_MAX} characters. Letters, numbers or underscore.`,
    };
  }

  const normalized = normalizeForMatch(value);

  if (RESERVED.has(value.toLowerCase()) || RESERVED.has(normalized)) {
    return { ok: false, problem: 'reserved', message: 'That name is taken.' };
  }

  // Test the plain fold, the stretched-letter fold, and every word the handle
  // is composed of (`fat_ass` and `FatAss99` both tokenize to [fat, ass]).
  const folds = [normalized, collapseRuns(normalized)];
  const tokens = tokenize(value).flatMap((t) => [t, collapseRuns(t)]);
  const safeContainer = folds.some((f) => SAFE_CONTAINERS.has(f));
  if (
    [...folds, ...tokens].some((f) => NORMALIZED_EXACT.has(f))
    || (!safeContainer && folds.some((f) => NORMALIZED_SUBSTRINGS.some((bad) => f.includes(bad))))
  ) {
    return {
      ok: false,
      problem: 'blocked',
      message: "Let's pick a different one — that name won't fly on the leaderboard.",
    };
  }

  return { ok: true, value };
}
