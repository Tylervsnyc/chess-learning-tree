'use client';

/**
 * AbilityCard — the MTG-style trading-card render for a single ability.
 *
 * Two layouts:
 *   - 'mini'  : 5:7 thumbnail used in the AbilityRack below the board.
 *               Name + art + uses pips. Tooltip-on-press handled by caller.
 *   - 'full'  : tall card used in the offer modal. Name banner, large art,
 *               type line, text box, tier gem.
 *
 * Tier palette is hand-tuned to feel MTG-ish (parchment grey, forest green,
 * sapphire blue, amber gold, foil). T4/T5 get a glow halo; T5 is foil and
 * uses the `.foil-card` class from globals.css.
 */

import { useRef, useState } from 'react';
import type {
  AbilityBlurb,
  AbilityId,
  AbilityTier,
  OwnedAbility,
} from '@/lib/run/abilities';
import { ABILITY_DEFS, blurbDetailForTier } from '@/lib/run/abilities';

// ---------------------------------------------------------------------------
// Tier styling.
// ---------------------------------------------------------------------------

interface TierStyle {
  /** Outer card background (the "border" colour seen around the inner cardface). */
  border: string;
  /** Inner card face (text box + frame around the art window). */
  face: string;
  /** Art window background — tinted by tier. */
  art: string;
  /** Tier-gem colour. */
  gem: string;
  /** Glow halo behind the whole card (T4/T5 only). */
  halo: string | null;
  /** Text colour on the face. */
  text: string;
  /** Foil class — only T5. */
  foil: boolean;
}

/**
 * Final art file per ability id. Most abilities ship `{id}-1.webp`; abilities
 * with multiple AI-generated variants pin to the chosen one explicitly. The
 * dart-art picker at `/test/dart-art` is the tool used to compare options.
 */
function artFile(id: AbilityId): string {
  if (id === 'poison-dart') return 'poison-dart-2.png';
  if (id === 'rabies-dart') return 'rabies-dart-2.png';
  if (id === 'freeze-ray') return 'freeze-ray-2.png';
  if (id === 'become-king') return 'become-king-2.png';
  if (id === 'convert' || id === 'drones' || id === 'squad') {
    return `${id}-1.png`;
  }
  return `${id}-1.webp`;
}

const TIER: Record<AbilityTier, TierStyle> = {
  1: {
    border:
      'linear-gradient(135deg, #6b6f76, #3f4248 35%, #9aa0a8 70%, #3f4248)',
    face: '#e7e4dc',
    art: 'radial-gradient(ellipse at center, #f5f2ea 0%, #c9c4b7 100%)',
    gem: '#6b6f76',
    halo: null,
    text: '#3a3a3a',
    foil: false,
  },
  2: {
    border:
      'linear-gradient(135deg, #1f5132, #0e3a1f 30%, #3aa05a 65%, #0e3a1f)',
    face: '#e2efde',
    art: 'radial-gradient(ellipse at center, #c9ecd0 0%, #6cbf80 100%)',
    gem: '#1f5132',
    halo: null,
    text: '#0e2e1c',
    foil: false,
  },
  3: {
    border:
      'linear-gradient(135deg, #173a7a, #0a1f4d 30%, #3d76d9 65%, #0a1f4d)',
    face: '#dce6f5',
    art: 'radial-gradient(ellipse at center, #c4d8ff 0%, #4a78d8 100%)',
    gem: '#173a7a',
    halo: null,
    text: '#0a1f4d',
    foil: false,
  },
  4: {
    border:
      'linear-gradient(135deg, #b8852b, #6a4612 30%, #ffd87a 60%, #b8852b)',
    face: '#f6e7c5',
    art: 'radial-gradient(ellipse at center, #ffe9a8 0%, #d49a2a 100%)',
    gem: '#6a4612',
    halo: '0 0 18px rgba(255, 191, 36, 0.55)',
    text: '#3d2806',
    foil: false,
  },
  5: {
    border:
      'linear-gradient(135deg, #ffd8a8, #ffb3ec 25%, #b3e5ff 55%, #ffe9a8 80%, #ffd8a8)',
    face: '#fff7e3',
    art: 'linear-gradient(135deg, #ffd8a8, #ffb3ec, #b3e5ff, #ffe9a8, #ffd8a8)',
    gem: '#a96b00',
    halo: '0 0 22px rgba(255, 180, 220, 0.7)',
    text: '#2a1d05',
    foil: true,
  },
};

// ---------------------------------------------------------------------------
// Icons. Use chess unicode for piece-form abilities (♗ ♞ ♛ ♙) and inline
// SVG for the rest — no emojis, no extra deps.
// ---------------------------------------------------------------------------

function AbilityIcon({ id, size }: { id: AbilityId; size: number }) {
  // Piece-form abilities use chess glyphs.
  const glyph =
    id === 'bishop-step'
      ? '♝' // ♝
      : id === 'knight-hop'
        ? '♞' // ♞
        : id === 'queen-pulse'
          ? '♛' // ♛
          : id === 'become-king'
            ? '♚' // ♚
            : null;
  if (glyph) {
    return (
      <span
        aria-hidden="true"
        style={{
          fontSize: size,
          lineHeight: 1,
          fontWeight: 900,
          textShadow: '0 2px 4px rgba(0,0,0,0.25)',
        }}
      >
        {glyph}
      </span>
    );
  }
  const stroke = Math.max(1.5, size / 14);
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (id) {
    case 'freeze-ray':
      // snowflake
      return (
        <svg {...props}>
          <path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M19.07 4.93L4.93 19.07" />
          <path d="M9 5l3-3 3 3M9 19l3 3 3-3M5 9l-3 3 3 3M19 9l3 3-3 3" />
        </svg>
      );
    case 'poison-dart':
      // arrow with droplet head
      return (
        <svg {...props}>
          <path d="M3 21L17 7" />
          <path d="M17 7l-4 0 0 4" />
          <path d="M19 4c1.5 1.5 1.5 4 0 5.5s-4 1.5-5.5 0 0-4 1.5-5.5L17 1.5z" />
        </svg>
      );
    case 'rabies-dart':
      // arrow with fang head
      return (
        <svg {...props}>
          <path d="M3 21L18 6" />
          <path d="M18 6l-4 0 0 4" />
          <path d="M14 4l3 3 3-3 1 3-3 1-3-1z" />
        </svg>
      );
    case 'convert':
      // swirl arrows — flipping allegiance
      return (
        <svg {...props}>
          <path d="M4 12a8 8 0 0 1 14-5" />
          <path d="M18 7v5h-5" />
          <path d="M20 12a8 8 0 0 1-14 5" />
          <path d="M6 17v-5h5" />
        </svg>
      );
    case 'drones':
      // little dots radiating outward
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="12" cy="20" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="20" cy="12" r="1.5" />
        </svg>
      );
    case 'squad':
      // three pawn-shaped marks
      return (
        <svg {...props}>
          <circle cx="6" cy="10" r="2" />
          <path d="M4 18h4l-1-6h-2z" />
          <circle cx="12" cy="8" r="2" />
          <path d="M10 18h4l-1-8h-2z" />
          <circle cx="18" cy="10" r="2" />
          <path d="M16 18h4l-1-6h-2z" />
        </svg>
      );
    case 'surge':
      // lightning bolt / zap — energetic, "extra move" feel
      return (
        <svg {...props}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case 'aegis':
      // shield
      return (
        <svg {...props}>
          <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
        </svg>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Pip row — tier badges and uses indicators share a tiny dot pattern.
// ---------------------------------------------------------------------------

function UsesPips({
  uses,
  max,
  color,
}: {
  uses: number;
  max: number;
  color: string;
}) {
  if (uses < 0) {
    return (
      <span
        style={{
          color,
          fontWeight: 900,
          fontSize: 11,
          lineHeight: 1,
          letterSpacing: '0.04em',
        }}
      >
        ∞
      </span>
    );
  }
  const dots = Math.max(uses, max);
  return (
    <div className="flex gap-[2px]" aria-label={`${uses} of ${max} uses left`}>
      {Array.from({ length: dots }, (_, i) => (
        <span
          key={i}
          className="w-[5px] h-[5px] rounded-full"
          style={{
            background: i < uses ? color : 'transparent',
            border: `1px solid ${color}`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MINI — used in AbilityRack below the board.
// ---------------------------------------------------------------------------

interface MiniProps {
  ability: OwnedAbility;
  active: boolean;
  flashing: boolean;
  onClick: () => void;
}

export function AbilityCardMini({
  ability,
  active,
  flashing,
  onClick,
}: MiniProps) {
  const def = ABILITY_DEFS[ability.id];
  const t = TIER[ability.tier];
  const disabled = ability.usesLeftThisLevel === 0 && ability.tier !== 5;
  const max = Math.max(1, maxUsesDisplay(ability));
  const blurb = blurbDetailForTier(ability.id, ability.tier);

  // Peek = card-flip explainer. Hover on desktop, long-press (~400ms) on
  // touch. Long-press also suppresses the next click so reading doesn't
  // burn a use.
  const [peeking, setPeeking] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressedRef = useRef(false);

  const clearPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };
  const startPress = () => {
    longPressedRef.current = false;
    clearPress();
    pressTimer.current = setTimeout(() => {
      longPressedRef.current = true;
      setPeeking(true);
    }, 400);
  };
  const endPress = () => {
    clearPress();
    if (longPressedRef.current) setPeeking(false);
  };
  const handleClick = () => {
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onPointerCancel={endPress}
      onMouseEnter={() => setPeeking(true)}
      onMouseLeave={() => setPeeking(false)}
      disabled={disabled}
      aria-label={`${def.name} — ${blurb.what} ${blurb.how}`}
      className={`relative snap-start shrink-0 group ${
        active ? 'ability-card-active' : ''
      } ${flashing ? 'ability-card-flash' : ''} ${
        disabled ? 'opacity-45' : 'active:scale-95'
      } transition-transform`}
      style={{
        width: 64,
        aspectRatio: '5 / 7',
        borderRadius: 7,
        background: 'transparent',
        perspective: '600px',
        boxShadow: 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation',
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: peeking ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 360ms cubic-bezier(0.4, 0.2, 0.2, 1)',
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: t.border,
            borderRadius: 7,
            padding: 2,
            boxShadow: t.halo ? `${t.halo}, 0 1px 3px rgba(0,0,0,0.25)` : '0 1px 3px rgba(0,0,0,0.25)',
          }}
        >
          <div
            className={`relative w-full h-full rounded-[5px] flex flex-col overflow-hidden ${
              t.foil ? 'foil-card' : ''
            }`}
            style={{
              background: t.foil ? undefined : t.face,
              color: t.text,
            }}
          >
            {/* Name banner */}
            <div
              className="text-[7.5px] font-black uppercase leading-tight tracking-[0.04em] px-1 pt-[3px] pb-[2px] truncate text-center"
              style={{ letterSpacing: '0.04em' }}
            >
              {def.name}
            </div>

            {/* Art window */}
            <div
              className="mx-[3px] rounded-[3px] overflow-hidden"
              style={{
                background: t.art,
                height: '64%',
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.25)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/abilities/${artFile(ability.id)}`}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* Footer: uses pips + tier gem */}
            <div className="flex-1 flex items-end justify-between px-[3px] pb-[3px] pt-[2px]">
              <UsesPips
                uses={ability.usesLeftThisLevel}
                max={max}
                color={t.gem}
              />
              <span
                className="text-[7px] font-black"
                style={{
                  color: t.gem,
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  border: `1px solid ${t.gem}`,
                  lineHeight: '7px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {ability.tier}
              </span>
            </div>
          </div>
        </div>

        {/* BACK FACE — explainer */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: t.border,
            borderRadius: 7,
            padding: 2,
            boxShadow: t.halo ? `${t.halo}, 0 1px 3px rgba(0,0,0,0.25)` : '0 1px 3px rgba(0,0,0,0.25)',
          }}
        >
          <div
            className="relative w-full h-full rounded-[5px] flex flex-col overflow-hidden"
            style={{
              background: t.foil ? '#fff7e3' : t.face,
              color: t.text,
            }}
          >
            <div
              className="text-[7.5px] font-black uppercase leading-tight tracking-[0.04em] px-1 pt-[3px] pb-[2px] truncate text-center"
              style={{ letterSpacing: '0.04em', borderBottom: `1px solid ${t.gem}33` }}
            >
              {def.name}
            </div>
            <div
              className="flex-1 px-[4px] py-[3px] flex flex-col gap-[2px] text-[6.5px] leading-[1.2] text-center"
              style={{ color: t.text, hyphens: 'auto' }}
            >
              <div className="font-black">{blurb.what}</div>
              <div className="font-medium" style={{ opacity: 0.65 }}>
                {blurb.how}
              </div>
              {blurb.limit ? (
                <div
                  className="font-bold mt-auto"
                  style={{ opacity: 0.7, fontSize: '5.5px' }}
                >
                  {blurb.limit}
                </div>
              ) : null}
            </div>
            <div className="flex items-end justify-end px-[3px] pb-[3px]">
              <span
                className="text-[7px] font-black"
                style={{
                  color: t.gem,
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  border: `1px solid ${t.gem}`,
                  lineHeight: '7px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {ability.tier}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// FULL — used in the offer modal.
// ---------------------------------------------------------------------------

interface FullProps {
  id: AbilityId;
  tier: AbilityTier;
  description: AbilityBlurb;
  /** "Upgrade → T3" badge. Omit to hide. */
  badge?: string;
  onClick: () => void;
}

export function AbilityCardFull({
  id,
  tier,
  description,
  badge,
  onClick,
}: FullProps) {
  const def = ABILITY_DEFS[id];
  const t = TIER[tier];

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full max-w-[200px] mx-auto group active:scale-[0.98] transition-transform"
      style={{
        aspectRatio: '4 / 7',
        background: t.border,
        borderRadius: 14,
        padding: 5,
        boxShadow: t.halo
          ? `${t.halo}, 0 6px 18px rgba(0,0,0,0.35)`
          : '0 6px 18px rgba(0,0,0,0.35)',
      }}
    >
      <div
        className={`relative w-full h-full rounded-[10px] flex flex-col overflow-hidden ${
          t.foil ? 'foil-card' : ''
        }`}
        style={{
          background: t.foil ? undefined : t.face,
          color: t.text,
        }}
      >
        {/* Badge (upgrade only — new cards have no badge) */}
        {badge ? (
          <div
            className="absolute top-1.5 right-1.5 z-10 text-[9px] font-black uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
            style={{
              background: t.gem,
              color: t.face,
            }}
          >
            {badge}
          </div>
        ) : null}

        {/* Top banner — fixed height so name length never shifts the art. */}
        <div
          className="px-3 text-center flex items-center justify-center shrink-0"
          style={{
            height: '12%',
            fontFamily:
              'ui-serif, Georgia, "Times New Roman", serif',
            fontWeight: 900,
            fontSize: 'clamp(13px, 3.6cqw, 17px)',
            lineHeight: 1.05,
            letterSpacing: '0.01em',
            color: t.text,
            textShadow: t.foil ? '0 1px 2px rgba(255,255,255,0.7)' : 'none',
            containerType: 'inline-size',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {def.name}
        </div>

        {/* Art window — fixed height so all cards line up. */}
        <div
          className="mx-2.5 rounded-md overflow-hidden relative shrink-0"
          style={{
            background: t.art,
            height: '54%',
            boxShadow:
              'inset 0 0 14px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.18)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/abilities/${artFile(id)}`}
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Text box — fills remaining space; text shrinks to fit. */}
        <div
          className="mx-2.5 mt-2 mb-7 flex-1 min-h-0 rounded-md px-2.5 py-1.5 flex flex-col gap-1 overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.6)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
            containerType: 'inline-size',
          }}
        >
          <p
            className="leading-snug font-black"
            style={{
              color: '#241b08',
              fontSize: 'clamp(9.5px, 2.6cqw, 11.5px)',
            }}
          >
            {description.what}
          </p>
          <p
            className="leading-snug font-medium"
            style={{
              color: '#4a3a18',
              fontSize: 'clamp(8.5px, 2.3cqw, 10px)',
            }}
          >
            {description.how}
          </p>
          {description.limit ? (
            <p
              className="leading-none font-bold uppercase tracking-wider mt-auto pt-0.5"
              style={{
                color: '#6b5223',
                opacity: 0.8,
                fontSize: 'clamp(7.5px, 2cqw, 9px)',
              }}
            >
              {description.limit}
            </p>
          ) : null}
        </div>

        {/* Footer — tier gem bottom-right */}
        <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
          <span
            className="text-[10px] font-black"
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: t.gem,
              color: t.face,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 1.5px rgba(0,0,0,0.18)',
            }}
          >
            {tier}
          </span>
        </div>
      </div>
    </button>
  );
}

function maxUsesDisplay(a: OwnedAbility): number {
  // Heuristic — the max-uses-at-tier may not equal current, but for the pip
  // display we just show "remaining of N" where N is whatever fits the row.
  // Default the row to at least 3 pips so the layout doesn't jump.
  const cur = a.usesLeftThisLevel;
  if (cur < 0) return 0;
  return Math.max(3, cur);
}
