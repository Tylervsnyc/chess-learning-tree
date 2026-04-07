'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { OpeningTree, OpeningNode } from '@/data/openings/ruy-lopez'
import { lightenColor } from '@/lib/color-utils'

// ============================================================
// CONSTANTS
// ============================================================

const PAD = 12
const DEFAULT_COLOR = '#FF9600'
const DEFAULT_COLOR_DARK = '#CC7800'
const DEVIATION_COLOR = '#0D9488'
const DEVIATION_DARK = '#0F766E'
const TEST_COLOR = '#8B5CF6'
const TEST_DARK = '#6D28D9'
const GOLD = '#FFC800'
const GOLD_DARK = '#CC9E00'
const LINE_DRAW_MS = 500

type NodeStatus = 'completed' | 'current' | 'upcoming'

// ============================================================
// GRID ENGINE — fixed positions, deterministic layout
// ============================================================

interface GridResult {
  nodeSize: number
  fontSize: number
  lineThick: number
  positioned: PositionedNode[]
  connections: Connection[]
  frameW: number
  frameH: number
  gridToPixel: (col: number, row: number) => { cx: number; cy: number }
}

interface PositionedNode {
  node: OpeningNode
  cx: number
  cy: number
}

interface Connection {
  from: PositionedNode
  to: PositionedNode
}

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
  // Completing a level test unlocks all deviations for that level.
  // If any test after this node in completionOrder is completed, unlock it.
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

function computeGrid(
  allNodes: OpeningNode[],
  completed: Set<string>,
  frameW: number,
  frameH: number,
  completionOrder: string[],
): GridResult | null {
  if (frameW < 10 || frameH < 10) return null

  const PAD_BOTTOM = 48 // Extra space for bottom labels
  const usableW = frameW - PAD * 2
  const usableH = frameH - PAD - PAD_BOTTOM

  const allCols = allNodes.map(n => n.col)
  const allRows = allNodes.map(n => n.row)
  const minCol = Math.min(...allCols)
  const maxCol = Math.max(...allCols)
  const maxRow = Math.max(...allRows)
  const gridCols = maxCol - minCol + 1
  const gridRows = maxRow + 1

  const cellW = usableW / gridCols
  const cellH = usableH / gridRows

  const nodeSize = Math.max(32, Math.min(80, Math.floor(Math.min(cellW, cellH) * 0.35)))
  const fontSize = Math.max(9, Math.round(nodeSize * 0.17))
  const lineThick = Math.max(2.5, nodeSize * 0.05)

  function gridToPixel(col: number, row: number) {
    const cx = PAD + (col - minCol + 0.5) * cellW
    const cy = frameH - PAD_BOTTOM - (row + 0.5) * cellH
    return { cx, cy }
  }

  const visible = allNodes.filter(n => completed.has(n.id) || isNodeUnlocked(n, completed, allNodes, completionOrder))
  const visibleIds = new Set(visible.map(n => n.id))

  const positioned = visible.map(n => {
    const { cx, cy } = gridToPixel(n.col, n.row)
    return { node: n, cx, cy }
  })

  const connections: Connection[] = []
  for (const n of visible) {
    if (n.lineFrom && visibleIds.has(n.lineFrom)) {
      const from = positioned.find(p => p.node.id === n.lineFrom)
      const to = positioned.find(p => p.node.id === n.id)
      if (from && to) connections.push({ from, to })
    }
  }

  return { nodeSize, fontSize, lineThick, positioned, connections, frameW, frameH, gridToPixel }
}

// ============================================================
// LINE PATH — L-shapes, never diagonal
// ============================================================

function buildLinePath(x1: number, y1: number, x2: number, y2: number, r: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const sameCol = Math.abs(dx) < 2
  const sameRow = Math.abs(dy) < 2

  if (sameCol) {
    const startY = dy < 0 ? y1 - r : y1 + r
    const endY = dy < 0 ? y2 + r : y2 - r
    return { d: `M ${x1} ${startY} L ${x1} ${endY}`, len: Math.abs(endY - startY) }
  }
  if (sameRow) {
    const startX = dx > 0 ? x1 + r : x1 - r
    const endX = dx > 0 ? x2 - r : x2 + r
    return { d: `M ${startX} ${y1} L ${endX} ${y1}`, len: Math.abs(endX - startX) }
  }

  // Vertical first (up), then horizontal (over) — cleaner tree look
  const startY = dy < 0 ? y1 - r : y1 + r
  const endX = dx > 0 ? x2 - r : x2 + r
  const cornerX = x1
  const cornerY = y2
  const vLen = Math.abs(cornerY - startY)
  const hLen = Math.abs(endX - cornerX)
  return {
    d: `M ${x1} ${startY} L ${cornerX} ${cornerY} L ${endX} ${cornerY}`,
    len: vLen + hLen,
  }
}

// ============================================================
// ICONS
// ============================================================

function CheckIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PlayIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 5v14l11-7L8 5z" fill={color} />
    </svg>
  )
}
function DeviationIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z" />
    </svg>
  )
}
function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

// ============================================================
// TREE NODE
// ============================================================

function TreeNodeEl({
  pos,
  status,
  nodeSize,
  fontSize,
  isHidden,
  isNew,
  onTap,
  accentColor,
  accentColorDark,
}: {
  pos: PositionedNode
  status: NodeStatus
  nodeSize: number
  fontSize: number
  isHidden: boolean
  isNew: boolean
  onTap: (id: string) => void
  accentColor: string
  accentColorDark: string
}) {
  // Label fades in AFTER the node button animation finishes.
  // Nodes present on initial load show labels immediately.
  const [labelVisible, setLabelVisible] = useState(!isNew)

  useEffect(() => {
    if (!isHidden && !labelVisible) {
      // grow-in is 0.65s — show label right after
      const timer = setTimeout(() => setLabelVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [isHidden, labelVisible])

  const n = pos.node
  const r = nodeSize / 2
  const depthY = Math.max(3, nodeSize * 0.08)
  const depthX = Math.max(2, nodeSize * 0.04)
  const iconSize = nodeSize * 0.4
  const isTest = n.type === 'test'
  const isDeviation = n.type === 'deviation'

  let topColor: string, botColor: string
  if (status === 'completed') {
    topColor = GOLD; botColor = GOLD_DARK
  } else if (isDeviation) {
    topColor = status === 'current' ? DEVIATION_COLOR : lightenColor(DEVIATION_COLOR, 0.3); botColor = DEVIATION_DARK
  } else if (isTest) {
    topColor = status === 'current' ? TEST_COLOR : lightenColor(TEST_COLOR, 0.3); botColor = TEST_DARK
  } else {
    topColor = status === 'current' ? accentColor : lightenColor(accentColor, 0.3); botColor = accentColorDark
  }

  const iconColor = status === 'completed' ? GOLD_DARK : '#fff'
  const nodeOpacity = status === 'completed' ? 0.85 : status === 'current' ? 1 : 0.65
  const borderRadius = isTest ? '20%' : '100%'
  const ringColor = isDeviation ? DEVIATION_COLOR : isTest ? TEST_COLOR : accentColor

  let icon
  if (status === 'completed') icon = <CheckIcon size={iconSize} color={iconColor} />
  else if (isTest) icon = <StarIcon size={iconSize} color={iconColor} />
  else if (isDeviation) icon = <DeviationIcon size={iconSize} color={iconColor} />
  else icon = <PlayIcon size={iconSize} color={iconColor} />

  // Window style — subtle tint matching node type
  const windowStyle = isDeviation
    ? { bg: '#F0FDFA', border: '#99F6E4', accent: '#0D9488' }
    : isTest
      ? { bg: '#F5F3FF', border: '#DDD6FE', accent: '#7C3AED' }
      : status === 'completed'
        ? { bg: '#FFFBEB', border: '#FDE68A', accent: '#B45309' }
        : { bg: '#FFF8F0', border: '#FED7AA', accent: '#9A6B3A' }

  return (
    <div
      className="absolute cursor-pointer"
      data-id={n.id}
      onClick={() => onTap(n.id)}
      style={{
        left: pos.cx - r,
        top: pos.cy - r,
        width: nodeSize,
        opacity: nodeOpacity,
        zIndex: 2,
        transformOrigin: 'center center',
        ...(isHidden ? { transform: 'scale(0)' } : {}),
      }}
    >
      {status === 'current' && !isHidden && (
        <div
          className="tree-pulse-ring absolute"
          style={{
            width: nodeSize + 20,
            height: nodeSize + 20,
            border: `3px solid ${ringColor}`,
            top: -10,
            left: -10,
            borderRadius: isTest ? 24 : '100%',
          }}
        />
      )}

      <div className="relative" style={{ width: nodeSize, height: nodeSize + depthY }}>
        <div className="absolute" style={{ width: nodeSize, height: nodeSize, top: depthY, left: depthX, background: botColor, borderRadius }} />
        <div className="absolute flex items-center justify-center" style={{ width: nodeSize, height: nodeSize, top: 0, left: 0, background: topColor, borderRadius }}>
          {icon}
        </div>
      </div>

      {/* Label window — tinted card, fades in after node animation, above everything */}
      {labelVisible && (
        <div
          className="tree-label-fade-in"
          style={{
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: depthY + 4,
            zIndex: 50,
            width: Math.max(nodeSize * 1.8, 70),
          }}
        >
          <div
            style={{
              background: windowStyle.bg,
              border: `1.5px solid ${windowStyle.border}`,
              borderRadius: 8,
              padding: `${Math.max(2, fontSize * 0.3)}px ${Math.max(4, fontSize * 0.5)}px`,
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="font-bold"
              style={{
                fontSize,
                color: 'var(--color-chess-text)',
                lineHeight: 1.25,
              }}
            >
              {n.name}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// TREE LINES (SVG)
// ============================================================

function TreeLines({
  connections,
  nodeSize,
  lineThick,
  frameW,
  frameH,
  excludeIds,
}: {
  connections: Connection[]
  nodeSize: number
  lineThick: number
  frameW: number
  frameH: number
  excludeIds?: Set<string>
}) {
  const r = nodeSize / 2
  const dotGap = Math.max(4, nodeSize * 0.08)
  const dotDash = `${dotGap * 0.4} ${dotGap * 0.6}`

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} width={frameW} height={frameH}>
      {connections.map((conn, i) => {
        if (excludeIds?.has(conn.to.node.id)) return null
        const { d } = buildLinePath(conn.from.cx, conn.from.cy, conn.to.cx, conn.to.cy, r)
        return (
          <path
            key={i}
            d={d}
            stroke="#58CC02"
            strokeWidth={lineThick}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dotDash}
          />
        )
      })}
    </svg>
  )
}

// ============================================================
// MAIN TREE VIEW
// ============================================================

export default function OpeningTreeView({
  tree,
  completedLessonIds = [],
  currentLessonId = null,
  onLessonTap,
  accentColor,
  accentColorDark,
}: {
  tree: OpeningTree
  completedLessonIds?: string[]
  currentLessonId?: string | null
  onLessonTap?: (nodeId: string) => void
  accentColor?: string
  accentColorDark?: string
}) {
  const COLOR = accentColor || DEFAULT_COLOR
  const COLOR_DARK = accentColorDark || DEFAULT_COLOR_DARK
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(new Set<string>())
  const initializedRef = useRef(false)
  const overlayRef = useRef<SVGSVGElement | null>(null)
  const rafRef = useRef<number>(0)

  const [dims, setDims] = useState({ w: 0, h: 0 })
  // Incrementing this forces a re-render (clears pendingIds after animation)
  const [tick, setTick] = useState(0)

  // Measure frame
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry) setDims({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const completedSet = useMemo(() => new Set(completedLessonIds), [completedLessonIds])

  const grid = useMemo(
    () => computeGrid(tree.nodes, completedSet, dims.w, dims.h, tree.completionOrder),
    [tree.nodes, completedSet, dims.w, dims.h, tree.completionOrder],
  )

  const getStatus = useCallback((node: OpeningNode): NodeStatus => {
    if (completedSet.has(node.id)) return 'completed'
    if (node.id === currentLessonId) return 'current'
    return 'upcoming'
  }, [completedSet, currentLessonId])

  const handleTap = useCallback((nodeId: string) => {
    onLessonTap?.(nodeId)
  }, [onLessonTap])

  // Arrow overlay pointing at first node of the next level after completing a test
  const levelArrows = useMemo(() => {
    if (!grid) return []
    const arrows: { targetCx: number; targetCy: number; nodeSize: number; level: number; targetId: string }[] = []
    // Find completed test nodes that unlock a next level
    const testNodes = grid.positioned.filter(p => p.node.type === 'test' && completedSet.has(p.node.id))
    for (const tn of testNodes) {
      // Find the node unlocked by this test (first node of next level)
      const nextNode = grid.positioned.find(p =>
        p.node.unlockedBy === tn.node.id && !completedSet.has(p.node.id)
      )
      if (!nextNode) continue
      const level = Math.floor(tn.node.row / 5) + 2
      arrows.push({
        targetCx: nextNode.cx,
        targetCy: nextNode.cy,
        nodeSize: grid.nodeSize,
        level,
        targetId: nextNode.node.id,
      })
    }
    return arrows
  }, [grid, completedSet, tree.nodes])

  const centerOffsetX = useMemo(() => {
    if (!grid || grid.positioned.length === 0) return 0
    const xs = grid.positioned.map(p => p.cx)
    const visibleCenterX = (Math.min(...xs) + Math.max(...xs)) / 2
    return grid.frameW / 2 - visibleCenterX
  }, [grid])

  // Which nodes are pending animation (visible in grid but not yet animated)?
  // Depends on `tick` so it re-evaluates after animation completes.
  const pendingIds = useMemo(() => {
    void tick // eslint-disable-line @typescript-eslint/no-unused-expressions
    if (!grid || !initializedRef.current) return new Set<string>()
    const s = new Set<string>()
    for (const p of grid.positioned) {
      if (!animatedRef.current.has(p.node.id)) s.add(p.node.id)
    }
    return s
  }, [grid, tick])

  // Initialize: on first valid grid, mark completed nodes as already animated.
  // The current (newly unlocked) node will animate in with line-draw + pop.
  useEffect(() => {
    if (!grid || initializedRef.current) return
    initializedRef.current = true
    for (const p of grid.positioned) {
      // Only pre-animate completed nodes — current node gets the entrance animation
      if (completedSet.has(p.node.id)) {
        animatedRef.current.add(p.node.id)
      }
    }
    setTick(t => t + 1)
  }, [grid, completedSet])

  // Animate newly appearing nodes when completedLessonIds changes
  // RULE: all positioned content (nodes, static lines, overlay lines)
  // must live inside the same coordinate space (contentRef wrapper).
  useEffect(() => {
    if (!grid || !contentRef.current || !initializedRef.current) return

    // Compute which nodes need animation right now
    const toAnimate: string[] = []
    for (const p of grid.positioned) {
      if (!animatedRef.current.has(p.node.id)) toAnimate.push(p.node.id)
    }
    if (toAnimate.length === 0) return

    const content = contentRef.current
    const r = grid.nodeSize / 2

    // Clean up any previous animation
    if (overlayRef.current?.parentNode) overlayRef.current.remove()
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    // Pop nodes without lineFrom immediately
    for (const nodeId of toAnimate) {
      const node = tree.nodes.find(n => n.id === nodeId)
      if (!node?.lineFrom) {
        const el = content.querySelector(`[data-id="${nodeId}"]`) as HTMLElement | null
        if (el) {
          el.classList.add('tree-grow-in')
          el.style.transform = ''
          animatedRef.current.add(nodeId)
        }
      }
    }

    // Create overlay SVG for animated line draws
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('style', `position:absolute;top:0;left:0;width:${grid.frameW}px;height:${grid.frameH}px;pointer-events:none;z-index:1;`)
    overlayRef.current = svg

    interface LineAnim {
      path: SVGPathElement
      len: number
      nodeId: string
      delay: number
      popped?: boolean
    }
    const lineAnims: LineAnim[] = []

    const nodesWithLines = toAnimate.filter(id => {
      const n = tree.nodes.find(x => x.id === id)
      return n?.lineFrom
    })

    nodesWithLines.forEach((nodeId, i) => {
      const node = tree.nodes.find(n => n.id === nodeId)!
      const parentPos = grid.positioned.find(p => p.node.id === node.lineFrom)
      if (!parentPos) return
      const { cx, cy } = grid.gridToPixel(node.col, node.row)
      const { d, len } = buildLinePath(parentPos.cx, parentPos.cy, cx, cy, r)

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', d)
      path.setAttribute('stroke', '#58CC02')
      path.setAttribute('stroke-width', String(grid.lineThick))
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke-linecap', 'round')
      path.setAttribute('stroke-linejoin', 'round')
      path.setAttribute('stroke-dasharray', String(len))
      path.setAttribute('stroke-dashoffset', String(len))
      svg.appendChild(path)

      lineAnims.push({ path, len, nodeId, delay: i * 150 })
    })

    if (lineAnims.length > 0) {
      content.appendChild(svg)
    }

    if (lineAnims.length === 0) {
      // All nodes were lineFrom-less, already popped above
      setTick(t => t + 1)
      return
    }

    const startTime = performance.now()

    function animTick(now: number) {
      let allDone = true
      for (const la of lineAnims) {
        const elapsed = now - startTime - la.delay
        if (elapsed < 0) { allDone = false; continue }
        const t = Math.min(1, elapsed / LINE_DRAW_MS)
        const e = 1 - Math.pow(1 - t, 3)
        la.path.setAttribute('stroke-dashoffset', String(la.len * (1 - e)))

        if (t >= 1 && !la.popped) {
          la.popped = true
          const el = content.querySelector(`[data-id="${la.nodeId}"]`) as HTMLElement | null
          if (el) {
            el.classList.add('tree-grow-in')
            el.style.transform = ''
            animatedRef.current.add(la.nodeId)
          }
        }
        if (t < 1) allDone = false
      }

      if (!allDone) {
        rafRef.current = requestAnimationFrame(animTick)
      } else {
        // After pop-in animation settles, remove overlay and re-render
        // so static dotted lines appear for these connections
        setTimeout(() => {
          if (svg.parentNode) svg.remove()
          setTick(t => t + 1)
        }, 700)
      }
    }

    rafRef.current = requestAnimationFrame(animTick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [completedLessonIds, grid, tree.nodes]) // eslint-disable-line react-hooks/exhaustive-deps

  const frameStyle = {
    backgroundImage: 'radial-gradient(circle, #afc4d0 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    minHeight: 400,
  }

  if (!grid) {
    return <div ref={frameRef} className="flex-1 relative overflow-hidden" style={frameStyle} />
  }

  return (
    <div ref={frameRef} className="flex-1 relative overflow-hidden" style={frameStyle}>
      <div
        ref={contentRef}
        className="absolute inset-0"
        style={{
          transform: `translateX(${centerOffsetX}px)`,
          transition: 'transform 0.5s ease',
        }}
      >
        <TreeLines
          connections={grid.connections}
          nodeSize={grid.nodeSize}
          lineThick={grid.lineThick}
          frameW={grid.frameW}
          frameH={grid.frameH}
          excludeIds={pendingIds}
        />

        {levelArrows.map((arrow, i) => (
          <div
            key={`level-arrow-${i}`}
            className="tree-level-arrow absolute pointer-events-none"
            style={{
              left: arrow.targetCx - 20,
              top: arrow.targetCy - arrow.nodeSize - 48,
              width: 40,
              zIndex: 10,
              textAlign: 'center',
            }}
            onClick={() => onLessonTap?.(arrow.targetId)}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: COLOR,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 4,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',
              }}
            >
              Level {arrow.level}
            </div>
            <svg width="20" height="18" viewBox="0 0 20 18" style={{ margin: '0 auto', display: 'block' }}>
              <path d="M10 18 L2 6 L7 6 L7 0 L13 0 L13 6 L18 6 Z" fill={COLOR} />
            </svg>
          </div>
        ))}

        {grid.positioned.map(pos => (
          <TreeNodeEl
            key={pos.node.id}
            pos={pos}
            status={getStatus(pos.node)}
            nodeSize={grid.nodeSize}
            fontSize={grid.fontSize}
            isHidden={pendingIds.has(pos.node.id)}
            isNew={!animatedRef.current.has(pos.node.id)}
            onTap={handleTap}
            accentColor={COLOR}
            accentColorDark={COLOR_DARK}
          />
        ))}
      </div>
    </div>
  )
}
