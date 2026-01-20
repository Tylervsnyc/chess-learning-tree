'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { forceSimulation, forceCollide, forceX, forceY, forceManyBody, SimulationNodeDatum } from 'd3-force';

interface ThemeData {
  theme: string;
  label: string;
  attempts: number;
  solved: number;
  accuracy: number;
}

// Sample data - 18 strengths + 18 weaknesses
const SAMPLE_THEME_DATA: ThemeData[] = [
  // STRENGTHS
  { theme: 'mateIn1', label: 'Mate in 1', attempts: 180, solved: 171, accuracy: 95 },
  { theme: 'fork', label: 'Fork', attempts: 156, solved: 143, accuracy: 92 },
  { theme: 'pin', label: 'Pin', attempts: 134, solved: 120, accuracy: 90 },
  { theme: 'hangingPiece', label: 'Hanging Piece', attempts: 115, solved: 101, accuracy: 88 },
  { theme: 'backRankMate', label: 'Back Rank Mate', attempts: 98, solved: 83, accuracy: 85 },
  { theme: 'discoveredAttack', label: 'Discovered Attack', attempts: 82, solved: 68, accuracy: 83 },
  { theme: 'doubleCheck', label: 'Double Check', attempts: 68, solved: 56, accuracy: 82 },
  { theme: 'skewer', label: 'Skewer', attempts: 55, solved: 44, accuracy: 80 },
  { theme: 'exposedKing', label: 'Exposed King', attempts: 45, solved: 35, accuracy: 78 },
  { theme: 'trappedPiece', label: 'Trapped Piece', attempts: 38, solved: 29, accuracy: 76 },
  { theme: 'promotion', label: 'Promotion', attempts: 32, solved: 24, accuracy: 75 },
  { theme: 'kingsideAttack', label: 'Kingside Attack', attempts: 26, solved: 19, accuracy: 73 },
  { theme: 'removeDefender', label: 'Remove Defender', attempts: 21, solved: 15, accuracy: 71 },
  { theme: 'overloading', label: 'Overloading', attempts: 17, solved: 12, accuracy: 71 },
  { theme: 'capturingDefender', label: 'Capture Defender', attempts: 13, solved: 9, accuracy: 69 },
  { theme: 'hookMate', label: 'Hook Mate', attempts: 10, solved: 7, accuracy: 70 },
  { theme: 'arabianMate', label: 'Arabian Mate', attempts: 7, solved: 5, accuracy: 71 },
  { theme: 'dovetailMate', label: 'Dovetail Mate', attempts: 4, solved: 3, accuracy: 75 },

  // WEAKNESSES
  { theme: 'endgame', label: 'Endgame', attempts: 175, solved: 70, accuracy: 40 },
  { theme: 'mateIn3', label: 'Mate in 3', attempts: 148, solved: 52, accuracy: 35 },
  { theme: 'sacrifice', label: 'Sacrifice', attempts: 125, solved: 50, accuracy: 40 },
  { theme: 'mateIn2', label: 'Mate in 2', attempts: 105, solved: 46, accuracy: 44 },
  { theme: 'quietMove', label: 'Quiet Move', attempts: 88, solved: 31, accuracy: 35 },
  { theme: 'deflection', label: 'Deflection', attempts: 72, solved: 29, accuracy: 40 },
  { theme: 'attraction', label: 'Attraction', attempts: 58, solved: 20, accuracy: 34 },
  { theme: 'clearance', label: 'Clearance', attempts: 47, solved: 14, accuracy: 30 },
  { theme: 'interference', label: 'Interference', attempts: 38, solved: 11, accuracy: 29 },
  { theme: 'xRayAttack', label: 'X-Ray Attack', attempts: 30, solved: 8, accuracy: 27 },
  { theme: 'zugzwang', label: 'Zugzwang', attempts: 24, solved: 6, accuracy: 25 },
  { theme: 'smotheredMate', label: 'Smothered Mate', attempts: 19, solved: 5, accuracy: 26 },
  { theme: 'underPromotion', label: 'Underpromotion', attempts: 15, solved: 4, accuracy: 27 },
  { theme: 'castling', label: 'Castling', attempts: 11, solved: 3, accuracy: 27 },
  { theme: 'enPassant', label: 'En Passant', attempts: 8, solved: 2, accuracy: 25 },
  { theme: 'queensideAttack', label: 'Queenside Attack', attempts: 6, solved: 2, accuracy: 33 },
  { theme: 'advancedPawn', label: 'Advanced Pawn', attempts: 4, solved: 1, accuracy: 25 },
  { theme: 'anastasiaMate', label: 'Anastasia Mate', attempts: 2, solved: 0, accuracy: 0 },
];

const STRENGTH_PALETTE = [
  '#4A9B7F', '#5B8EC9', '#6BBF9A', '#7B68B8', '#3D8B74', '#6BA3D9',
  '#5BAE8A', '#8B7BC8', '#45A878', '#5C9FD4', '#7DCBA4', '#9B8AD8',
  '#2E8B8B', '#7AA3E5', '#4DB89E', '#6A5ACD', '#3CB88B', '#87AEEB',
];

const WEAKNESS_PALETTE = [
  '#E8A87C', '#C5A85F', '#E07B5A', '#D4A574', '#B8A44C', '#E9967A',
  '#C9B458', '#D98B6B', '#A89B4A', '#ECAB6F', '#C4A14E', '#E4947A',
  '#D4B896', '#BC8F6F', '#E6C28C', '#C1946A', '#DDA878', '#B5A642',
];

interface BubbleNode extends SimulationNodeDatum {
  id: string;
  theme: ThemeData;
  isStrength: boolean;
  radius: number;
  color: string;
}

function BubbleChart({ strengths, weaknesses, onSelectTheme }: {
  strengths: ThemeData[];
  weaknesses: ThemeData[];
  onSelectTheme: (theme: ThemeData) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 350, height: 500 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const simulationRef = useRef<ReturnType<typeof forceSimulation<BubbleNode>> | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width < 200) return;

    const halfWidth = dimensions.width / 2;
    const padding = 15;

    const allThemes = [...strengths, ...weaknesses];
    if (allThemes.length === 0) return;

    const minAttempts = Math.min(...allThemes.map(t => t.attempts));
    const maxAttempts = Math.max(...allThemes.map(t => t.attempts));

    const createNode = (theme: ThemeData, index: number, isStrength: boolean): BubbleNode => {
      const normalized = (theme.attempts - minAttempts) / (maxAttempts - minAttempts || 1);
      const radius = 20 + normalized * 35;

      const palette = isStrength ? STRENGTH_PALETTE : WEAKNESS_PALETTE;
      const color = palette[index % palette.length];

      const centerX = isStrength ? halfWidth / 2 : halfWidth + halfWidth / 2;

      return {
        id: theme.theme,
        theme,
        isStrength,
        radius,
        color,
        x: centerX + (Math.random() - 0.5) * 80,
        y: dimensions.height / 2 + (Math.random() - 0.5) * 150,
      };
    };

    const newNodes: BubbleNode[] = [
      ...strengths.map((t, i) => createNode(t, i, true)),
      ...weaknesses.map((t, i) => createNode(t, i, false)),
    ];

    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    const maxRadius = Math.max(...newNodes.map(n => n.radius));

    const simulation = forceSimulation<BubbleNode>(newNodes)
      .force('collide', forceCollide<BubbleNode>()
        .radius(d => d.radius + 3)
        .strength(0.8)
        .iterations(3)
      )
      .force('x', forceX<BubbleNode>()
        .x(d => d.isStrength ? halfWidth / 2 : halfWidth + halfWidth / 2)
        .strength(0.01)
      )
      .force('y', forceY<BubbleNode>()
        .y(d => {
          const sizeRatio = d.radius / maxRadius;
          return 60 + (1 - sizeRatio) * (dimensions.height - 120);
        })
        .strength(0.06)
      )
      .force('charge', forceManyBody<BubbleNode>().strength(-1))
      .alpha(0.4)
      .alphaDecay(0.008)
      .velocityDecay(0.55)
      .on('tick', () => {
        for (const node of newNodes) {
          const xMin = node.isStrength ? padding + node.radius : halfWidth + padding + node.radius;
          const xMax = node.isStrength ? halfWidth - padding - node.radius : dimensions.width - padding - node.radius;
          const yMin = 40 + node.radius;
          const yMax = dimensions.height - padding - node.radius;

          node.x = Math.max(xMin, Math.min(xMax, node.x || 0));
          node.y = Math.max(yMin, Math.min(yMax, node.y || 0));
        }
        setNodes([...newNodes]);
      });

    simulationRef.current = simulation;

    return () => { simulation.stop(); };
  }, [dimensions, strengths, weaknesses]);

  const handleBubbleClick = (clickedNode: BubbleNode) => {
    if (simulationRef.current) {
      for (const node of nodes) {
        if (node.isStrength !== clickedNode.isStrength) continue;
        const dx = (node.x || 0) - (clickedNode.x || 0);
        const dy = (node.y || 0) - (clickedNode.y || 0);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 3;
          node.vx = (node.vx || 0) + (dx / dist) * force;
          node.vy = (node.vy || 0) + (dy / dist) * force;
        }
      }
      simulationRef.current.alpha(0.2).restart();
    }
    setTimeout(() => onSelectTheme(clickedNode.theme), 300);
  };

  return (
    <div ref={containerRef} className="flex-1 min-h-[450px] relative bg-[#131F24] rounded-xl overflow-hidden">
      <div className="absolute top-2 left-0 right-0 flex justify-around text-[10px] font-medium z-20 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#4A9B7F]" />
          <span className="text-gray-400 uppercase">Strengths</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#E8A87C]" />
          <span className="text-gray-400 uppercase">Needs Work</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-8 bottom-2 w-px bg-gray-700/50" />

      {nodes.map((node) => {
        const isHovered = hoveredId === node.id;
        const diameter = node.radius * 2;
        const fontSize = diameter > 70 ? 11 : diameter > 50 ? 10 : 9;

        return (
          <button
            key={node.id}
            onClick={() => handleBubbleClick(node)}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="absolute rounded-full flex items-center justify-center text-center cursor-pointer select-none"
            style={{
              width: diameter,
              height: diameter,
              backgroundColor: node.color,
              left: (node.x || 0) - node.radius,
              top: (node.y || 0) - node.radius,
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.15s ease-out',
              boxShadow: isHovered
                ? `0 6px 20px ${node.color}55, 0 0 0 2px rgba(255,255,255,0.2)`
                : `0 2px 10px ${node.color}40`,
              zIndex: isHovered ? 20 : 1,
            }}
          >
            <div className="text-white font-medium leading-tight px-1" style={{ fontSize }}>
              <div className="truncate">{node.theme.label}</div>
              <div className="opacity-70 text-[8px]">({node.theme.attempts})</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function TestProfilePage() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);

  const avgAccuracy = 63;
  const { strengths, weaknesses } = useMemo(() => {
    const sorted = [...SAMPLE_THEME_DATA].sort((a, b) => b.accuracy - a.accuracy);
    return {
      strengths: sorted.filter(t => t.accuracy >= avgAccuracy),
      weaknesses: sorted.filter(t => t.accuracy < avgAccuracy).reverse(),
    };
  }, []);

  if (selectedTheme) {
    const isStrength = selectedTheme.accuracy >= avgAccuracy;
    return (
      <div className="min-h-screen bg-[#131F24] text-white">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button onClick={() => setSelectedTheme(null)} className="text-gray-400 hover:text-white">
              &larr; Back
            </button>
            <h1 className="text-lg font-bold">{selectedTheme.label}</h1>
            <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              isStrength ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {selectedTheme.accuracy}%
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#1A2C35] rounded-xl p-3 text-center">
              <div className="text-xl font-bold">{selectedTheme.attempts}</div>
              <div className="text-xs text-gray-400">Attempted</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-green-400">{selectedTheme.solved}</div>
              <div className="text-xs text-gray-400">Solved</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-red-400">{selectedTheme.attempts - selectedTheme.solved}</div>
              <div className="text-xs text-gray-400">Missed</div>
            </div>
          </div>
          <div className="bg-[#1A2C35] rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm mb-4">
              {isStrength ? `Great work on ${selectedTheme.label}!` : `Practice more ${selectedTheme.label} to improve.`}
            </p>
            <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
              Practice {selectedTheme.label}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/learn')} className="text-gray-400 hover:text-white">&larr;</button>
          <div className="text-center">
            <h1 className="text-lg font-bold">Sample Profile</h1>
            <span className="text-[10px] text-gray-400 bg-[#131F24] px-2 py-0.5 rounded">Rating: 1150</span>
          </div>
          <div className="w-8" />
        </div>
      </div>

      <div className="bg-[#1A2C35]/50 border-b border-white/5 px-4 py-3">
        <div className="max-w-md mx-auto flex justify-center gap-6">
          <div className="text-center">
            <div className="text-xl font-bold">2,076</div>
            <div className="text-[10px] text-gray-400">Puzzles</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">63%</div>
            <div className="text-[10px] text-gray-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">36</div>
            <div className="text-[10px] text-gray-400">Themes</div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 py-4">
        <BubbleChart strengths={strengths} weaknesses={weaknesses} onSelectTheme={setSelectedTheme} />
      </div>
    </div>
  );
}
