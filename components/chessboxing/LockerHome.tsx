'use client';

import { useEffect, useState } from 'react';
import { getStreak, peekStreak, getStoredUserId } from '@/lib/streak-client';

/**
 * LockerHome — the Chess Boxing home screen. Layered art (GPT-cut from
 * home-locker-v2-3.png) with live behavior:
 *  - chalk tally marks on the door = the user's REAL streak (drawn in code)
 *  - gloves sway idle, swing when tapped  -> FIGHT (bout)
 *  - chess pieces bob                      -> TRAIN (workout)
 *
 * Streak reads go through lib/streak-client (rule: never fetch the endpoint
 * directly). `previewStreak` overrides for test pages.
 */

const ASSET = {
  base: '/test-assets/locker-base-patched.png',
  gloves: '/test-assets/locker-gloves.png',
};

const KEYFRAMES = `
  @keyframes lhGloveIdle {
    0%, 100% { transform: rotate(-1.3deg); }
    50% { transform: rotate(1.3deg); }
  }
  @keyframes lhGloveSwing {
    0% { transform: rotate(0deg); }
    18% { transform: rotate(11deg); }
    42% { transform: rotate(-8deg); }
    64% { transform: rotate(5deg); }
    82% { transform: rotate(-2deg); }
    100% { transform: rotate(0deg); }
  }
  @keyframes lhPiecesBob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-0.6%); }
  }
  @keyframes lhChalkDraw {
    0% { stroke-dashoffset: 30; opacity: 0; }
    20% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }
`;

// Deterministic chalk jitter per mark index
const j = (i: number, k: number) => (((i * 37 + k * 13) % 7) - 3) * 0.45;

/**
 * Chalk tallies on the door. Groups of 5 (4 verticals + a diagonal slash),
 * stacked down the door strip. The newest mark draws itself on.
 */
function ChalkTallies({ count }: { count: number }) {
  const groups = Math.floor(count / 5);
  const rem = count % 5;
  const marks: { g: number; i: number; isLast: boolean }[] = [];
  for (let g = 0; g < groups; g++) for (let i = 0; i < 5; i++) marks.push({ g, i, isLast: false });
  for (let i = 0; i < rem; i++) marks.push({ g: groups, i, isLast: false });
  if (marks.length > 0) marks[marks.length - 1].isLast = true;

  const GROUP_H = 34;
  const maxGroups = 7; // door runs out of chalk room; show count below after that
  const shown = marks.filter((m) => m.g < maxGroups);
  const overflow = count > maxGroups * 5;

  return (
    <svg viewBox="0 0 60 300" width="100%" height="100%" style={{ display: 'block' }}>
      {shown.map(({ g, i, isLast }, idx) => {
        const y0 = 16 + g * GROUP_H;
        const stroke = {
          stroke: '#dfe7f5',
          strokeWidth: 2.4,
          strokeLinecap: 'round' as const,
          opacity: 0.92,
        };
        if (i < 4) {
          const x = 14 + i * 8 + j(idx, 1);
          return (
            <line key={idx} x1={x} y1={y0 + j(idx, 2)} x2={x + j(idx, 3) * 0.6} y2={y0 + 22 + j(idx, 4)}
              {...stroke}
              strokeDasharray={isLast ? 30 : undefined}
              style={isLast ? { animation: 'lhChalkDraw 0.7s ease-out 0.9s both' } : undefined}
            />
          );
        }
        return (
          <line key={idx} x1={10 + j(idx, 1)} y1={y0 + 20 + j(idx, 2)} x2={46 + j(idx, 3)} y2={y0 + 2 + j(idx, 4)}
            {...stroke}
            strokeDasharray={isLast ? 42 : undefined}
            style={isLast ? { animation: 'lhChalkDraw 0.7s ease-out 0.9s both' } : undefined}
          />
        );
      })}
      {overflow && (
        <text x={30} y={16 + maxGroups * GROUP_H + 18} textAnchor="middle" fontSize={17} fontWeight={700}
          fill="#dfe7f5" opacity={0.92} style={{ fontFamily: 'inherit' }}>
          {count}
        </text>
      )}
    </svg>
  );
}

export function LockerHome({
  previewStreak,
  onFight,
  onTrain,
}: {
  previewStreak?: number;
  onFight?: () => void;
  onTrain?: () => void;
}) {
  const [streak, setStreak] = useState<number>(previewStreak ?? 0);
  const [punchId, setPunchId] = useState(0);
  const [hover, setHover] = useState<'fight' | 'train' | null>(null);

  useEffect(() => {
    if (previewStreak !== undefined) {
      setStreak(previewStreak);
      return;
    }
    const uid = getStoredUserId();
    const snap = uid ? peekStreak(uid) : null;
    if (snap) setStreak(snap.current);
    getStreak().then((d) => { if (d) setStreak(d.current); });
  }, [previewStreak]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1024 / 1536', userSelect: 'none' }}>
      <style>{KEYFRAMES}</style>

      {/* base scene (locker, shelf, board, wraps, bottle — no gloves, no chalk) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ASSET.base} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* gloves layer — idle sway, tap to swing; pivot near the hook */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ASSET.gloves} alt="" draggable={false}
        key={punchId}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          transformOrigin: '53% 16%',
          animation: punchId > 0
            ? 'lhGloveSwing 1.1s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'lhGloveIdle 3.6s ease-in-out 1s infinite',
          filter: hover === 'fight' ? 'brightness(1.12)' : 'none',
          transition: 'filter 0.2s',
        }} />

      {/* chalk streak on the door (left strip) */}
      <div style={{ position: 'absolute', left: '1.5%', top: '8%', width: '13%', height: '58%', pointerEvents: 'none' }}>
        <ChalkTallies count={streak} />
      </div>

      {/* FIGHT tap zone (gloves) */}
      <button
        onClick={() => { setPunchId((p) => p + 1); onFight?.(); }}
        onMouseEnter={() => setHover('fight')} onMouseLeave={() => setHover(null)}
        aria-label="Fight — start a bout"
        style={{ position: 'absolute', left: '22%', top: '18%', width: '58%', height: '38%', background: 'none', border: 'none', cursor: 'pointer' }}
      />
      {/* TRAIN tap zone (board) */}
      <button
        onClick={() => onTrain?.()}
        onMouseEnter={() => setHover('train')} onMouseLeave={() => setHover(null)}
        aria-label="Train — puzzle workout"
        style={{ position: 'absolute', left: '20%', top: '60%', width: '68%', height: '26%', background: 'none', border: 'none', cursor: 'pointer',
          filter: hover === 'train' ? 'brightness(1.1)' : 'none' }}
      />

      {/* labels */}
      <div style={{ position: 'absolute', left: '50%', top: '54.5%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 999,
        background: hover === 'fight' ? '#e5484d' : 'rgba(9, 14, 28, 0.65)', color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1.5,
        transition: 'background 0.2s', pointerEvents: 'none' }}>
        FIGHT
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '87.5%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 999,
        background: hover === 'train' ? '#e5484d' : 'rgba(9, 14, 28, 0.65)', color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1.5,
        transition: 'background 0.2s', pointerEvents: 'none' }}>
        TRAIN
      </div>
    </div>
  );
}
