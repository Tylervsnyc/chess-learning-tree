'use client';

/**
 * Chess Box tab icon candidates — rendered in the real BoxTabBar button
 * style (active red + inactive tint) so they can be judged in context.
 * Current GloveIcon shown first for comparison.
 */

const RED = '#FF4B4B';
const SHADOW = '#CC3939';
const TINT = 'rgba(255,75,75,0.12)';

type IconFn = () => React.ReactNode;

const svgProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* 0 — current icon */
function Current() {
  return (
    <svg {...svgProps} aria-hidden>
      <path d="M7 10V7a5 5 0 0 1 10 0v4a5 5 0 0 1-3 4.6V17H9v-1.4A5 5 0 0 1 7 12" />
      <path d="M7 10a2 2 0 1 0 2 3" />
      <path d="M9 20h5v-3" />
    </svg>
  );
}

/* 1 — classic side-profile glove: big rounded fist, thumb bump, cuff */
function GloveClassic() {
  return (
    <svg {...svgProps} aria-hidden>
      <path d="M6 11V8a6 6 0 0 1 12 0v3a6 6 0 0 1-4 5.7V18h-4v-1.3A6 6 0 0 1 6 11Z" />
      <path d="M6 9.5a2.5 2.5 0 0 0 0 5" />
      <path d="M9 21h6v-3H9Z" />
    </svg>
  );
}

/* 2 — glove punching right with speed lines */
function GlovePunch() {
  return (
    <svg {...svgProps} aria-hidden>
      <path d="M9 6h5a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H9V6Z" />
      <path d="M12 6v5a2 2 0 0 0 2 2" />
      <path d="M9 8H6v8h3" />
      <path d="M2 9.5h2M2 14.5h2" />
    </svg>
  );
}

/* 3 — boxing ring: canvas + two ropes + corner posts */
function Ring() {
  return (
    <svg {...svgProps} aria-hidden>
      <path d="M4 5v11M20 5v11" />
      <path d="M4 8h16M4 12h16" />
      <path d="M2 19c3-2.5 7-3 10-3s7 .5 10 3" />
      <circle cx="4" cy="4.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="20" cy="4.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* 4 — round bell */
function Bell() {
  return (
    <svg {...svgProps} aria-hidden>
      <path d="M12 4a7 7 0 0 1 7 7v4H5v-4a7 7 0 0 1 7-7Z" />
      <path d="M12 4V2.5M4 18.5h16" />
      <path d="M9 21.5h6" />
    </svg>
  );
}

/* 5 — crossed gloves (two mitts touching) */
function GlovesTouch() {
  return (
    <svg {...svgProps} aria-hidden>
      <path d="M10.5 12.5 6 8a2.5 2.5 0 0 1 3.5-3.5L14 9" />
      <path d="M13.5 12.5 18 8a2.5 2.5 0 0 0-3.5-3.5" />
      <path d="M10.5 12.5a4.5 4.5 0 0 0 3 0" />
      <path d="M8 14.5c0 3 1.8 5.5 4 5.5s4-2.5 4-5.5" />
    </svg>
  );
}

/* 6 — pawn wearing a glove (chess + boxing in one) */
function PawnGlove() {
  return (
    <svg {...svgProps} aria-hidden>
      <circle cx="10" cy="6" r="2.6" />
      <path d="M8.2 10.5h3.6L13 17H7Z" />
      <path d="M5.5 20h9" />
      <path d="M15 8.5h3a3.2 3.2 0 0 1 0 6.4h-3V8.5Z" />
      <path d="M16.8 8.5v3.4a1.3 1.3 0 0 0 1.3 1.3" />
    </svg>
  );
}

/* 7 — raised fist */
function Fist() {
  return (
    <svg {...svgProps} aria-hidden>
      <path d="M7 12V9.5a1.7 1.7 0 0 1 3.4 0M10.4 9V7.5a1.7 1.7 0 0 1 3.4 0V9M13.8 9V8a1.7 1.7 0 0 1 3.4 0V12" />
      <path d="M7 12v2.5a5.6 5.6 0 0 0 5.6 5.6h.1a4.5 4.5 0 0 0 4.5-4.5V12" />
      <path d="M7 12.8 5.6 11.4a1.6 1.6 0 0 1 2.3-2.3" />
    </svg>
  );
}

const CANDIDATES: { name: string; note: string; icon: IconFn }[] = [
  { name: 'Current', note: 'the one shipping now', icon: Current },
  { name: 'Glove classic', note: 'bigger fist, clear thumb + cuff', icon: GloveClassic },
  { name: 'Glove punch', note: 'sideways jab + speed lines', icon: GlovePunch },
  { name: 'Ring', note: 'ropes + corner posts', icon: Ring },
  { name: 'Bell', note: 'round bell — ding ding', icon: Bell },
  { name: 'Gloves touch', note: 'touch gloves, fight starts', icon: GlovesTouch },
  { name: 'Pawn + glove', note: 'chess AND boxing in one', icon: PawnGlove },
  { name: 'Fist', note: 'raised fist, no glove', icon: Fist },
];

function Tab({ icon: Icon, active }: { icon: IconFn; active: boolean }) {
  return (
    <span
      className="flex flex-col items-center justify-center gap-0.5 min-h-[48px] w-24 rounded-xl border-2"
      style={{
        background: active ? RED : TINT,
        borderColor: active ? SHADOW : 'transparent',
        boxShadow: active ? `0 3px 0 0 ${SHADOW}` : 'none',
        color: active ? '#fff' : RED,
        opacity: active ? 1 : 0.85,
      }}
    >
      <Icon />
      <span className="text-[10px] font-extrabold leading-none whitespace-nowrap">Chess Box</span>
    </span>
  );
}

export default function ChessBoxTabIconTest() {
  return (
    <div className="h-full overflow-auto bg-chess-bg p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-extrabold text-slate-800 mb-1">Chess Box tab icon</h1>
        <p className="text-sm text-slate-500 mb-6">Each candidate in the real tab style — active and inactive.</p>
        <div className="flex flex-col gap-4">
          {CANDIDATES.map(({ name, note, icon }) => (
            <div key={name} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <Tab icon={icon} active />
              <Tab icon={icon} active={false} />
              <div className="min-w-0">
                <div className="font-bold text-slate-800 text-sm">{name}</div>
                <div className="text-xs text-slate-500">{note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
