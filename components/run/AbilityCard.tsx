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

import type {
  AbilityId,
  AbilityTier,
  OwnedAbility,
} from '@/lib/run/abilities';
import { ABILITY_DEFS, blurbForTier } from '@/lib/run/abilities';

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
          : id === 'pawn-charge'
            ? '♟' // ♟
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
    case 'detonate':
      // bomb
      return (
        <svg {...props}>
          <circle cx="11" cy="14" r="7" />
          <path d="M16 9l3-3M19 6l1-3 3-1-1 3-3 1" />
          <path d="M9 11a4 4 0 0 1 3-2" />
        </svg>
      );
    case 'phase-step':
      // ghost
      return (
        <svg {...props}>
          <path d="M5 11a7 7 0 0 1 14 0v10l-2-2-2 2-2-2-2 2-2-2-2 2-2-2V11z" />
          <circle cx="9.5" cy="11" r="0.6" fill="currentColor" />
          <circle cx="14.5" cy="11" r="0.6" fill="currentColor" />
        </svg>
      );
    case 'leap':
      // upward chevron / forward leap arrow
      return (
        <svg {...props}>
          <path d="M12 20V6" />
          <path d="M5 13l7-7 7 7" />
          <path d="M5 19l7-7 7 7" opacity="0.55" />
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

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={`${def.name} — ${blurbForTier(ability.id, ability.tier)}`}
      className={`relative snap-start shrink-0 group ${
        active ? 'ability-card-active' : ''
      } ${flashing ? 'ability-card-flash' : ''} ${
        disabled ? 'opacity-45' : 'active:scale-95'
      } transition-transform`}
      style={{
        width: 64,
        aspectRatio: '5 / 7',
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
          className="mx-[3px] rounded-[3px] flex items-center justify-center"
          style={{
            background: t.art,
            height: '52%',
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.25)',
            color: t.text,
          }}
        >
          <AbilityIcon id={ability.id} size={22} />
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
    </button>
  );
}

// ---------------------------------------------------------------------------
// FULL — used in the offer modal.
// ---------------------------------------------------------------------------

interface FullProps {
  id: AbilityId;
  tier: AbilityTier;
  description: string;
  /** "New" or "Upgrade → T3" badge. */
  badge: string;
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
        aspectRatio: '5 / 7',
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
        {/* Badge (new / upgrade) */}
        <div
          className="absolute top-1.5 right-1.5 z-10 text-[9px] font-black uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
          style={{
            background: t.gem,
            color: t.face,
          }}
        >
          {badge}
        </div>

        {/* Top banner — ability name in display font */}
        <div
          className="px-3 pt-2.5 pb-1.5 text-center"
          style={{
            fontFamily:
              'ui-serif, Georgia, "Times New Roman", serif',
            fontWeight: 900,
            fontSize: 17,
            lineHeight: 1.05,
            letterSpacing: '0.01em',
            color: t.text,
            textShadow: t.foil ? '0 1px 2px rgba(255,255,255,0.7)' : 'none',
          }}
        >
          {def.name}
        </div>

        {/* Art window */}
        <div
          className="mx-2.5 rounded-md flex items-center justify-center relative"
          style={{
            background: t.art,
            height: '46%',
            boxShadow:
              'inset 0 0 14px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(0,0,0,0.18)',
            color: t.text,
          }}
        >
          <AbilityIcon id={id} size={64} />
        </div>

        {/* Type line */}
        <div
          className="px-3 pt-1.5 pb-0 text-center text-[10px]"
          style={{
            fontFamily: 'ui-serif, Georgia, serif',
            fontStyle: 'italic',
            color: t.text,
            opacity: 0.8,
          }}
        >
          {def.typeLine}
        </div>

        {/* Text box */}
        <div className="mx-2.5 mt-1.5 mb-2 flex-1 rounded-md px-2 py-1.5 flex items-center"
          style={{
            background: 'rgba(255,255,255,0.55)',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)',
          }}
        >
          <p
            className="text-[11px] leading-snug font-medium"
            style={{ color: '#241b08' }}
          >
            {description}
          </p>
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
