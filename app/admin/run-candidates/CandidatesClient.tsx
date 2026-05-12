'use client';

/**
 * Client triage UI for Rookie's Run candidates.
 *
 * Two tabs: Levels | Abilities. Each tab is a vertically scrollable list of
 * cards. Each card has a Promote (green) + Reject (red) button. Buttons POST
 * to /api/admin/{promote,reject}-candidate; on success the card is removed
 * from the list optimistically.
 *
 * Mobile-first: card list fills the viewport, scrolls, big tap targets.
 */

import { useState } from 'react';
import { ReplayBoard } from '@/components/playtest/ReplayBoard';
import type { SerializedBoard } from '@/scripts/run-playtest/types';
import type {
  CandidateLevelRecord,
  CandidateAbilityRecord,
} from './page';

interface Props {
  levels: CandidateLevelRecord[];
  abilities: CandidateAbilityRecord[];
}

type Tab = 'levels' | 'abilities';
type CardStatus = 'idle' | 'promoting' | 'rejecting' | 'done' | 'error';

interface CardState {
  status: CardStatus;
  message: string | null;
}

/**
 * Synthesize a minimal SerializedBoard from a candidate's puzzle so we can
 * reuse ReplayBoard. Most fields are defaults — the candidate file doesn't
 * carry a live game state.
 */
function puzzleToBoard(p: CandidateLevelRecord['data']['puzzle']): SerializedBoard {
  return {
    // Rookie starts on file 4 (d-file) by convention for thumbnails.
    rookie: { file: 4, rank: 1 },
    pieces: p.pieces.map((q) => ({ type: q.type, file: q.file, rank: q.rank })),
    hazards: p.hazards ?? [],
    frozenSquares: [],
    shieldUp: false,
    form: 'rook',
    formMovesLeft: 0,
    tempo: 0,
    moveCount: 0,
    moveLimit: p.moveLimit ?? null,
    bonusMovesLeft: 0,
    abilities: [],
    pendingOffer: null,
    turn: 'rookie',
    status: 'playing',
  };
}

async function callPromote(
  kind: 'level' | 'ability',
  filename: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/promote-candidate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind, filename }),
    });
    const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
    if (!res.ok) return { ok: false, message: data.error ?? `HTTP ${res.status}` };
    return { ok: data.ok !== false, message: data.message ?? 'Promoted' };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}

async function callReject(
  kind: 'level' | 'ability',
  filename: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/reject-candidate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind, filename }),
    });
    const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
    if (!res.ok) return { ok: false, message: data.error ?? `HTTP ${res.status}` };
    return { ok: data.ok !== false, message: data.message ?? 'Rejected' };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}

function LevelCard({
  record,
  state,
  onPromote,
  onReject,
}: {
  record: CandidateLevelRecord;
  state: CardState;
  onPromote: () => void;
  onReject: () => void;
}): React.ReactElement {
  const { data } = record;
  const t3 = (data.tierCurve.T3 * 100).toFixed(0);
  const t4 = (data.tierCurve.T4 * 100).toFixed(0);
  const t5 = (data.tierCurve.T5 * 100).toFixed(0);
  const board = puzzleToBoard(data.puzzle);
  const busy = state.status === 'promoting' || state.status === 'rejecting';

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-stone-900">
          {data.seedLevelId ?? 'unknown seed'} · L{data.puzzle.level}
        </h3>
        <span className="text-xs text-stone-500">{record.dateLabel}</span>
      </header>

      <div className="mb-3">
        <ReplayBoard board={board} />
      </div>

      <dl className="mb-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-stone-100 p-2">
          <dt className="text-xs text-stone-500">T3</dt>
          <dd className="font-semibold text-stone-900">{t3}%</dd>
        </div>
        <div className="rounded-lg bg-stone-100 p-2">
          <dt className="text-xs text-stone-500">T4</dt>
          <dd className="font-semibold text-stone-900">{t4}%</dd>
        </div>
        <div className="rounded-lg bg-stone-100 p-2">
          <dt className="text-xs text-stone-500">T5</dt>
          <dd className="font-semibold text-stone-900">{t5}%</dd>
        </div>
      </dl>

      {data.fitnessLabel && (
        <p className="mb-2 text-xs text-stone-600">
          <span className="font-medium">{data.fitnessLabel}</span>
          {typeof data.fitnessDistance === 'number' &&
            ` · ${data.fitnessDistance.toFixed(1)}pp from envelope`}
        </p>
      )}

      <p className="mb-3 text-xs text-stone-500">
        {data.mutations.length} mutation{data.mutations.length === 1 ? '' : 's'} ·{' '}
        {data.puzzle.pieces.length} pieces
        {data.puzzle.hazards && data.puzzle.hazards.length > 0
          ? ` · ${data.puzzle.hazards.length} hazards`
          : ''}
        {typeof data.puzzle.moveLimit === 'number'
          ? ` · ${data.puzzle.moveLimit}-move limit`
          : ''}
      </p>

      {state.status === 'done' ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {state.message ?? 'Done'}
        </p>
      ) : state.status === 'error' ? (
        <p className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-900">
          {state.message ?? 'Error'}
        </p>
      ) : null}

      {state.status !== 'done' && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPromote}
            disabled={busy}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {state.status === 'promoting' ? 'Promoting…' : 'Promote'}
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={busy}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-50"
          >
            {state.status === 'rejecting' ? 'Rejecting…' : 'Reject'}
          </button>
        </div>
      )}
    </article>
  );
}

function AbilityCard({
  record,
  state,
  onPromote,
  onReject,
}: {
  record: CandidateAbilityRecord;
  state: CardState;
  onPromote: () => void;
  onReject: () => void;
}): React.ReactElement {
  const { data } = record;
  const busy = state.status === 'promoting' || state.status === 'rejecting';
  const tiers: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <header className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-stone-900">{data.name}</h3>
        <span className="text-xs text-stone-500">{record.dateLabel}</span>
      </header>

      <p className="mb-1 text-xs uppercase tracking-wide text-stone-500">{data.typeLine}</p>
      <p className="mb-3 text-sm text-stone-800">{data.pitch ?? data.description}</p>

      {data.gapAddressed && (
        <p className="mb-3 text-xs text-stone-600">
          <span className="font-medium">Gap:</span> {data.gapAddressed}
        </p>
      )}

      <ol className="mb-3 space-y-1 text-xs text-stone-700">
        {tiers.map((t) => {
          const blurb =
            (data.blurbs as Record<string | number, string | undefined>)[t] ??
            (data.blurbs as Record<string | number, string | undefined>)[String(t)] ??
            '—';
          return (
            <li key={t} className="flex gap-2">
              <span className="w-6 shrink-0 font-mono text-stone-400">T{t}</span>
              <span>{blurb}</span>
            </li>
          );
        })}
      </ol>

      {!data.mechanics && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          No mechanics hint — promotion will require engine work.
        </p>
      )}

      {state.status === 'done' ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {state.message ?? 'Done'}
        </p>
      ) : state.status === 'error' ? (
        <p className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-900">
          {state.message ?? 'Error'}
        </p>
      ) : null}

      {state.status !== 'done' && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPromote}
            disabled={busy}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {state.status === 'promoting' ? 'Promoting…' : 'Promote'}
          </button>
          <button
            type="button"
            onClick={onReject}
            disabled={busy}
            className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-50"
          >
            {state.status === 'rejecting' ? 'Rejecting…' : 'Reject'}
          </button>
        </div>
      )}
    </article>
  );
}

export function CandidatesClient({
  levels,
  abilities,
}: Props): React.ReactElement {
  const [tab, setTab] = useState<Tab>('levels');
  // Per-card state keyed by filename — outcomes persist after action.
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});

  const setCard = (filename: string, status: CardStatus, message: string | null): void => {
    setCardStates((prev) => ({ ...prev, [filename]: { status, message } }));
  };

  const onLevelPromote = async (rec: CandidateLevelRecord): Promise<void> => {
    setCard(rec.filename, 'promoting', null);
    const r = await callPromote('level', rec.filename);
    setCard(rec.filename, r.ok ? 'done' : 'error', r.message);
  };
  const onLevelReject = async (rec: CandidateLevelRecord): Promise<void> => {
    setCard(rec.filename, 'rejecting', null);
    const r = await callReject('level', rec.filename);
    setCard(rec.filename, r.ok ? 'done' : 'error', r.message);
  };
  const onAbilityPromote = async (rec: CandidateAbilityRecord): Promise<void> => {
    setCard(rec.filename, 'promoting', null);
    const r = await callPromote('ability', rec.filename);
    setCard(rec.filename, r.ok ? 'done' : 'error', r.message);
  };
  const onAbilityReject = async (rec: CandidateAbilityRecord): Promise<void> => {
    setCard(rec.filename, 'rejecting', null);
    const r = await callReject('ability', rec.filename);
    setCard(rec.filename, r.ok ? 'done' : 'error', r.message);
  };

  const idle: CardState = { status: 'idle', message: null };

  return (
    <div className="h-full overflow-auto bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-2xl px-4 py-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold">Run candidates</h1>
          <p className="mt-1 text-sm text-stone-600">
            Swipe through proposals from the nightly mutator + weekly designer agents.
            Promote into the live game or reject. Promote runs the same CLI a human
            would; it can refuse with a safety error.
          </p>
        </header>

        <div role="tablist" className="mb-4 flex gap-2">
          <button
            role="tab"
            aria-selected={tab === 'levels'}
            onClick={() => setTab('levels')}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === 'levels'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 ring-1 ring-stone-200'
            }`}
          >
            Levels ({levels.length})
          </button>
          <button
            role="tab"
            aria-selected={tab === 'abilities'}
            onClick={() => setTab('abilities')}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === 'abilities'
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 ring-1 ring-stone-200'
            }`}
          >
            Abilities ({abilities.length})
          </button>
        </div>

        {tab === 'levels' ? (
          levels.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
              No candidate levels yet. The mutator-explorer routine writes new ones nightly.
            </p>
          ) : (
            <ul className="space-y-3">
              {levels.map((rec) => (
                <li key={rec.filename}>
                  <LevelCard
                    record={rec}
                    state={cardStates[rec.filename] ?? idle}
                    onPromote={() => void onLevelPromote(rec)}
                    onReject={() => void onLevelReject(rec)}
                  />
                </li>
              ))}
            </ul>
          )
        ) : abilities.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">
            No candidate abilities yet. The ability-designer routine writes new ones weekly.
          </p>
        ) : (
          <ul className="space-y-3">
            {abilities.map((rec) => (
              <li key={rec.filename}>
                <AbilityCard
                  record={rec}
                  state={cardStates[rec.filename] ?? idle}
                  onPromote={() => void onAbilityPromote(rec)}
                  onReject={() => void onAbilityReject(rec)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
