// Verifies every Witty Alien opening lesson with chess.js.
// Flags: illegal correctMove, wrong side-to-move, broken position chains,
// and scripted opponent replies that capture the player's queen.
import { Chess } from 'chess.js'

import { WITTY_ALIEN } from '../data/openings/witty-alien'
import { WITTY_ALIEN_MARTIAN } from '../data/openings/witty-alien-martian'
import { WITTY_ALIEN_BONJOUR } from '../data/openings/witty-alien-bonjour'
import { WITTY_ALIEN_ELEPHANT } from '../data/openings/witty-alien-elephant'
import { WITTY_ALIEN_ENGLUND } from '../data/openings/witty-alien-englund'
import { WITTY_ALIEN_DANISH } from '../data/openings/witty-alien-danish'
import { WITTY_ALIEN_SCANDI } from '../data/openings/witty-alien-scandi'

import { getWittyAlienLesson } from '../data/openings/witty-alien-lessons'
import { getWittyAlienMartianLesson } from '../data/openings/witty-alien-martian-lessons'
import { getWittyAlienBonjourLesson } from '../data/openings/witty-alien-bonjour-lessons'
import { getWittyAlienElephantLesson } from '../data/openings/witty-alien-elephant-lessons'
import { getWittyAlienEnglundLesson } from '../data/openings/witty-alien-englund-lessons'
import { getWittyAlienDanishLesson } from '../data/openings/witty-alien-danish-lessons'
import { getWittyAlienScandiLesson } from '../data/openings/witty-alien-scandi-lessons'

const OPENINGS = [
  { tree: WITTY_ALIEN, get: getWittyAlienLesson },
  { tree: WITTY_ALIEN_MARTIAN, get: getWittyAlienMartianLesson },
  { tree: WITTY_ALIEN_BONJOUR, get: getWittyAlienBonjourLesson },
  { tree: WITTY_ALIEN_ELEPHANT, get: getWittyAlienElephantLesson },
  { tree: WITTY_ALIEN_ENGLUND, get: getWittyAlienEnglundLesson },
  { tree: WITTY_ALIEN_DANISH, get: getWittyAlienDanishLesson },
  { tree: WITTY_ALIEN_SCANDI, get: getWittyAlienScandiLesson },
]

const place = (fen: string) => fen.split(' ')[0]
const turn = (fen: string) => fen.split(' ')[1]
const ply = (fen: string) => {
  const p = fen.split(' ')
  const full = parseInt(p[5] ?? '1', 10)
  return (full - 1) * 2 + (p[1] === 'b' ? 1 : 0)
}

let bugCount = 0
function bug(loc: string, msg: string) {
  bugCount++
  console.log(`  ❌ [${loc}] ${msg}`)
}

for (const { tree, get } of OPENINGS) {
  console.log(`\n=== ${tree.name} (${tree.slug}) ===`)
  const ids = tree.nodes.map((n: any) => n.id)
  for (const id of ids) {
    const lesson = get(id)
    if (!lesson) {
      if ((tree.nodes.find((n: any) => n.id === id) as any)?.type !== 'test')
        console.log(`  ⚠️  no lesson for node ${id}`)
      continue
    }
    const steps = lesson.steps as any[]
    const defaultO = lesson.defaultOrientation
    // pending = the player's last move, awaiting connectivity check against
    // the very next position the lesson shows (the opponent's scripted reply).
    let pending: { fen: string; move: string } | null = null
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i]
      const loc = `${id} step ${i}`
      if (!s.fen) continue

      // 1) FEN must be legal
      try {
        new Chess(s.fen)
      } catch (e: any) {
        bug(loc, `illegal FEN: ${s.fen} — ${e.message}`)
        pending = null
        continue
      }

      // 2) connectivity: the immediate next shown position after a player move
      //    must be reachable in 0 or 1 opponent moves. A break = the board
      //    "jumps" to a wrong position right after you move.
      if (pending) {
        let afterPrev: Chess | null = null
        try {
          afterPrev = new Chess(pending.fen)
          afterPrev.move(pending.move)
        } catch {
          afterPrev = null
        }
        if (afterPrev) {
          // Only check genuine forward continuity: the next shown position must
          // be the same position (0 opponent moves, re-shown) or exactly one
          // opponent move later. Backward jumps = benign section/recap resets;
          // multi-ply jumps = narration skipping ahead. Both are skipped.
          const fromPly = ply(afterPrev.fen())
          const toPly = ply(s.fen)
          if (toPly === fromPly || toPly === fromPly + 1) {
            const target = place(s.fen)
            let connected = place(afterPrev.fen()) === target
            let capturedQueen = false
            if (!connected) {
              for (const m of afterPrev.moves({ verbose: true }) as any[]) {
                const t = new Chess(afterPrev.fen())
                t.move(m)
                if (place(t.fen()) === target) {
                  connected = true
                  if (m.captured === 'q') capturedQueen = true
                  break
                }
              }
            }
            if (!connected) {
              bug(loc, `position does NOT connect from your move ${pending.move} (@ ${pending.fen}). Next shown: ${s.fen}`)
            } else if (capturedQueen) {
              bug(loc, `scripted opponent reply CAPTURES YOUR QUEEN right after you play ${pending.move}`)
            }
          }
        }
        pending = null
      }

      // 3) play-move validation
      if (s.type === 'play-move' && s.correctMove) {
        const o = s.orientation ?? defaultO
        const wantTurn = o === 'white' ? 'w' : 'b'
        if (turn(s.fen) !== wantTurn) {
          bug(loc, `side-to-move mismatch: fen says '${turn(s.fen)}' to move but orientation '${o}' (move ${s.correctMove})`)
        }
        const test = new Chess(s.fen)
        let ok = false
        try {
          ok = !!test.move(s.correctMove)
        } catch {
          ok = false
        }
        if (!ok) {
          bug(loc, `ILLEGAL correctMove '${s.correctMove}' in ${s.fen}`)
        }
        pending = { fen: s.fen, move: s.correctMove }
      }
    }
  }
}

console.log(`\n${'='.repeat(50)}`)
console.log(bugCount === 0 ? '✅ No issues found.' : `❌ ${bugCount} issue(s) found.`)
process.exit(bugCount === 0 ? 0 : 1)
