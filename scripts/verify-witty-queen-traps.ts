// Scans Witty Alien lessons for "queen trap" move-order bugs:
// the lesson scripts an unnatural opponent move so the memorized line looks
// safe, but a NATURAL opponent move attacks the player's queen and the next
// taught move ignores it -> student hangs the queen in real games.
import { Chess } from 'chess.js'

import { WITTY_ALIEN } from '../data/openings/witty-alien'
import { WITTY_ALIEN_MARTIAN } from '../data/openings/witty-alien-martian'
import { WITTY_ALIEN_TWO_KNIGHTS } from '../data/openings/witty-alien-two-knights'
import { WITTY_ALIEN_BONJOUR } from '../data/openings/witty-alien-bonjour'
import { WITTY_ALIEN_ELEPHANT } from '../data/openings/witty-alien-elephant'
import { WITTY_ALIEN_ENGLUND } from '../data/openings/witty-alien-englund'
import { WITTY_ALIEN_DANISH } from '../data/openings/witty-alien-danish'
import { WITTY_ALIEN_SCANDI } from '../data/openings/witty-alien-scandi'
import { getWittyAlienLesson } from '../data/openings/witty-alien-lessons'
import { getWittyAlienMartianLesson } from '../data/openings/witty-alien-martian-lessons'
import { getWittyAlienTwoKnightsLesson } from '../data/openings/witty-alien-two-knights-lessons'
import { getWittyAlienBonjourLesson } from '../data/openings/witty-alien-bonjour-lessons'
import { getWittyAlienElephantLesson } from '../data/openings/witty-alien-elephant-lessons'
import { getWittyAlienEnglundLesson } from '../data/openings/witty-alien-englund-lessons'
import { getWittyAlienDanishLesson } from '../data/openings/witty-alien-danish-lessons'
import { getWittyAlienScandiLesson } from '../data/openings/witty-alien-scandi-lessons'

const OPENINGS = [
  { tree: WITTY_ALIEN, get: getWittyAlienLesson },
  { tree: WITTY_ALIEN_MARTIAN, get: getWittyAlienMartianLesson },
  { tree: WITTY_ALIEN_TWO_KNIGHTS, get: getWittyAlienTwoKnightsLesson },
  { tree: WITTY_ALIEN_BONJOUR, get: getWittyAlienBonjourLesson },
  { tree: WITTY_ALIEN_ELEPHANT, get: getWittyAlienElephantLesson },
  { tree: WITTY_ALIEN_ENGLUND, get: getWittyAlienEnglundLesson },
  { tree: WITTY_ALIEN_DANISH, get: getWittyAlienDanishLesson },
  { tree: WITTY_ALIEN_SCANDI, get: getWittyAlienScandiLesson },
]

const place = (f: string) => f.split(' ')[0]
const VAL: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 99 }

let flags = 0

for (const { tree, get } of OPENINGS) {
  const playerColor = tree.nodes.find((n: any) => n.side)?.side === 'white' ? 'w' : 'b'
  for (const node of tree.nodes as any[]) {
    const lesson = get(node.id)
    if (!lesson) continue
    const me = (lesson.defaultOrientation === 'white' ? 'w' : 'b')
    const them = me === 'w' ? 'b' : 'w'
    const steps = lesson.steps as any[]

    // collect ordered player moves with their starting FEN
    const pm = steps.filter(s => s.type === 'play-move' && s.correctMove)
    for (let k = 0; k < pm.length - 1; k++) {
      const cur = pm[k]
      const nxt = pm[k + 1]
      // P0 = position after the player makes the current taught move (opponent to move)
      let P0: Chess
      try {
        P0 = new Chess(cur.fen)
        P0.move(cur.correctMove)
      } catch { continue }
      if (P0.turn() !== them) continue

      const findQueen = (g: Chess) => {
        for (const row of g.board()) for (const sq of row)
          if (sq && sq.type === 'q' && sq.color === me) return sq.square
        return null
      }
      const qSq = findQueen(P0)
      if (!qSq) continue

      // The student blindly follows the script: whatever the opponent does, they
      // play nxt.correctMove next. Find any opponent move T such that, after the
      // student plays nxt.correctMove, the opponent can win the queen.
      let worst: { T: string; loss: number; line: string } | null = null
      for (const T of P0.moves({ verbose: true }) as any[]) {
        const P1 = new Chess(P0.fen()); P1.move(T)
        // student blindly plays the next scripted move
        let okMove = false
        try { okMove = !!P1.move(nxt.correctMove) } catch { okMove = false }
        if (!okMove) continue
        const P2 = P1 // opponent to move again
        const q2 = findQueen(P2)
        if (!q2) continue
        // can opponent capture the queen now?
        const cap = (P2.moves({ verbose: true }) as any[]).find(m => m.to === q2 && m.captured === 'q')
        if (!cap) continue
        // net material: queen (9) minus whatever the player can recapture the capturer for
        const P3 = new Chess(P2.fen()); P3.move(cap)
        const recap = (P3.moves({ verbose: true }) as any[]).find(m => m.to === cap.to)
        const loss = 9 - (recap ? VAL[cap.piece] : 0)
        if (loss >= 3 && (!worst || loss > worst.loss)) {
          worst = { T: T.san, loss, line: `${T.san} ${nxt.correctMove} ${cap.san}` }
        }
      }
      if (!worst) continue

      flags++
      console.log(`❌ ${tree.slug} / ${node.id}: you play ${cur.correctMove}, queen on ${qSq}.`)
      console.log(`     If opponent plays ${worst.T} (legal/natural), the scripted next move ${nxt.correctMove} hangs the queen: ${worst.line} (net -${worst.loss})`)
    }
  }
}

console.log(`\n${flags === 0 ? '✅ No queen-trap patterns found.' : `❌ ${flags} queen-trap pattern(s) found.`}`)
