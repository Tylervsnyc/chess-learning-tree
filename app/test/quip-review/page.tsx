'use client';

import { useState, useEffect, useMemo } from 'react';
import { AUTHORED_LINES } from '@/lib/speech/line-pool';
import { ROOKIE_CHARACTER_CARD } from '@/lib/rookie-os/character-card';

// ════════════════════════════════
// TYPES
// ════════════════════════════════

type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'needs-edit' | 'favorite';

interface QuipReview {
  status: ReviewStatus;
  comment: string;
  reviewedAt: string | null;
}

type ReviewState = Record<string, QuipReview>;

// ════════════════════════════════
// HELPERS
// ════════════════════════════════

const STORAGE_KEY = 'quip-review-state';

function loadReviews(): ReviewState {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveReviews(state: ReviewState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function categorize(line: (typeof AUTHORED_LINES)[number]): string {
  const id = line.id;
  if (id.startsWith('opening_white')) return 'Opening (Player White)';
  if (id.startsWith('opening_black')) return 'Opening (Rookie White)';
  if (id.startsWith('early_')) return 'Early Game';
  if (id.startsWith('capture_minor_player')) return 'Capture Minor (Player)';
  if (id.startsWith('capture_minor_rookie')) return 'Capture Minor (Rookie)';
  if (id.startsWith('capture_player')) return 'Capture Major (Player)';
  if (id.startsWith('capture_rookie')) return 'Capture Major (Rookie)';
  if (id.startsWith('check_player')) return 'Check (Player)';
  if (id.startsWith('check_rookie')) return 'Check (Rookie)';
  if (id.startsWith('checkmate_player')) return 'Checkmate (Player Wins)';
  if (id.startsWith('checkmate_rookie')) return 'Checkmate (Rookie Wins)';
  if (id.startsWith('stalemate')) return 'Stalemate';
  if (id.startsWith('castle_player')) return 'Castle (Player)';
  if (id.startsWith('castle_rookie')) return 'Castle (Rookie)';
  if (id.startsWith('knight_')) return 'Knight Moves';
  if (id.startsWith('queen_')) return 'Queen Moves';
  if (id.startsWith('great_move')) return 'Great Move';
  if (id.startsWith('blunder_')) return 'Blunder';
  if (id.startsWith('fork_')) return 'Fork';
  if (id.startsWith('pin_')) return 'Pin';
  if (id.startsWith('mood_')) return 'Mood Change';
  if (id.startsWith('late_')) return 'Late Game';
  if (id.startsWith('resign_')) return 'Resign';
  if (id.startsWith('quiet_')) return 'Quiet Moves';
  if (id.startsWith('thinking_')) return 'Thinking Time';
  if (id.startsWith('promotion_')) return 'Promotion';
  if (id.startsWith('capture_seq')) return 'Capture Sequence';
  // Fallback: derive from id
  const prefix = id.replace(/_\d+$/, '').replace(/_/g, ' ');
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

function conditionBadges(line: (typeof AUTHORED_LINES)[number]): string[] {
  const badges: string[] = [];
  const c = line.conditions;
  if (!c) return badges;
  if (c.beats) badges.push(...c.beats.map(b => `beat:${b}`));
  if (c.events) badges.push(...c.events.map(e => `event:${e}`));
  if (c.movedBy) badges.push(`by:${c.movedBy}`);
  if (c.playerColor) badges.push(`color:${c.playerColor}`);
  if (c.movedPiece) badges.push(`piece:${c.movedPiece}`);
  if (c.evalMoods) badges.push(...c.evalMoods.map(m => `mood:${m}`));
  if (c.maxMove) badges.push(`before:move ${c.maxMove}`);
  if (c.minMove) badges.push(`after:move ${c.minMove}`);
  return badges;
}

// Parse mes_example into individual dialogues
function parseMesExamples(raw: string): { trigger: string; response: string; id: string }[] {
  return raw.split('<START>').filter(Boolean).map((block, i) => {
    const lines = block.trim().split('\n').filter(Boolean);
    const trigger = lines.find(l => l.startsWith('{{user}}:'))?.replace('{{user}}:', '').trim() || '';
    const response = lines.find(l => l.startsWith('{{char}}:'))?.replace('{{char}}:', '').trim() || '';
    return { trigger, response, id: `mes_example_${i + 1}` };
  });
}

// ════════════════════════════════
// STATUS COLORS
// ════════════════════════════════

const STATUS_COLORS: Record<ReviewStatus, string> = {
  pending: 'bg-zinc-700 text-zinc-300',
  approved: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700',
  rejected: 'bg-red-900/60 text-red-300 border border-red-700',
  'needs-edit': 'bg-amber-900/60 text-amber-300 border border-amber-700',
  favorite: 'bg-fuchsia-900/60 text-fuchsia-300 border border-fuchsia-700',
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Cut',
  'needs-edit': 'Needs Edit',
  favorite: 'Fav',
};

// ════════════════════════════════
// COMPONENTS
// ════════════════════════════════

function QuipCard({
  id,
  text,
  badges,
  priority,
  review,
  onUpdate,
}: {
  id: string;
  text: string;
  badges: string[];
  priority?: number;
  review: QuipReview;
  onUpdate: (review: QuipReview) => void;
}) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState(review.comment);

  const setStatus = (status: ReviewStatus) => {
    const updated = { ...review, status, reviewedAt: new Date().toISOString() };
    onUpdate(updated);
  };

  const saveComment = () => {
    onUpdate({ ...review, comment, reviewedAt: new Date().toISOString() });
    setShowComment(false);
  };

  return (
    <div className={`rounded-lg p-4 ${review.status === 'pending' ? 'bg-zinc-800/50' : 'bg-zinc-800/80'} border border-zinc-700/50 transition-all`}>
      {/* Quip text */}
      <p className="text-base text-zinc-100 leading-relaxed mb-3">
        &ldquo;{text}&rdquo;
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {badges.map(b => (
          <span key={b} className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-400 font-mono">
            {b}
          </span>
        ))}
        {priority !== undefined && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 font-mono">
            pri:{priority}
          </span>
        )}
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-500 font-mono">
          {id}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStatus('favorite')}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${
            review.status === 'favorite'
              ? 'bg-fuchsia-600 text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-fuchsia-800 hover:text-fuchsia-200'
          }`}
        >
          Fav
        </button>
        <button
          onClick={() => setStatus('approved')}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${
            review.status === 'approved'
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-emerald-800 hover:text-emerald-200'
          }`}
        >
          Keep
        </button>
        <button
          onClick={() => setStatus('needs-edit')}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${
            review.status === 'needs-edit'
              ? 'bg-amber-600 text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-amber-800 hover:text-amber-200'
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setStatus('rejected')}
          className={`text-xs px-3 py-1 rounded-md transition-colors ${
            review.status === 'rejected'
              ? 'bg-red-600 text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-red-800 hover:text-red-200'
          }`}
        >
          Cut
        </button>
        <button
          onClick={() => setShowComment(!showComment)}
          className="text-xs px-3 py-1 rounded-md bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors ml-auto"
        >
          {review.comment ? 'Edit Note' : 'Add Note'}
        </button>
      </div>

      {/* Comment */}
      {review.comment && !showComment && (
        <p className="mt-2 text-xs text-amber-300/80 italic pl-2 border-l-2 border-amber-700/50">
          {review.comment}
        </p>
      )}

      {showComment && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveComment()}
            placeholder="Your note..."
            className="flex-1 text-sm px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-600 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400"
            autoFocus
          />
          <button
            onClick={saveComment}
            className="text-xs px-3 py-1.5 rounded-md bg-zinc-600 text-zinc-200 hover:bg-zinc-500 transition-colors"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════
// MAIN PAGE
// ════════════════════════════════

type Tab = 'character-card' | 'authored-quips';
type FilterStatus = 'all' | ReviewStatus;

export default function QuipReviewPage() {
  const [reviews, setReviews] = useState<ReviewState>({});
  const [activeTab, setActiveTab] = useState<Tab>('character-card');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Load saved reviews
  useEffect(() => {
    setReviews(loadReviews());
  }, []);

  const getReview = (id: string): QuipReview =>
    reviews[id] || { status: 'pending' as const, comment: '', reviewedAt: null };

  const updateReview = (id: string, review: QuipReview) => {
    const next = { ...reviews, [id]: review };
    setReviews(next);
    saveReviews(next);
  };

  // Parse mes_examples
  const mesExamples = useMemo(() => parseMesExamples(ROOKIE_CHARACTER_CARD.mes_example), []);

  // Group authored quips by category
  const grouped = useMemo(() => {
    const map = new Map<string, typeof AUTHORED_LINES>();
    for (const line of AUTHORED_LINES) {
      const cat = categorize(line);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(line);
    }
    return map;
  }, []);

  // Stats
  const allIds = useMemo(() => {
    const ids = mesExamples.map(e => e.id);
    ids.push(...AUTHORED_LINES.map(l => l.id));
    // Add greeting IDs
    ids.push('first_mes');
    ROOKIE_CHARACTER_CARD.alternate_greetings.forEach((_, i) => ids.push(`greeting_${i}`));
    return ids;
  }, [mesExamples]);

  const stats = useMemo(() => {
    const s = { total: allIds.length, approved: 0, rejected: 0, needsEdit: 0, pending: 0, favorite: 0 };
    for (const id of allIds) {
      const r = getReview(id);
      if (r.status === 'favorite') s.favorite++;
      else if (r.status === 'approved') s.approved++;
      else if (r.status === 'rejected') s.rejected++;
      else if (r.status === 'needs-edit') s.needsEdit++;
      else s.pending++;
    }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allIds, reviews]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const expandAll = () => setExpandedCategories(new Set(grouped.keys()));
  const collapseAll = () => setExpandedCategories(new Set());

  const filterQuip = (id: string) => {
    if (filterStatus === 'all') return true;
    return getReview(id).status === filterStatus;
  };

  const exportReviews = () => {
    const data = JSON.stringify(reviews, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quip-reviews-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-auto">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Rookie Quip Review</h1>
          <p className="text-zinc-400 text-sm">
            Review every quip in Rookie&apos;s OS. Keep, edit, or cut.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6 text-sm">
          <span className="text-zinc-400">{stats.total} total</span>
          <span className="text-fuchsia-400">{stats.favorite} fav</span>
          <span className="text-emerald-400">{stats.approved} kept</span>
          <span className="text-amber-400">{stats.needsEdit} edit</span>
          <span className="text-red-400">{stats.rejected} cut</span>
          <span className="text-zinc-500">{stats.pending} pending</span>
          <button
            onClick={() => {
              const cardIds = ['first_mes', ...ROOKIE_CHARACTER_CARD.alternate_greetings.map((_, i) => `greeting_${i}`), ...mesExamples.map(e => e.id)];
              const next = { ...reviews };
              for (const id of cardIds) delete next[id];
              setReviews(next);
              saveReviews(next);
            }}
            className="text-xs px-3 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
          >
            Reset Card Reviews
          </button>
          <button
            onClick={() => { setReviews({}); saveReviews({}); }}
            className="text-xs px-3 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={exportReviews}
            className="ml-auto text-xs px-3 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
          >
            Export JSON
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'favorite', 'approved', 'needs-edit', 'rejected'] as FilterStatus[]).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                filterStatus === f
                  ? 'bg-zinc-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {f === 'all' ? 'All' : STATUS_LABELS[f as ReviewStatus] || f}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('character-card')}
            className={`px-4 py-2 text-sm rounded-t-md transition-colors ${
              activeTab === 'character-card'
                ? 'bg-zinc-800 text-zinc-100 border-b-2 border-indigo-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Character Card ({mesExamples.length + 1 + ROOKIE_CHARACTER_CARD.alternate_greetings.length})
          </button>
          <button
            onClick={() => setActiveTab('authored-quips')}
            className={`px-4 py-2 text-sm rounded-t-md transition-colors ${
              activeTab === 'authored-quips'
                ? 'bg-zinc-800 text-zinc-100 border-b-2 border-indigo-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Authored Quips ({AUTHORED_LINES.length})
          </button>
        </div>

        {/* CHARACTER CARD TAB */}
        {activeTab === 'character-card' && (
          <div className="space-y-8">
            {/* First message */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-zinc-300">First Message</h2>
              {filterQuip('first_mes') && (
                <QuipCard
                  id="first_mes"
                  text={ROOKIE_CHARACTER_CARD.first_mes}
                  badges={['first_mes', 'game_start']}
                  review={getReview('first_mes')}
                  onUpdate={r => updateReview('first_mes', r)}
                />
              )}
            </div>

            {/* Alternate greetings */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-zinc-300">
                Alternate Greetings ({ROOKIE_CHARACTER_CARD.alternate_greetings.length})
              </h2>
              <div className="space-y-3">
                {ROOKIE_CHARACTER_CARD.alternate_greetings.map((g, i) => {
                  const id = `greeting_${i}`;
                  const energies = ['excited', 'chill', 'nerdy', 'competitive', 'warm', 'mysterious', 'first-game', 'returning'];
                  if (!filterQuip(id)) return null;
                  return (
                    <QuipCard
                      key={id}
                      id={id}
                      text={g}
                      badges={['greeting', `energy:${energies[i] || 'unknown'}`]}
                      review={getReview(id)}
                      onUpdate={r => updateReview(id, r)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Example dialogues */}
            <div>
              <h2 className="text-lg font-semibold mb-3 text-zinc-300">
                Example Dialogues ({mesExamples.length})
              </h2>
              <p className="text-xs text-zinc-500 mb-4">
                These are the most important lines for voice consistency. The LLM mimics the style of these examples more than any other field.
              </p>
              <div className="space-y-3">
                {mesExamples.map(ex => {
                  if (!filterQuip(ex.id)) return null;
                  return (
                    <div key={ex.id} className="space-y-1">
                      <p className="text-xs text-zinc-500 pl-4 italic">
                        Player: {ex.trigger}
                      </p>
                      <QuipCard
                        id={ex.id}
                        text={ex.response}
                        badges={['mes_example', 'voice_anchor']}
                        review={getReview(ex.id)}
                        onUpdate={r => updateReview(ex.id, r)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* AUTHORED QUIPS TAB */}
        {activeTab === 'authored-quips' && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-2">
              <button
                onClick={expandAll}
                className="text-xs px-3 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="text-xs px-3 py-1 rounded-md bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
              >
                Collapse All
              </button>
            </div>

            {Array.from(grouped.entries()).map(([category, lines]) => {
              const isExpanded = expandedCategories.has(category);
              const filtered = lines.filter(l => filterQuip(l.id));
              const categoryStats = {
                total: lines.length,
                favorite: lines.filter(l => getReview(l.id).status === 'favorite').length,
                approved: lines.filter(l => getReview(l.id).status === 'approved').length,
                pending: lines.filter(l => getReview(l.id).status === 'pending').length,
              };

              return (
                <div key={category} className="border border-zinc-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-zinc-500">{isExpanded ? '▼' : '▶'}</span>
                      <span className="font-medium">{category}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-zinc-500">{categoryStats.total} quips</span>
                      {categoryStats.favorite > 0 && (
                        <span className="text-fuchsia-500">{categoryStats.favorite} fav</span>
                      )}
                      {categoryStats.approved > 0 && (
                        <span className="text-emerald-500">{categoryStats.approved} kept</span>
                      )}
                      {categoryStats.pending > 0 && (
                        <span className="text-zinc-600">{categoryStats.pending} pending</span>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 space-y-3">
                      {filtered.length === 0 && (
                        <p className="text-xs text-zinc-600 text-center py-4">
                          No quips match current filter
                        </p>
                      )}
                      {filtered.map(line => (
                        <QuipCard
                          key={line.id}
                          id={line.id}
                          text={line.text}
                          badges={conditionBadges(line)}
                          priority={line.priority}
                          review={getReview(line.id)}
                          onUpdate={r => updateReview(line.id, r)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Spacer for mobile */}
        <div className="h-20" />
      </div>
    </div>
  );
}
