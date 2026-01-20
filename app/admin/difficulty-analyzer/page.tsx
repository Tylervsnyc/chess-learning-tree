'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Chessboard } from 'react-chessboard';

interface DifficultyFactors {
  patternVisibility: number;
  candidateMoves: number;
  trapPotential: number;
  calculationDepth: number;
  boardComplexity: number;
  setupRequired: number;
}

interface PuzzleAnalysis {
  puzzleId: string;
  puzzleFen: string;
  rating: number;
  lichessThemes: string[];
  solution: string;
  predictedPrimaryTheme: string;
  difficultyFactors: DifficultyFactors;
  trueDifficultyScore: number;
  recommendedSlot: 1 | 2 | 3 | 4 | 5 | 6;
  executingPiece: string | null;
  solutionOutcome: string;
  difficultyReasoning: string;
  playerColor: 'white' | 'black';
  lastMoveFrom: string;
  lastMoveTo: string;
  setupMove: string;
}

interface SlotAssignment {
  slot: 1 | 2 | 3 | 4 | 5 | 6;
  puzzleId: string;
  analysis: PuzzleAnalysis;
}

interface LessonArcResponse {
  targetElo: number;
  bracket: string;
  theme: string;
  candidateCount: number;
  lessonArc: SlotAssignment[];
}

const SLOT_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Warmup', color: '#58CC02' },
  2: { label: 'Warmup', color: '#58CC02' },
  3: { label: 'Core', color: '#1CB0F6' },
  4: { label: 'Core', color: '#1CB0F6' },
  5: { label: 'Stretch', color: '#FF9600' },
  6: { label: 'Boss', color: '#FF6B6B' },
};

const FACTOR_INFO: Record<string, { label: string; description: string; invertedForDifficulty?: boolean }> = {
  patternVisibility: {
    label: 'Pattern Visibility',
    description: 'How obvious is the tactic? High = easy (check/capture)',
    invertedForDifficulty: true,
  },
  candidateMoves: {
    label: 'Candidate Moves',
    description: 'How many plausible alternatives? High = hard',
  },
  trapPotential: {
    label: 'Trap Potential',
    description: 'Are there tempting wrong answers? High = hard',
  },
  calculationDepth: {
    label: 'Calculation Depth',
    description: 'Move count adjusted for forcing nature. High = hard',
  },
  boardComplexity: {
    label: 'Board Complexity',
    description: 'Piece count / visual noise. High = hard',
  },
  setupRequired: {
    label: 'Setup Required',
    description: 'Does solution need quiet prep moves? High = hard',
  },
};

function FactorBar({ name, value, inverted }: { name: string; value: number; inverted?: boolean }) {
  const info = FACTOR_INFO[name];
  // For inverted factors (patternVisibility), high value = easy, so show it differently
  const effectiveValue = inverted ? 100 - value : value;
  const barColor = effectiveValue < 30 ? '#58CC02' : effectiveValue < 60 ? '#FFD700' : '#FF6B6B';

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{info?.label || name}</span>
        <span className="text-gray-400">
          {value}
          {inverted && <span className="text-xs ml-1">(inv: {effectiveValue})</span>}
        </span>
      </div>
      <div className="h-2 bg-[#131F24] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: barColor }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{info?.description}</p>
    </div>
  );
}

function PuzzleCard({ assignment, isSelected, onClick }: {
  assignment: SlotAssignment;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { slot, puzzleId, analysis } = assignment;
  const slotInfo = SLOT_LABELS[slot];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected
          ? 'bg-[#1A2C35] border-[#1CB0F6]'
          : 'bg-[#1A2C35]/50 border-gray-700 hover:border-gray-500'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ backgroundColor: `${slotInfo.color}20`, color: slotInfo.color }}
          >
            {slot}
          </span>
          <span className="text-sm text-gray-400">{slotInfo.label}</span>
        </div>
        <span className="text-xs text-gray-500">{analysis.executingPiece || '?'}</span>
      </div>
      <div className="mb-2">
        <code className="text-xs font-mono text-[#1CB0F6]">{puzzleId}</code>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div>
          <span className="text-gray-500">Lichess:</span>{' '}
          <span className="text-white">{analysis.rating}</span>
        </div>
        <div>
          <span className="text-gray-500">True:</span>{' '}
          <span className="text-[#1CB0F6] font-medium">{analysis.trueDifficultyScore}</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500 truncate">
        {analysis.predictedPrimaryTheme} • {analysis.solutionOutcome}
      </div>
    </button>
  );
}

export default function DifficultyAnalyzerPage() {
  const [mode, setMode] = useState<'single' | 'lesson'>('lesson');
  const [puzzleId, setPuzzleId] = useState('');
  const [bracket, setBracket] = useState('0400-0800');
  const [theme, setTheme] = useState('fork');
  const [targetElo, setTargetElo] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Single puzzle analysis
  const [singleAnalysis, setSingleAnalysis] = useState<PuzzleAnalysis | null>(null);

  // Lesson arc
  const [lessonArc, setLessonArc] = useState<LessonArcResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const analyzeSingle = async () => {
    if (!puzzleId.trim()) return;
    setLoading(true);
    setError(null);
    setSingleAnalysis(null);

    try {
      const res = await fetch(`/api/analyze-difficulty?mode=single&puzzleId=${puzzleId.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze puzzle');
      }

      setSingleAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const generateLessonArc = async () => {
    setLoading(true);
    setError(null);
    setLessonArc(null);
    setSelectedSlot(null);

    try {
      const res = await fetch(
        `/api/analyze-difficulty?mode=lesson&bracket=${bracket}&theme=${theme}&targetElo=${targetElo}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate lesson arc');
      }

      setLessonArc(data);
      if (data.lessonArc?.length > 0) {
        setSelectedSlot(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const selectedAssignment = lessonArc?.lessonArc.find(a => a.slot === selectedSlot);
  const displayAnalysis = mode === 'single' ? singleAnalysis : selectedAssignment?.analysis;

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div className="bg-[#1A2C35] border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Difficulty Analyzer</h1>
            <p className="text-sm text-gray-400">Test puzzle difficulty analysis & 6-puzzle lesson arcs</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-[#1CB0F6] hover:text-[#58CC02] transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('lesson')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'lesson'
                ? 'bg-[#1CB0F6] text-white'
                : 'bg-[#1A2C35] text-gray-400 hover:text-white'
            }`}
          >
            6-Puzzle Lesson Arc
          </button>
          <button
            onClick={() => setMode('single')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'single'
                ? 'bg-[#1CB0F6] text-white'
                : 'bg-[#1A2C35] text-gray-400 hover:text-white'
            }`}
          >
            Single Puzzle
          </button>
        </div>

        {/* Controls */}
        <div className="bg-[#1A2C35] rounded-xl p-6 border border-gray-700 mb-6">
          {mode === 'single' ? (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">Puzzle ID</label>
                <input
                  type="text"
                  value={puzzleId}
                  onChange={(e) => setPuzzleId(e.target.value)}
                  placeholder="e.g., 009tE"
                  className="w-full bg-[#131F24] border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#1CB0F6] focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && analyzeSingle()}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={analyzeSingle}
                  disabled={loading || !puzzleId.trim()}
                  className="px-6 py-2 bg-[#58CC02] text-white font-medium rounded-lg hover:bg-[#4CAF00] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rating Bracket</label>
                <select
                  value={bracket}
                  onChange={(e) => setBracket(e.target.value)}
                  className="w-full bg-[#131F24] border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#1CB0F6] focus:outline-none"
                >
                  <option value="0400-0800">400-800 (Beginner)</option>
                  <option value="0800-1200">800-1200 (Intermediate)</option>
                  <option value="1200-1600">1200-1600 (Advanced)</option>
                  <option value="1600-2000">1600-2000 (Expert)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-[#131F24] border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-[#1CB0F6] focus:outline-none"
                >
                  <option value="fork">Fork</option>
                  <option value="pin">Pin</option>
                  <option value="skewer">Skewer</option>
                  <option value="discoveredAttack">Discovered Attack</option>
                  <option value="mateIn1">Mate in 1</option>
                  <option value="mateIn2">Mate in 2</option>
                  <option value="backRankMate">Back Rank Mate</option>
                  <option value="deflection">Deflection</option>
                  <option value="attraction">Attraction</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Target ELO</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTargetElo(Math.max(400, targetElo - 100))}
                    className="w-12 h-10 bg-[#131F24] border border-gray-600 rounded-lg text-white text-xl font-bold hover:bg-[#1A2C35] hover:border-[#1CB0F6] transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 bg-[#131F24] border border-gray-600 rounded-lg px-4 py-2 text-white text-center font-medium">
                    {targetElo}
                  </div>
                  <button
                    onClick={() => setTargetElo(Math.min(2000, targetElo + 100))}
                    className="w-12 h-10 bg-[#131F24] border border-gray-600 rounded-lg text-white text-xl font-bold hover:bg-[#1A2C35] hover:border-[#1CB0F6] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={generateLessonArc}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-[#58CC02] text-white font-medium rounded-lg hover:bg-[#4CAF00] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate Arc'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Lesson Arc Stats */}
        {lessonArc && mode === 'lesson' && (
          <div className="bg-[#1A2C35] rounded-xl p-4 border border-gray-700 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Target ELO:</span>{' '}
                  <span className="text-white font-medium">{lessonArc.targetElo}</span>
                </div>
                <div>
                  <span className="text-gray-500">Theme:</span>{' '}
                  <span className="text-[#58CC02] font-medium">{lessonArc.theme}</span>
                </div>
                <div>
                  <span className="text-gray-500">Candidates:</span>{' '}
                  <span className="text-white">{lessonArc.candidateCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Selected:</span>{' '}
                  <span className="text-[#1CB0F6] font-medium">{lessonArc.lessonArc.length}/6</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#58CC02' }} />
                  <span className="text-gray-400">Warmup</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#1CB0F6' }} />
                  <span className="text-gray-400">Core</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF9600' }} />
                  <span className="text-gray-400">Stretch</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#FF6B6B' }} />
                  <span className="text-gray-400">Boss</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Puzzle List (lesson mode) or empty */}
          {mode === 'lesson' && lessonArc && (
            <div className="col-span-3 space-y-3">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Lesson Arc (6 Puzzles)</h3>
              {lessonArc.lessonArc.map((assignment) => (
                <PuzzleCard
                  key={assignment.slot}
                  assignment={assignment}
                  isSelected={selectedSlot === assignment.slot}
                  onClick={() => setSelectedSlot(assignment.slot)}
                />
              ))}
            </div>
          )}

          {/* Center: Chessboard */}
          <div className={mode === 'lesson' && lessonArc ? 'col-span-4' : 'col-span-5'}>
            {displayAnalysis ? (
              <div className="bg-[#1A2C35] rounded-xl p-4 border border-gray-700">
                {/* Puzzle ID */}
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono text-[#1CB0F6] bg-[#131F24] px-2 py-1 rounded">
                    {displayAnalysis.puzzleId}
                  </code>
                  <a
                    href={`https://lichess.org/training/${displayAnalysis.puzzleId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-[#1CB0F6] transition-colors"
                  >
                    View on Lichess →
                  </a>
                </div>
                {/* Player color indicator */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm border border-gray-600"
                      style={{ backgroundColor: displayAnalysis.playerColor === 'white' ? '#fff' : '#333' }}
                    />
                    <span className="text-sm text-gray-400">
                      {displayAnalysis.playerColor === 'white' ? 'White' : 'Black'} to move
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    After {displayAnalysis.setupMove}
                  </span>
                </div>
                <div className="aspect-square">
                  <Chessboard
                    options={{
                      position: displayAnalysis.puzzleFen,
                      boardOrientation: displayAnalysis.playerColor,
                      squareStyles: {
                        [displayAnalysis.lastMoveFrom]: {
                          backgroundColor: 'rgba(255, 255, 0, 0.4)',
                        },
                        [displayAnalysis.lastMoveTo]: {
                          backgroundColor: 'rgba(255, 255, 0, 0.5)',
                        },
                      },
                      boardStyle: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                      },
                      darkSquareStyle: { backgroundColor: '#779952' },
                      lightSquareStyle: { backgroundColor: '#edeed1' },
                    }}
                  />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-1">Solution:</div>
                  <div className="font-mono text-white">{displayAnalysis.solution}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {displayAnalysis.lichessThemes.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className={`px-2 py-0.5 rounded text-xs ${
                        t === displayAnalysis.predictedPrimaryTheme
                          ? 'bg-[#58CC02]/20 text-[#58CC02] font-medium'
                          : 'bg-[#131F24] text-gray-400'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#1A2C35] rounded-xl p-4 border border-gray-700 aspect-square flex items-center justify-center">
                <p className="text-gray-500">
                  {mode === 'single' ? 'Enter a puzzle ID to analyze' : 'Generate a lesson arc to see puzzles'}
                </p>
              </div>
            )}
          </div>

          {/* Right: Difficulty Analysis */}
          <div className={mode === 'lesson' && lessonArc ? 'col-span-5' : 'col-span-7'}>
            {displayAnalysis ? (
              <div className="bg-[#1A2C35] rounded-xl p-6 border border-gray-700">
                {/* Header Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#131F24] rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs mb-1">Lichess Rating</div>
                    <div className="text-2xl font-bold text-white">{displayAnalysis.rating}</div>
                  </div>
                  <div className="bg-[#131F24] rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs mb-1">True Difficulty</div>
                    <div className="text-2xl font-bold text-[#1CB0F6]">
                      {displayAnalysis.trueDifficultyScore}
                    </div>
                  </div>
                  <div className="bg-[#131F24] rounded-lg p-4 text-center">
                    <div className="text-gray-500 text-xs mb-1">Recommended Slot</div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: SLOT_LABELS[displayAnalysis.recommendedSlot].color }}
                    >
                      {displayAnalysis.recommendedSlot}
                    </div>
                  </div>
                </div>

                {/* Rating Comparison */}
                <div className="mb-6 p-4 bg-[#131F24] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Rating Comparison</span>
                    <span className="text-xs text-gray-500">
                      Diff: {displayAnalysis.trueDifficultyScore - displayAnalysis.rating > 0 ? '+' : ''}
                      {displayAnalysis.trueDifficultyScore - displayAnalysis.rating}
                    </span>
                  </div>
                  <div className="relative h-8 bg-[#1A2C35] rounded-full">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-400 border-2 border-white"
                      style={{ left: `${((displayAnalysis.rating - 400) / 1600) * 100}%` }}
                      title={`Lichess: ${displayAnalysis.rating}`}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1CB0F6] border-2 border-white"
                      style={{ left: `${((displayAnalysis.trueDifficultyScore - 400) / 1600) * 100}%` }}
                      title={`True: ${displayAnalysis.trueDifficultyScore}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>400</span>
                    <span>2000</span>
                  </div>
                </div>

                {/* Difficulty Factors */}
                <h4 className="text-sm font-medium text-gray-400 mb-4">Difficulty Factors</h4>
                {Object.entries(displayAnalysis.difficultyFactors).map(([key, value]) => (
                  <FactorBar
                    key={key}
                    name={key}
                    value={value}
                    inverted={FACTOR_INFO[key]?.invertedForDifficulty}
                  />
                ))}

                {/* Reasoning */}
                <div className="mt-6 p-4 bg-[#131F24] rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Analysis Summary</div>
                  <p className="text-white text-sm">{displayAnalysis.difficultyReasoning}</p>
                </div>

                {/* Meta Info */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                  <div>
                    <span className="text-gray-600">Piece:</span> {displayAnalysis.executingPiece || 'unknown'}
                  </div>
                  <div>
                    <span className="text-gray-600">Outcome:</span> {displayAnalysis.solutionOutcome}
                  </div>
                  <div>
                    <span className="text-gray-600">Primary:</span> {displayAnalysis.predictedPrimaryTheme}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#1A2C35] rounded-xl p-6 border border-gray-700 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="mb-2">No puzzle selected</p>
                  <p className="text-sm">
                    {mode === 'single'
                      ? 'Enter a puzzle ID and click Analyze'
                      : 'Click Generate Arc to create a lesson'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
