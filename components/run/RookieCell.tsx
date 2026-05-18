'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';
import { GOLDEN_KING_PALETTE, PieceBlocks } from './PieceBlocks';
import type { RookieForm } from '@/lib/run/types';

interface RookieCellProps {
  /** Current Rookie form — drives which sprite renders. */
  form?: RookieForm;
  /** Triggers the crumble animation — used during the death sequence. */
  dying?: boolean;
  /** True briefly after a transform — plays the glitch-flicker effect. */
  glitching?: boolean;
}

/**
 * Rookie sprite, dead-center inside react-chessboard's piece slot.
 *
 * Rook  → BreathingRook (canonical 5×6 sprite)
 * Knight → PieceBlocks 'N' (block-rasterized in Rookie palette)
 * Bishop → PieceBlocks 'B' (block-rasterized in Rookie palette)
 *
 * When `glitching` is true (briefly after a transform), we layer RGB-split
 * copies + scanlines + a jitter animation — leans into Rookie being a
 * computer rebooting into a new shape.
 *
 * See git history for the padding-bottom: 100% ratio-box trick that keeps
 * Rookie centered inside react-chessboard's indeterminate-height piece slot.
 */
function Sprite({ form, animate }: { form: RookieForm; animate: boolean }) {
  if (form === 'rook') {
    return <BreathingRook size="xs" animate={animate} mood="neutral" />;
  }
  if (form === 'king') {
    return (
      <PieceBlocks
        piece="K"
        blockSize={3}
        animate={animate}
        palette={GOLDEN_KING_PALETTE}
      />
    );
  }
  const piece =
    form === 'knight'
      ? 'N'
      : form === 'bishop'
        ? 'B'
        : form === 'pawn'
          ? 'P'
          : 'Q';
  return <PieceBlocks piece={piece} blockSize={3} animate={animate} />;
}

export function RookieCell({
  form = 'rook',
  dying = false,
  glitching = false,
}: RookieCellProps) {
  const showGlitch = glitching && !dying;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: showGlitch ? 'hidden' : undefined,
        }}
      >
        {showGlitch && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 4px)',
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '20%',
                background: 'rgba(28, 176, 246, 0.35)',
                animation: 'rookieGlitchScan 440ms linear',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
          </>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'scale(0.88)',
            animation: showGlitch
              ? 'rookieGlitchBase 440ms steps(8)'
              : undefined,
            ...(dying
              ? {
                  animation: 'rookieCrumble 1100ms ease-in forwards',
                  transformOrigin: 'center bottom',
                }
              : null),
          }}
        >
          <Sprite form={form} animate={!dying && !showGlitch} />

          {showGlitch && (
            <>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'rookieGlitchShakeR 440ms steps(6)',
                  filter: 'drop-shadow(2px 0 0 #ff4b4b)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              >
                <Sprite form={form} animate={false} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'rookieGlitchShakeB 440ms steps(6)',
                  filter: 'drop-shadow(-2px 0 0 #1cb0f6)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                }}
              >
                <Sprite form={form} animate={false} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
