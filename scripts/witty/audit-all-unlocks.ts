// Audits unlock integrity for EVERY opening tree, using the exact
// isNodeUnlocked logic from OpeningTreeView.tsx. Separates hard bugs from
// soft notes (multi-reveal, which can be an intentional branching design).
import { TREE_LOOKUP } from '../../lib/opening-trees'
import type { OpeningNode, OpeningTree } from '../../data/openings/ruy-lopez'

function isNodeUnlocked(
  node: OpeningNode, completed: Set<string>, allNodes: OpeningNode[], completionOrder: string[],
): boolean {
  if (!node.unlockedBy) return true
  if (Array.isArray(node.unlockedBy)) {
    if (node.unlockedBy.every(id => completed.has(id))) return true
  } else if (completed.has(node.unlockedBy)) return true
  if (node.type === 'deviation') {
    const nodeIdx = completionOrder.indexOf(node.id)
    if (nodeIdx >= 0) {
      for (let i = nodeIdx + 1; i < completionOrder.length; i++) {
        const later = allNodes.find(n => n.id === completionOrder[i])
        if (later?.type === 'test' && completed.has(later.id)) return true
      }
    }
  }
  return false
}

const visible = (nodes: OpeningNode[], completed: Set<string>, order: string[]) =>
  nodes.filter(n => completed.has(n.id) || isNodeUnlocked(n, completed, nodes, order)).map(n => n.id)

function auditTree(slug: string, tree: OpeningTree) {
  const bugs: string[] = []
  const notes: string[] = []
  const order = tree.completionOrder
  const ids = new Set(tree.nodes.map(n => n.id))
  const orderSet = new Set(order)

  // --- completionOrder integrity ---
  if (orderSet.size !== order.length) bugs.push('completionOrder has duplicate ids')
  for (const id of order) if (!ids.has(id)) bugs.push(`completionOrder id "${id}" not in nodes`)
  for (const n of tree.nodes) if (!orderSet.has(n.id)) bugs.push(`node "${n.id}" missing from completionOrder (never tappable)`)

  // --- entry node: exactly one always-visible node, and it's the first in order ---
  const alwaysVisible = tree.nodes.filter(n => !n.unlockedBy)
  if (alwaysVisible.length === 0) bugs.push('no entry node (every node has unlockedBy) — nothing shows')
  if (alwaysVisible.length > 1) bugs.push(`${alwaysVisible.length} nodes have unlockedBy:null (mass-unlock bug): ${alwaysVisible.map(n => n.id).join(', ')}`)
  if (alwaysVisible.length >= 1 && alwaysVisible[0].id !== order[0])
    notes.push(`entry node "${alwaysVisible[0].id}" is not completionOrder[0] "${order[0]}"`)

  // --- dangling unlockedBy references ---
  for (const n of tree.nodes) {
    const refs = n.unlockedBy == null ? [] : Array.isArray(n.unlockedBy) ? n.unlockedBy : [n.unlockedBy]
    for (const r of refs) if (!ids.has(r)) bugs.push(`node "${n.id}" unlockedBy "${r}" — id does not exist (dead-locked)`)
  }

  // --- no stuck nodes: completing the full order must reveal every node ---
  const allDone = new Set(order)
  const visAll = new Set(visible(tree.nodes, allDone, order))
  for (const n of tree.nodes) if (!visAll.has(n.id)) bugs.push(`node "${n.id}" never becomes visible even after completing everything`)

  // --- fresh tree should show only entry node(s); count multi-reveal steps ---
  const fresh = visible(tree.nodes, new Set(), order)
  if (fresh.length > 1) notes.push(`fresh tree shows ${fresh.length} nodes: ${fresh.join(', ')}`)
  let multiRevealSteps = 0
  let prevCount = fresh.length
  for (let k = 1; k <= order.length; k++) {
    const vis = visible(tree.nodes, new Set(order.slice(0, k)), order)
    const newlyShown = vis.length - prevCount
    if (newlyShown > 1) multiRevealSteps++
    prevCount = vis.length
  }
  if (multiRevealSteps > 0) notes.push(`${multiRevealSteps} step(s) reveal >1 node at once (branching — may be intentional)`)

  return { bugs, notes }
}

const slugs = Object.keys(TREE_LOOKUP).sort()
let bugCount = 0
const clean: string[] = []
for (const slug of slugs) {
  const { bugs, notes } = auditTree(slug, TREE_LOOKUP[slug])
  if (bugs.length === 0 && notes.length === 0) { clean.push(slug); continue }
  const tag = bugs.length ? 'BUG ' : 'note'
  if (bugs.length) bugCount++
  console.log(`${tag} ${slug} (${TREE_LOOKUP[slug].nodes.length} nodes)`)
  for (const b of bugs) console.log(`      ✗ ${b}`)
  for (const n of notes) console.log(`      · ${n}`)
}
console.log(`\n${clean.length} clean, ${bugCount} with bugs, ${slugs.length} total`)
console.log(clean.length ? `clean: ${clean.join(', ')}` : '')
process.exit(bugCount ? 1 : 0)
