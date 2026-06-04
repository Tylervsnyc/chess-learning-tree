// Generator core for trick-weapon openings (the skill's lesson stage).
// Color-agnostic: the player can be White or Black. Input is a spec of real
// lines (SAN ply sequences + voice); output is tree + lessons objects with
// chess.js-computed FENs (correct by construction) and auto-derived highlight
// squares. The data is impossible to desync — every FEN is produced by
// actually playing the moves.
import { Chess } from 'chess.js'

export interface PlySpec {
  san: string
  // player plies only:
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
  teachFrom: number     // index of the FIRST taught player ply; recap covers [0, teachFrom)
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
  playerColor?: 'white' | 'black' // default 'black'
  completionOrder: string[]
  lines: LineSpec[]
  test: { id: string; title: string; intro: string; outro: string; row: number; col: number; lineFrom: string | null }
}

const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const moveNo = (ply: number) => Math.floor(ply / 2) + 1
const sanLabel = (ply: number, san: string) => `${moveNo(ply)}${ply % 2 === 0 ? '.' : '...'}${san}`

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

function buildContext(spec: OpeningSpec) {
  const player = spec.playerColor ?? 'black'
  const playerParity = player === 'white' ? 0 : 1 // player plies have index % 2 === parity
  const isPlayer = (i: number) => i % 2 === playerParity
  const taughtPlies = (line: LineSpec) =>
    line.plies.map((_, i) => i).filter(i => isPlayer(i) && i >= line.teachFrom).slice(0, line.teachCount ?? 3)
  return { player, isPlayer, taughtPlies }
}

export function buildOpening(spec: OpeningSpec) {
  const ctx = buildContext(spec)

  // Reveal lessons ONE AT A TIME: each node unlocks when the node before it in
  // completionOrder is completed (mirrors the hand-authored openings, e.g.
  // ruy-lopez sets rl-3.unlockedBy = its completionOrder predecessor rl-dev-b5).
  // Without this every node had unlockedBy:null, so the whole tree popped in at
  // once on a brand-new opening. The first node stays null = visible up front.
  const orderIdx = new Map(spec.completionOrder.map((id, i) => [id, i]))
  const unlockedByFor = (id: string, lineFrom: string | null): string | null => {
    const i = orderIdx.get(id)
    if (i === undefined) return lineFrom // not in completionOrder → fall back to structural parent
    return i === 0 ? null : spec.completionOrder[i - 1]
  }

  // ---- TREE ----
  const nodes: any[] = []
  for (const line of spec.lines) {
    const { info } = replay(line.plies)
    const taught = ctx.taughtPlies(line)
    // each taught player ply paired with the opponent move just before it (if any)
    const moves = taught.map(j => {
      const prev = j - 1 >= 0 ? `${sanLabel(j - 1, info[j - 1].san)} ` : ''
      return `${prev}${info[j].san}`.trim()
    })
    nodes.push({
      id: line.id, name: line.title, moves, description: line.intro,
      type: line.type, row: line.row, col: line.col, lineFrom: line.lineFrom,
      unlockedBy: unlockedByFor(line.id, line.lineFrom), side: ctx.player,
    })
  }
  nodes.push({
    id: spec.test.id, name: spec.test.title, moves: [], description: spec.test.intro,
    type: 'test', row: spec.test.row, col: spec.test.col, lineFrom: spec.test.lineFrom,
    unlockedBy: unlockedByFor(spec.test.id, spec.test.lineFrom), side: ctx.player,
  })

  const tree = {
    id: spec.id, name: spec.name, slug: spec.slug, description: spec.description,
    color: spec.color, colorDark: spec.colorDark, completionOrder: spec.completionOrder, nodes,
  }

  // ---- LESSONS ----
  const lessons: Record<string, any> = {}
  for (const line of spec.lines) lessons[line.id] = buildLesson(line, ctx)
  lessons[spec.test.id] = buildTest(spec, ctx)

  return { tree, lessons }
}

type Ctx = ReturnType<typeof buildContext>

function buildLesson(line: LineSpec, ctx: Ctx) {
  const { before, after, info } = replay(line.plies)
  const n = line.plies.length
  const O = ctx.player
  const steps: any[] = []
  const hl = (i: number) => [info[i].from, info[i].to]
  const oppAuto = (i: number) => ({ type: 'instruction', fen: after[i], text: `${sanLabel(i, info[i].san)}.`, autoAdvance: 800, highlightSquares: hl(i) })
  const quickPlay = (i: number) => ({ type: 'play-move', fen: before[i], correctMove: info[i].san, prompt: 'Your move.', hint: `${info[i].san}.`, correctFeedback: `${info[i].san}.`, wrongFeedback: `${info[i].san}.`, orientation: O })

  steps.push({ type: 'instruction', fen: before[line.teachFrom] ?? START, text: line.intro })

  // RECAP / lead-in — replay [0, teachFrom)
  const priorPlayerMoves = line.plies.slice(0, line.teachFrom).filter((_, i) => ctx.isPlayer(i)).length
  if (priorPlayerMoves > 0) steps.push({ type: 'instruction', fen: START, text: 'Quick recap to the position.' })
  for (let i = 0; i < line.teachFrom; i++) steps.push(ctx.isPlayer(i) ? quickPlay(i) : oppAuto(i))

  // TEACH
  const taught = ctx.taughtPlies(line)
  const lastTaught = taught[taught.length - 1]
  for (const j of taught) {
    const p = line.plies[j]
    steps.push({ type: 'instruction', fen: before[j], text: p.teach ?? '', highlightSquares: p.highlight ?? hl(j) })
    const pm: any = { type: 'play-move', fen: before[j], correctMove: p.san, prompt: p.prompt ?? 'Your move.', hint: p.hint ?? `${p.san}.`, correctFeedback: p.ok ?? `${p.san}.`, wrongFeedback: p.wrong ?? `Play ${p.san}.`, orientation: O }
    if (p.arrow) pm.postMoveArrow = p.arrow
    if (p.accept) pm.acceptMoves = p.accept
    steps.push(pm)
    if (j + 1 < n) steps.push(oppAuto(j + 1))
  }

  // RECALL
  steps.push({ type: 'instruction', fen: before[taught[0]], text: `Recall: ${taught.map(j => info[j].san).join(', ')}.` })
  for (const j of taught) {
    steps.push(quickPlay(j))
    if (j !== lastTaught && j + 1 < n) steps.push(oppAuto(j + 1))
  }

  // OUTRO
  steps.push({ type: 'instruction', fen: after[Math.min(lastTaught + 1, n - 1)], text: line.outro })

  return { id: line.id, title: line.title, defaultOrientation: O, steps }
}

function buildTest(spec: OpeningSpec, ctx: Ctx) {
  const O = ctx.player
  const steps: any[] = []
  steps.push({ type: 'instruction', fen: START, text: spec.test.intro, buttonText: "LET'S GO" })
  const seenMain = new Set<PlySpec[]>()
  const section = (title: string, plies: PlySpec[], upto: number) => {
    const { before, after, info } = replay(plies)
    steps.push({ type: 'instruction', fen: START, text: `— ${title} —` })
    for (let i = 0; i <= upto; i++) {
      if (ctx.isPlayer(i)) steps.push({ type: 'play-move', fen: before[i], correctMove: info[i].san, prompt: 'Your move.', hint: `${info[i].san}.`, correctFeedback: `${info[i].san}.`, wrongFeedback: `${info[i].san}.`, orientation: O })
      else steps.push({ type: 'instruction', fen: after[i], text: `${sanLabel(i, info[i].san)}.`, autoAdvance: 800, highlightSquares: [info[i].from, info[i].to] })
    }
  }
  for (const line of spec.lines) {
    if (line.type === 'main') {
      if (seenMain.has(line.plies)) continue
      seenMain.add(line.plies)
      section('Main line', line.plies, line.plies.length - 1)
    } else {
      const taught = ctx.taughtPlies(line)
      section(line.title, line.plies, taught[taught.length - 1])
    }
  }
  steps.push({ type: 'instruction', fen: START, text: spec.test.outro })
  return { id: spec.test.id, title: spec.test.title, defaultOrientation: O, steps }
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

// Back-compat alias (the elephant build imports buildBlackOpening).
export const buildBlackOpening = buildOpening
