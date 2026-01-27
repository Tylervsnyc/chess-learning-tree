'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chessboard } from 'react-chessboard';
import ChessTacticsTree from '@/components/tree/ChessTacticsTree';

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

// Theme stats by level - FROM CHAIN ANALYSIS (move-by-move tactical analysis)
// Each move assigned ONE primary theme with confidence scoring
// Outcomes absorb mechanisms (fork→mate = mate puzzle)
const LEVEL_STATS = {
  '400-800': {
    label: '400-800 ELO',
    color: '#58CC02',
    totalPuzzles: 52155,
    // From chain analysis PRIMARY THEMES
    primaryThemes: {
      checkmate: 80.9,
      fork: 9.7,
      discoveredAttack: 4.5,
      pin: 2.9,
      skewer: 0.8,
      tactical: 1.0,
      attraction: 0.2,
    },
    // Outcome distribution
    outcomes: {
      checkmate: 80.9,
      major_win: 7.9,
      minor_win: 5.8,
      queen_win: 2.7,
      positional: 1.7,
      pawn_win: 1.0,
    },
    // Combination stats
    combinations: {
      total: 30.1,
      clean: 29.9,
      topFlows: [
        { flow: 'discoveredAttack → checkmate', count: 8558 },
        { flow: 'fork → checkmate', count: 5576 },
        { flow: 'skewer → checkmate', count: 1252 },
      ],
    },
    confidence: { high: 96.0, medium: 0.7, low: 3.3 },
    // Legacy themes field for tree visualization
    themes: {
      mate: 80.9, fork: 9.7, discoveredAttack: 4.5, pin: 2.9, skewer: 0.8,
      backRankMate: 13.8, operaMate: 3.3, pillsburysMate: 3.0, smotheredMate: 2.5,
      attraction: 0.2, crushing: 7.9, advantage: 1.7,
    }
  },
  '800-1200': {
    label: '800-1200 ELO',
    color: '#1CB0F6',
    totalPuzzles: 150319,
    primaryThemes: {
      checkmate: 50.9,
      fork: 24.6,
      discoveredAttack: 13.1,
      pin: 3.1,
      skewer: 1.4,
      tactical: 6.8,
      attraction: 0.2,
    },
    outcomes: {
      checkmate: 50.9,
      major_win: 19.0,
      minor_win: 12.8,
      queen_win: 7.6,
      positional: 5.5,
      pawn_win: 4.3,
    },
    combinations: {
      total: 23.3,
      clean: 23.2,
      topFlows: [
        { flow: 'discoveredAttack → checkmate', count: 16321 },
        { flow: 'fork → checkmate', count: 10098 },
        { flow: 'skewer → checkmate', count: 2649 },
      ],
    },
    confidence: { high: 92.7, medium: 0.5, low: 6.8 },
    themes: {
      mate: 50.9, fork: 24.6, discoveredAttack: 13.1, pin: 3.1, skewer: 1.4,
      backRankMate: 4.8, operaMate: 1.5, pillsburysMate: 1.4, smotheredMate: 0.9,
      attraction: 0.2, crushing: 19.0, advantage: 5.5,
    }
  },
  '1200-1600': {
    label: '1200-1600 ELO',
    color: '#FF9600',
    totalPuzzles: 137033,
    primaryThemes: {
      checkmate: 28.0,
      fork: 27.4,
      discoveredAttack: 21.5,
      pin: 6.9,
      skewer: 3.3,
      tactical: 12.6,
      attraction: 0.4,
    },
    outcomes: {
      checkmate: 28.0,
      major_win: 21.1,
      minor_win: 23.3,
      queen_win: 7.4,
      positional: 11.6,
      pawn_win: 8.6,
    },
    combinations: {
      total: 17.5,
      clean: 17.4,
      topFlows: [
        { flow: 'discoveredAttack → checkmate', count: 9461 },
        { flow: 'fork → checkmate', count: 6415 },
        { flow: 'discoveredAttack → discoveredAttack → checkmate', count: 1531 },
      ],
    },
    confidence: { high: 86.0, medium: 1.4, low: 12.6 },
    themes: {
      mate: 28.0, fork: 27.4, discoveredAttack: 21.5, pin: 6.9, skewer: 3.3,
      backRankMate: 1.5, operaMate: 0.9, pillsburysMate: 0.8, smotheredMate: 0.4,
      attraction: 0.4, crushing: 21.1, advantage: 11.6,
    }
  }
} as const;

// Node to Lichess theme mapping
// Maps tree node IDs to chain analysis theme keys
// Available themes in chain analysis: checkmate, discoveredAttack, fork, pin, skewer
const NODE_TO_THEME: Record<string, string | null> = {
  // These have verified examples in chain analysis
  fork: 'fork',
  pin: 'pin',
  skewer: 'skewer',
  discovery: 'discoveredAttack',
  checkmate: 'checkmate',
  matePatterns: 'checkmate',
  winMaterial: 'fork',
  // These don't have pure examples (they're enablers/forcing moves, not primary themes)
  // Show as unavailable rather than silently failing
  doubleCheck: null,
  attraction: null,
  deflection: null,
  clearance: null,
  removal: null,
  interference: null,
  overload: null,
  endgame: null,
  check: null,
  capture: null,
  threat: null,
};

// Themes that have chain analysis data
const AVAILABLE_THEMES = ['fork', 'pin', 'skewer', 'discovery', 'checkmate', 'matePatterns', 'winMaterial'];

type LevelKey = keyof typeof LEVEL_STATS;

interface Puzzle {
  id: string;
  fen: string;
  playerColor: 'white' | 'black';
  moveCount: number;
  outcome: string;
  primaryTheme: string;
  teachAs: string;
  confidence: number;
  moves: Array<{
    number: number;
    san: string;
    theme: string;
    confidence: number;
    evidence: string;
  }>;
  url: string;
}

interface StatsData {
  total: number;
  primaryThemes: Record<string, number>;
  outcomes: Record<string, number>;
  combinations: {
    percent: number;
    topFlows: Array<{ flow: string; count: number }>;
  };
  confidence: {
    highPercent: number;
  };
}

interface ApiResponse {
  dataFile?: string;
  minPlays?: number;
  count: number;
  puzzles: Puzzle[];
  stats?: StatsData;
  error?: string;
}

interface SelectedNode {
  id: string;
  label: string;
  description?: string;
  tier: string;
}

const MIN_PLAYS_OPTIONS = [
  { value: 0, label: 'All' },
  { value: 1000, label: '1K+' },
  { value: 3000, label: '3K+' },
  { value: 5000, label: '5K+' },
];

export default function TestThemeMap() {
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelKey>('400-800');
  const [minPlays, setMinPlays] = useState<number>(1000); // Default to 1000+ plays
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loadingPuzzles, setLoadingPuzzles] = useState(false);
  const [dataFile, setDataFile] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Dynamic stats from chain analysis
  const [dynamicStats, setDynamicStats] = useState<StatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const levelData = LEVEL_STATS[selectedLevel];

  // Transform dynamicStats to format tree expects
  // Tree uses nodeToTheme mapping: fork->fork, pin->pin, discovery->discoveredAttack, matePatterns->backRankMate, etc.
  const dynamicTreeStats: Record<string, number> | undefined = dynamicStats ? {
    // Primary mechanisms from chain analysis
    fork: dynamicStats.primaryThemes.fork || 0,
    pin: dynamicStats.primaryThemes.pin || 0,
    skewer: dynamicStats.primaryThemes.skewer || 0,
    discoveredAttack: dynamicStats.primaryThemes.discoveredAttack || 0,
    // Checkmate-related (use checkmate percentage for mate patterns)
    mate: dynamicStats.primaryThemes.checkmate || 0,
    backRankMate: (dynamicStats.primaryThemes.checkmate || 0) * 0.17, // Estimate ~17% of mates are back rank
    // Material outcomes (derive from outcomes)
    crushing: dynamicStats.outcomes.major_win || 0,
    advantage: dynamicStats.outcomes.positional || 0,
    // Not tracked in chain analysis but keep for tree display
    doubleCheck: 0,
    attraction: dynamicStats.primaryThemes.attraction || 0,
  } : undefined;

  // Fetch stats when level or minPlays changes
  useEffect(() => {
    setLoadingStats(true);
    const params = new URLSearchParams({
      level: selectedLevel,
      limit: '1', // We just need stats, not puzzles
    });
    if (minPlays > 0) {
      params.set('minPlays', minPlays.toString());
    }

    fetch(`/api/puzzles/analyzed?${params}`)
      .then(res => res.json())
      .then((data: ApiResponse) => {
        if (data.stats) {
          setDynamicStats(data.stats);
        }
        setLoadingStats(false);
      })
      .catch(() => {
        setDynamicStats(null);
        setLoadingStats(false);
      });
  }, [selectedLevel, minPlays]);

  // Fetch puzzles from chain analysis data (pre-verified)
  useEffect(() => {
    if (!selectedNode) {
      setPuzzles([]);
      setDataFile(null);
      setApiError(null);
      return;
    }

    const lichessTheme = NODE_TO_THEME[selectedNode.id];

    // Check if this theme has analyzed data
    if (lichessTheme === null || lichessTheme === undefined) {
      setPuzzles([]);
      setDataFile(null);
      setApiError(
        `"${selectedNode.label}" is an enabler/forcing move - not a primary teaching theme. ` +
        `Chain analysis only tracks: Fork, Pin, Skewer, Discovery, Checkmate.`
      );
      setLoadingPuzzles(false);
      return;
    }

    setLoadingPuzzles(true);
    setApiError(null);

    // Use the new analyzed puzzles API (chain analysis data)
    const params = new URLSearchParams({
      theme: lichessTheme,
      level: selectedLevel,
      limit: '4',
      type: 'pure',
    });
    if (minPlays > 0) {
      params.set('minPlays', minPlays.toString());
    }

    fetch(`/api/puzzles/analyzed?${params}`)
      .then(res => res.json())
      .then((data: ApiResponse) => {
        setPuzzles(data.puzzles || []);
        setDataFile(data.dataFile || null);
        setApiError(data.error || null);
        setLoadingPuzzles(false);
      })
      .catch(() => {
        setPuzzles([]);
        setDataFile(null);
        setApiError('Failed to fetch puzzles');
        setLoadingPuzzles(false);
      });
  }, [selectedNode, selectedLevel, minPlays]);

  const handleNodeClick = (node: SelectedNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="min-h-screen bg-[#131F24] flex">
      {/* Main Content */}
      <div className={`flex-1 transition-all ${selectedNode ? 'mr-[400px]' : ''}`}>
        {/* Header */}
        <div className="bg-[#1A2C35] border-b border-white/10 px-4 py-3 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Link href="/" className="text-white/60 hover:text-white">
              <ChevronLeft />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-white">Chess Theme Map</h1>
              <p className="text-xs text-white/50">
                Click any theme to see verified puzzle examples
              </p>
            </div>

            {/* Level Selector */}
            <div className="flex gap-2">
              {(Object.keys(LEVEL_STATS) as LevelKey[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedLevel === level
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                  style={{
                    backgroundColor: selectedLevel === level
                      ? LEVEL_STATS[level].color + '30'
                      : 'transparent',
                    borderColor: selectedLevel === level
                      ? LEVEL_STATS[level].color
                      : 'transparent',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                >
                  {LEVEL_STATS[level].label}
                </button>
              ))}
            </div>

            {/* Min Plays Filter */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/20">
              <span className="text-xs text-white/40">Plays:</span>
              {MIN_PLAYS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMinPlays(opt.value)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                    minPlays === opt.value
                      ? 'bg-white/20 text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div
          className="border-b border-white/10 px-4 py-2"
          style={{ backgroundColor: levelData.color + '10' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-white/50">Puzzles: </span>
                <span className="text-white font-medium">
                  {loadingStats ? '...' : (dynamicStats?.total.toLocaleString() || levelData.totalPuzzles.toLocaleString())}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-white/40">Primary themes:</span>
                <span className="px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(88, 204, 2, 0.2)' }}>
                  <span className="text-[#58CC02]">Checkmate: {dynamicStats?.primaryThemes.checkmate ?? levelData.primaryThemes.checkmate}%</span>
                </span>
                <span className="px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(28, 176, 246, 0.2)' }}>
                  <span className="text-[#1CB0F6]">Fork: {dynamicStats?.primaryThemes.fork ?? levelData.primaryThemes.fork}%</span>
                </span>
                <span className="px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(255, 150, 0, 0.2)' }}>
                  <span className="text-[#FF9600]">Discovery: {dynamicStats?.primaryThemes.discoveredAttack ?? levelData.primaryThemes.discoveredAttack}%</span>
                </span>
              </div>
            </div>
            <div className="text-[10px] text-white/30">
              Combinations: {dynamicStats?.combinations.percent ?? levelData.combinations.total}% | High confidence: {dynamicStats?.confidence.highPercent ?? levelData.confidence.high}%
            </div>
          </div>
        </div>

        {/* Tree Visualization */}
        <ChessTacticsTree
          showHeader={false}
          onNodeClick={handleNodeClick}
          themeStats={dynamicTreeStats || levelData.themes}
          levelColor={levelData.color}
        />

        {/* Info panel */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Chain Analysis - Dynamic Stats */}
          <div className="bg-[#0D1A1F] rounded-xl p-6 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Chain Analysis: {selectedLevel} ELO
                {minPlays > 0 && <span className="text-white/50 font-normal ml-2">({minPlays.toLocaleString()}+ plays)</span>}
              </h3>
              {loadingStats && <span className="text-xs text-white/40">Loading...</span>}
            </div>
            <p className="text-xs text-white/50 mb-4">
              {dynamicStats ? `${dynamicStats.total.toLocaleString()} puzzles analyzed` : 'Loading stats...'}
            </p>

            {/* Primary Theme Distribution - Dynamic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-3">Primary Theme Distribution</h4>
                {dynamicStats ? (
                  <div className="space-y-3">
                    {['checkmate', 'fork', 'discoveredAttack', 'pin', 'skewer'].map(theme => {
                      const percent = dynamicStats.primaryThemes[theme] || 0;
                      return (
                        <div key={theme} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60 capitalize">{theme === 'discoveredAttack' ? 'Discovery' : theme}</span>
                            <span className="text-white font-medium">{percent}%</span>
                          </div>
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${percent}%`,
                                backgroundColor: levelData.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-white/40 text-sm">Loading...</div>
                )}
              </div>

              {/* Outcome Distribution */}
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-3">Puzzle Outcomes</h4>
                {dynamicStats ? (
                  <div className="space-y-2">
                    {Object.entries(dynamicStats.outcomes)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([outcome, percent]) => (
                        <div key={outcome} className="flex items-center justify-between text-xs">
                          <span className="text-white/60">{outcome.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${percent}%`,
                                  backgroundColor: outcome === 'checkmate' ? '#58CC02' : '#1CB0F6',
                                }}
                              />
                            </div>
                            <span className="text-white/70 w-12 text-right">{percent}%</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-white/40 text-sm">Loading...</div>
                )}
              </div>
            </div>

            {/* Top Combination Flows - Dynamic */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-white/70 mb-3">
                Top Combination Flows
                <span className="text-white/40 font-normal ml-2">
                  ({dynamicStats?.combinations.percent ?? '...'}% of puzzles are combinations)
                </span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(dynamicStats?.combinations.topFlows || []).map((flow, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/70 border border-white/10">
                    {flow.flow} <span className="text-white/40">({flow.count.toLocaleString()})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Hierarchy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1A2C35] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#58CC02]" />
                <span className="font-semibold text-[#58CC02]">Outcomes</span>
              </div>
              <p className="text-white/60 text-sm">
                The goals: checkmate, winning material, promotion. <span className="text-[#58CC02]">Absorbs mechanisms when present.</span>
              </p>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#1CB0F6]" />
                <span className="font-semibold text-[#1CB0F6]">Mechanisms</span>
              </div>
              <p className="text-white/60 text-sm">
                Tactical patterns: forks, pins, skewers. <span className="text-[#1CB0F6]">Only counted when NOT leading to mate.</span>
              </p>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#FF9600]" />
                <span className="font-semibold text-[#FF9600]">Enablers</span>
              </div>
              <p className="text-white/60 text-sm">
                Setup moves: attraction, deflection, clearance. <span className="text-[#FF9600]">Must lead to mechanism/outcome.</span>
              </p>
            </div>
            <div className="bg-[#1A2C35] rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#A560E8]" />
                <span className="font-semibold text-[#A560E8]">Forcing Moves</span>
              </div>
              <p className="text-white/60 text-sm">
                Checks, captures, and threats. <span className="text-[#A560E8]">HOW you do it, not WHAT you learn.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {selectedNode && (
        <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-[#1A2C35] border-l border-white/10 overflow-y-auto z-40">
          {/* Panel Header */}
          <div className="sticky top-0 bg-[#1A2C35] border-b border-white/10 p-4 z-10">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded uppercase"
                  style={{
                    backgroundColor:
                      selectedNode.tier === 'outcomes' || selectedNode.tier === 'ultimate'
                        ? 'rgba(88, 204, 2, 0.2)'
                        : selectedNode.tier === 'mechanisms'
                        ? 'rgba(28, 176, 246, 0.2)'
                        : selectedNode.tier === 'enablers'
                        ? 'rgba(255, 150, 0, 0.2)'
                        : 'rgba(165, 96, 232, 0.2)',
                    color:
                      selectedNode.tier === 'outcomes' || selectedNode.tier === 'ultimate'
                        ? '#58CC02'
                        : selectedNode.tier === 'mechanisms'
                        ? '#1CB0F6'
                        : selectedNode.tier === 'enablers'
                        ? '#FF9600'
                        : '#A560E8',
                  }}
                >
                  {selectedNode.tier}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{selectedNode.label}</h2>
                {selectedNode.description && (
                  <p className="text-sm text-white/60 mt-1">{selectedNode.description}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-white/40 hover:text-white text-2xl leading-none p-1"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Sample Puzzles - from chain analysis */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white/70 mb-2">
              Verified Examples
            </h3>
            {dataFile && (
              <p className="text-[10px] text-white/30 mb-3 font-mono">
                {dataFile}
              </p>
            )}
            {apiError && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3">
                <p className="text-xs text-yellow-200">
                  {apiError}
                </p>
              </div>
            )}

            {loadingPuzzles ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 animate-pulse">
                    <div className="aspect-square bg-white/10 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : puzzles.length > 0 ? (
              <div className="space-y-4">
                {puzzles.map((puzzle) => (
                  <div key={puzzle.id} className="bg-white/5 rounded-lg p-3">
                    <div className="aspect-square mb-2 rounded overflow-hidden relative">
                      {puzzle.fen && (
                        <Chessboard
                          key={puzzle.id}
                          options={{
                            position: puzzle.fen,
                            boardOrientation: puzzle.playerColor || 'white',
                            boardStyle: { borderRadius: '8px' },
                            darkSquareStyle: { backgroundColor: '#779952' },
                            lightSquareStyle: { backgroundColor: '#edeed1' },
                          }}
                        />
                      )}
                    </div>

                    {/* Header: player color + confidence */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                          puzzle.playerColor === 'black'
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          Play as {puzzle.playerColor}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                          {puzzle.teachAs}
                        </span>
                      </div>
                      <span className="text-xs text-white/50">
                        {Math.round(puzzle.confidence * 100)}% conf
                      </span>
                    </div>

                    {/* Move breakdown - the key insight! */}
                    <div className="bg-black/20 rounded p-2 mb-2">
                      <div className="text-[10px] text-white/40 mb-1">Solution ({puzzle.moveCount} moves):</div>
                      <div className="space-y-1">
                        {puzzle.moves.map((move, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="text-white font-mono">{move.number}. {move.san}</span>
                            <span className="text-white/50">→</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              move.theme === puzzle.primaryTheme
                                ? 'bg-green-500/30 text-green-300'
                                : 'bg-white/10 text-white/60'
                            }`}>
                              {move.theme}
                            </span>
                            <span className="text-white/30 text-[10px]">
                              {Math.round(move.confidence * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Outcome */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/40">
                        Outcome: <span className="text-white/60">{puzzle.outcome}</span>
                      </span>
                      <a
                        href={puzzle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-1 rounded bg-[#1CB0F6]/20 text-[#1CB0F6] hover:bg-[#1CB0F6]/30 transition-colors"
                      >
                        Solve →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/40">
                <p>No puzzles found for this combination</p>
                <p className="text-xs mt-1">Try a different connection or level</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
