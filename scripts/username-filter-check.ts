/**
 * Guard for the fighter-name filter (lib/username/validate.ts).
 *
 * Run by `npm run check`. The blocklist is the one place in the app where a
 * careless edit is quietly expensive in BOTH directions: loosen it and a slur
 * lands on the public leaderboard; tighten it and a real person is told their
 * own name is offensive. So both directions are asserted here.
 *
 * When you add a term to the blocklist, add a case to ALLOWED for any ordinary
 * word that contains it. If you can't, the term belongs in BLOCKED_EXACT, not
 * BLOCKED_SUBSTRINGS.
 */

import { validateUsername } from '../lib/username/validate';

/** Must be accepted. Ordinary handles, plus every known Scunthorpe trap. */
const ALLOWED = [
  // ordinary handles
  'brooklyn_bishop', 'rook_life', 'Tyler', 'pawnstar', 'classic', 'Gleason92',
  'e4_forever', 'knight_rider', 'BoxerBen', 'chess_kid_7',
  // words containing a blocked term — must NOT be caught
  'bassist', 'assassin', 'massive', 'Cockburn', 'shitake',
  'analyst', 'cummings', 'Hitchcock', 'scunthorpe', 'mustard_rook',
  'raccoon_king', 'tycoon', 'spicy_pawn', 'suspicious', 'pakistan_92',
  'squawk', 'homogeneous', 'negroni', 'luckys', 'grape_ape',
  'crisis', 'popcorn', 'thomas', 'drapes', 'scrape', 'trapeze', 'custard',
  'nightmare', 'Lynch', 'cocoon', 'spice_rack',
  // start/end with a boundary word but are real words or names
  'class', 'classic_rook', 'glass', 'brass', 'grass', 'bypass', 'compass',
  'harass', 'assassin', 'assist', 'asset_king', 'assembly', 'kansas',
  'cockpit', 'cocktail', 'peacock', 'woodcock', 'dickens', 'dickinson',
  'bass_line', 'lass', 'shiitake',
];

/** Must be rejected. */
const BLOCKED = [
  // format / reserved
  'a', 'ab', 'way_too_long_a_name_here', 'bad name', 'admin', 'ROOKIE', 'Support',
  // mild profanity as the whole handle
  'ass', 'FUCK', 'shit', 'twat', 'wanker',
  // slurs
  'n1gg3r', 'xx_faggot_xx', 'n_i_g_g_e_r', 'R3D5K1N', 'PEDO_x', 'whitepower',
  'hitler88', 'r3t4rd', 'p0rnking', 'cunt99', 'tranny_x', 'KIKE_1',
  // exact-match slurs that collide with real words
  'sp1c', 'coon', 'paki', 'tard', 'homo', 'negro', 'kys', 'K_Y_S', 'rape',
  // evasion
  'fuuuck', 'shiiit', 'niiigger',
  // compounds — a mild word glued to another (Tyler's "fat ass" test, 2026-08-25).
  // The space version fails on format; these are the ones that used to get in.
  'fat_ass', 'fatass', 'FatAss99', 'dumbass', 'jackass', 'bigass_rook',
  'b1g_4ss', 'bullshit', 'shithead', 'DickHead', 'mother_fucker', 'douchebag',
  // ACCEPTED FALSE POSITIVE: the token pass reads this as van + dyke. A real
  // surname loses to a slur here — see the note in lib/username/validate.ts.
  'VanDyke',
  // boundary compounds — Tyler's "assguy" test, v3 review
  'assguy', 'guyass', 'assface_1', 'shitguy', 'fuckguy', 'dickguy',
  'ass_guy', 'AssGuy', '4ssguy', 'cockguy', 'bitchboy', 'wankster',
];

let failures = 0;

for (const name of ALLOWED) {
  const r = validateUsername(name);
  if (!r.ok) {
    console.error(`  FALSE POSITIVE  ${name}  (rejected as "${r.problem}")`);
    failures++;
  }
}

for (const name of BLOCKED) {
  const r = validateUsername(name);
  if (r.ok) {
    console.error(`  LEAKED          ${name}  (accepted)`);
    failures++;
  }
}

const total = ALLOWED.length + BLOCKED.length;
if (failures > 0) {
  console.error(`\nUsername filter check FAILED — ${failures}/${total} cases wrong.`);
  process.exit(1);
}
console.log(`Username filter check passed — ${total} cases (${ALLOWED.length} allowed, ${BLOCKED.length} blocked).`);
