// Shared lookup for opening tree data.
// Used by tree page (progress derivation) and landing page (lesson counts).

import type { OpeningTree } from '@/data/openings/ruy-lopez'
import { RUY_LOPEZ } from '@/data/openings/ruy-lopez'
import { ITALIAN_GAME } from '@/data/openings/italian'
import { SICILIAN_DEFENSE } from '@/data/openings/sicilian'
import { PIRC_DEFENSE } from '@/data/openings/pirc'
import { LONDON_SYSTEM } from '@/data/openings/london'
import { FRENCH_DEFENSE } from '@/data/openings/french'
import { CARO_KANN } from '@/data/openings/caro-kann'
import { KINGS_GAMBIT } from '@/data/openings/kings-gambit'

export const TREE_LOOKUP: Record<string, OpeningTree> = {
  'ruy-lopez': RUY_LOPEZ,
  'italian': ITALIAN_GAME,
  'sicilian': SICILIAN_DEFENSE,
  'pirc-defense': PIRC_DEFENSE,
  'london': LONDON_SYSTEM,
  'french': FRENCH_DEFENSE,
  'caro-kann': CARO_KANN,
  'kings-gambit': KINGS_GAMBIT,
}

/** Get total lesson count for an opening */
export function getLessonCount(slug: string): number {
  return TREE_LOOKUP[slug]?.completionOrder?.length ?? 0
}
