'use client';

import { useEffect, useMemo, useState } from 'react';
import { ACHIEVEMENT_CATALOG } from '@/lib/achievements/catalog';
import {
  beltBandForLevel,
  beltBandForRung,
  BELT_BAND_LABELS,
  CATEGORY_LABELS,
  type AchievementCategory,
  type AchievementDef,
  type AchievementRow,
  type BeltBand,
} from '@/lib/achievements/types';
import { AchievementTile, BAND_COLORS } from './BeltBadge';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';

/**
 * The Trophy Case — every achievement in the catalog, earned ones lit with
 * their belt band, locked ones dimmed, secrets as "???". Tap a medal for the
 * detail sheet (Rookie's line, tier progress, date). Fetches /api/achievements
 * once; the catalog (copy) lives in code.
 *
 * <TrophyCase /> — full grid section (web /profile).
 * <TrophyCaseRow /> — one shrink-0 line for the no-scroll /box/profile:
 *   top medals + count, tap opens the full case as a bottom sheet.
 */

interface Merged {
  def: AchievementDef;
  row: AchievementRow | null;
  band: BeltBand;
}

function useAchievements(): { merged: Merged[]; earned: number; loaded: boolean } {
  const [rows, setRows] = useState<AchievementRow[] | null>(null);

  useEffect(() => {
    if (!FEATURE_FLAGS.ACHIEVEMENTS) {
      setRows([]);
      return;
    }
    fetch('/api/achievements', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setRows(Array.isArray(d?.achievements) ? d.achievements : []))
      .catch(() => setRows([]));
  }, []);

  const merged = useMemo(() => {
    const byId = new Map((rows ?? []).map((r) => [r.achievement_id, r]));
    const all = ACHIEVEMENT_CATALOG.map((def) => {
      const row = byId.get(def.id) ?? null;
      const unlocked = !!row && row.tier > 0;
      return { def, row: unlocked ? row : null, band: bandFor(def, row) };
    });
    // Earned first (newest unlock first), then locked in catalog order;
    // secrets sink to the bottom of the locked block.
    const earned = all
      .filter((m) => m.row)
      .sort((a, b) => ((a.row!.upgraded_at ?? a.row!.unlocked_at) < (b.row!.upgraded_at ?? b.row!.unlocked_at) ? 1 : -1));
    const locked = all.filter((m) => !m.row).sort((a, b) => Number(!!a.def.secret) - Number(!!b.def.secret));
    return [...earned, ...locked];
  }, [rows]);

  return { merged, earned: merged.filter((m) => m.row).length, loaded: rows !== null };
}

function bandFor(def: AchievementDef, row: AchievementRow | null | undefined): BeltBand {
  const tier = row?.tier ?? 0;
  if (tier <= 0) return 'amateur';
  if (def.levelTiered) return beltBandForLevel(tier);
  if (def.thresholds) return beltBandForRung(tier, def.thresholds.length);
  return def.band ?? 'amateur'; // binary medals carry a rarity band
}

// ── Full grid ────────────────────────────────────────────────────────────────

export function TrophyCase() {
  const { merged, earned, loaded } = useAchievements();
  const [selected, setSelected] = useState<Merged | null>(null);
  if (!FEATURE_FLAGS.ACHIEVEMENTS) return null;

  return (
    <div>
      <style>{`@keyframes achShimmer { 0% { background-position: 200% 0;} 100% { background-position: -50% 0;} }`}</style>
      <div className="flex items-baseline justify-between px-1 mb-2">
        <h2 className="text-xs font-black uppercase tracking-wide text-chess-text-muted">
          Trophy Case
        </h2>
        <span className="text-[11px] font-bold text-chess-text-muted tabular-nums">
          {loaded ? `${earned} / ${merged.length}` : ''}
        </span>
      </div>
      <div className="bg-chess-surface rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-4">
        {(Object.keys(CATEGORY_LABELS) as AchievementCategory[]).map((cat) => {
          const group = merged.filter((m) => m.def.category === cat);
          if (group.length === 0) return null;
          const got = group.filter((m) => m.row).length;
          return (
            <div key={cat}>
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-chess-text-muted">
                  {CATEGORY_LABELS[cat]}
                </h3>
                <span className="text-[10px] font-bold text-chess-text-faint tabular-nums">
                  {got}/{group.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                {group.map((m) => (
                  <button
                    key={m.def.id}
                    type="button"
                    onClick={() => setSelected(m)}
                    className="flex flex-col items-center gap-1 tap-highlight min-w-0"
                    aria-label={m.row || !m.def.secret ? m.def.name : 'Secret achievement'}
                  >
                    <AchievementTile
                      icon={m.def.icon}
                      band={m.band}
                      size={52}
                      locked={!m.row}
                      secret={!!m.def.secret}
                      shimmer={m.band === 'undisputed' && !!m.row}
                    />
                    <span
                      className={`text-[10px] font-bold leading-tight text-center line-clamp-2 ${
                        m.row ? 'text-chess-text' : 'text-chess-text-faint'
                      }`}
                    >
                      {m.row || !m.def.secret ? m.def.name : '???'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {selected && <DetailSheet merged={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ── Compact row for /box/profile (no-scroll page — one line, sheet for more) ─

export function TrophyCaseRow() {
  const { merged, earned, loaded } = useAchievements();
  const [open, setOpen] = useState(false);
  if (!FEATURE_FLAGS.ACHIEVEMENTS || !loaded || earned === 0) return null;

  const top = merged.filter((m) => m.row).slice(0, 4);
  const unseen = merged.some((m) => m.row && !m.row.seen);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-2xl bg-chess-surface border border-slate-200 shadow-sm px-4 py-2.5 flex items-center gap-3 text-left tap-highlight active:scale-[0.99] transition-transform w-full"
        aria-label="Trophy case"
      >
        <div className="flex -space-x-2 shrink-0">
          {top.map((m) => (
            <AchievementTile key={m.def.id} icon={m.def.icon} band={m.band} size={34} />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wide text-chess-text-muted">
              Trophy case
            </span>
            {unseen && <span className="w-1.5 h-1.5 rounded-full bg-chess-red" aria-label="New" />}
          </div>
          <div className="text-sm font-black text-chess-text tabular-nums">
            {earned} / {merged.length}
          </div>
        </div>
        <span className="text-[10px] font-bold text-chess-text-faint shrink-0">See all ›</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-chess-page px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <TrophyCase />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full rounded-2xl bg-chess-surface border border-slate-200 py-3 text-sm font-black text-chess-text tap-highlight"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Detail sheet ─────────────────────────────────────────────────────────────

function DetailSheet({ merged, onClose }: { merged: Merged; onClose: () => void }) {
  const { def, row, band } = merged;
  const c = BAND_COLORS[band];
  const isSecretLocked = !row && !!def.secret;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-3xl bg-chess-page px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-300" />
        <div className="flex flex-col items-center gap-3 text-center">
          <AchievementTile
            icon={def.icon}
            band={band}
            size={80}
            locked={!row}
            secret={!!def.secret}
            shimmer={band === 'undisputed' && !!row}
          />
          <div>
            <div className="text-xl font-black text-chess-text">
              {isSecretLocked ? '???' : def.name}
            </div>
            {row && (
              <div
                className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide"
                style={{ background: c.bg, color: c.text }}
              >
                {def.category === 'shame' ? 'Earned. Somehow.' : beltLine(def, row)}
              </div>
            )}
          </div>
          <div className="w-full rounded-xl bg-chess-surface border border-slate-200 px-3 py-2.5 text-sm font-semibold text-chess-text leading-snug">
            {isSecretLocked ? 'Secret. You’ll know it when it happens to you.' : def.description}
          </div>
          {progressLine(def, row) && (
            <div className="text-xs font-bold text-chess-text-muted">{progressLine(def, row)}</div>
          )}
          {row && (
            <div className="text-[11px] font-semibold text-chess-text-faint">
              Earned {new Date(row.upgraded_at ?? row.unlocked_at).toLocaleDateString()}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-1 w-full rounded-2xl bg-chess-surface border border-slate-200 py-3 text-sm font-black text-chess-text tap-highlight"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function beltLine(def: AchievementDef, row: AchievementRow): string {
  const band = BELT_BAND_LABELS[bandFor(def, row)];
  if (def.levelTiered) return `${band} · beat Level ${row.tier}`;
  if (def.thresholds && def.thresholds.length > 1) {
    const roman = ['I', 'II', 'III', 'IV', 'V'][Math.min(4, row.tier - 1)];
    return `${band} · Tier ${roman}`;
  }
  return band;
}

function progressLine(def: AchievementDef, row: AchievementRow | null): string | null {
  if (def.levelTiered) {
    const tier = row?.tier ?? 0;
    if (tier >= 10) return 'Level 10. There is no Level 11. I checked.';
    return tier > 0 ? `Next: beat Rookie at Level ${tier + 1}` : 'Win a bout to hang the first belt.';
  }
  if (!def.thresholds) return null;
  const progress = row?.progress ?? 0;
  const next = def.thresholds.find((t) => progress < t);
  if (next === undefined) return `Maxed out at ${progress.toLocaleString()}.`;
  return `${progress.toLocaleString()} / ${next.toLocaleString()} to ${row && row.tier > 0 ? 'the next tier' : 'unlock'}`;
}
