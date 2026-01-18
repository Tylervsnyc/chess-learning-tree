'use client';

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Chessboard } from 'react-chessboard';
import { useLessonProgress, ThemeStats, PuzzleAttempt } from '@/hooks/useProgress';
import { forceSimulation, forceCollide, forceX, forceY, forceManyBody, SimulationNodeDatum } from 'd3-force';

// Theme display names
const THEME_LABELS: Record<string, string> = {
  fork: 'Fork',
  pin: 'Pin',
  skewer: 'Skewer',
  discoveredAttack: 'Discovered Attack',
  doubleCheck: 'Double Check',
  backRankMate: 'Back Rank Mate',
  mateIn1: 'Mate in 1',
  mateIn2: 'Mate in 2',
  mateIn3: 'Mate in 3',
  hangingPiece: 'Hanging Piece',
  trappedPiece: 'Trapped Piece',
  deflection: 'Deflection',
  attraction: 'Attraction',
  sacrifice: 'Sacrifice',
  clearance: 'Clearance',
  interference: 'Interference',
  xRayAttack: 'X-Ray Attack',
  zugzwang: 'Zugzwang',
  quietMove: 'Quiet Move',
  defensiveMove: 'Defensive Move',
  promotion: 'Promotion',
  underPromotion: 'Underpromotion',
  castling: 'Castling',
  enPassant: 'En Passant',
  exposedKing: 'Exposed King',
  kingsideAttack: 'Kingside Attack',
  queensideAttack: 'Queenside Attack',
  advancedPawn: 'Advanced Pawn',
  endgame: 'Endgame',
  middlegame: 'Middlegame',
  opening: 'Opening',
  short: 'Short',
  long: 'Long',
  veryLong: 'Very Long',
  crushing: 'Crushing',
  advantage: 'Advantage',
  equality: 'Equality',
  master: 'Master',
  masterVsMaster: 'Master vs Master',
  superGM: 'Super GM',
  hookMate: 'Hook Mate',
  smotheredMate: 'Smothered Mate',
  arabianMate: 'Arabian Mate',
  doubleBishopMate: 'Double Bishop Mate',
  dovetailMate: 'Dovetail Mate',
  bodenMate: 'Boden Mate',
  anastasiaMate: 'Anastasia Mate',
};

function getThemeLabel(theme: string): string {
  return THEME_LABELS[theme] || theme.replace(/([A-Z])/g, ' $1').trim();
}

interface ThemeData {
  theme: string;
  label: string;
  attempts: number;
  solved: number;
  accuracy: number;
  puzzleIds: string[];
}

// Sample data - 18 strengths + 18 weaknesses with widely varying attempt counts
const SAMPLE_THEME_DATA: ThemeData[] = [
  // STRENGTHS (left side - high accuracy, varying sizes)
  { theme: 'mateIn1', label: 'Mate in 1', attempts: 180, solved: 171, accuracy: 95, puzzleIds: [] },
  { theme: 'fork', label: 'Fork', attempts: 156, solved: 143, accuracy: 92, puzzleIds: [] },
  { theme: 'pin', label: 'Pin', attempts: 134, solved: 120, accuracy: 90, puzzleIds: [] },
  { theme: 'hangingPiece', label: 'Hanging Piece', attempts: 115, solved: 101, accuracy: 88, puzzleIds: [] },
  { theme: 'backRankMate', label: 'Back Rank Mate', attempts: 98, solved: 83, accuracy: 85, puzzleIds: [] },
  { theme: 'discoveredAttack', label: 'Discovered Attack', attempts: 82, solved: 68, accuracy: 83, puzzleIds: [] },
  { theme: 'doubleCheck', label: 'Double Check', attempts: 68, solved: 56, accuracy: 82, puzzleIds: [] },
  { theme: 'skewer', label: 'Skewer', attempts: 55, solved: 44, accuracy: 80, puzzleIds: [] },
  { theme: 'exposedKing', label: 'Exposed King', attempts: 45, solved: 35, accuracy: 78, puzzleIds: [] },
  { theme: 'trappedPiece', label: 'Trapped Piece', attempts: 38, solved: 29, accuracy: 76, puzzleIds: [] },
  { theme: 'promotion', label: 'Promotion', attempts: 32, solved: 24, accuracy: 75, puzzleIds: [] },
  { theme: 'kingsideAttack', label: 'Kingside Attack', attempts: 26, solved: 19, accuracy: 73, puzzleIds: [] },
  { theme: 'removeDefender', label: 'Remove Defender', attempts: 21, solved: 15, accuracy: 71, puzzleIds: [] },
  { theme: 'overloading', label: 'Overloading', attempts: 17, solved: 12, accuracy: 71, puzzleIds: [] },
  { theme: 'capturingDefender', label: 'Capture Defender', attempts: 13, solved: 9, accuracy: 69, puzzleIds: [] },
  { theme: 'hookMate', label: 'Hook Mate', attempts: 10, solved: 7, accuracy: 70, puzzleIds: [] },
  { theme: 'arabianMate', label: 'Arabian Mate', attempts: 7, solved: 5, accuracy: 71, puzzleIds: [] },
  { theme: 'dovetailMate', label: 'Dovetail Mate', attempts: 4, solved: 3, accuracy: 75, puzzleIds: [] },

  // WEAKNESSES (right side - low accuracy, varying sizes)
  { theme: 'endgame', label: 'Endgame', attempts: 175, solved: 70, accuracy: 40, puzzleIds: [] },
  { theme: 'mateIn3', label: 'Mate in 3', attempts: 148, solved: 52, accuracy: 35, puzzleIds: [] },
  { theme: 'sacrifice', label: 'Sacrifice', attempts: 125, solved: 50, accuracy: 40, puzzleIds: [] },
  { theme: 'mateIn2', label: 'Mate in 2', attempts: 105, solved: 46, accuracy: 44, puzzleIds: [] },
  { theme: 'quietMove', label: 'Quiet Move', attempts: 88, solved: 31, accuracy: 35, puzzleIds: [] },
  { theme: 'deflection', label: 'Deflection', attempts: 72, solved: 29, accuracy: 40, puzzleIds: [] },
  { theme: 'attraction', label: 'Attraction', attempts: 58, solved: 20, accuracy: 34, puzzleIds: [] },
  { theme: 'clearance', label: 'Clearance', attempts: 47, solved: 14, accuracy: 30, puzzleIds: [] },
  { theme: 'interference', label: 'Interference', attempts: 38, solved: 11, accuracy: 29, puzzleIds: [] },
  { theme: 'xRayAttack', label: 'X-Ray Attack', attempts: 30, solved: 8, accuracy: 27, puzzleIds: [] },
  { theme: 'zugzwang', label: 'Zugzwang', attempts: 24, solved: 6, accuracy: 25, puzzleIds: [] },
  { theme: 'smotheredMate', label: 'Smothered Mate', attempts: 19, solved: 5, accuracy: 26, puzzleIds: [] },
  { theme: 'underPromotion', label: 'Underpromotion', attempts: 15, solved: 4, accuracy: 27, puzzleIds: [] },
  { theme: 'castling', label: 'Castling', attempts: 11, solved: 3, accuracy: 27, puzzleIds: [] },
  { theme: 'enPassant', label: 'En Passant', attempts: 8, solved: 2, accuracy: 25, puzzleIds: [] },
  { theme: 'queensideAttack', label: 'Queenside Attack', attempts: 6, solved: 2, accuracy: 33, puzzleIds: [] },
  { theme: 'advancedPawn', label: 'Advanced Pawn', attempts: 4, solved: 1, accuracy: 25, puzzleIds: [] },
  { theme: 'anastasiaMate', label: 'Anastasia Mate', attempts: 2, solved: 0, accuracy: 0, puzzleIds: [] },
];

// Color palettes matching inspiration - greens/teals for strengths, warm oranges/reds for weaknesses
const STRENGTH_COLORS = [
  '#4A9B7F', // Sage green
  '#3D8B74', // Deep teal
  '#5BAE8A', // Medium green
  '#6BBF9A', // Light green
  '#4AA085', // Forest teal
  '#3C9478', // Dark sage
  '#5DB891', // Mint green
  '#4CAF7D', // Grass green
  '#459A76', // Deep green
  '#52A684', // Medium teal
  '#5FB88D', // Light teal
  '#48A07A', // Emerald
];

const WEAKNESS_COLORS = [
  '#E07B5A', // Coral
  '#D4694B', // Salmon
  '#C9A227', // Mustard yellow
  '#E8913A', // Orange
  '#D35D4A', // Terracotta
  '#C4853E', // Amber
  '#DB7B4C', // Burnt orange
  '#E09545', // Golden orange
  '#CC6B52', // Rust
  '#D9A032', // Gold
  '#E58A4E', // Peach
  '#CE7845', // Copper
];

// Get a stable color based on index
function getStrengthColor(index: number): string {
  return STRENGTH_COLORS[index % STRENGTH_COLORS.length];
}

function getWeaknessColor(index: number): string {
  return WEAKNESS_COLORS[index % WEAKNESS_COLORS.length];
}

// Bubble node for d3-force simulation
interface BubbleNode extends SimulationNodeDatum {
  id: string;
  theme: ThemeData;
  isStrength: boolean;
  radius: number;
  color: string;
}

// Expanded color palette - blues, greens, teals, purples for strengths
const STRENGTH_PALETTE = [
  '#4A9B7F', // Sage green
  '#5B8EC9', // Sky blue
  '#6BBF9A', // Light green
  '#7B68B8', // Light purple
  '#3D8B74', // Teal
  '#6BA3D9', // Light blue
  '#5BAE8A', // Medium green
  '#8B7BC8', // Lavender
  '#45A878', // Mint teal
  '#5C9FD4', // Soft blue
  '#7DCBA4', // Pale green
  '#9B8AD8', // Light violet
  '#2E8B8B', // Dark cyan
  '#7AA3E5', // Periwinkle
  '#4DB89E', // Seafoam
  '#6A5ACD', // Slate blue
  '#3CB88B', // Medium sea green
  '#87AEEB', // Light steel blue
];

// Expanded muted warm palette - peachy, coral, olive, salmon, tan
const WEAKNESS_PALETTE = [
  '#E8A87C', // Peach
  '#C5A85F', // Olive khaki
  '#E07B5A', // Coral
  '#D4A574', // Tan
  '#B8A44C', // Olive green
  '#E9967A', // Dark salmon
  '#C9B458', // Khaki gold
  '#D98B6B', // Light coral
  '#A89B4A', // Olive
  '#ECAB6F', // Light peach
  '#C4A14E', // Mustard olive
  '#E4947A', // Salmon pink
  '#D4B896', // Wheat
  '#BC8F6F', // Camel
  '#E6C28C', // Buff
  '#C1946A', // Fawn
  '#DDA878', // Apricot
  '#B5A642', // Brass
];

// Bubble Chart using d3-force for proper physics
interface BubbleChartProps {
  strengths: ThemeData[];
  weaknesses: ThemeData[];
  onSelectTheme: (theme: ThemeData) => void;
}

function BubbleChart({ strengths, weaknesses, onSelectTheme }: BubbleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<BubbleNode[]>([]);
  const simulationRef = useRef<ReturnType<typeof forceSimulation<BubbleNode>> | null>(null);

  // Update dimensions
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

  // Create nodes and simulation
  useEffect(() => {
    if (dimensions.width < 200) return;

    const halfWidth = dimensions.width / 2;
    const padding = 20;

    // Find min/max attempts for scaling
    const allThemes = [...strengths, ...weaknesses];
    if (allThemes.length === 0) return;

    const minAttempts = Math.min(...allThemes.map(t => t.attempts));
    const maxAttempts = Math.max(...allThemes.map(t => t.attempts));

    const createNode = (theme: ThemeData, index: number, isStrength: boolean): BubbleNode => {
      const normalized = (theme.attempts - minAttempts) / (maxAttempts - minAttempts || 1);
      const radius = 25 + normalized * 48; // 25px to 73px radius

      const palette = isStrength ? STRENGTH_PALETTE : WEAKNESS_PALETTE;
      const color = palette[index % palette.length];

      // Initial position
      const centerX = isStrength ? halfWidth / 2 : halfWidth + halfWidth / 2;

      return {
        id: theme.theme,
        theme,
        isStrength,
        radius,
        color,
        x: centerX + (Math.random() - 0.5) * 100,
        y: dimensions.height / 2 + (Math.random() - 0.5) * 200,
      };
    };

    const newNodes: BubbleNode[] = [
      ...strengths.map((t, i) => createNode(t, i, true)),
      ...weaknesses.map((t, i) => createNode(t, i, false)),
    ];

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Find max radius for buoyancy scaling
    const maxRadius = Math.max(...newNodes.map(n => n.radius));

    // Create new simulation with d3-force - lava lamp style (slow, dreamy)
    const simulation = forceSimulation<BubbleNode>(newNodes)
      .force('collide', forceCollide<BubbleNode>()
        .radius(d => d.radius + 5)
        .strength(0.8)
        .iterations(3)
      )
      .force('x', forceX<BubbleNode>()
        .x(d => d.isStrength ? halfWidth / 2 : halfWidth + halfWidth / 2)
        .strength(0.008) // Very gentle horizontal centering
      )
      .force('y', forceY<BubbleNode>()
        .y(d => {
          // Bigger bubbles float higher (lower y value)
          const sizeRatio = d.radius / maxRadius;
          const targetY = 70 + (1 - sizeRatio) * (dimensions.height - 150);
          return targetY;
        })
        .strength(0.06) // Strong enough to pull up, but still smooth
      )
      .force('charge', forceManyBody<BubbleNode>()
        .strength(-1)
      )
      .alpha(0.4) // Start slower
      .alphaDecay(0.008) // Very slow decay - keeps moving longer
      .velocityDecay(0.55) // High friction - smooth, slow movement
      .on('tick', () => {
        // Constrain to boundaries
        for (const node of newNodes) {
          const xMin = node.isStrength ? padding + node.radius : halfWidth + padding + node.radius;
          const xMax = node.isStrength ? halfWidth - padding - node.radius : dimensions.width - padding - node.radius;
          const yMin = 45 + node.radius;
          const yMax = dimensions.height - padding - node.radius;

          node.x = Math.max(xMin, Math.min(xMax, node.x || 0));
          node.y = Math.max(yMin, Math.min(yMax, node.y || 0));
        }

        setNodes([...newNodes]);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [dimensions, strengths, weaknesses]);

  // Click handler - gentle jostle like poking a lava lamp
  const handleBubbleClick = (clickedNode: BubbleNode) => {
    if (simulationRef.current) {
      // Gentle push on nearby nodes
      for (const node of nodes) {
        if (node.isStrength !== clickedNode.isStrength) continue;

        const dx = (node.x || 0) - (clickedNode.x || 0);
        const dy = (node.y || 0) - (clickedNode.y || 0);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && dist > 0) {
          // Gentle, smooth push
          const force = (180 - dist) / 180 * 4;
          node.vx = (node.vx || 0) + (dx / dist) * force;
          node.vy = (node.vy || 0) + (dy / dist) * force;
        }
      }

      // Gentle reheat - slow dreamy response
      simulationRef.current.alpha(0.25).restart();
    }

    setTimeout(() => onSelectTheme(clickedNode.theme), 300);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-[500px] relative bg-[#131F24] rounded-xl overflow-hidden"
    >
      {/* Column labels */}
      <div className="absolute top-3 left-0 right-0 flex justify-around text-xs font-medium z-20 pointer-events-none tracking-wide">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4A9B7F]" />
          <span className="text-gray-400 uppercase">Strengths</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E8A87C]" />
          <span className="text-gray-400 uppercase">Needs Work</span>
        </div>
      </div>

      {/* Center divider */}
      <div className="absolute left-1/2 top-10 bottom-3 w-px bg-gray-700/50" />

      {/* Bubbles */}
      {nodes.map((node) => {
        const isHovered = hoveredId === node.id;
        const diameter = node.radius * 2;
        const fontSize = diameter > 80 ? 12 : diameter > 60 ? 11 : diameter > 45 ? 10 : 9;

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
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.15s ease-out',
              boxShadow: isHovered
                ? `0 8px 25px ${node.color}55, 0 0 0 2px rgba(255,255,255,0.2)`
                : `0 3px 12px ${node.color}40`,
              zIndex: isHovered ? 20 : 1,
            }}
          >
            <div
              className="text-white font-medium leading-tight px-1.5"
              style={{
                fontSize: `${fontSize}px`,
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              <div className="truncate max-w-full">{node.theme.label}</div>
              <div className="opacity-70 text-[9px] mt-0.5">({node.theme.attempts})</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    puzzleAttempts,
    themePerformance,
    totalPuzzlesSolved,
    totalPuzzlesAttempted,
    loaded,
  } = useLessonProgress();

  // Selected theme for drill-down
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
  const [useSampleData, setUseSampleData] = useState(true); // Force sample data for testing

  // Check if we have real data
  const hasRealData = Object.keys(themePerformance).length > 0;

  // Use sample data if toggled on (for testing visualization)
  const showingSampleData = useSampleData;

  // Calculate stats
  const displayPuzzlesAttempted = showingSampleData ? 2076 : totalPuzzlesAttempted;
  const displayPuzzlesSolved = showingSampleData ? 1298 : totalPuzzlesSolved;
  const overallAccuracy = displayPuzzlesAttempted > 0
    ? Math.round((displayPuzzlesSolved / displayPuzzlesAttempted) * 100)
    : 0;

  // Process theme data
  const { strengths, weaknesses, allThemes } = useMemo(() => {
    if (showingSampleData) {
      // Use sample data
      const sorted = [...SAMPLE_THEME_DATA].sort((a, b) => b.accuracy - a.accuracy);
      const avgAccuracy = 63; // Sample average
      const strengths = sorted.filter(t => t.accuracy >= avgAccuracy);
      const weaknesses = sorted.filter(t => t.accuracy < avgAccuracy).reverse();
      return { strengths, weaknesses, allThemes: sorted };
    }

    const themes: ThemeData[] = [];

    for (const [theme, stats] of Object.entries(themePerformance)) {
      if (stats.attempts >= 2) { // Minimum 2 attempts to show
        const accuracy = Math.round((stats.solved / stats.attempts) * 100);
        themes.push({
          theme,
          label: getThemeLabel(theme),
          attempts: stats.attempts,
          solved: stats.solved,
          accuracy,
          puzzleIds: stats.puzzleIds,
        });
      }
    }

    // Sort by accuracy
    themes.sort((a, b) => b.accuracy - a.accuracy);

    // Split into strengths (above average) and weaknesses (below average)
    const strengths = themes.filter(t => t.accuracy >= overallAccuracy);
    const weaknesses = themes.filter(t => t.accuracy < overallAccuracy).reverse();

    return { strengths, weaknesses, allThemes: themes };
  }, [themePerformance, overallAccuracy, showingSampleData]);

  // Get puzzles for a theme
  const getThemePuzzles = (theme: ThemeData, solved: boolean) => {
    return puzzleAttempts
      .filter(a => a.themes?.includes(theme.theme) && a.correct === solved)
      .slice(-5); // Last 5 puzzles
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#131F24] text-white flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  // Theme drill-down view
  if (selectedTheme) {
    const isStrength = selectedTheme.accuracy >= overallAccuracy;
    const puzzles = getThemePuzzles(selectedTheme, isStrength);

    return (
      <div className="min-h-screen bg-[#131F24] text-white">
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setSelectedTheme(null)}
              className="text-gray-400 hover:text-white"
            >
              &larr; Back
            </button>
            <h1 className="text-xl font-bold">{selectedTheme.label}</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isStrength ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {selectedTheme.accuracy}% accuracy
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{selectedTheme.attempts}</div>
              <div className="text-sm text-gray-400">Attempted</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{selectedTheme.solved}</div>
              <div className="text-sm text-gray-400">Solved</div>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{selectedTheme.attempts - selectedTheme.solved}</div>
              <div className="text-sm text-gray-400">Missed</div>
            </div>
          </div>

          {/* Puzzles */}
          <h2 className="text-lg font-semibold mb-3 text-gray-300">
            {isStrength ? 'Recent Correct Puzzles' : 'Recent Missed Puzzles'}
          </h2>

          {puzzles.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No puzzles recorded yet for this theme.
            </div>
          ) : (
            <div className="space-y-4">
              {puzzles.map((puzzle, index) => (
                <div
                  key={`${puzzle.puzzleId}-${index}`}
                  className="bg-[#1A2C35] rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 flex-shrink-0">
                      {puzzle.fen && (
                        <Chessboard
                          options={{
                            position: puzzle.fen,
                            boardStyle: { borderRadius: '4px' },
                            darkSquareStyle: { backgroundColor: '#779952' },
                            lightSquareStyle: { backgroundColor: '#edeed1' },
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={puzzle.correct ? 'text-green-400' : 'text-red-400'}>
                          {puzzle.correct ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-400 text-sm">
                          Rating: {puzzle.rating || 'N/A'}
                        </span>
                      </div>
                      {puzzle.solution && (
                        <div className="text-sm text-gray-300 font-mono mb-2">
                          {puzzle.solution}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {new Date(puzzle.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main profile view with bubbles
  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white"
          >
            &larr; Back
          </button>
          <h1 className="text-xl font-bold">Skills Profile</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-[#1A2C35]/50 border-b border-white/5 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{displayPuzzlesAttempted}</div>
            <div className="text-xs text-gray-400">Puzzles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{overallAccuracy}%</div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{allThemes.length}</div>
            <div className="text-xs text-gray-400">Themes</div>
          </div>
        </div>
        {/* Sample data toggle */}
        {showingSampleData && (
          <div className="max-w-6xl mx-auto mt-2 text-center">
            <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
              Showing sample data for preview
            </span>
          </div>
        )}
      </div>

      {(
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex gap-4">
            {/* Left panel - Strengths list */}
            <div className="w-56 flex-shrink-0">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <span className="text-[#4A9B7F]">&#9829;</span>
                <span className="font-semibold text-white">Strengths</span>
              </div>
              <div className="space-y-1">
                {strengths.map(theme => (
                  <button
                    key={theme.theme}
                    onClick={() => setSelectedTheme(theme)}
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        {theme.label}
                      </span>
                      <span className="text-[#4A9B7F] font-semibold text-sm ml-2">
                        {theme.attempts}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 italic mt-0.5">
                      {theme.accuracy}% accuracy
                    </div>
                  </button>
                ))}
                {strengths.length === 0 && (
                  <div className="text-gray-500 text-sm py-2">
                    Keep practicing!
                  </div>
                )}
              </div>
            </div>

            {/* Center - Bubble chart */}
            <BubbleChart
              strengths={strengths}
              weaknesses={weaknesses}
              onSelectTheme={setSelectedTheme}
            />

            {/* Right panel - Weaknesses list */}
            <div className="w-56 flex-shrink-0">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <span className="text-[#E07B5A]">&#9829;</span>
                <span className="font-semibold text-white">Needs Work</span>
              </div>
              <div className="space-y-1">
                {weaknesses.map(theme => (
                  <button
                    key={theme.theme}
                    onClick={() => setSelectedTheme(theme)}
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        {theme.label}
                      </span>
                      <span className="text-[#E07B5A] font-semibold text-sm ml-2">
                        {theme.attempts}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 italic mt-0.5">
                      {theme.accuracy}% accuracy
                    </div>
                  </button>
                ))}
                {weaknesses.length === 0 && (
                  <div className="text-gray-500 text-sm py-2">
                    Looking good!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
