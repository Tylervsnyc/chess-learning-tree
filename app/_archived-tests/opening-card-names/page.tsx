'use client'

import { OPENINGS_REGISTRY, PIECE_SVGS } from '@/data/openings/registry'
import type { OpeningConfig } from '@/data/openings/registry'

function PieceIcon({ icon, size = 40, color = '#ffffff' }: { icon: keyof typeof PIECE_SVGS; size?: number; color?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = PIECE_SVGS[icon] as any
  if (!svg) return null
  return (
    <svg viewBox={svg.viewBox} width={size} height={size} fill={color} xmlns="http://www.w3.org/2000/svg">
      {svg.paths?.map((path: string, i: number) => <path key={`p-${i}`} d={path} />)}
      {svg.circles?.map((c: { cx: number; cy: number; r: number }, i: number) => <circle key={`c-${i}`} {...c} />)}
      {svg.extraPaths?.map((path: string, i: number) => <path key={`e-${i}`} d={path} />)}
      {svg.polygons?.map((p: { points: string }, i: number) => <polygon key={`pg-${i}`} points={p.points} />)}
    </svg>
  )
}

const MY_OPENINGS = [
  { opening: OPENINGS_REGISTRY.find(o => o.slug === 'ruy-lopez')!, progress: 5, total: 9 },
  { opening: OPENINGS_REGISTRY.find(o => o.slug === 'sicilian')!, progress: 2, total: 9 },
  { opening: OPENINGS_REGISTRY.find(o => o.slug === 'italian')!, progress: 7, total: 9 },
  { opening: OPENINGS_REGISTRY.find(o => o.slug === 'london')!, progress: 1, total: 9 },
  { opening: OPENINGS_REGISTRY.find(o => o.slug === 'pirc-defense')!, progress: 4, total: 9 },
]

// Shared puck + chevron to keep variants focused on just the window
function Puck({ icon }: { icon: OpeningConfig['icon'] }) {
  return (
    <div className="flex-shrink-0" style={{ width: 56, height: 56, position: 'relative' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 56, height: 52, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ filter: 'drop-shadow(1px 2px 0 rgba(0,0,0,0.15))' }}>
          <PieceIcon icon={icon} size={28} color="#ffffff" />
        </div>
      </div>
    </div>
  )
}

function Chevron() {
  return (
    <div className="flex-shrink-0 text-white">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

function ProgressBar({ progress, total }: { progress: number; total: number }) {
  const pct = (progress / total) * 100
  return (
    <div className="w-full mt-2.5">
      <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: '#fff' }} />
      </div>
      <p className="text-xs text-white/70 mt-1 font-medium">{progress}/{total}</p>
    </div>
  )
}

// ─── A: Rounded inset with piece icon + moves (the original #4) ───
function CardA({ opening, progress, total }: { opening: OpeningConfig; progress: number; total: number }) {
  const gradient = `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 50%, ${opening.colorLight} 100%)`
  return (
    <div className="w-full rounded-[18px] p-5 flex items-center gap-4 shadow-md" style={{ background: gradient }}>
      <Puck icon={opening.icon} />
      <div className="flex-1">
        <div
          className="rounded-xl p-2.5 px-3.5 flex items-center gap-2.5 mb-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <PieceIcon icon={opening.icon} size={14} color="#ffffff" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{opening.name}</p>
            <p className="text-[10px] text-white/50 font-medium">{opening.moves}</p>
          </div>
        </div>
        <p className="text-white/70 text-sm">{opening.subtitle}</p>
        <ProgressBar progress={progress} total={total} />
      </div>
      <Chevron />
    </div>
  )
}

// ─── B: Tight inset strip — minimal, no icon, just name + colored left accent ───
function CardB({ opening, progress, total }: { opening: OpeningConfig; progress: number; total: number }) {
  const gradient = `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 50%, ${opening.colorLight} 100%)`
  return (
    <div className="w-full rounded-[18px] p-5 flex items-center gap-4 shadow-md" style={{ background: gradient }}>
      <Puck icon={opening.icon} />
      <div className="flex-1">
        {/* Tight strip with left color bar */}
        <div
          className="rounded-lg flex items-center overflow-hidden mb-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.22)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.25)' }}
        >
          <div className="w-1 self-stretch" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
          <div className="px-3 py-2">
            <p className="text-[11px] font-bold text-white tracking-wide">{opening.name}</p>
          </div>
        </div>
        <p className="text-white/70 text-sm">{opening.subtitle}</p>
        <ProgressBar progress={progress} total={total} />
      </div>
      <Chevron />
    </div>
  )
}

// ─── C: Double-border inset — inner glow border effect ───
function CardC({ opening, progress, total }: { opening: OpeningConfig; progress: number; total: number }) {
  const gradient = `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 50%, ${opening.colorLight} 100%)`
  return (
    <div className="w-full rounded-[18px] p-5 flex items-center gap-4 shadow-md" style={{ background: gradient }}>
      <Puck icon={opening.icon} />
      <div className="flex-1">
        {/* Double border window */}
        <div
          className="rounded-xl p-[3px] mb-2"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <div
            className="rounded-[10px] px-3.5 py-2 flex items-center gap-2"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)' }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opening.colorLight, boxShadow: `0 0 6px ${opening.colorLight}80` }} />
            <span className="text-[11px] font-bold text-white tracking-wide">{opening.name}</span>
            <span className="text-[10px] text-white/40 ml-auto font-medium">{opening.side === 'white' ? 'White' : 'Black'}</span>
          </div>
        </div>
        <p className="text-white/70 text-sm">{opening.subtitle}</p>
        <ProgressBar progress={progress} total={total} />
      </div>
      <Chevron />
    </div>
  )
}

// ─── D: Full-width bottom inset tray — spans the card width ───
function CardD({ opening, progress, total }: { opening: OpeningConfig; progress: number; total: number }) {
  const gradient = `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 50%, ${opening.colorLight} 100%)`
  return (
    <div className="w-full rounded-[18px] shadow-md overflow-hidden" style={{ background: gradient }}>
      <div className="p-5 pb-3 flex items-center gap-4">
        <Puck icon={opening.icon} />
        <div className="flex-1">
          <p className="text-white/70 text-sm">{opening.subtitle}</p>
          <ProgressBar progress={progress} total={total} />
        </div>
        <Chevron />
      </div>
      {/* Full-width bottom inset tray */}
      <div className="mx-3 mb-3">
        <div
          className="rounded-xl px-4 py-2.5 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.22)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <PieceIcon icon={opening.icon} size={16} color="#ffffff" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white">{opening.name}</p>
            <p className="text-[10px] text-white/40">{opening.moves}</p>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
            <path d="M4 2l4 4-4 4" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── E: Notch window — top-edge inset that looks cut into the card ───
function CardE({ opening, progress, total }: { opening: OpeningConfig; progress: number; total: number }) {
  const gradient = `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 50%, ${opening.colorLight} 100%)`
  return (
    <div className="w-full rounded-[18px] shadow-md overflow-hidden relative" style={{ background: gradient }}>
      {/* Notch window inset at top */}
      <div className="flex justify-center pt-0">
        <div
          className="rounded-b-xl px-5 py-2 flex items-center gap-2"
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: opening.colorLight, boxShadow: `0 0 4px ${opening.colorLight}` }} />
          <span className="text-[11px] font-bold text-white tracking-wide">{opening.name}</span>
        </div>
      </div>

      <div className="p-5 pt-3 flex items-center gap-4">
        <Puck icon={opening.icon} />
        <div className="flex-1">
          <p className="text-white/70 text-sm">{opening.subtitle}</p>
          <ProgressBar progress={progress} total={total} />
        </div>
        <Chevron />
      </div>
    </div>
  )
}

// ─── Page ───
const OPTIONS = [
  { name: 'Rounded Inset + Icon', desc: 'Recessed window with piece icon and moves', Component: CardA },
  { name: 'Accent Strip', desc: 'Minimal inset with left color bar', Component: CardB },
  { name: 'Double Border Glow', desc: 'Inner glow border with side indicator', Component: CardC },
  { name: 'Bottom Tray', desc: 'Full-width inset tray at card bottom', Component: CardD },
  { name: 'Top Notch', desc: 'Inset window cut into the card top edge', Component: CardE },
]

export default function OpeningCardNamesTest() {
  return (
    <div className="min-h-screen bg-chess-page overflow-auto">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-1">Inset Window Variations</h1>
        <p className="text-sm text-white/50 mb-8">5 takes on the recessed card-within-card style</p>

        {OPTIONS.map(({ name, desc, Component }, optIdx) => (
          <div key={name} className="mb-12">
            <div className="mb-4">
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Option {optIdx + 1}</span>
              <h2 className="text-sm font-semibold text-white">{name}</h2>
              <p className="text-xs text-white/40 mb-3">{desc}</p>
            </div>
            <div className="space-y-4">
              {MY_OPENINGS.map(({ opening, progress, total }) => (
                <Component key={opening.slug} opening={opening} progress={progress} total={total} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
