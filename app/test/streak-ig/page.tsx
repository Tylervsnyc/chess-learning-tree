'use client';

/* ════════════════════════════════════════════════════════════════════
   STREAK — Instagram posts (1080 × 1350, 4:5 portrait)
   Theme: streaks = the accountability + excitement that makes you improve.
   Hero: RookieCampfire (Rookie's blocks become fire when the streak's alive).
   Brand style matches /test/witty-alien-ig + the milestone card.
   No fabricated stats — motivational truth only.

   Capture: each post has "Download PNG", or hit ?raw=N (1–5) for a native
   1080×1350 frame to screenshot.
   ════════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';
import RookieCampfire from '@/components/shared/RookieCampfire';

const ORANGE = '#FF9500';
const ORANGE_DARK = '#E23A00';
const TEXT = '#2A3C45';
const MUTED = '#6b7c8a';
const FAINT = '#94a3b8';
const GREEN = '#58CC02';
const BLUE = '#1CB0F6';

// ── Brand logo (rook block sprite + wordmark) ──────────────────────────
const LOGO_BLOCKS = [
  { x: 0, y: 0, color: '#1CB0F6' }, { x: 2, y: 0, color: '#2FCBEF' }, { x: 4, y: 0, color: '#A560E8' },
  { x: 0, y: 1, color: '#58CC02' }, { x: 1, y: 1, color: '#FFC800' }, { x: 2, y: 1, color: '#FF9600' },
  { x: 3, y: 1, color: '#FF6B6B' }, { x: 4, y: 1, color: '#FF4B4B' },
  { x: 1, y: 2, color: '#1CB0F6' }, { x: 2, y: 2, color: '#2FCBEF' }, { x: 3, y: 2, color: '#A560E8' },
  { x: 1, y: 3, color: '#58CC02' }, { x: 2, y: 3, color: '#FFC800' }, { x: 3, y: 3, color: '#FF9600' },
  { x: 1, y: 4, color: '#FF6B6B' }, { x: 2, y: 4, color: '#FF4B4B' }, { x: 3, y: 4, color: '#1CB0F6' },
  { x: 0, y: 5, color: '#2FCBEF' }, { x: 1, y: 5, color: '#A560E8' }, { x: 2, y: 5, color: '#58CC02' },
  { x: 3, y: 5, color: '#FFC800' }, { x: 4, y: 5, color: '#FF9600' },
];
function RookLogo({ size = 14 }: { size?: number }) {
  const spacing = Math.round(size * 1.14);
  return (
    <div style={{ position: 'relative', width: spacing * 4 + size, height: spacing * 5 + size }}>
      {LOGO_BLOCKS.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: b.x * spacing, top: b.y * spacing,
          width: size, height: size, borderRadius: 4,
          background: getMatteBackground(b.color), boxShadow: getMatteBoxShadow(b.color, size / 14),
        }} />
      ))}
    </div>
  );
}

function BrandHeader({ dark = false }: { dark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <RookLogo size={13} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, fontWeight: 800, fontSize: 36, letterSpacing: -0.5 }}>
        <span style={{ color: dark ? '#fff' : TEXT }}>chess</span>
        <span style={{
          backgroundImage: 'linear-gradient(90deg,#FFC800,#FF6B6B,#1CB0F6)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>path</span>
      </div>
    </div>
  );
}

function Footer({ dark = false, cta = 'Start your streak' }: { dark?: boolean; cta?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 34, fontWeight: 900, color: dark ? '#fff' : TEXT }}>chesspath.app</span>
        <span style={{ fontSize: 24, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.55)' : FAINT }}>
          the fun way to learn chess
        </span>
      </div>
      <div style={{
        background: GREEN, color: '#fff', fontWeight: 900, fontSize: 30,
        padding: '20px 38px', borderRadius: 999, boxShadow: '0 6px 0 #46A302',
      }}>
        {cta} →
      </div>
    </div>
  );
}

// Outer frame: gradient border + inner panel.
function Frame({
  children,
  outer,
  panel,
}: {
  children: React.ReactNode;
  outer: string;
  panel: string;
}) {
  return (
    <div style={{
      width: 1080, height: 1350, background: outer, padding: 30,
      fontFamily: 'var(--font-body, "DM Sans", sans-serif)', boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%', height: '100%', background: panel, borderRadius: 44,
        padding: '52px 56px 48px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════ POST 1 — Don't break the chain ════════════ */
function Post1() {
  return (
    <Frame outer="linear-gradient(150deg,#FFB347 0%,#FF7A00 50%,#E23A00 100%)" panel="#eef6fc">
      <BrandHeader />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 40, flex: 1 }}>
        <div style={{ marginTop: 10, marginBottom: 30 }}>
          <RookieCampfire blockSize={54} active blaze={1} />
        </div>
        <h1 style={{ fontSize: 104, fontWeight: 900, color: TEXT, lineHeight: 0.98, letterSpacing: -3, margin: 0 }}>
          Don't break<br />the chain.
        </h1>
        <p style={{ fontSize: 38, fontWeight: 600, color: MUTED, marginTop: 30, maxWidth: 760, lineHeight: 1.3 }}>
          One thing a day — a lesson, a puzzle, a game.
          <br />
          That's how chess actually starts to click.
        </p>
      </div>
      <Footer />
    </Frame>
  );
}

/* ═══════════════════════════ POST 2 — Showing up beats talent (dark) ═══ */
function Post2() {
  return (
    <Frame outer="linear-gradient(150deg,#FF9500,#E23A00)" panel="linear-gradient(180deg,#2A3C45 0%,#33373f 55%,#3a2e26 100%)">
      <BrandHeader dark />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 30, flex: 1 }}>
        <div style={{ marginTop: 6, marginBottom: 24 }}>
          <RookieCampfire blockSize={58} active blaze={1} />
        </div>
        <h1 style={{ fontSize: 110, fontWeight: 900, color: '#fff', lineHeight: 0.96, letterSpacing: -3, margin: 0 }}>
          Showing up<br />
          <span style={{ color: ORANGE }}>beats talent.</span>
        </h1>
        <p style={{ fontSize: 38, fontWeight: 600, color: 'rgba(255,255,255,0.72)', marginTop: 30, maxWidth: 740, lineHeight: 1.3 }}>
          A streak keeps you honest. Chess Path makes coming back the fun part.
        </p>
      </div>
      <Footer dark />
    </Frame>
  );
}

/* ═══════════════════════════ POST 3 — How to actually get good ═════════ */
function Post3() {
  const steps = [
    { n: '1', t: 'Show up.', b: 'Open the app. That\'s the whole battle, honestly.' },
    { n: '2', t: 'Solve, learn, play.', b: 'A puzzle, a lesson, or a quick game. Anything counts.' },
    { n: '3', t: "Don't let the fire go out.", b: 'Keep the streak alive and watch your rating follow.' },
  ];
  return (
    <Frame outer="linear-gradient(150deg,#FFB347,#FF7A00,#E23A00)" panel="#eef6fc">
      <BrandHeader />
      <h1 style={{ fontSize: 76, fontWeight: 900, color: TEXT, lineHeight: 1.02, letterSpacing: -2, marginTop: 34, marginBottom: 8 }}>
        How to actually<br />get good at chess
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 26 }}>
        {steps.map((s) => (
          <div key={s.n} style={{
            display: 'flex', alignItems: 'center', gap: 26, background: '#fff', borderRadius: 28,
            padding: '30px 34px', boxShadow: '0 8px 22px rgba(226,58,0,0.08)',
          }}>
            <div style={{
              width: 78, height: 78, borderRadius: 20, flexShrink: 0, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 44, fontWeight: 900, background: `linear-gradient(135deg,${ORANGE},${ORANGE_DARK})`,
            }}>{s.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: TEXT }}>{s.t}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: MUTED, marginTop: 4 }}>{s.b}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 44, right: 50 }}>
        <RookieCampfire blockSize={26} active blaze={1} withFx={false} />
      </div>
      <div style={{ marginTop: 'auto' }}><Footer /></div>
    </Frame>
  );
}

/* ═══════════════════════════ POST 4 — The streak window mockup ═════════ */
function StreakWindowMock() {
  return (
    <div style={{
      width: 760, borderRadius: 36, padding: 36, color: '#fff',
      background: 'linear-gradient(180deg,#2A3C45 0%,#33373f 55%,#3a2e26 100%)',
      border: '2px solid rgba(255,149,0,0.4)', boxShadow: '0 24px 60px rgba(226,58,0,0.25)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ flexShrink: 0 }}>
          <RookieCampfire blockSize={34} active blaze={1} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 96, fontWeight: 900, color: '#fff', lineHeight: 0.9 }}>14</span>
            <span style={{ fontSize: 34, fontWeight: 800, color: 'rgba(255,255,255,0.55)' }}>days</span>
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
            Still burning bright. See you tomorrow.
          </div>
        </div>
      </div>
      <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>A lesson, a game, or a puzzle — anything counts.</span>
        <span style={{ fontSize: 24, fontWeight: 800, color: '#FFD24D' }}>Best 23</span>
      </div>
    </div>
  );
}
function Post4() {
  return (
    <Frame outer="linear-gradient(150deg,#FFB347,#FF7A00,#E23A00)" panel="#eef6fc">
      <BrandHeader />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 30, flex: 1 }}>
        <h1 style={{ fontSize: 84, fontWeight: 900, color: TEXT, lineHeight: 1.0, letterSpacing: -2.5, margin: 0 }}>
          Your streak.<br />Your accountability.
        </h1>
        <p style={{ fontSize: 34, fontWeight: 600, color: MUTED, marginTop: 22, maxWidth: 740, lineHeight: 1.3 }}>
          Rookie catches fire when you show up. The longer you go, the bigger the blaze.
        </p>
        <div style={{ marginTop: 44 }}>
          <StreakWindowMock />
        </div>
      </div>
      <Footer cta="Start a streak" />
    </Frame>
  );
}

/* ═══════════════════════════ POST 5 — Big bold hook (dark) ═════════════ */
function Post5() {
  return (
    <Frame outer="linear-gradient(150deg,#FF9500,#E23A00)" panel="linear-gradient(180deg,#1f2c33 0%,#33291f 100%)">
      <BrandHeader dark />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', flex: 1 }}>
        <div style={{ marginBottom: 36 }}>
          <RookieCampfire blockSize={64} active blaze={1} />
        </div>
        <h1 style={{ fontSize: 118, fontWeight: 900, color: '#fff', lineHeight: 0.94, letterSpacing: -4, margin: 0 }}>
          DON'T LET<br />THE FIRE<br /><span style={{ color: ORANGE }}>GO OUT.</span>
        </h1>
        <p style={{ fontSize: 36, fontWeight: 600, color: 'rgba(255,255,255,0.72)', marginTop: 34, maxWidth: 720, lineHeight: 1.3 }}>
          Build a daily chess habit. One puzzle at a time.
        </p>
      </div>
      <Footer dark cta="Light it up" />
    </Frame>
  );
}

// ── Post registry ──────────────────────────────────────────────────────
const POSTS = [
  { id: 1, name: "Don't break the chain", file: 'streak-1-chain', render: () => <Post1 /> },
  { id: 2, name: 'Showing up beats talent', file: 'streak-2-talent', render: () => <Post2 /> },
  { id: 3, name: 'How to get good (3 steps)', file: 'streak-3-howto', render: () => <Post3 /> },
  { id: 4, name: 'Streak window mockup', file: 'streak-4-window', render: () => <Post4 /> },
  { id: 5, name: "Don't let the fire go out", file: 'streak-5-fire', render: () => <Post5 /> },
];

function PostPreview({ post }: { post: (typeof POSTS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  async function download() {
    if (!ref.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(ref.current, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${post.file}.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  }
  const SCALE = 0.46;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-base font-black text-slate-700">
          {post.id}. {post.name}
        </span>
        <button
          onClick={download}
          disabled={busy}
          className="rounded-lg bg-chess-green px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-chess-green-dark disabled:opacity-50"
        >
          {busy ? 'Rendering…' : 'Download PNG'}
        </button>
        <a href={`?raw=${post.id}`} target="_blank" className="text-xs font-semibold text-chess-blue underline">
          raw ↗
        </a>
      </div>
      {/* Fixed-size box reserves layout space; the card is scaled inside it. */}
      <div
        style={{
          width: 1080 * SCALE,
          height: 1350 * SCALE,
          overflow: 'hidden',
          borderRadius: 14,
          boxShadow: '0 10px 40px rgba(0,0,0,0.18)',
          flexShrink: 0,
        }}
      >
        <div ref={ref} style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
          {post.render()}
        </div>
      </div>
    </div>
  );
}

export default function StreakIGPage() {
  const [raw, setRaw] = useState<number | null>(null);
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('raw');
    setRaw(v ? Number(v) : null);
  }, []);

  // Raw mode: single native-size post for screenshot capture.
  if (raw) {
    const post = POSTS.find((p) => p.id === raw);
    return <div style={{ width: 1080, height: 1350 }}>{post ? post.render() : null}</div>;
  }

  return (
    <div className="min-h-screen w-full overflow-auto bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black text-slate-800">Streak — Instagram posts</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          1080×1350 · accountability + excitement angle · Rookie catches fire. Download each, or open raw to screenshot.
        </p>
        <div className="mt-10 flex flex-col items-center gap-20">
          {POSTS.map((p) => (
            <PostPreview key={p.id} post={p} />
          ))}
        </div>
        <div className="h-24" />
      </div>
    </div>
  );
}
