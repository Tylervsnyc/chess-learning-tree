// Verifies the "reveal one at a time" unlock behavior for every Witty Alien
// opening, using the EXACT isNodeUnlocked logic from OpeningTreeView.tsx.
import { TREE_LOOKUP } from '../../lib/opening-trees'
import type { OpeningNode } from '../../data/openings/ruy-lopez'

function isNodeUnlocked(
  node: OpeningNode,
  completed: Set<string>,
  allNodes: OpeningNode[],
  completionOrder: string[],
): boolean {
  if (!node.unlockedBy) return true
  if (Array.isArray(node.unlockedBy)) {
    if (node.unlockedBy.every(id => completed.has(id))) return true
  } else if (completed.has(node.unlockedBy)) {
    return true
  }
  if (node.type === 'deviation') {
    const nodeIdx = completionOrder.indexOf(node.id)
    if (nodeIdx >= 0) {
      for (let i = nodeIdx + 1; i < completionOrder.length; i++) {
        const laterNode = allNodes.find(n => n.id === completionOrder[i])
        if (laterNode?.type === 'test' && completed.has(laterNode.id)) return true
      }
    }
  }
  return false
}

const visibleIds = (nodes: OpeningNode[], completed: Set<string>, order: string[]) =>
  nodes.filter(n => completed.has(n.id) || isNodeUnlocked(n, completed, nodes, order)).map(n => n.id)

const slugs = Object.keys(TREE_LOOKUP).filter(s => s.startsWith('witty-alien'))
let allOk = true

for (const slug of slugs) {
  const tree = TREE_LOOKUP[slug]
  const order = tree.completionOrder
  const ids = new Set(tree.nodes.map(n => n.id))
  const problems: string[] = []

  // 1) completionOrder must cover every node, no orphans/dupes
  const orderSet = new Set(order)
  if (orderSet.size !== order.length) problems.push('completionOrder has duplicates')
  for (const id of order) if (!ids.has(id)) problems.push(`order id "${id}" not in nodes`)
  for (const n of tree.nodes) if (!orderSet.has(n.id)) problems.push(`node "${n.id}" missing from completionOrder`)

  // 2) Fresh opening (nothing completed) → ONLY the first node visible
  const fresh = visibleIds(tree.nodes, new Set(), order)
  if (fresh.length !== 1 || fresh[0] !== order[0]) {
    problems.push(`fresh tree shows [${fresh.join(', ')}] — expected only [${order[0]}]`)
  }

  // 3) Walk the order: after completing the first k, exactly k+1 nodes visible
  //    (the k completed + the single next), i.e. one reveals at a time.
  for (let k = 1; k < order.length; k++) {
    const completed = new Set(order.slice(0, k))
    const vis = visibleIds(tree.nodes, completed, order)
    const expected = order.slice(0, k + 1)
    const visSet = new Set(vis)
    const missing = expected.filter(id => !visSet.has(id))
    const extra = vis.filter(id => !new Set(expected).has(id))
    if (missing.length || extra.length) {
      problems.push(`after completing ${k}: missing[${missing.join(',')}] extra[${extra.join(',')}]`)
    }
  }

  const status = problems.length === 0 ? 'OK ' : 'FAIL'
  if (problems.length) allOk = false
  console.log(`${status} ${slug}  (${tree.nodes.length} nodes)`)
  for (const p of problems) console.log(`      ↳ ${p}`)
}

console.log(allOk ? '\nALL WITTY OPENINGS PASS — reveal one at a time.' : '\nSOME FAILED ↑')
process.exit(allOk ? 0 : 1)
