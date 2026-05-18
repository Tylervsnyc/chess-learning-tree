import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getMatteBackground, getMatteBoxShadow } from '@/lib/daily-rook-blocks';

export const runtime = 'edge';

// Logo block positions and colors (original Chess Path rook shape)
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

// Grid positions ordered bottom-to-top, left-to-right for puzzle numbering
const GRID_POSITIONS = [
  { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 },
  { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 },
  { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
  { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
  { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
  { x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 },
];

function getBlockColor(x: number, y: number): string {
  const block = LOGO_BLOCKS.find(b => b.x === x && b.y === y);
  return block?.color || '#58CC02';
}

const DEFAULT_RESULTS = [
  true, true, true, false, true,
  true, false, true,
  true, true, true,
  true, false, true,
  true, true, true, true, true,
  true, true, false,
];

function parseResults(resultsParam: string | null): boolean[] {
  if (!resultsParam) return DEFAULT_RESULTS;
  return resultsParam.split(',').map(v => v.trim() === '1');
}

// ── Logo Grid ────────────────────────────────────────────────────────────
function renderLogoGrid(results: boolean[], blockSize: number, spacing: number) {
  const radius = Math.round(blockSize * 0.2);
  const bottomShadow = Math.round(blockSize * 0.06);
  return (
    <div style={{
      display: 'flex',
      position: 'relative',
      width: spacing * 4 + blockSize,
      height: spacing * 5 + blockSize + bottomShadow,
    }}>
      {GRID_POSITIONS.map((pos, i) => {
        const correct = results[i] ?? false;
        const color = getBlockColor(pos.x, pos.y);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: pos.x * spacing,
              top: pos.y * spacing,
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: correct ? getMatteBackground(color) : '#e2e8f0',
              boxShadow: correct
                ? getMatteBoxShadow(color, blockSize / 14)
                : `0 ${bottomShadow}px 0 rgba(0,0,0,0.06)`,
            }}
          >
            <span style={{
              fontSize: Math.round(blockSize * 0.32),
              fontWeight: 900,
              color: correct ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.1)',
              textShadow: correct ? '0 1px 2px rgba(0,0,0,0.25)' : 'none',
            }}>
              {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Small Logo (block icon + wordmark) ───────────────────────────────────
function renderSmallLogo(iconSize: number = 8, fontSize: number = 20) {
  const iconSpacing = Math.round(iconSize * 1.14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(fontSize * 0.4) }}>
      <div style={{
        display: 'flex',
        position: 'relative',
        width: iconSpacing * 4 + iconSize,
        height: iconSpacing * 5 + iconSize,
      }}>
        {LOGO_BLOCKS.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x * iconSpacing,
              top: b.y * iconSpacing,
              width: iconSize,
              height: iconSize,
              borderRadius: Math.max(2, Math.round(iconSize * 0.2)),
              background: getMatteBackground(b.color),
              boxShadow: getMatteBoxShadow(b.color, iconSize / 14),
              display: 'flex',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span style={{ color: '#2A3C45', fontWeight: 700, fontSize }}>chess</span>
        <span style={{
          fontWeight: 700,
          fontSize,
          backgroundImage: 'linear-gradient(90deg, #FFC800 0%, #FFC800 20%, #FF6B6B 40%, #FF6B6B 55%, #1CB0F6 75%, #1CB0F6 100%)',
          backgroundClip: 'text',
          color: 'transparent',
        }}>path</span>
      </div>
    </div>
  );
}

interface LayoutProps {
  results: boolean[];
  score: string;
  timeFormatted: string;
  globalPct: number | null;
  name: string;
}

// Helper: top percent display
function topPct(globalPct: number | null): number {
  if (globalPct === null || globalPct <= 0) return 0;
  return 100 - globalPct < 1 ? 1 : 100 - globalPct;
}

const FRAME_STYLE = { width: 1200, height: 630, display: 'flex' as const, background: '#eef6fc', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative' as const };

// ── Shared top section: logo, title, tagline, pills ──────────────────────
function renderTopSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {renderSmallLogo(8, 18)}

      <span style={{ fontSize: 54, fontWeight: 900, color: '#2A3C45', letterSpacing: -1, lineHeight: 1.05, marginTop: 12 }}>
        The Daily Rook
      </span>
      <span style={{ fontSize: 22, fontWeight: 600, color: 'rgba(42,60,69,0.5)', marginTop: 6, fontStyle: 'italic' }}>
        Build the rook. Improve at chess.
      </span>

      {/* Rules as big bold pills */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 18px', borderRadius: 24, background: 'rgba(28,176,246,0.12)', display: 'flex' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1CB0F6' }}>22 puzzles</span>
        </div>
        <div style={{ padding: '8px 18px', borderRadius: 24, background: 'rgba(255,150,0,0.12)', display: 'flex' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#FF9600' }}>5 minutes</span>
        </div>
        <div style={{ padding: '8px 18px', borderRadius: 24, background: 'rgba(255,107,107,0.12)', display: 'flex' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#FF6B6B' }}>3 lives</span>
        </div>
        <div style={{ padding: '8px 18px', borderRadius: 24, background: 'rgba(165,96,232,0.12)', display: 'flex' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#A560E8' }}>Easy → Hard</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 1: "Clean Line"
// No card — just score big, name/time/rank on a single clean line below.
// Minimal, lets the pills + grid do the talking.
// ═══════════════════════════════════════════════════════════════════════════
function renderLayout1({ results, score, timeFormatted, globalPct, name }: LayoutProps) {
  return (
    <div style={FRAME_STYLE}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 5, background: 'linear-gradient(90deg, #FF9600, #FF6B6B, #A560E8)', display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px 0 52px', width: 550 }}>
        {renderTopSection()}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 22 }}>
          <span style={{ fontSize: 72, fontWeight: 900, color: '#FF9600', lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: 'rgba(255,150,0,0.35)' }}>/22</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#2A3C45' }}>{name}</span>
          <div style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)', display: 'flex' }} />
          <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(42,60,69,0.4)' }}>{timeFormatted}</span>
          {globalPct !== null && globalPct > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)', display: 'flex' }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#46A302' }}>Top {topPct(globalPct)}%</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 650 }}>
        {renderLogoGrid(results, 74, 80)}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 1200, height: 32, background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, letterSpacing: 0.5 }}>chesspath.app</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 2: "Scoreboard"
// ═══════════════════════════════════════════════════════════════════════════
function renderLayout2({ results, score, timeFormatted, globalPct, name }: LayoutProps) {
  return (
    <div style={FRAME_STYLE}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 5, background: 'linear-gradient(90deg, #FF9600, #FF6B6B, #A560E8)', display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px 0 52px', width: 550 }}>
        {renderTopSection()}
        <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
          <div style={{ padding: '10px 20px', borderRadius: 24, background: 'rgba(255,150,0,0.15)', display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#FF9600' }}>{score}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,150,0,0.5)' }}>/22</span>
          </div>
          <div style={{ padding: '10px 20px', borderRadius: 24, background: 'rgba(42,60,69,0.06)', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#2A3C45' }}>{name}</span>
          </div>
          <div style={{ padding: '10px 20px', borderRadius: 24, background: 'rgba(42,60,69,0.06)', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(42,60,69,0.5)' }}>{timeFormatted}</span>
          </div>
          {globalPct !== null && globalPct > 0 && (
            <div style={{ padding: '10px 20px', borderRadius: 24, background: 'rgba(88,204,2,0.12)', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#46A302' }}>Top {topPct(globalPct)}%</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 650 }}>
        {renderLogoGrid(results, 74, 80)}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 1200, height: 32, background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, letterSpacing: 0.5 }}>chesspath.app</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 3: "White Card"
// ═══════════════════════════════════════════════════════════════════════════
function renderLayout3({ results, score, timeFormatted, globalPct, name }: LayoutProps) {
  return (
    <div style={FRAME_STYLE}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 5, background: 'linear-gradient(90deg, #FF9600, #FF6B6B, #A560E8)', display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px 0 52px', width: 550 }}>
        {renderTopSection()}
        <div style={{
          marginTop: 20,
          padding: '20px 24px',
          borderRadius: 18,
          background: '#ffffff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          border: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 56, fontWeight: 900, color: '#FF9600', lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,150,0,0.35)' }}>/22</span>
            </div>
            {globalPct !== null && globalPct > 0 && (
              <div style={{ padding: '6px 16px', borderRadius: 20, background: 'rgba(88,204,2,0.12)', display: 'flex' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#46A302' }}>Top {topPct(globalPct)}%</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#2A3C45' }}>{name}</span>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)', display: 'flex' }} />
            <span style={{ fontSize: 17, fontWeight: 600, color: 'rgba(42,60,69,0.4)' }}>in {timeFormatted}</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 650 }}>
        {renderLogoGrid(results, 74, 80)}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 1200, height: 32, background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, letterSpacing: 0.5 }}>chesspath.app</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 4: "Challenge"
// ═══════════════════════════════════════════════════════════════════════════
function renderLayout4({ results, score, timeFormatted, globalPct, name }: LayoutProps) {
  return (
    <div style={FRAME_STYLE}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 5, background: 'linear-gradient(90deg, #FF9600, #FF6B6B, #A560E8)', display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px 0 52px', width: 550 }}>
        {renderTopSection()}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 22 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: '#2A3C45', lineHeight: 1.2 }}>
            {name} got <span style={{ color: '#FF9600' }}>{score}</span> in {timeFormatted}
          </span>
          {globalPct !== null && globalPct > 0 && (
            <span style={{ fontSize: 18, fontWeight: 700, color: '#46A302' }}>
              Top {topPct(globalPct)}% of all players
            </span>
          )}
          <span style={{ fontSize: 20, fontWeight: 800, color: '#1CB0F6', marginTop: 6 }}>
            Can you beat that?
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 650 }}>
        {renderLogoGrid(results, 74, 80)}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 1200, height: 32, background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, letterSpacing: 0.5 }}>chesspath.app</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT 5: "Score Circle"
// ═══════════════════════════════════════════════════════════════════════════
function renderLayout5({ results, score, timeFormatted, globalPct, name }: LayoutProps) {
  return (
    <div style={FRAME_STYLE}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 5, background: 'linear-gradient(90deg, #FF9600, #FF6B6B, #A560E8)', display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 36px 0 52px', width: 550 }}>
        {renderTopSection()}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 22 }}>
          <div style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            background: 'linear-gradient(135deg, #FF9600, #FF6B6B)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 0 rgba(255,107,107,0.4)',
          }}>
            <span style={{ fontSize: 38, fontWeight: 900, color: '#fff' }}>{score}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#2A3C45' }}>{name}</span>
            <span style={{ fontSize: 17, fontWeight: 600, color: 'rgba(42,60,69,0.4)' }}>
              {score}/22 in {timeFormatted}
            </span>
            {globalPct !== null && globalPct > 0 && (
              <span style={{ fontSize: 16, fontWeight: 700, color: '#46A302' }}>
                Top {topPct(globalPct)}%
              </span>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 650 }}>
        {renderLogoGrid(results, 74, 80)}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 1200, height: 32, background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 12, letterSpacing: 0.5 }}>chesspath.app</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STORY LAYOUT: 9:16 (1080×1920) — Instagram Stories / texting
// V3 "Score + Divider" format per RULES.md Section 31
// ═══════════════════════════════════════════════════════════════════════════
function renderStoryLayout({ results, score, timeFormatted, globalPct, name }: LayoutProps) {
  const lives = results.filter(r => !r).length;
  const heartsRemaining = Math.max(0, 3 - lives);
  // Content width — pills, title, and results card all share this width
  const contentWidth = 936;

  return (
    <div style={{
      width: 1080,
      height: 1920,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: '#eef6fc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
    }}>
      {/* Top gradient bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1080, height: 8, background: 'linear-gradient(90deg, #FF9600, #FF6B6B, #A560E8, #1CB0F6)', display: 'flex' }} />

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 72px 0', width: '100%' }}>
        {/* Logo */}
        {renderSmallLogo(12, 28)}

        {/* Title pill — compact, flush with content width */}
        <div style={{
          marginTop: 40,
          width: contentWidth,
          padding: '14px 0',
          borderRadius: 16,
          border: '2px solid rgba(255,150,0,0.3)',
          background: 'linear-gradient(135deg, rgba(255,150,0,0.1), rgba(255,107,107,0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 6,
            backgroundImage: 'linear-gradient(90deg, #FF9600, #FF6B6B, #FF9600)',
            backgroundClip: 'text',
            color: 'transparent',
          }}>THE DAILY ROOK</span>
        </div>

        {/* Tagline */}
        <span style={{ fontSize: 26, fontWeight: 900, color: '#6b7c8a', fontStyle: 'italic', marginTop: 14 }}>
          Build the Rook. Improve at Chess.
        </span>

        {/* Date */}
        <span style={{ fontSize: 20, color: '#6b7c8a', marginTop: 14 }}>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>

        {/* Rule pills — flush row filling content width */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28, width: contentWidth }}>
          {[
            { label: '22 puzzles', color: '#1CB0F6' },
            { label: '5 min', color: '#FF9600' },
            { label: '3 lives', color: '#FF6B6B' },
            { label: 'Easy → Hard', color: '#A560E8' },
          ].map(pill => (
            <div key={pill.label} style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 24,
              background: `${pill.color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: pill.color }}>{pill.label}</span>
            </div>
          ))}
        </div>

        {/* Score + Divider card — flush with pills */}
        <div style={{
          marginTop: 16,
          width: contentWidth,
          padding: '36px 40px',
          borderRadius: 24,
          background: '#ffffff',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}>
          {/* Left: score */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 72, fontWeight: 900, color: '#FF9600', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'rgba(42,60,69,0.5)', marginTop: 4 }}>SOLVED</span>
          </div>

          {/* Divider */}
          <div style={{ width: 2, alignSelf: 'stretch', background: '#dce8f0', display: 'flex' }} />

          {/* Right: info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#2A3C45' }}>{name}</span>
              {/* Hearts */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <svg key={i} width="28" height="28" viewBox="0 0 24 24" fill={i < heartsRemaining ? '#FF4B4B' : '#c5d4de'}>
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: '#6b7c8a' }}>{timeFormatted}</span>
              {globalPct !== null && globalPct > 0 && (
                <span style={{ fontSize: 26, fontWeight: 900, color: '#46A302' }}>Beat {globalPct}%</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rook grid — tight to results card, bigger to fill space */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 36 }}>
        {renderLogoGrid(results, 130, 143)}
      </div>

      {/* Spacer pushes footer down */}
      <div style={{ flex: 1, display: 'flex' }} />

      {/* Footer */}
      <div style={{ padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'rgba(0,0,0,0.15)', fontSize: 18, letterSpacing: 1 }}>chesspath.app</span>
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const score = searchParams.get('score') || '0';
  const time = searchParams.get('time') || '0';
  const rank = searchParams.get('rank');
  const total = searchParams.get('total');
  const resultsParam = searchParams.get('results');
  const variantParam = searchParams.get('variant') || '3';
  const format = searchParams.get('format') || 'og';
  const name = searchParams.get('name') || 'Player';

  const results = parseResults(resultsParam);
  const variant = parseInt(variantParam) || 1;

  const timeMs = parseInt(time);
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeFormatted = minutes === 0 ? `${seconds}s` : `${minutes}:${seconds.toString().padStart(2, '0')}`;

  let globalPct: number | null = null;
  if (rank && total) {
    const rankNum = parseInt(rank);
    const totalNum = parseInt(total);
    if (totalNum > 1) {
      globalPct = Math.round(((totalNum - rankNum) / totalNum) * 100);
    }
  }

  const props: LayoutProps = { results, score, timeFormatted, globalPct, name };

  // Story format: 9:16 (1080×1920) for Instagram/texting
  if (format === 'story') {
    return new ImageResponse(renderStoryLayout(props), { width: 1080, height: 1920 });
  }

  // OG format: landscape (1200×630) for link previews
  let content;
  switch (variant) {
    case 2: content = renderLayout2(props); break;
    case 3: content = renderLayout3(props); break;
    case 4: content = renderLayout4(props); break;
    case 5: content = renderLayout5(props); break;
    case 1: default: content = renderLayout1(props); break;
  }

  return new ImageResponse(content, { width: 1200, height: 630 });
}
