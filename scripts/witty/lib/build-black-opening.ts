// Generator core for trick-weapon BLACK openings (the skill's lesson stage).
// Input: a spec of real lines (SAN ply sequences + voice). Output: tree +
// lessons objects with chess.js-computed FENs (correct by construction) and
// auto-derived highlight squares. The data is impossible to desync because
// every FEN is produced by actually playing the moves.
import { Chess } from 'chess.js'

export interface PlySpec {
  san: string
  // player (black) plies only:
  teach?: string        // instruction shown before the play-move
  prompt?: string
  hint?: string
  ok?: string           // correctFeedback
  wrong?: string
  highlight?: string[]  // override (default: [from,to] of the move)
  arrow?: [string, string] // postMoveArrow after a correct move
  accept?: string[]     // additional accepted moves
}

export interface LineSpec {
  id: string
  title: string
  type: 'main' | 'deviation'
  intro: string
  outro: string
  plies: PlySpec[]      // full sequence from move 1, alternating White, Black
  teachFrom: number     // index of the FIRST taught player (black) ply; recap covers [0, teachFrom)
  teachCount?: number   // how many player moves this node teaches (default 3)
  row: number
  col: number
  lineFrom: string | null
}

export interface OpeningSpec {
  id: string
  slug: string
  name: string
  description: string
  color: string
  colorDark: string
  completionOrder: string[]
  lines: LineSpec[]
  test: { id: string; title: string; intro: string; outro: string; row: number; col: number; lineFrom: string | null }
}

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// Replay a ply list, returning fenBefore[i], fenAfter[i] and verbose move info.
function replay(plies: PlySpec[]) {
  const c = new Chess()
  const before: string[] = []
  const after: string[] = []
  const info: { from: string; to: string; color: 'w' | 'b'; san: string }[] = []
  for (let i = 0; i < plies.length; i++) {
    before[i] = c.fen()
    const mv = c.move(plies[i].san)
    if (!mv) throw new Error(`illegal move ${plies[i].san} at ply ${i} in ${before[i]}`)
    after[i] = c.fen()
    info[i] = { from: mv.from, to: mv.to, color: mv.color, san: mv.san }
  }
  return { before, after, info }
}

const moveNo = (ply: number) => Math.floor(ply / 2) + 1
const wLabel = (ply: number, san: string) => `${moveNo(ply)}.${san}`

// player (black) plies this node teaches: first `teachCount` black plies at idx >= teachFrom
function taughtPlies(line: LineSpec): number[] {
  return line.plies
    .map((_, i) => i)
    .filter(i => i % 2 === 1 && i >= line.teachFrom)
    .slice(0, line.teachCount ?? 3)
}

export function buildBlackOpening(spec: OpeningSpec) {
  // ---- TREE ----
  const nodes: any[] = []
  for (const line of spec.lines) {
    const { info } = replay(line.plies)
    const taught = taughtPlies(line)
    const moves = taught.map(j => `${wLabel(j - 1, info[j - 1].san)} ${info[j].san}`)
    nodes.push({
      id: line.id,
      name: line.title,
      moves,
      description: line.intro,
      type: line.type,
      row: line.row,
      col: line.col,
      lineFrom: line.lineFrom,
      unlockedBy: null,
      side: 'black',
    })
  }
  nodes.push({
    id: spec.test.id, name: spec.test.title, moves: [],
    description: spec.test.intro, type: 'test',
    row: spec.test.row, col: spec.test.col, lineFrom: spec.test.lineFrom,
    unlockedBy: null, side: 'black',
  })

  const tree = {
    id: spec.id, name: spec.name, slug: spec.slug, description: spec.description,
    color: spec.color, colorDark: spec.colorDark,
    completionOrder: spec.completionOrder, nodes,
  }

  // ---- LESSONS ----
  const lessons: Record<string, any> = {}
  for (const line of spec.lines) {
    lessons[line.id] = buildLesson(line)
  }
  lessons[spec.test.id] = buildTest(spec)

  return { tree, lessons }
}

function buildLesson(line: LineSpec) {
  const { before, after, info } = replay(line.plies)
  const n = line.plies.length
  const steps: any[] = []
  const hl = (i: number) => [info[i].from, info[i].to]

  const introFen = before[line.teachFrom]
  steps.push({ type: 'instruction', fen: introFen, text: line.intro })

  // RECAP — replay [0, teachFrom): white moves auto-advance, black moves are quick play-moves
  if (line.teachFrom > 1) {
    steps.push({ type: 'instruction', fen: START, text: 'Quick recap to the position.' })
    for (let i = 0; i < line.teachFrom; i++) {
      if (info[i].color === 'w') {
        steps.push({ type: 'instruction', fen: after[i], text: `${wLabel(i, info[i].san)}.`, autoAdvance: 800, highlightSquares: hl(i) })
      } else {
        steps.push({ type: 'play-move', fen: before[i], correctMove: info[i].san, prompt: 'Your move.', hint: `${info[i].san}.`, correctFeedback: `${info[i].san}.`, wrongFeedback: `${info[i].san}.`, orientation: 'black' })
      }
    }
  } else if (line.teachFrom === 1) {
    // first lesson: just show White's opening move before the first teach
    steps.push({ type: 'instruction', fen: after[0], text: `${wLabel(0, info[0].san)}.`, autoAdvance: 800, highlightSquares: hl(0) })
  }

  // TEACH — each taught player ply
  const taught = taughtPlies(line)
  const lastTaught = taught[taught.length - 1]
  for (const j of taught) {
    const p = line.plies[j]
    steps.push({ type: 'instruction', fen: before[j], text: p.teach ?? '', highlightSquares: p.highlight ?? hl(j) })
    const pm: any = {
      type: 'play-move', fen: before[j], correctMove: p.san,
      prompt: p.prompt ?? 'Your move.', hint: p.hint ?? `${p.san}.`,
      correctFeedback: p.ok ?? `${p.san}.`, wrongFeedback: p.wrong ?? `Play ${p.san}.`,
      orientation: 'black',
    }
    if (p.arrow) pm.postMoveArrow = p.arrow
    if (p.accept) pm.acceptMoves = p.accept
    steps.push(pm)
    // White's reply (next ply), if any, as a lead-in
    if (j + 1 < n) {
      steps.push({ type: 'instruction', fen: after[j + 1], text: `${wLabel(j + 1, info[j + 1].san)}.`, autoAdvance: 800, highlightSquares: hl(j + 1) })
    }
  }

  // RECALL — terse replay of just the taught moves
  steps.push({ type: 'instruction', fen: before[taught[0]], text: `Recall: ${taught.map(j => info[j].san).join(', ')}.` })
  for (const j of taught) {
    steps.push({ type: 'play-move', fen: before[j], correctMove: info[j].san, prompt: 'Your move.', hint: `${info[j].san}.`, correctFeedback: `${info[j].san}.`, wrongFeedback: `${info[j].san}.`, orientation: 'black' })
    if (j !== lastTaught && j + 1 < n) steps.push({ type: 'instruction', fen: after[j + 1], text: `${wLabel(j + 1, info[j + 1].san)}.`, autoAdvance: 800, highlightSquares: hl(j + 1) })
  }

  // OUTRO — show the position right after the node's last taught move (+ White's reply)
  const outroPly = Math.min(lastTaught + 1, n - 1)
  steps.push({ type: 'instruction', fen: after[outroPly], text: line.outro })

  return { id: line.id, title: line.title, defaultOrientation: 'black', steps }
}

function buildTest(spec: OpeningSpec) {
  const steps: any[] = []
  steps.push({ type: 'instruction', fen: START, text: spec.test.intro, buttonText: "LET'S GO" })
  const seenMain = new Set<PlySpec[]>()
  const replaySection = (title: string, plies: PlySpec[], upto: number) => {
    const { before, after, info } = replay(plies)
    steps.push({ type: 'instruction', fen: START, text: `— ${title} —` })
    for (let i = 0; i <= upto; i++) {
      if (info[i].color === 'w') steps.push({ type: 'instruction', fen: after[i], text: `${wLabel(i, info[i].san)}.`, autoAdvance: 800, highlightSquares: [info[i].from, info[i].to] })
      else steps.push({ type: 'play-move', fen: before[i], correctMove: info[i].san, prompt: 'Your move.', hint: `${info[i].san}.`, correctFeedback: `${info[i].san}.`, wrongFeedback: `${info[i].san}.`, orientation: 'black' })
    }
  }
  for (const line of spec.lines) {
    if (line.type === 'main') {
      if (seenMain.has(line.plies)) continue       // main nodes share one plies array — test it once, fully
      seenMain.add(line.plies)
      replaySection('Main line', line.plies, line.plies.length - 1)
    } else {
      const taught = taughtPlies(line)
      replaySection(line.title, line.plies, taught[taught.length - 1])
    }
  }
  steps.push({ type: 'instruction', fen: START, text: spec.test.outro })
  return { id: spec.test.id, title: spec.test.title, defaultOrientation: 'black', steps }
}

// ---- SERIALIZER ----
export function serializeTree(tree: any, exportName: string): string {
  return `// GENERATED by scripts/witty/build-${tree.slug.replace('witty-alien-', '')}.ts — do not edit by hand.
// Source: witty_alien's real chess.com games. Edit the spec + regenerate.
import type { OpeningTree } from './ruy-lopez'

export const ${exportName}: OpeningTree = ${JSON.stringify(tree, null, 2)}
`
}

export function serializeLessons(lessons: any, getterName: string, recordName: string): string {
  return `// GENERATED — do not edit by hand. Source: witty_alien's real chess.com games.
import type { OpeningLesson } from '@/types/opening-lesson'

const ${recordName}: Record<string, OpeningLesson> = ${JSON.stringify(lessons, null, 2)}

export function ${getterName}(id: string): OpeningLesson | undefined {
  return ${recordName}[id]
}
`
}
