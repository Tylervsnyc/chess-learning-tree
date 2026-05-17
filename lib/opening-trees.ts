// Shared lookup for opening tree data.
// Used by tree page (progress derivation) and landing page (lesson counts).

import type { OpeningTree } from '@/data/openings/ruy-lopez'
import { RUY_LOPEZ } from '@/data/openings/ruy-lopez'
import { ITALIAN_GAME } from '@/data/openings/italian'
import { SICILIAN_DEFENSE } from '@/data/openings/sicilian'
import { PIRC_DEFENSE } from '@/data/openings/pirc'
import { PIRC_AUSTRIAN } from '@/data/openings/pirc-austrian'
import { PIRC_150_ATTACK } from '@/data/openings/pirc-150-attack'
import { LONDON_SYSTEM } from '@/data/openings/london'
import { FRENCH_DEFENSE } from '@/data/openings/french'
import { CARO_KANN } from '@/data/openings/caro-kann'
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
import { FRENCH_WINAWER } from '@/data/openings/french-winawer'
import { SICILIAN_NAJDORF } from '@/data/openings/sicilian-najdorf'
import { RUY_LOPEZ_BERLIN } from '@/data/openings/ruy-lopez-berlin'
import { RUY_LOPEZ_EXCHANGE } from '@/data/openings/ruy-lopez-exchange'
import { NIMZO_INDIAN_CLASSICAL } from '@/data/openings/nimzo-indian-classical'
import { NIMZO_INDIAN_SAEMISCH } from '@/data/openings/nimzo-indian-saemisch'
import { PETROFF_3D4 } from '@/data/openings/petroff-3d4'
import { PETROFF_5NC3 } from '@/data/openings/petroff-5nc3'
import { ITALIAN_EVANS_GAMBIT } from '@/data/openings/italian-evans-gambit'
import { LONDON_VS_C5 } from '@/data/openings/london-vs-c5'
import { LONDON_VS_KINGS_INDIAN } from '@/data/openings/london-vs-kings-indian'
import { FRENCH_TARRASCH } from '@/data/openings/french-tarrasch'
import { ITALIAN_TWO_KNIGHTS } from '@/data/openings/italian-two-knights'
import { CARO_KANN_ADVANCE } from '@/data/openings/caro-kann-advance'
import { CARO_KANN_PANOV } from '@/data/openings/caro-kann-panov'
import { CARO_KANN_SMYSLOV } from '@/data/openings/caro-kann-smyslov'
import { QUEENS_GAMBIT_ACCEPTED } from '@/data/openings/queens-gambit-accepted'
import { SCANDINAVIAN_DEFENSE } from '@/data/openings/scandinavian'
import { WITTY_ALIEN } from '@/data/openings/witty-alien'

export const TREE_LOOKUP: Record<string, OpeningTree> = {
  'ruy-lopez': RUY_LOPEZ,
  'italian': ITALIAN_GAME,
  'sicilian': SICILIAN_DEFENSE,
  'pirc-defense': PIRC_DEFENSE,
  'pirc-austrian': PIRC_AUSTRIAN,
  'pirc-150-attack': PIRC_150_ATTACK,
  'london': LONDON_SYSTEM,
  'french': FRENCH_DEFENSE,
  'caro-kann': CARO_KANN,
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
  'french-winawer': FRENCH_WINAWER,
  'sicilian-najdorf': SICILIAN_NAJDORF,
  'ruy-lopez-berlin': RUY_LOPEZ_BERLIN,
  'ruy-lopez-exchange': RUY_LOPEZ_EXCHANGE,
  'nimzo-indian-classical': NIMZO_INDIAN_CLASSICAL,
  'nimzo-indian-saemisch': NIMZO_INDIAN_SAEMISCH,
  'petroff-3d4': PETROFF_3D4,
  'petroff-5nc3': PETROFF_5NC3,
  'italian-evans-gambit': ITALIAN_EVANS_GAMBIT,
  'london-vs-c5': LONDON_VS_C5,
  'london-vs-kings-indian': LONDON_VS_KINGS_INDIAN,
  'french-tarrasch': FRENCH_TARRASCH,
  'italian-two-knights': ITALIAN_TWO_KNIGHTS,
  'caro-kann-advance': CARO_KANN_ADVANCE,
  'caro-kann-panov': CARO_KANN_PANOV,
  'caro-kann-smyslov': CARO_KANN_SMYSLOV,
  'queens-gambit-accepted': QUEENS_GAMBIT_ACCEPTED,
  'scandinavian': SCANDINAVIAN_DEFENSE,
  'witty-alien': WITTY_ALIEN,
}

/** Get total lesson count for an opening */
export function getLessonCount(slug: string): number {
  return TREE_LOOKUP[slug]?.completionOrder?.length ?? 0
}
