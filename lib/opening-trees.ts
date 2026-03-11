// Shared lookup for opening tree data.
// Used by tree page (progress derivation) and landing page (lesson counts).

import type { OpeningTree } from '@/data/openings/ruy-lopez'
import { RUY_LOPEZ } from '@/data/openings/ruy-lopez'
import { ITALIAN_GAME } from '@/data/openings/italian'
import { SICILIAN_DEFENSE } from '@/data/openings/sicilian'
import { PIRC_DEFENSE } from '@/data/openings/pirc'
import { PIRC_AUSTRIAN } from '@/data/openings/pirc-austrian'
import { LONDON_SYSTEM } from '@/data/openings/london'
import { FRENCH_DEFENSE } from '@/data/openings/french'
import { CARO_KANN } from '@/data/openings/caro-kann'
import { KINGS_GAMBIT } from '@/data/openings/kings-gambit'
import { KINGS_INDIAN } from '@/data/openings/kings-indian'
import { SCOTCH_GAME } from '@/data/openings/scotch'
import { RUY_LOPEZ_MARSHALL } from '@/data/openings/ruy-lopez-marshall'
import { GRUNFELD_DEFENSE } from '@/data/openings/grunfeld'
import { SLAV_DEFENSE } from '@/data/openings/slav'
import { QUEENS_GAMBIT_DECLINED } from '@/data/openings/queens-gambit'
import { ENGLISH_OPENING } from '@/data/openings/english'
import { NIMZO_INDIAN } from '@/data/openings/nimzo-indian'
import { PETROFF_DEFENSE } from '@/data/openings/petroff'
import { SICILIAN_DRAGON } from '@/data/openings/sicilian-dragon'
import { SICILIAN_SVESHNIKOV } from '@/data/openings/sicilian-sveshnikov'
import { SICILIAN_CLASSICAL } from '@/data/openings/sicilian-classical'
import { SICILIAN_KAN } from '@/data/openings/sicilian-kan'
import { SICILIAN_TAIMANOV } from '@/data/openings/sicilian-taimanov'
import { SICILIAN_ACCELERATED_DRAGON } from '@/data/openings/sicilian-accelerated-dragon'
import { SICILIAN_ALAPIN } from '@/data/openings/sicilian-alapin'
import { SICILIAN_SCHEVENINGEN } from '@/data/openings/sicilian-scheveningen'

export const TREE_LOOKUP: Record<string, OpeningTree> = {
  'ruy-lopez': RUY_LOPEZ,
  'italian': ITALIAN_GAME,
  'sicilian': SICILIAN_DEFENSE,
  'pirc-defense': PIRC_DEFENSE,
  'pirc-austrian': PIRC_AUSTRIAN,
  'london': LONDON_SYSTEM,
  'french': FRENCH_DEFENSE,
  'caro-kann': CARO_KANN,
  'kings-gambit': KINGS_GAMBIT,
  'kings-indian': KINGS_INDIAN,
  'scotch': SCOTCH_GAME,
  'ruy-lopez-marshall': RUY_LOPEZ_MARSHALL,
  'grunfeld': GRUNFELD_DEFENSE,
  'slav': SLAV_DEFENSE,
  'queens-gambit': QUEENS_GAMBIT_DECLINED,
  'english': ENGLISH_OPENING,
  'nimzo-indian': NIMZO_INDIAN,
  'petroff': PETROFF_DEFENSE,
  'sicilian-dragon': SICILIAN_DRAGON,
  'sicilian-sveshnikov': SICILIAN_SVESHNIKOV,
  'sicilian-classical': SICILIAN_CLASSICAL,
  'sicilian-kan': SICILIAN_KAN,
  'sicilian-taimanov': SICILIAN_TAIMANOV,
  'sicilian-accelerated-dragon': SICILIAN_ACCELERATED_DRAGON,
  'sicilian-alapin': SICILIAN_ALAPIN,
  'sicilian-scheveningen': SICILIAN_SCHEVENINGEN,
}

/** Get total lesson count for an opening */
export function getLessonCount(slug: string): number {
  return TREE_LOOKUP[slug]?.completionOrder?.length ?? 0
}
