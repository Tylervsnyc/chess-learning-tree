'use client';

interface TreeNode {
  move: string;
  games: number;
  wins: number;
  masterRank: number;
  label?: string;
  isYours?: boolean;
  children: TreeNode[];
}

// Tyler's Sicilian data (learnthroughstories on Lichess)
// After 1.e4 c5 2.Nf3
const SICILIAN: TreeNode = {
  move: 'Nf3',
  games: 41,
  wins: 16,
  masterRank: 1,
  label: 'Sicilian',
  isYours: true,
  children: [
    {
      move: 'd6', games: 18, wins: 5, masterRank: 1, label: 'Najdorf/Dragon',
      children: [
        {
          move: 'd4', games: 18, wins: 5, masterRank: 1, isYours: true,
          children: [
            {
              move: 'cxd4', games: 18, wins: 5, masterRank: 1,
              children: [
                {
                  move: 'Nxd4', games: 18, wins: 5, masterRank: 1, isYours: true,
                  children: [
                    { move: 'Nf6', games: 11, wins: 1, masterRank: 1, label: '9% win!', children: [] },
                    { move: 'a6', games: 3, wins: 1, masterRank: 3, children: [] },
                    { move: 'Nc6', games: 3, wins: 2, masterRank: 2, children: [] },
                    { move: 'e5', games: 1, wins: 1, masterRank: 4, children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      move: 'Nc6', games: 14, wins: 6, masterRank: 2, label: 'Open Sicilian',
      children: [
        {
          move: 'd4', games: 14, wins: 6, masterRank: 1, isYours: true,
          children: [
            {
              move: 'cxd4', games: 12, wins: 5, masterRank: 1,
              children: [
                {
                  move: 'Nxd4', games: 12, wins: 5, masterRank: 1, isYours: true,
                  children: [
                    { move: 'e5', games: 5, wins: 1, masterRank: 3, label: '20% win', children: [] },
                    { move: 'g6', games: 2, wins: 2, masterRank: 4, children: [] },
                    { move: 'Nxd4', games: 2, wins: 1, masterRank: 5, children: [] },
                    { move: 'Nf6', games: 1, wins: 0, masterRank: 2, children: [] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      move: 'e6', games: 4, wins: 1, masterRank: 3, label: 'French Var',
      children: [
        { move: 'd4', games: 4, wins: 1, masterRank: 1, isYours: true, children: [] },
      ],
    },
    {
      move: 'a6', games: 2, wins: 2, masterRank: 5, children: [],
    },
    {
      move: 'd5', games: 2, wins: 1, masterRank: 4, children: [],
    },
  ],
};

// Ruy Lopez data for comparison
const RUY: TreeNode = {
  move: 'Bb5',
  games: 32,
  wins: 22,
  masterRank: 1,
  label: 'Ruy Lopez',
  isYours: true,
  children: [
    {
      move: 'a6', games: 11, wins: 9, masterRank: 1, label: 'Morphy',
      children: [
        {
          move: 'Ba4', games: 11, wins: 9, masterRank: 1, isYours: true,
          children: [
            { move: 'Nf6', games: 4, wins: 3, masterRank: 1, children: [
              { move: 'O-O', games: 4, wins: 3, masterRank: 1, isYours: true, children: [
                { move: 'b5', games: 1, wins: 1, masterRank: 2, children: [] },
                { move: 'd6', games: 1, wins: 1, masterRank: 3, children: [] },
                { move: 'Nxe4', games: 1, wins: 1, masterRank: 4, children: [] },
              ] },
            ] },
            { move: 'b5', games: 4, wins: 4, masterRank: 2, children: [] },
            { move: 'Bc5', games: 3, wins: 2, masterRank: 6, children: [] },
          ],
        },
      ],
    },
    {
      move: 'd6', games: 13, wins: 9, masterRank: 8, label: 'Steinitz',
      children: [
        { move: 'd4', games: 6, wins: 5, masterRank: 1, isYours: true, children: [] },
        { move: 'h3', games: 5, wins: 2, masterRank: 0, isYours: true, label: 'not theory', children: [] },
        { move: 'O-O', games: 2, wins: 2, masterRank: 3, isYours: true, children: [] },
      ],
    },
    {
      move: 'Nf6', games: 10, wins: 8, masterRank: 2, label: 'Berlin',
      children: [
        { move: 'd3', games: 6, wins: 4, masterRank: 2, isYours: true, label: 'sideline', children: [] },
        { move: 'O-O', games: 2, wins: 2, masterRank: 1, isYours: true, children: [] },
      ],
    },
    {
      move: 'Bc5', games: 10, wins: 5, masterRank: 6, label: 'Classical',
      children: [],
    },
  ],
};

// ============================================================
// Overlap-proof layout algorithm
// Each leaf gets a guaranteed slot. No decay, no overlap, ever.
// ============================================================
const NODE_W = 54;
const NODE_H = 30;
const LABEL_H = 16; // space for labels below nodes
const X_GAP = 90;   // horizontal gap between columns
const Y_SLOT = NODE_H + LABEL_H + 14; // vertical slot per leaf (node + label + padding)

interface Pos {
  x: number;
  y: number;
  node: TreeNode;
  parent?: { x: number; y: number };
}

function countLeaves(node: TreeNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, c) => sum + countLeaves(c), 0);
}

function buildPositions(tree: TreeNode) {
  const positions: Pos[] = [];
  let maxX = 0;
  let maxY = 0;

  // Each node gets positioned based on its leaf range
  // Leaves are numbered 0..N-1 top to bottom
  // A leaf at index i sits at y = i * Y_SLOT
  // A parent centers itself over its children's y range
  function layout(node: TreeNode, depth: number, leafStart: number, parent?: { x: number; y: number }) {
    const x = 40 + depth * X_GAP;
    const leaves = countLeaves(node);

    if (node.children.length === 0) {
      // Leaf node — sits at its slot
      const y = leafStart * Y_SLOT;
      positions.push({ x, y, node, parent });
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    } else {
      // Parent — first position children, then center over them
      let cursor = leafStart;
      const childPositions: { y: number }[] = [];

      for (const child of node.children) {
        const childLeaves = countLeaves(child);
        layout(child, depth + 1, cursor, { x, y: 0 }); // y=0 placeholder
        // Find the child's y (it was just pushed)
        const childPos = positions[positions.length - 1];
        // Actually we need the child's own y, which might be a parent centered over ITS children
        // Let's find it by looking at the position we just added for this child
        childPositions.push({ y: 0 }); // we'll fix parent y after
        cursor += childLeaves;
      }

      // Find the y range of direct children
      // Children were added to positions — find them
      // Direct children are at depth+1 with parent.x === x
      const directChildYs: number[] = [];
      for (const p of positions) {
        if (p.parent && p.parent.x === x && p.node !== node) {
          // Check if this is a direct child (not grandchild)
          if (node.children.includes(p.node)) {
            directChildYs.push(p.y);
          }
        }
      }

      const minChildY = Math.min(...directChildYs);
      const maxChildY = Math.max(...directChildYs);
      const y = (minChildY + maxChildY) / 2;

      positions.push({ x, y, node, parent });
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;

      // Fix parent references — children were given placeholder parent y
      for (const p of positions) {
        if (p.parent && p.parent.x === x && p.parent.y === 0) {
          p.parent = { x, y };
        }
      }
    }
  }

  // Better approach: two-pass layout
  // Pass 1: assign y to all leaves (bottom-up leaf count)
  // Pass 2: assign y to parents (center of children)
  positions.length = 0;
  maxX = 0;
  maxY = 0;

  function layout2(node: TreeNode, depth: number, leafStart: number, parentCoord?: { x: number; y: number }): { y: number } {
    const x = 40 + depth * X_GAP;

    if (node.children.length === 0) {
      const y = leafStart * Y_SLOT;
      positions.push({ x, y, node, parent: parentCoord });
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      return { y };
    }

    // Layout children first to find their y positions
    let cursor = leafStart;
    const childYs: number[] = [];
    const myCoord = { x, y: 0 }; // placeholder

    for (const child of node.children) {
      const childLeaves = countLeaves(child);
      const result = layout2(child, depth + 1, cursor, myCoord);
      childYs.push(result.y);
      cursor += childLeaves;
    }

    // Center parent over children
    const y = (Math.min(...childYs) + Math.max(...childYs)) / 2;
    myCoord.y = y; // fix the placeholder — this updates all child parent refs too

    positions.push({ x, y, node, parent: parentCoord });
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;

    return { y };
  }

  layout2(tree, 0, 0);

  // Normalize: shift everything so min y = padding
  const minY = Math.min(...positions.map(p => p.y));
  const pad = NODE_H;
  for (const p of positions) {
    p.y -= minY - pad;
    if (p.parent) p.parent.y -= minY - pad;
  }
  maxY = Math.max(...positions.map(p => p.y));

  return { positions, maxX: maxX + 40, maxY: maxY + pad };
}

function WinRateFlow({ tree, title, subtitle }: { tree: TreeNode; title: string; subtitle: string }) {
  const wr = Math.round((tree.wins / tree.games) * 100);
  const { positions, maxX, maxY } = buildPositions(tree);
  const svgW = Math.max(380, maxX + 60);
  const svgH = Math.max(200, maxY + 40);

  return (
    <div className="mb-10">
      <div className="flex items-baseline gap-2 mb-1">
        <h2 className="text-[#2A3C45] text-sm font-bold">{title}</h2>
        <span className="text-xs font-semibold" style={{ color: wr > 55 ? '#58CC02' : wr > 45 ? '#FFD700' : '#FF4B4B' }}>
          {wr}% overall
        </span>
      </div>
      <p className="text-[#94a3b8] text-[11px] mb-3">{subtitle}</p>
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 shadow-sm overflow-x-auto">
        <svg width={svgW} height={svgH} className="w-full" style={{ minWidth: svgW }}>
          {/* Edges */}
          {/* Fork connectors: one stem from parent, vertical trunk, branches to children */}
          {(() => {
            // Group children by parent position
            const parentGroups = new Map<string, Pos[]>();
            for (const p of positions) {
              if (!p.parent) continue;
              const key = `${p.parent.x},${p.parent.y}`;
              if (!parentGroups.has(key)) parentGroups.set(key, []);
              parentGroups.get(key)!.push(p);
            }

            const elements: React.ReactNode[] = [];
            let ei = 0;

            for (const [key, children] of parentGroups) {
              const [px, py] = key.split(',').map(Number);
              const stemX = px + NODE_W / 2;          // right edge of parent
              const trunkX = stemX + (X_GAP - NODE_W) / 2; // halfway between parent right and child left

              // Average color from children
              const avgWr = children.reduce((s, c) => s + c.node.wins / c.node.games, 0) / children.length;
              const trunkColor = avgWr > 0.6 ? '#58CC02' : avgWr > 0.45 ? '#FFD700' : '#FF4B4B';

              // Horizontal stem from parent center to trunk
              elements.push(
                <line key={`stem${ei}`} x1={stemX} y1={py} x2={trunkX} y2={py}
                  stroke={trunkColor} strokeWidth={1.5} opacity={0.3} />
              );

              if (children.length === 1 && Math.abs(children[0].y - py) < 1) {
                // Single child on same row — just a straight line
                const c = children[0];
                const cWr = c.node.wins / c.node.games;
                const cColor = cWr > 0.6 ? '#58CC02' : cWr > 0.45 ? '#FFD700' : '#FF4B4B';
                elements.push(
                  <line key={`br${ei}`} x1={trunkX} y1={c.y} x2={c.x - NODE_W / 2} y2={c.y}
                    stroke={cColor} strokeWidth={1.5} opacity={0.3} />
                );
              } else {
                // Vertical trunk from topmost child to bottommost child
                const minY = Math.min(...children.map(c => c.y));
                const maxY = Math.max(...children.map(c => c.y));
                elements.push(
                  <line key={`trunk${ei}`} x1={trunkX} y1={minY} x2={trunkX} y2={maxY}
                    stroke={trunkColor} strokeWidth={1.5} opacity={0.25} />
                );

                // Connect trunk to parent's y if parent is outside the trunk range
                if (py < minY) {
                  elements.push(
                    <line key={`trunkup${ei}`} x1={trunkX} y1={py} x2={trunkX} y2={minY}
                      stroke={trunkColor} strokeWidth={1.5} opacity={0.25} />
                  );
                } else if (py > maxY) {
                  elements.push(
                    <line key={`trunkdn${ei}`} x1={trunkX} y1={maxY} x2={trunkX} y2={py}
                      stroke={trunkColor} strokeWidth={1.5} opacity={0.25} />
                  );
                }

                // Horizontal branches from trunk to each child
                for (let ci = 0; ci < children.length; ci++) {
                  const c = children[ci];
                  const cWr = c.node.wins / c.node.games;
                  const cColor = cWr > 0.6 ? '#58CC02' : cWr > 0.45 ? '#FFD700' : '#FF4B4B';
                  elements.push(
                    <line key={`br${ei}-${ci}`} x1={trunkX} y1={c.y} x2={c.x - NODE_W / 2} y2={c.y}
                      stroke={cColor} strokeWidth={Math.max(1.5, Math.min(3, c.node.games / 4))}
                      opacity={0.3} />
                  );
                }
              }
              ei++;
            }
            return elements;
          })()}
          {/* Nodes */}
          {positions.map((p, i) => {
            const nodeWr = p.node.wins / p.node.games;
            const fillColor = nodeWr > 0.6 ? '#58CC02' : nodeWr > 0.45 ? '#FFD700' : '#FF4B4B';
            const wrPct = Math.round(nodeWr * 100);
            const w = NODE_W;
            const h = NODE_H;
            return (
              <g key={`n${i}`}>
                {/* White bg */}
                <rect x={p.x - w / 2} y={p.y - h / 2} width={w} height={h} rx={6}
                  fill="white" stroke="#e2e8f0" strokeWidth={1} />
                {/* Win rate fill */}
                <rect x={p.x - w / 2} y={p.y - h / 2} width={w * nodeWr} height={h} rx={6}
                  fill={fillColor} opacity={0.12} />
                {/* Border */}
                <rect x={p.x - w / 2} y={p.y - h / 2} width={w} height={h} rx={6}
                  fill="none" stroke={fillColor} strokeWidth={1.5} />
                {/* Move text */}
                <text x={p.x} y={p.y - 1} textAnchor="middle" fill="#2A3C45" fontSize={11} fontWeight={700}>
                  {p.node.move}
                </text>
                {/* Win rate */}
                <text x={p.x} y={p.y + 11} textAnchor="middle" fill={fillColor} fontSize={8} fontWeight={600}>
                  {wrPct}% · {p.node.games}g
                </text>
                {/* Label below node */}
                {p.node.label && (
                  <text x={p.x} y={p.y + h / 2 + 12} textAnchor="middle"
                    fill={nodeWr < 0.4 ? '#FF4B4B' : '#6b7c8a'} fontSize={8}
                    fontWeight={nodeWr < 0.4 ? 600 : 400}>
                    {p.node.label}
                  </text>
                )}
                {/* Leaf: tree ends */}
                {p.node.children.length === 0 && !p.node.label && p.node.games <= 3 && (
                  <text x={p.x} y={p.y + h / 2 + 12} textAnchor="middle" fill="#c5d4de" fontSize={7}>
                    ends
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function TreeTestPage() {
  return (
    <div className="min-h-screen bg-[#eef6fc] p-4 max-w-[390px] mx-auto overflow-auto pb-20">
      <h1 className="text-[#2A3C45] text-lg font-bold mb-1">Opening Tree — Win Rate Flow</h1>
      <p className="text-[#6b7c8a] text-xs mb-6">
        learnthroughstories · all speeds
      </p>

      <WinRateFlow
        tree={SICILIAN}
        title="Sicilian Defense"
        subtitle="1.e4 c5 2.Nf3 · 41 games — your worst opening"
      />

      <WinRateFlow
        tree={RUY}
        title="Ruy Lopez"
        subtitle="1.e4 e5 2.Nf3 Nc6 3.Bb5 · 32 games — much healthier"
      />
    </div>
  );
}
