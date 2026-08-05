'use client';

import { useState } from 'react';

/**
 * LinkedIn infographic gallery — Tyler's AI automation "Recipe" framework.
 * 10 different 1080x1350 layouts of the same 5-step idea, classic palette.
 * Screenshot any card's #card-N node at full size to export.
 */

// ─── Classic brand palette ───
const C = {
  purple: '#7c5ba8',
  blue: '#4a90e5',
  yellow: '#f0cb3a',
  green: '#8fb35e',
  red: '#c53b36',
  orange: '#dc6e2a',
  black: '#1a1a1a',
};

const INK_SUB = '#5a6b85';

const STEPS = [
  { title: 'Pick one boring process', sub: 'something you already do every week', color: C.blue },
  { title: 'Lay out the ingredients', sub: 'the emails, the spreadsheet, the call notes', color: C.green },
  { title: 'Show 3 examples done well', sub: 'the step everyone skips', color: C.yellow },
  { title: 'Write the recipe', sub: 'like you’re training a new hire', color: C.orange },
  { title: 'Run it, fix one thing, run again', sub: 'iterate until it’s right', color: C.red },
];

const POST_TEXT = `You don't need an AI strategy.

You need one boring process and three examples of it done well.

Here's the exact playbook I use every time I help someone automate part of their work with AI:

1. Pick a dish you already cook.
An existing process you do every week. Not a new idea. The boring one.

2. Lay out the ingredients.
The inputs you already have — the emails, the spreadsheet, the call notes.

3. Show a photo of the finished plate.
2-3 real examples of the output done well. This is the step everyone skips, and it's the whole trick.

4. Write the recipe.
Describe the process in plain words, like you're training a new hire.

5. Taste and adjust.
Run it. Mark what's off. Fix one thing. Run again.

That's it. No platform. No "AI transformation roadmap."

Examples beat instructions. Every time.

What's the boring process you'd hand off first?`;

// ─── Shared bits ───

const ROOK: { x: number; y: number; color: string }[] = [
  { x: 0, y: 0, color: C.red }, { x: 2, y: 0, color: C.blue }, { x: 4, y: 0, color: C.yellow },
  { x: 0, y: 1, color: C.green }, { x: 1, y: 1, color: C.red }, { x: 2, y: 1, color: C.orange }, { x: 3, y: 1, color: C.green }, { x: 4, y: 1, color: C.blue },
  { x: 1, y: 2, color: C.blue }, { x: 2, y: 2, color: C.yellow }, { x: 3, y: 2, color: C.red },
  { x: 1, y: 3, color: C.orange }, { x: 2, y: 3, color: C.green }, { x: 3, y: 3, color: C.yellow },
  { x: 1, y: 4, color: C.yellow }, { x: 2, y: 4, color: C.red }, { x: 3, y: 4, color: C.blue },
  { x: 0, y: 5, color: C.blue }, { x: 1, y: 5, color: C.green }, { x: 2, y: 5, color: C.orange }, { x: 3, y: 5, color: C.red }, { x: 4, y: 5, color: C.green },
];

function MiniRook({ block = 14 }: { block?: number }) {
  return (
    <div style={{ position: 'relative', width: block * 5, height: block * 6 }}>
      {ROOK.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x * block,
            top: b.y * block,
            width: block - 1,
            height: block - 1,
            background: b.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

// Star from the /play lesson buttons (LearnPageContent PIECE_ICONS.star)
function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={color} />
    </svg>
  );
}

function Shell({ id, bg = '#f0f6ff', children }: { id: string; bg?: string; children: React.ReactNode }) {
  return (
    <div
      id={id}
      style={{
        position: 'relative',
        width: 1080,
        height: 1350,
        background: bg,
        fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

function Footer({ light = false }: { light?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 64,
        bottom: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ fontSize: 25, fontWeight: 700, color: light ? '#ffffff' : C.black }}>
        Examples beat instructions.{' '}
        <span style={{ color: light ? 'rgba(255,255,255,0.65)' : INK_SUB, fontWeight: 500 }}>Every time.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MiniRook block={8} />
        <div style={{ fontSize: 21, fontWeight: 700, color: light ? 'rgba(255,255,255,0.75)' : INK_SUB }}>
          Tyler Schwartz
        </div>
      </div>
    </div>
  );
}

function Hook({ title, sub, light = false }: { title: string; sub?: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ position: 'absolute', top: 60, left: 64, right: 64 }}>
      <div style={{ fontSize: 56, fontWeight: 800, color: light ? '#ffffff' : C.black, lineHeight: 1.08, letterSpacing: -1.5 }}>
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: 29, fontWeight: 500, color: light ? 'rgba(255,255,255,0.7)' : INK_SUB, lineHeight: 1.3, marginTop: 12 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

const HOOK_SUB = (
  <>
    You need one boring process and <span style={{ color: C.black, fontWeight: 700 }}>three examples of it done well.</span>
  </>
);

// ════════════════════════════════════════════════════════════
// 1. THE FLOWCHART
// ════════════════════════════════════════════════════════════

function FlowchartCard() {
  const wire = '#8aa4c8';
  const nodes = [
    { n: 1, ...STEPS[0], left: 80, top: 285, w: 400, rot: -2, badge: undefined as string | undefined },
    { n: 2, ...STEPS[1], left: 555, top: 430, w: 410, rot: 1.5, badge: undefined },
    { n: 3, ...STEPS[2], left: 70, top: 580, w: 430, rot: -1.5, badge: 'the whole trick' },
    { n: 4, ...STEPS[3], left: 575, top: 730, w: 375, rot: 2, badge: undefined },
    { n: 5, color: C.red, title: 'Run it', sub: 'mark what’s off', left: 120, top: 875, w: 310, rot: -2, badge: undefined },
  ];
  return (
    <Shell id="card-1">
      <Hook title="You don’t need an AI strategy." sub={HOOK_SUB} />
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <marker id="fc-a" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={wire} />
          </marker>
          <marker id="fc-r" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.red} />
          </marker>
          <marker id="fc-g" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.green} />
          </marker>
        </defs>
        <path d="M 440 395 C 540 440 520 450 575 472" fill="none" stroke={wire} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" markerEnd="url(#fc-a)" />
        <path d="M 690 545 C 600 605 540 605 470 622" fill="none" stroke={wire} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" markerEnd="url(#fc-a)" />
        <path d="M 450 700 C 560 745 560 755 600 768" fill="none" stroke={wire} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" markerEnd="url(#fc-a)" />
        <path d="M 600 845 C 500 895 470 895 420 908" fill="none" stroke={wire} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" markerEnd="url(#fc-a)" />
        <path d="M 420 970 C 500 1010 520 1015 562 1040" fill="none" stroke={wire} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" markerEnd="url(#fc-a)" />
        <path d="M 562 1095 C 380 1180 200 1130 235 985" fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" markerEnd="url(#fc-r)" />
        <path d="M 722 1085 C 790 1125 800 1130 830 1150" fill="none" stroke={C.green} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" markerEnd="url(#fc-g)" />
      </svg>
      {nodes.map((node) => (
        <div
          key={node.n}
          style={{
            position: 'absolute',
            left: node.left,
            top: node.top,
            width: node.w,
            background: node.color,
            borderRadius: 26,
            padding: '22px 30px',
            transform: `rotate(${node.rot}deg)`,
            boxShadow: '0 6px 0 rgba(26,26,26,0.15)',
          }}
        >
          <div
            style={{
              position: 'absolute', top: -22, left: -22, width: 56, height: 56, borderRadius: '50%',
              background: '#ffffff', border: `4px solid ${node.color}`, color: C.black,
              fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {node.n}
          </div>
          {node.badge && (
            <div
              style={{
                position: 'absolute', top: -26, right: 24, background: C.black, color: '#ffffff',
                fontSize: 21, fontWeight: 800, padding: '8px 18px', borderRadius: 999,
                transform: 'rotate(3deg)', whiteSpace: 'nowrap',
              }}
            >
              {node.badge}
            </div>
          )}
          <div style={{ fontSize: 32, fontWeight: 800, color: node.color === C.yellow ? C.black : '#ffffff', lineHeight: 1.15 }}>
            {node.title}
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: node.color === C.yellow ? C.black : '#ffffff', opacity: 0.82, lineHeight: 1.3, marginTop: 6 }}>
            {node.sub}
          </div>
        </div>
      ))}
      <div
        style={{
          position: 'absolute', left: 570, top: 975, width: 140, height: 140, background: C.purple,
          borderRadius: 24, transform: 'rotate(45deg)', boxShadow: '0 6px 0 rgba(26,26,26,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ transform: 'rotate(-45deg)', color: '#ffffff', fontSize: 32, fontWeight: 800 }}>Good?</div>
      </div>
      <div
        style={{
          position: 'absolute', left: 300, top: 1115, background: '#ffffff', border: `3px solid ${C.red}`,
          color: C.red, fontSize: 22, fontWeight: 800, padding: '8px 18px', borderRadius: 999,
          transform: 'rotate(-3deg)', whiteSpace: 'nowrap',
        }}
      >
        nope — fix ONE thing
      </div>
      <div
        style={{
          position: 'absolute', left: 762, top: 1062, background: '#ffffff', border: `3px solid ${C.green}`,
          color: C.green, fontSize: 22, fontWeight: 800, padding: '6px 16px', borderRadius: 999, transform: 'rotate(4deg)',
        }}
      >
        yes
      </div>
      <div
        style={{
          position: 'absolute', left: 820, top: 1155, background: C.black, color: '#ffffff', fontSize: 34,
          fontWeight: 800, padding: '20px 38px', borderRadius: 24, transform: 'rotate(-2deg)',
          boxShadow: '0 6px 0 rgba(26,26,26,0.25)',
        }}
      >
        Ship it.
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 2. THE RECIPE CARD
// ════════════════════════════════════════════════════════════

function RecipeCard() {
  const ingredients = [
    { t: '1 boring weekly process', c: C.blue },
    { t: 'the emails it lives in', c: C.green },
    { t: 'the spreadsheet', c: C.green },
    { t: 'the call notes', c: C.green },
    { t: '3 examples done well', c: C.yellow, star: true },
    { t: 'plain words, no jargon', c: C.orange },
    { t: 'patience for 3 rounds', c: C.red },
  ];
  return (
    <Shell id="card-2">
      <div
        style={{
          position: 'absolute', left: 70, top: 64, right: 70, bottom: 130, background: '#fffdf4',
          borderRadius: 28, border: '3px dashed #d9cfa8', padding: '52px 56px', boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: INK_SUB, letterSpacing: 5 }}>RECIPE No. 001</div>
        <div style={{ fontSize: 52, fontWeight: 800, color: C.black, lineHeight: 1.08, letterSpacing: -1, marginTop: 10 }}>
          One Boring Process, Automated
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: INK_SUB, marginTop: 16, letterSpacing: 1 }}>
          PREP: 30 MIN&ensp;&middot;&ensp;COOK: 1 AFTERNOON&ensp;&middot;&ensp;SERVES: YOUR WHOLE TEAM
        </div>
        <div style={{ height: 3, background: '#e8e0c3', margin: '34px 0' }} />
        <div style={{ display: 'flex', gap: 48 }}>
          <div style={{ width: 360, flexShrink: 0 }}>
            <div style={{ fontSize: 27, fontWeight: 800, color: C.black, letterSpacing: 2 }}>INGREDIENTS</div>
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {ingredients.map((ing) => (
                <div key={ing.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: ing.c, flexShrink: 0, marginTop: 2 }} />
                  <div style={{ fontSize: 23, fontWeight: ing.star ? 800 : 600, color: C.black, lineHeight: 1.25 }}>
                    {ing.t}
                    {ing.star && <span style={{ color: C.red, fontWeight: 800 }}> *</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, color: C.red, marginTop: 22, lineHeight: 1.35 }}>
              * do not substitute. This is the whole dish.
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 27, fontWeight: 800, color: C.black, letterSpacing: 2 }}>INSTRUCTIONS</div>
            <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {STEPS.map((s, i) => (
                <div key={s.title} style={{ display: 'flex', gap: 18 }}>
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: '50%', background: s.color, flexShrink: 0,
                      color: s.color === C.yellow ? C.black : '#ffffff', fontSize: 23, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 25, fontWeight: 800, color: C.black, lineHeight: 1.2 }}>{s.title}</div>
                    <div style={{ fontSize: 20, fontWeight: 500, color: INK_SUB, lineHeight: 1.3, marginTop: 4 }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'absolute', left: 56, right: 56, bottom: 44, background: '#f5eed3', borderRadius: 18,
            padding: '20px 28px', fontSize: 22, fontWeight: 600, color: '#6b5d2e', fontStyle: 'italic', lineHeight: 1.35,
          }}
        >
          Chef’s note: most people skip the examples and wonder why it tastes like a chatbot. Don’t skip the examples.
        </div>
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 3. THE CHESSBOARD
// ════════════════════════════════════════════════════════════

function ChessboardCard() {
  const SQ = 102;
  const BL = 132; // board left
  const BT = 300; // board top
  const path = [
    { c: 0, r: 5 }, { c: 2, r: 4 }, { c: 4, r: 3 }, { c: 5, r: 1 }, { c: 7, r: 0 },
  ];
  const center = (p: { c: number; r: number }) => ({ x: BL + p.c * SQ + SQ / 2, y: BT + p.r * SQ + SQ / 2 });
  return (
    <Shell id="card-3">
      <Hook title="Automation is a board you already know." sub="Five squares from boring to shipped." />
      {/* board */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 8 }).map((__, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              position: 'absolute', left: BL + c * SQ, top: BT + r * SQ, width: SQ, height: SQ,
              background: (r + c) % 2 === 0 ? '#ffffff' : '#cfe1f7',
            }}
          />
        ))
      )}
      {/* dashed move lines */}
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <marker id="cb-a" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.black} />
          </marker>
        </defs>
        {path.slice(0, -1).map((p, i) => {
          const a = center(p);
          const b = center(path[i + 1]);
          return (
            <line
              key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.black} strokeWidth={5}
              strokeDasharray="3 14" strokeLinecap="round" markerEnd="url(#cb-a)" opacity={0.55}
            />
          );
        })}
      </svg>
      {/* step squares */}
      {path.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: BL + p.c * SQ + 6, top: BT + p.r * SQ + 6, width: SQ - 12, height: SQ - 12,
            background: STEPS[i].color, borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 4px 0 rgba(26,26,26,0.2)',
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 800, color: STEPS[i].color === C.yellow ? C.black : '#ffffff' }}>{i + 1}</div>
        </div>
      ))}
      {/* ship it flag off the last square */}
      <div
        style={{
          position: 'absolute', left: 880, top: 238, background: C.black, color: '#ffffff', fontSize: 26,
          fontWeight: 800, padding: '12px 24px', borderRadius: 16, transform: 'rotate(3deg)',
          boxShadow: '0 5px 0 rgba(26,26,26,0.25)',
        }}
      >
        Ship it.
      </div>
      {/* legend */}
      <div style={{ position: 'absolute', left: 132, top: 950, display: 'flex', flexDirection: 'column', gap: 13 }}>
        {STEPS.map((s, i) => (
          <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 38, height: 38, borderRadius: 10, background: s.color, flexShrink: 0,
                color: s.color === C.yellow ? C.black : '#ffffff', fontSize: 21, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.black }}>
              {s.title}
              <span style={{ color: INK_SUB, fontWeight: 500 }}> — {s.sub}</span>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 3A. CHESSBOARD VARIATION — THE SCORESHEET
// ════════════════════════════════════════════════════════════

function ScoresheetCard() {
  const SQ = 62;
  const BL = (1080 - 8 * SQ) / 2;
  const BT = 280;
  // Same knight path as the poster board; h1 (bottom-right) is light.
  const path = [
    { c: 1, r: 7 }, { c: 2, r: 5 }, { c: 4, r: 4 }, { c: 5, r: 2 }, { c: 7, r: 1 },
  ];
  const ship = { c: 5, r: 0 };
  const cx = (c: number) => BL + c * SQ + SQ / 2;
  const cy = (r: number) => BT + r * SQ + SQ / 2;
  const knightPath = (a: { c: number; r: number }, b: { c: number; r: number }) => {
    const vertFirst = Math.abs(b.r - a.r) === 2;
    return vertFirst
      ? `M ${cx(a.c)} ${cy(a.r)} L ${cx(a.c)} ${cy(b.r)} L ${cx(b.c)} ${cy(b.r)}`
      : `M ${cx(a.c)} ${cy(a.r)} L ${cx(b.c)} ${cy(a.r)} L ${cx(b.c)} ${cy(b.r)}`;
  };
  // Real knight tour: b1 -> c3 -> e4 -> f6 -> h7 -> g8. The notation is legit.
  const moves = [
    { title: 'Pick one boring task', sub: 'something you do every week', san: 'Nc3!' },
    { title: 'Gather your inputs', sub: 'the emails, files, and notes it uses', san: 'Ne4!' },
    { title: 'Show 3 examples done well', sub: 'show it — don’t describe it', san: 'Nf6!!' },
    { title: 'Write the steps in plain words', sub: 'like training a new hire', san: 'Nh7!' },
    { title: 'Run it. Fix one thing. Repeat.', sub: 'three rounds is usually enough', san: 'Ng8#' },
  ];
  return (
    <Shell id="card-3a">
      {/* header window — how-to-begin-with-ai.pgn */}
      <div
        style={{
          position: 'absolute', left: 64, top: 36, right: 64, background: '#ffffff',
          border: `4px solid ${C.black}`, borderRadius: 22, overflow: 'hidden',
          boxShadow: `10px 10px 0 ${C.blue}`,
        }}
      >
        {/* title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', background: C.blue }}>
          <div style={{ width: 16, height: 16, borderRadius: 5, background: C.red }} />
          <div style={{ width: 16, height: 16, borderRadius: 5, background: C.yellow }} />
          <div style={{ width: 16, height: 16, borderRadius: 5, background: C.green }} />
          <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.92)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', marginLeft: 8 }}>
            how-to-begin-with-ai.pgn
          </div>
        </div>
        {/* window body */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 26, padding: '18px 28px' }}>
          <div>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.black, lineHeight: 1.1, letterSpacing: -1 }}>
              How to begin with{' '}
              <span style={{ background: C.yellow, padding: '0 12px', borderRadius: 10, display: 'inline-block', transform: 'rotate(-1.5deg)' }}>
                AI.
              </span>
            </div>
            <div style={{ fontSize: 21, fontWeight: 500, color: INK_SUB, lineHeight: 1.3, marginTop: 8 }}>
              The first exercise I run with every client — it gets you thinking in the AI mindset.
              And it&rsquo;s <span style={{ fontWeight: 800, color: C.black }}>NOT</span> scary, I promise!
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/email/tyler-headshot.jpg"
              alt="Tyler Schwartz"
              style={{
                width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top',
                border: `4px solid ${C.yellow}`,
              }}
            />
            <div style={{ fontSize: 17, fontWeight: 800, color: C.black, marginTop: 6 }}>Tyler Schwartz</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.blue, marginTop: 2 }}>
              tyleraiconsulting.vercel.app
            </div>
          </div>
        </div>
      </div>
      {/* full 8x8 board — h1 (bottom-right) is light */}
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 8 }).map((__, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              position: 'absolute', left: BL + c * SQ, top: BT + r * SQ, width: SQ, height: SQ,
              background: (r + c) % 2 === 0 ? '#ffffff' : '#cfe1f7',
            }}
          />
        ))
      )}
      {/* board coordinates — the craft detail chess people check */}
      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((f, i) => (
        <div
          key={f}
          style={{
            position: 'absolute', left: BL + i * SQ, top: BT + 8 * SQ + 2, width: SQ, textAlign: 'center',
            fontSize: 15, fontWeight: 700, color: '#8aa4c8',
          }}
        >
          {f}
        </div>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: BL - 24, top: BT + i * SQ, height: SQ, width: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#8aa4c8',
          }}
        >
          {8 - i}
        </div>
      ))}
      {/* L-shaped knight-move arrows */}
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <marker id="ss-a" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.black} />
          </marker>
          <marker id="ss-r" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.red} />
          </marker>
        </defs>
        {path.slice(0, -1).map((p, i) => (
          <path
            key={i} d={knightPath(p, path[i + 1])} fill="none" stroke={C.black} strokeWidth={5}
            strokeDasharray="3 13" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#ss-a)" opacity={0.5}
          />
        ))}
        <path
          d={knightPath(path[4], ship)} fill="none" stroke={C.red} strokeWidth={5}
          strokeDasharray="3 13" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#ss-r)"
        />
      </svg>
      {/* the knight starts on b1 */}
      <div
        style={{
          position: 'absolute', left: BL + path[0].c * SQ + 5, top: BT + path[0].r * SQ + 5, width: SQ - 10, height: SQ - 10,
          background: C.black, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 0 rgba(26,26,26,0.3)', fontSize: 34, color: '#ffffff', lineHeight: 1,
        }}
      >
        ♞
      </div>
      {/* move squares 1-4 */}
      {path.slice(1).map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: BL + p.c * SQ + 5, top: BT + p.r * SQ + 5, width: SQ - 10, height: SQ - 10,
            background: STEPS[i].color, borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 4px 0 rgba(26,26,26,0.2)',
            fontSize: 29, fontWeight: 800, color: STEPS[i].color === C.yellow ? C.black : '#ffffff',
          }}
        >
          {i + 1}
        </div>
      ))}
      {/* move 5 — the star square (g8), where it ships */}
      <div
        style={{
          position: 'absolute', left: BL + ship.c * SQ + 5, top: BT + ship.r * SQ + 5, width: SQ - 10, height: SQ - 10,
          background: C.red, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 0 rgba(26,26,26,0.3)',
        }}
      >
        <StarIcon size={36} color="#ffffff" />
      </div>
      <div
        style={{
          position: 'absolute', left: BL + ship.c * SQ + SQ + 12, top: BT + 16, background: C.black,
          color: '#ffffff', fontSize: 22, fontWeight: 800, padding: '8px 18px', borderRadius: 999,
          transform: 'rotate(2deg)',
        }}
      >
        Ship it.
      </div>
      {/* scoresheet window — matches the header window */}
      <div
        style={{
          position: 'absolute', left: 110, right: 110, top: 802, background: '#ffffff',
          border: `4px solid ${C.black}`, borderRadius: 22, overflow: 'hidden',
          boxShadow: `10px 10px 0 ${C.blue}`,
        }}
      >
        {/* title bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px', background: C.blue }}>
          <div style={{ width: 14, height: 14, borderRadius: 4, background: C.red }} />
          <div style={{ width: 14, height: 14, borderRadius: 4, background: C.yellow }} />
          <div style={{ width: 14, height: 14, borderRadius: 4, background: C.green }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.92)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', marginLeft: 8 }}>
            you-vs-the-busywork.pgn
          </div>
        </div>
        <div style={{ padding: '14px 32px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e9f0fa', paddingBottom: 8 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: C.black, letterSpacing: 2 }}>WHITE: YOU</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: INK_SUB, letterSpacing: 2 }}>BLACK: THE BUSYWORK</div>
        </div>
        {moves.map((m, i) => (
          <div key={m.san} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '6px 0', borderBottom: i < 4 ? '1px solid #eef3fb' : 'none' }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 10, background: STEPS[i].color, flexShrink: 0,
                color: STEPS[i].color === C.yellow ? C.black : '#ffffff', fontSize: 19, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {i === 4 ? <StarIcon size={20} color="#ffffff" /> : i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.black, lineHeight: 1.15 }}>{m.title}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: INK_SUB, lineHeight: 1.2, marginTop: 2 }}>{m.sub}</div>
            </div>
            <div style={{ fontSize: 23, fontWeight: 800, color: i === 2 ? C.red : INK_SUB }}>{m.san}</div>
          </div>
        ))}
        {/* bottom row: footnote + takeaway left, result stamp right */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
            marginTop: 8, borderTop: '2px solid #e9f0fa', paddingTop: 10,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: INK_SUB }}>
              !! = the move everyone skips&ensp;&middot;&ensp;# = shipped&ensp;&middot;&ensp;yes, the knight moves are real
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.black, marginTop: 4 }}>
              Try it this week — pick the task before you pick the tool.
            </div>
          </div>
          <div
            style={{
              border: `3px solid ${C.red}`, color: C.red, fontSize: 16, fontWeight: 800,
              letterSpacing: 1, padding: '6px 14px', borderRadius: 10, transform: 'rotate(-3deg)',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            1–0 &middot; BUSYWORK RESIGNS
          </div>
        </div>
        </div>
      </div>
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 3B. CHESSBOARD VARIATION — CHECKMATE IN 5
// ════════════════════════════════════════════════════════════

function CheckmateCard() {
  const SQ = 102;
  const BL = 132;
  const BT = 290;
  const path = [
    { c: 0, r: 5 }, { c: 2, r: 4 }, { c: 4, r: 3 }, { c: 5, r: 2 }, { c: 6, r: 1 },
  ];
  const king = { c: 7, r: 0 };
  const center = (p: { c: number; r: number }) => ({ x: BL + p.c * SQ + SQ / 2, y: BT + p.r * SQ + SQ / 2 });
  const legend = [
    { t: '1 · the process', color: C.blue },
    { t: '2 · the ingredients', color: C.green },
    { t: '3 · THREE EXAMPLES', color: C.yellow },
    { t: '4 · the recipe', color: C.orange },
    { t: '5 · run + fix + run', color: C.red },
  ];
  return (
    <Shell id="card-3b">
      <Hook title="Checkmate in 5." sub="The busywork never sees it coming." />
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 8 }).map((__, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              position: 'absolute', left: BL + c * SQ, top: BT + r * SQ, width: SQ, height: SQ,
              background: (r + c) % 2 === 0 ? '#ffffff' : '#cfe1f7',
            }}
          />
        ))
      )}
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <marker id="cm-a" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.black} />
          </marker>
          <marker id="cm-r" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.red} />
          </marker>
        </defs>
        {path.slice(0, -1).map((p, i) => {
          const a = center(p);
          const b = center(path[i + 1]);
          return (
            <line
              key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.black} strokeWidth={5}
              strokeDasharray="3 14" strokeLinecap="round" markerEnd="url(#cm-a)" opacity={0.55}
            />
          );
        })}
        <line
          x1={center(path[4]).x} y1={center(path[4]).y} x2={center(king).x - 14} y2={center(king).y + 14}
          stroke={C.red} strokeWidth={6} strokeDasharray="3 14" strokeLinecap="round" markerEnd="url(#cm-r)"
        />
      </svg>
      {path.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: BL + p.c * SQ + 6, top: BT + p.r * SQ + 6, width: SQ - 12, height: SQ - 12,
            background: STEPS[i].color, borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 4px 0 rgba(26,26,26,0.2)',
            fontSize: 44, fontWeight: 800, color: STEPS[i].color === C.yellow ? C.black : '#ffffff',
          }}
        >
          {i + 1}
        </div>
      ))}
      {/* the toppled king */}
      <div
        style={{
          position: 'absolute', left: BL + king.c * SQ, top: BT + king.r * SQ - 6, width: SQ, height: SQ,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 84, color: C.black, transform: 'rotate(62deg)', lineHeight: 1,
        }}
      >
        ♚
      </div>
      <div
        style={{
          position: 'absolute', left: 890, top: 232, background: '#ffffff', border: `3px solid ${C.red}`,
          color: C.red, fontSize: 25, fontWeight: 800, padding: '8px 18px', borderRadius: 999, transform: 'rotate(4deg)',
        }}
      >
        # shipped
      </div>
      {/* legend pills */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 970, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {legend.map((l) => (
          <div
            key={l.t}
            style={{
              background: l.color, color: l.color === C.yellow ? C.black : '#ffffff', fontSize: 27,
              fontWeight: 800, padding: '14px 28px', borderRadius: 999, boxShadow: '0 4px 0 rgba(26,26,26,0.15)',
            }}
          >
            {l.t}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 1115, textAlign: 'center', fontSize: 25, fontWeight: 600, color: INK_SUB, lineHeight: 1.4 }}>
        Move 3 is the only one people get wrong — they describe the work
        <br />
        instead of showing it done well.
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 3C. CHESSBOARD VARIATION — THE KNIGHT'S PATH (full 8x8)
// Board is a true 8x8, light square bottom-right (h1 = white).
// Every step is a legal knight move; arrows are L-shaped.
// ════════════════════════════════════════════════════════════

function PosterBoardCard() {
  const SQ = 135;
  const BT = 270; // board occupies y 270..1350 (8 rows), full width (8 cols)
  // Knight path, (col,row) with row 0 at top of the board:
  // (1,7) -> (2,5) -> (4,4) -> (5,2) -> (7,1) -> ship (5,0). All legal knight moves.
  const path = [
    { c: 1, r: 7 }, { c: 2, r: 5 }, { c: 4, r: 4 }, { c: 5, r: 2 }, { c: 7, r: 1 },
  ];
  const ship = { c: 5, r: 0 };
  const cx = (c: number) => c * SQ + SQ / 2;
  const cy = (r: number) => BT + r * SQ + SQ / 2;
  // L-shaped knight arrows: long leg first, then the short leg.
  const knightPath = (a: { c: number; r: number }, b: { c: number; r: number }) => {
    const vertFirst = Math.abs(b.r - a.r) === 2;
    return vertFirst
      ? `M ${cx(a.c)} ${cy(a.r)} L ${cx(a.c)} ${cy(b.r)} L ${cx(b.c)} ${cy(b.r)}`
      : `M ${cx(a.c)} ${cy(a.r)} L ${cx(b.c)} ${cy(a.r)} L ${cx(b.c)} ${cy(b.r)}`;
  };
  const labels = [
    { title: 'Pick one boring task', sub: 'start here — something you do every week', left: 282, top: 1228, color: C.blue, rot: -1 },
    { title: 'Gather your inputs', sub: 'the emails, files, and notes it uses', left: 300, top: 1092, color: C.green, rot: 1 },
    { title: 'Show 3 examples done well', sub: 'show it — don’t describe it', left: 688, top: 818, color: C.yellow, rot: -1 },
    { title: 'Write the steps in plain words', sub: 'like training a new hire', left: 630, top: 690, color: C.orange, rot: 1 },
    { title: 'Run it. Fix one thing. Repeat.', sub: 'three rounds is usually enough', left: 560, top: 502, color: C.red, rot: -1 },
  ];
  return (
    <Shell id="card-3c">
      {/* header strip */}
      <div style={{ position: 'absolute', left: 64, top: 44, right: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ background: C.black, color: '#ffffff', fontSize: 21, fontWeight: 800, padding: '6px 16px', borderRadius: 999, letterSpacing: 1 }}>
            PART 1
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, color: INK_SUB, letterSpacing: 3, flex: 1 }}>
            INTEGRATING AI INTO YOUR WORK
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MiniRook block={6} />
            <div style={{ fontSize: 20, fontWeight: 700, color: INK_SUB }}>Tyler Schwartz</div>
          </div>
        </div>
        <div style={{ fontSize: 47, fontWeight: 800, color: C.black, lineHeight: 1.1, letterSpacing: -1, marginTop: 14 }}>
          Automate one piece of your work in 5 moves.
        </div>
        <div style={{ fontSize: 25, fontWeight: 500, color: INK_SUB, marginTop: 8 }}>
          The first exercise I run with every client — it gets you thinking in the structure AI needs.
        </div>
      </div>
      {/* full-width 8x8 board — h1 (bottom-right) is light */}
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 8 }).map((__, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              position: 'absolute', left: c * SQ, top: BT + r * SQ, width: SQ, height: SQ,
              background: (r + c) % 2 === 0 ? '#ffffff' : '#cfe1f7',
            }}
          />
        ))
      )}
      {/* L-shaped knight-move arrows */}
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <marker id="kn-a" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.black} />
          </marker>
          <marker id="kn-r" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.red} />
          </marker>
        </defs>
        {path.slice(0, -1).map((p, i) => (
          <path
            key={i} d={knightPath(p, path[i + 1])} fill="none" stroke={C.black} strokeWidth={6}
            strokeDasharray="3 15" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#kn-a)" opacity={0.5}
          />
        ))}
        <path
          d={knightPath(path[4], ship)} fill="none" stroke={C.red} strokeWidth={7}
          strokeDasharray="3 15" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#kn-r)"
        />
      </svg>
      {/* step squares */}
      {path.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: p.c * SQ + 8, top: BT + p.r * SQ + 8, width: SQ - 16, height: SQ - 16,
            background: STEPS[i].color, borderRadius: 20, display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 5px 0 rgba(26,26,26,0.22)',
            fontSize: 54, fontWeight: 800, color: STEPS[i].color === C.yellow ? C.black : '#ffffff',
          }}
        >
          {i + 1}
        </div>
      ))}
      {/* ship square — the final knight move lands here */}
      <div
        style={{
          position: 'absolute', left: ship.c * SQ + 8, top: BT + ship.r * SQ + 8, width: SQ - 16, height: SQ - 16,
          background: C.black, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 5px 0 rgba(26,26,26,0.3)', fontSize: 64, color: '#ffffff', lineHeight: 1,
        }}
      >
        ♞
      </div>
      <div
        style={{
          position: 'absolute', left: 830, top: 300, background: C.black, color: '#ffffff', fontSize: 27,
          fontWeight: 800, padding: '10px 24px', borderRadius: 999, transform: 'rotate(2deg)',
          boxShadow: '0 5px 0 rgba(26,26,26,0.3)',
        }}
      >
        Ship it.
      </div>
      {/* step labels — numbered to match their squares */}
      {labels.map((l, i) => (
        <div
          key={l.title}
          style={{
            position: 'absolute', left: l.left, top: l.top, background: '#ffffff',
            borderRadius: 18, padding: '12px 22px 12px 14px', transform: `rotate(${l.rot}deg)`,
            boxShadow: '0 5px 16px rgba(26,26,26,0.16)', display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div
            style={{
              width: 42, height: 42, borderRadius: 12, background: l.color, flexShrink: 0,
              color: l.color === C.yellow ? C.black : '#ffffff', fontSize: 23, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {i + 1}
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.black, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{l.title}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: INK_SUB, whiteSpace: 'nowrap', marginTop: 2 }}>{l.sub}</div>
          </div>
        </div>
      ))}
      {/* "the step everyone skips" tag on step 3 */}
      <div
        style={{
          position: 'absolute', left: 700, top: 918, background: C.black, color: '#ffffff', fontSize: 19,
          fontWeight: 800, padding: '6px 15px', borderRadius: 999, transform: 'rotate(-2deg)',
        }}
      >
        the step everyone skips
      </div>
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 4. THE METRO MAP
// ════════════════════════════════════════════════════════════

function MetroCard() {
  const stations = [
    { x: 320, y: 420, label: 'Boring Process', side: 'above' },
    { x: 700, y: 420, label: 'Ingredients', side: 'above' },
    { x: 640, y: 670, label: 'Three Examples', side: 'above' },
    { x: 300, y: 670, label: 'The Recipe', side: 'below' },
    { x: 400, y: 920, label: 'First Run', side: 'above' },
  ];
  return (
    <Shell id="card-4">
      <Hook title="The Automation Line." sub="Five stops. One loop. No transfers to a platform." />
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* main line */}
        <path
          d="M 170 420 H 840 Q 910 420 910 490 V 600 Q 910 670 840 670 H 240 Q 170 670 170 740 V 850 Q 170 920 240 920 H 560 M 720 920 H 790 Q 860 920 860 990 V 1070"
          fill="none" stroke={C.blue} strokeWidth={18} strokeLinecap="round"
        />
        {/* iterate loop */}
        <circle cx={640} cy={920} r={62} fill="none" stroke={C.red} strokeWidth={14} strokeDasharray="10 14" strokeLinecap="round" />
      </svg>
      {/* stations */}
      {stations.map((s, i) => (
        <div key={s.label}>
          <div
            style={{
              position: 'absolute', left: s.x - 24, top: s.y - 24, width: 48, height: 48, borderRadius: '50%',
              background: '#ffffff', border: `10px solid ${STEPS[i].color}`, boxSizing: 'border-box',
            }}
          />
          <div
            style={{
              position: 'absolute', left: s.x - 130, top: s.side === 'above' ? s.y - 92 : s.y + 38, width: 260,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 800, color: C.black }}>
              <span style={{ color: STEPS[i].color }}>{i + 1}</span> &middot; {s.label}
            </div>
          </div>
        </div>
      ))}
      {/* loop label */}
      <div style={{ position: 'absolute', left: 520, top: 1010, width: 260, textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.red }}>the Iterate Loop</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: INK_SUB, lineHeight: 1.3 }}>fix one thing, ride again</div>
      </div>
      {/* terminus */}
      <div
        style={{
          position: 'absolute', left: 800, top: 1085, background: C.black, color: '#ffffff', fontSize: 30,
          fontWeight: 800, padding: '16px 30px', borderRadius: 16,
        }}
      >
        Ship It Terminus
      </div>
      <div
        style={{
          position: 'absolute', left: 64, top: 1090, width: 380, background: '#ffffff', border: '2px solid #d7e4f6',
          borderRadius: 16, padding: '18px 22px', fontSize: 21, fontWeight: 600, color: INK_SUB, lineHeight: 1.35,
        }}
      >
        Service notice: trains skipping the <b style={{ color: C.black }}>Three Examples</b> station never reach the terminus.
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 5. THE LEVEL PATH (Duolingo-style, bottom to top)
// ════════════════════════════════════════════════════════════

function LevelPathCard() {
  const nodes: { x: number; y: number; labelSide: 'left' | 'right' }[] = [
    { x: 300, y: 1080, labelSide: 'right' },
    { x: 660, y: 950, labelSide: 'left' },
    { x: 380, y: 815, labelSide: 'right' },
    { x: 700, y: 680, labelSide: 'left' },
    { x: 420, y: 545, labelSide: 'right' },
  ];
  const D = 110;
  return (
    <Shell id="card-5">
      <Hook title="Your first automation is a path, not a leap." sub="Start at the bottom. Five unlocks to shipped." />
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {nodes.slice(0, -1).map((n, i) => {
          const m = nodes[i + 1];
          return (
            <path
              key={i}
              d={`M ${n.x} ${n.y} Q ${(n.x + m.x) / 2 + (i % 2 === 0 ? 70 : -70)} ${(n.y + m.y) / 2} ${m.x} ${m.y}`}
              fill="none" stroke="#b9cdea" strokeWidth={10} strokeDasharray="1 22" strokeLinecap="round"
            />
          );
        })}
        <path
          d={`M ${nodes[4].x} ${nodes[4].y} Q ${(nodes[4].x + 660) / 2 + 70} ${(nodes[4].y + 410) / 2} 660 410`}
          fill="none" stroke="#b9cdea" strokeWidth={10} strokeDasharray="1 22" strokeLinecap="round"
        />
      </svg>
      {nodes.map((n, i) => (
        <div key={i}>
          <div
            style={{
              position: 'absolute', left: n.x - D / 2, top: n.y - D / 2, width: D, height: D, borderRadius: '50%',
              background: STEPS[i].color, boxShadow: '0 8px 0 rgba(26,26,26,0.18)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 46, fontWeight: 800,
              color: STEPS[i].color === C.yellow ? C.black : '#ffffff',
            }}
          >
            {i + 1}
          </div>
          <div
            style={{
              position: 'absolute',
              left: n.labelSide === 'right' ? n.x + D / 2 + 22 : n.x - D / 2 - 22 - 300,
              top: n.y - 34, width: 300,
              textAlign: n.labelSide === 'right' ? 'left' : 'right',
            }}
          >
            <div style={{ fontSize: 27, fontWeight: 800, color: C.black, lineHeight: 1.15 }}>{STEPS[i].title}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: INK_SUB, lineHeight: 1.25, marginTop: 4 }}>{STEPS[i].sub}</div>
          </div>
        </div>
      ))}
      {/* crown node */}
      <div
        style={{
          position: 'absolute', left: 660 - 70, top: 410 - 70, width: 140, height: 140, borderRadius: '50%',
          background: C.black, boxShadow: '0 8px 0 rgba(26,26,26,0.25)',
        }}
      />
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <polygon points="660,365 675,398 711,402 684,426 691,462 660,444 629,462 636,426 609,402 645,398" fill={C.yellow} />
      </svg>
      <div style={{ position: 'absolute', left: 560, top: 282, width: 200, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.black }}>Shipped.</div>
      </div>
      <div
        style={{
          position: 'absolute', left: 190, top: 1145, background: '#ffffff', border: `3px solid ${C.blue}`,
          color: C.blue, fontSize: 23, fontWeight: 800, padding: '8px 20px', borderRadius: 999, transform: 'rotate(-2deg)',
        }}
      >
        START HERE
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 6. THE BOARD GAME
// ════════════════════════════════════════════════════════════

function BoardGameCard() {
  const tiles: { label: string; sub?: string; color: string; ink?: string; n?: number }[] = [
    { label: 'START', sub: 'one boring process', color: C.black },
    { label: 'Pick the process', color: C.blue, n: 1 },
    { label: 'Resist building a platform', sub: 'lose a turn if you don’t', color: '#ffffff', ink: C.black },
    { label: 'Gather ingredients', color: C.green, n: 2 },
    { label: 'Find the spreadsheet', sub: 'it’s in someone’s downloads', color: '#ffffff', ink: C.black },
    { label: 'Show 3 examples', color: C.yellow, n: 3 },
    { label: 'Skipped the examples?', sub: 'go back 2 spaces', color: C.red },
    { label: 'Write the recipe', color: C.orange, n: 4 },
    { label: 'Demo it to a coworker', sub: 'their face is the test', color: '#ffffff', ink: C.black },
    { label: 'Run it', color: C.red, n: 5 },
    { label: 'Fix ONE thing', sub: 'then run it again', color: C.purple },
    { label: 'SHIP IT', sub: 'you win', color: C.black },
  ];
  const TW = 222, TH = 200, GAP = 16;
  const cols = 4;
  const left0 = (1080 - (cols * TW + (cols - 1) * GAP)) / 2;
  const top0 = 320;
  return (
    <Shell id="card-6">
      <Hook title="The Automation Game." sub="Everyone loses the same way: skipping square 6." />
      {tiles.map((t, i) => {
        const row = Math.floor(i / cols);
        const colInRow = i % cols;
        const col = row % 2 === 0 ? colInRow : cols - 1 - colInRow; // snake
        const ink = t.ink ?? (t.color === C.yellow ? C.black : '#ffffff');
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: left0 + col * (TW + GAP), top: top0 + row * (TH + GAP),
              width: TW, height: TH, background: t.color, borderRadius: 20, padding: '18px 18px',
              boxSizing: 'border-box', border: t.color === '#ffffff' ? '3px solid #d7e4f6' : 'none',
              boxShadow: '0 5px 0 rgba(26,26,26,0.15)',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 800, color: ink, opacity: 0.5 }}>{i + 1}</div>
            <div style={{ fontSize: 25, fontWeight: 800, color: ink, lineHeight: 1.1, marginTop: 4 }}>
              {t.n ? <span style={{ opacity: 0.75 }}>Step {t.n}: </span> : null}
              {t.label}
            </div>
            {t.sub && (
              <div style={{ fontSize: 18, fontWeight: 600, color: ink, opacity: 0.75, lineHeight: 1.25, marginTop: 6 }}>{t.sub}</div>
            )}
          </div>
        );
      })}
      {/* die */}
      <div
        style={{
          position: 'absolute', left: 920, top: 1010, width: 84, height: 84, background: '#ffffff',
          border: '3px solid #d7e4f6', borderRadius: 18, transform: 'rotate(12deg)',
          boxShadow: '0 5px 0 rgba(26,26,26,0.12)',
        }}
      >
        {[[20, 20], [54, 20], [37, 37], [20, 54], [54, 54]].map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', left: x - 6, top: y - 6, width: 13, height: 13, borderRadius: '50%', background: C.black }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 64, top: 1035, width: 700, fontSize: 23, fontWeight: 600, color: INK_SUB, lineHeight: 1.35 }}>
        House rule: there is no &ldquo;AI strategy&rdquo; card in this game. You just play the five squares.
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 7. THE PERIODIC TABLE
// ════════════════════════════════════════════════════════════

function PeriodicCard() {
  const els = [
    { sym: 'Bp', name: 'Boring Process', note: 'abundant in every office', color: C.blue, star: false },
    { sym: 'In', name: 'Ingredients', note: 'found in inboxes + sheets', color: C.green, star: false },
    { sym: 'Ex', name: 'Examples', note: 'rare. highly reactive.', color: C.yellow, star: true },
    { sym: 'Re', name: 'Recipe', note: 'plain words only', color: C.orange, star: false },
    { sym: 'It', name: 'Iteration', note: 'stable after 3 cycles', color: C.red, star: false },
  ];
  const TW = 296, TH = 330, GAP = 26;
  return (
    <Shell id="card-7">
      <Hook title="The 5 elements of useful AI." sub="No rare earths. You already have all of these." />
      {els.map((el, i) => {
        const row = i < 3 ? 0 : 1;
        const col = i < 3 ? i : i - 3;
        const rowW = row === 0 ? 3 * TW + 2 * GAP : 2 * TW + GAP;
        const left0 = (1080 - rowW) / 2;
        const ink = el.color === C.yellow ? C.black : '#ffffff';
        return (
          <div
            key={el.sym}
            style={{
              position: 'absolute', left: left0 + col * (TW + GAP), top: 290 + row * (TH + GAP),
              width: TW, height: TH, background: el.color, borderRadius: 24, padding: 26, boxSizing: 'border-box',
              boxShadow: '0 6px 0 rgba(26,26,26,0.18)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: ink, opacity: 0.7 }}>{i + 1}</div>
              {el.star && (
                <div style={{ background: C.black, color: '#ffffff', fontSize: 17, fontWeight: 800, padding: '5px 12px', borderRadius: 999 }}>
                  the whole trick
                </div>
              )}
            </div>
            <div style={{ fontSize: 104, fontWeight: 800, color: ink, lineHeight: 1, marginTop: 8, letterSpacing: -3 }}>{el.sym}</div>
            <div style={{ fontSize: 27, fontWeight: 800, color: ink, marginTop: 14 }}>{el.name}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: ink, opacity: 0.78, lineHeight: 1.25, marginTop: 6 }}>{el.note}</div>
          </div>
        );
      })}
      {/* formula */}
      <div
        style={{
          position: 'absolute', left: 64, right: 64, top: 1050, background: '#ffffff', border: '2px solid #d7e4f6',
          borderRadius: 20, padding: '24px 30px', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 800, color: C.black, letterSpacing: 0.5 }}>
          Bp + In + Ex<sub style={{ fontSize: 20 }}>3</sub> + Re + It&ensp;&rarr;&ensp;an automation that ships
        </div>
        <div style={{ fontSize: 21, fontWeight: 600, color: INK_SUB, marginTop: 8 }}>
          Unstable without Ex<sub style={{ fontSize: 14 }}>3</sub>. Decays into a chatbot demo.
        </div>
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 8. THE STICKY NOTES
// ════════════════════════════════════════════════════════════

function StickyNotesCard() {
  const notes = [
    { x: 95, y: 330, rot: -4, color: C.blue },
    { x: 650, y: 305, rot: 3, color: C.green },
    { x: 360, y: 590, rot: -2, color: C.yellow },
    { x: 95, y: 880, rot: 2, color: C.orange },
    { x: 660, y: 860, rot: -3, color: C.red },
  ];
  const NW = 310, NH = 250;
  return (
    <Shell id="card-8" bg="#ffffff">
      <div style={{ position: 'absolute', inset: 28, border: '4px solid #e2e8f2', borderRadius: 18 }} />
      <div
        style={{
          position: 'absolute', left: 70, top: 80, fontSize: 50, fontWeight: 800, color: C.black,
          transform: 'rotate(-1.5deg)', letterSpacing: -1,
        }}
      >
        the whole &ldquo;AI strategy&rdquo;, one whiteboard:
      </div>
      <svg width={1080} height={1350} viewBox="0 0 1080 1350" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <defs>
          <marker id="sn-a" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 1 1 L 11 6 L 1 11 z" fill={C.black} />
          </marker>
        </defs>
        <path d="M 420 430 C 520 400 560 400 635 415" fill="none" stroke={C.black} strokeWidth={5} strokeLinecap="round" markerEnd="url(#sn-a)" />
        <path d="M 740 570 C 700 630 660 650 600 665" fill="none" stroke={C.black} strokeWidth={5} strokeLinecap="round" markerEnd="url(#sn-a)" />
        <path d="M 380 850 C 330 880 300 890 270 900" fill="none" stroke={C.black} strokeWidth={5} strokeLinecap="round" markerEnd="url(#sn-a)" />
        <path d="M 420 1010 C 520 1050 560 1040 645 1010" fill="none" stroke={C.black} strokeWidth={5} strokeLinecap="round" markerEnd="url(#sn-a)" />
        {/* scrawled circle around note 3 */}
        <ellipse cx={515} cy={710} rx={245} ry={175} fill="none" stroke={C.red} strokeWidth={7} strokeDasharray="34 14" strokeLinecap="round" transform="rotate(-3 515 710)" />
      </svg>
      {notes.map((nt, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: nt.x, top: nt.y, width: NW, height: NH, background: nt.color,
            transform: `rotate(${nt.rot}deg)`, borderRadius: 6, padding: '40px 24px 20px',
            boxSizing: 'border-box', boxShadow: '0 10px 18px rgba(26,26,26,0.18)',
          }}
        >
          <div
            style={{
              position: 'absolute', left: NW / 2 - 55, top: -14, width: 110, height: 30,
              background: 'rgba(255,255,255,0.55)', transform: 'rotate(-2deg)',
            }}
          />
          <div style={{ fontSize: 24, fontWeight: 800, color: nt.color === C.yellow ? C.black : '#ffffff', opacity: 0.65 }}>
            {i + 1}.
          </div>
          <div style={{ fontSize: 29, fontWeight: 800, color: nt.color === C.yellow ? C.black : '#ffffff', lineHeight: 1.15, marginTop: 4 }}>
            {STEPS[i].title}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: nt.color === C.yellow ? C.black : '#ffffff', opacity: 0.8, lineHeight: 1.25, marginTop: 8 }}>
            {STEPS[i].sub}
          </div>
        </div>
      ))}
      <div
        style={{
          position: 'absolute', left: 760, top: 575, fontSize: 34, fontWeight: 800, color: C.red,
          transform: 'rotate(5deg)', lineHeight: 1.05,
        }}
      >
        DON’T<br />SKIP!!
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 9. THE PYRAMID
// ════════════════════════════════════════════════════════════

function PyramidCard() {
  const layers = [
    { w: 360, h: 110, title: '5. Iterate', sub: 'fix one thing, run again', color: C.red },
    { w: 520, h: 110, title: '4. The recipe', sub: 'plain words, new-hire style', color: C.orange },
    { w: 680, h: 110, title: '2. The ingredients', sub: 'emails, sheets, call notes', color: C.green },
    { w: 840, h: 110, title: '1. One boring process', sub: 'something you already do weekly', color: C.blue },
    { w: 952, h: 150, title: '3. Three examples done well', sub: 'THE FOUNDATION — everything above collapses without it', color: C.yellow },
  ];
  let y = 380;
  const positioned = layers.map((l) => {
    const out = { ...l, top: y };
    y += l.h + 10;
    return out;
  });
  return (
    <Shell id="card-9">
      <Hook title="Everything rests on the examples." sub="Skip the foundation and the whole thing is a demo." />
      {/* flag on top */}
      <div style={{ position: 'absolute', left: 538, top: 290, width: 6, height: 90, background: C.black }} />
      <div
        style={{
          position: 'absolute', left: 544, top: 290, background: C.black, color: '#ffffff', fontSize: 23,
          fontWeight: 800, padding: '8px 18px', borderRadius: '0 12px 12px 0',
        }}
      >
        Ship it.
      </div>
      {positioned.map((l) => (
        <div
          key={l.title}
          style={{
            position: 'absolute', left: (1080 - l.w) / 2, top: l.top, width: l.w, height: l.h,
            background: l.color, borderRadius: 18, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 0 rgba(26,26,26,0.16)',
            textAlign: 'center', padding: '0 24px', boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: l.color === C.yellow ? 34 : 28, fontWeight: 800, color: l.color === C.yellow ? C.black : '#ffffff', lineHeight: 1.1 }}>
            {l.title}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: l.color === C.yellow ? C.black : '#ffffff', opacity: 0.8, marginTop: 5, lineHeight: 1.25 }}>
            {l.sub}
          </div>
        </div>
      ))}
      <div
        style={{
          position: 'absolute', left: 64, right: 64, top: 1060, textAlign: 'center', fontSize: 26,
          fontWeight: 600, color: INK_SUB, lineHeight: 1.4,
        }}
      >
        Most &ldquo;AI projects&rdquo; build the top four layers first,
        <br />
        then wonder why it all falls over.
      </div>
      <Footer />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// 10. THE CHALKBOARD EQUATION
// ════════════════════════════════════════════════════════════

function ChalkboardCard() {
  const term = (label: string, color: string) => (
    <span
      style={{
        display: 'inline-block', background: color, color: color === C.yellow ? C.black : '#ffffff',
        fontSize: 34, fontWeight: 800, padding: '12px 26px', borderRadius: 16, margin: '0 6px',
        verticalAlign: 'middle',
      }}
    >
      {label}
    </span>
  );
  const op = (s: string) => (
    <span style={{ fontSize: 46, fontWeight: 800, color: 'rgba(255,255,255,0.85)', margin: '0 8px', verticalAlign: 'middle' }}>{s}</span>
  );
  return (
    <Shell id="card-10" bg={C.black}>
      <div style={{ position: 'absolute', inset: 36, border: '3px solid rgba(255,255,255,0.18)', borderRadius: 20 }} />
      <Hook light title="The only AI equation you need." sub={<span>Solve for &ldquo;actually useful.&rdquo;</span>} />
      <div style={{ position: 'absolute', left: 90, right: 90, top: 340, textAlign: 'center', lineHeight: 2.4 }}>
        {op('(')}
        {term('one boring process', C.blue)}
        {op('+')}
        {term('your ingredients', C.green)}
        {op('+')}
        {term('3 examples done well', C.yellow)}
        {op(')')}
        <br />
        {op('×')}
        {term('a plain-words recipe', C.orange)}
        {op('×')}
        {term('iterate ×3', C.red)}
        <br />
        {op('=')}
        <span style={{ fontSize: 44, fontWeight: 800, color: '#ffffff', verticalAlign: 'middle' }}>
          an automation that ships
        </span>
      </div>
      <div
        style={{
          position: 'absolute', left: 660, top: 620, fontSize: 25, fontWeight: 700, color: C.yellow,
          transform: 'rotate(-3deg)',
        }}
      >
        &uarr; the whole trick
      </div>
      <div
        style={{
          position: 'absolute', left: 90, right: 90, top: 900, borderTop: '2px solid rgba(255,255,255,0.2)',
          paddingTop: 40, textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 30, fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
          Note that <span style={{ color: C.yellow, fontWeight: 800 }}>&ldquo;AI strategy&rdquo;</span> appears nowhere
          in this equation.
          <br />
          Neither does <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>a platform</span>,{' '}
          <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>a task force</span>, or{' '}
          <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>a 40-slide roadmap</span>.
        </div>
      </div>
      <Footer light />
    </Shell>
  );
}

// ════════════════════════════════════════════════════════════
// Gallery page
// ════════════════════════════════════════════════════════════

const CARDS: { label: string; note: string; Comp: () => React.ReactElement }[] = [
  { label: '1 · The Flowchart', note: 'zigzag steps + iterate loop', Comp: FlowchartCard },
  { label: '2 · The Recipe Card', note: 'ingredients + instructions, chef’s note', Comp: RecipeCard },
  { label: '3 · The Chessboard', note: 'on-brand — five squares to shipped', Comp: ChessboardCard },
  { label: '4 · The Metro Map', note: 'five stops, one iterate loop', Comp: MetroCard },
  { label: '5 · The Level Path', note: 'Duolingo-style climb, bottom to top', Comp: LevelPathCard },
  { label: '6 · The Board Game', note: 'snake tiles, penalty square', Comp: BoardGameCard },
  { label: '7 · The Periodic Table', note: '5 elements + a formula', Comp: PeriodicCard },
  { label: '8 · The Sticky Notes', note: 'whiteboard energy, marker arrows', Comp: StickyNotesCard },
  { label: '9 · The Pyramid', note: 'examples are the foundation', Comp: PyramidCard },
  { label: '10 · The Chalkboard', note: 'dark mode, the equation', Comp: ChalkboardCard },
];

const CHESS_VARIANTS: { label: string; note: string; Comp: () => React.ReactElement }[] = [
  { label: '3A · The Scoresheet', note: 'full 8x8 + clarified scoresheet, Ex6!!', Comp: ScoresheetCard },
  { label: '3B · Checkmate in 5', note: 'path ends on a toppled king', Comp: CheckmateCard },
  { label: '3C · The Poster Board', note: 'full-bleed board, chips on squares', Comp: PosterBoardCard },
];

const SCALE = 0.31;
const SCALE_LG = 0.6;

export default function LinkedInAIPostPage() {
  const [copied, setCopied] = useState(false);

  const copyPost = async () => {
    await navigator.clipboard.writeText(POST_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="h-full overflow-auto" style={{ background: '#f0f6ff', fontFamily: 'var(--font-dm-sans), "DM Sans", sans-serif' }}>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-2xl font-extrabold" style={{ color: C.black }}>
          LinkedIn infographics — &ldquo;The Recipe&rdquo; &times; 10
        </h1>
        <p className="mt-1 text-sm font-medium" style={{ color: INK_SUB }}>
          Same framework, 10 layouts. All 1080&times;1350. Screenshot a card&rsquo;s #card-N node at full size to export.
        </p>

        <h2 className="mt-8 text-lg font-extrabold" style={{ color: C.black }}>
          Chessboard variations
        </h2>
        <div className="mt-4 flex flex-col gap-12">
          {CHESS_VARIANTS.map(({ label, note, Comp }) => (
            <div key={label}>
              <div className="mb-3">
                <span className="text-base font-bold" style={{ color: C.black }}>{label}</span>{' '}
                <span className="text-base font-medium" style={{ color: INK_SUB }}>— {note}</span>
              </div>
              <div
                style={{
                  width: 1080 * SCALE_LG,
                  height: 1350 * SCALE_LG,
                  maxWidth: '100%',
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: '0 8px 28px rgba(26,26,26,0.16)',
                }}
              >
                <div style={{ transform: `scale(${SCALE_LG})`, transformOrigin: 'top left' }}>
                  <Comp />
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-lg font-extrabold" style={{ color: C.black }}>
          All 10 concepts
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {CARDS.map(({ label, note, Comp }) => (
            <div key={label}>
              <div className="mb-2">
                <span className="text-sm font-bold" style={{ color: C.black }}>{label}</span>{' '}
                <span className="text-sm font-medium" style={{ color: INK_SUB }}>— {note}</span>
              </div>
              <div
                style={{
                  width: 1080 * SCALE,
                  height: 1350 * SCALE,
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 6px 22px rgba(26,26,26,0.14)',
                }}
              >
                <div style={{ transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
                  <Comp />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The text post */}
        <div className="mt-14 w-full max-w-[520px]">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold" style={{ color: C.black }}>The post text</div>
            <button
              onClick={copyPost}
              className="rounded-full px-4 py-1.5 text-sm font-bold text-white"
              style={{ background: copied ? C.green : C.blue, minHeight: 36 }}
            >
              {copied ? 'Copied' : 'Copy text'}
            </button>
          </div>
          <div className="rounded-2xl bg-white p-5" style={{ border: '2px solid #e3ecf8' }}>
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold text-white"
                style={{ background: C.blue }}
              >
                TS
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.black }}>Tyler Schwartz</div>
                <div className="text-xs" style={{ color: INK_SUB }}>
                  AI automation for real workflows &middot; Built chesspath.app
                </div>
              </div>
            </div>
            <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed" style={{ color: C.black }}>
              {POST_TEXT}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
