'use client';

const CANDIDATES_COLOR = '#58CC02';

/**
 * Slim one-line tournament header.
 * Just event name, round, and FIDE badge.
 */
export function CandidatesHeader({
  round,
}: {
  round?: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-chess-text">
        Candidates 2026
      </span>
      {round != null && (
        <>
          <span className="text-[10px] text-chess-text-faint">|</span>
          <span className="text-[10px] font-bold text-chess-text-muted">
            Round {round}
          </span>
        </>
      )}
      <span
        className="rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white"
        style={{ backgroundColor: CANDIDATES_COLOR }}
      >
        FIDE
      </span>
    </div>
  );
}

export { CANDIDATES_COLOR };
