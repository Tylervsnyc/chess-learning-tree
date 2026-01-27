'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CURRICULUM_V2_CONFIG } from '@/data/curriculum-v2-config';

// Types
type PieceType = 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn' | 'star';
type LessonStatus = 'completed' | 'current' | 'locked';

// Demo lessons for the preview
const DEMO_LESSONS = [
  { id: '1', name: 'Mate in 1', status: 'completed' as LessonStatus, piece: 'knight' as PieceType },
  { id: '2', name: 'Back Rank', status: 'completed' as LessonStatus, piece: 'queen' as PieceType },
  { id: '3', name: 'The Fork', status: 'current' as LessonStatus, piece: 'rook' as PieceType },
  { id: '4', name: 'Pin Tactics', status: 'locked' as LessonStatus, piece: 'bishop' as PieceType },
  { id: '5', name: 'Skewer', status: 'locked' as LessonStatus, piece: 'pawn' as PieceType },
];

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function darkenColor(hex: string, amount: number = 0.25): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) * (1 - amount));
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) * (1 - amount));
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) * (1 - amount));
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

// ============================================================================
// SIMPLE, CLEAN BACKGROUNDS - Duolingo Style
// Light colors, minimal design, let the UI shine
// ============================================================================

interface BackgroundOption {
  id: string;
  name: string;
  description: string;
  component: React.FC;
}

// 1. SOFT MINT - Clean light green, very Duolingo
function SoftMintBackground() {
  return (
    <div className="absolute inset-0 bg-[#e5f5e8]" />
  );
}

// 2. WARM CREAM - Soft warm neutral
function WarmCreamBackground() {
  return (
    <div className="absolute inset-0 bg-[#faf8f3]" />
  );
}

// 3. SKY LIGHT - Very light blue, airy
function SkyLightBackground() {
  return (
    <div className="absolute inset-0 bg-[#eef6fc]" />
  );
}

// 4. SAGE WASH - Muted sage green with subtle gradient
function SageWashBackground() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, #e8f0e6 0%, #dce8da 100%)'
      }}
    />
  );
}

// 5. PEARL - Clean white with just a hint of warmth
function PearlBackground() {
  return (
    <div className="absolute inset-0 bg-[#fefefe]" />
  );
}

const BACKGROUNDS: BackgroundOption[] = [
  { id: 'mint', name: 'Soft Mint', description: 'Clean light green', component: SoftMintBackground },
  { id: 'cream', name: 'Warm Cream', description: 'Soft warm neutral', component: WarmCreamBackground },
  { id: 'sky', name: 'Sky Light', description: 'Airy light blue', component: SkyLightBackground },
  { id: 'sage', name: 'Sage Wash', description: 'Muted green gradient', component: SageWashBackground },
  { id: 'pearl', name: 'Pearl', description: 'Clean bright white', component: PearlBackground },
];

// ============================================================================
// LESSON BUTTON COMPONENTS (from curriculum design)
// ============================================================================

// Chess piece icon paths
type CircleElement = { type: 'circle'; cx: number; cy: number; r: number };
type PathElement = { type: 'path'; d: string };
type PolygonElement = { type: 'polygon'; points: string };
type PieceElement = CircleElement | PathElement | PolygonElement;

const PIECE_PATHS: Record<PieceType, { viewBox: string; elements: PieceElement[] }> = {
  queen: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'circle', cx: 6, cy: 12, r: 3 },
      { type: 'circle', cx: 14, cy: 9, r: 3 },
      { type: 'circle', cx: 22.5, cy: 8, r: 3 },
      { type: 'circle', cx: 31, cy: 9, r: 3 },
      { type: 'circle', cx: 39, cy: 12, r: 3 },
      { type: 'path', d: 'M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z' },
      { type: 'path', d: 'M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z' },
    ],
  },
  rook: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M9 39h27v-3H9v3zM12 36v-4h21v4H12zM14 29.5v-13h17v13H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11zM12.5 32l1.5-2.5h17l1.5 2.5z' },
    ],
  },
  bishop: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z' },
      { type: 'path', d: 'M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z' },
      { type: 'circle', cx: 22.5, cy: 8, r: 3 },
    ],
  },
  knight: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21' },
      { type: 'path', d: 'M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3' },
    ],
  },
  pawn: {
    viewBox: '0 0 45 45',
    elements: [
      { type: 'path', d: 'M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z' },
    ],
  },
  star: {
    viewBox: '0 0 24 24',
    elements: [
      { type: 'polygon', points: '12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26' },
    ],
  },
};

function renderPieceElements(piece: PieceType, fill: string, transform?: string) {
  const data = PIECE_PATHS[piece];
  return data.elements.map((el, i) => {
    if (el.type === 'circle') {
      return <circle key={i} fill={fill} transform={transform} cx={el.cx} cy={el.cy} r={el.r} />;
    } else if (el.type === 'path') {
      return <path key={i} fill={fill} transform={transform} d={el.d} />;
    } else if (el.type === 'polygon') {
      return <polygon key={i} fill={fill} transform={transform} points={el.points} />;
    }
    return null;
  });
}

function getIconLongShadow(piece: PieceType, color: string, size: number) {
  const data = PIECE_PATHS[piece];
  const layers = 4;

  return (
    <svg width={size} height={size} viewBox={data.viewBox}>
      {Array.from({ length: layers }).map((_, i) => (
        <g key={i} opacity={0.15 - i * 0.03}>
          {renderPieceElements(piece, '#000', `translate(${(layers - i) * 0.8}, ${(layers - i) * 0.8})`)}
        </g>
      ))}
      <g>{renderPieceElements(piece, color)}</g>
    </svg>
  );
}

function LockIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function Sparkles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
      <div
        className="absolute w-2 h-2"
        style={{
          top: '15%',
          left: '20%',
          animation: 'sparkle 2s ease-in-out infinite',
          animationDelay: '0s',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"/>
        </svg>
      </div>
      <div
        className="absolute w-1.5 h-1.5"
        style={{
          top: '60%',
          right: '15%',
          animation: 'sparkle 2s ease-in-out infinite',
          animationDelay: '0.7s',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"/>
        </svg>
      </div>
      <div
        className="absolute w-1 h-1"
        style={{
          top: '30%',
          right: '25%',
          animation: 'sparkle-2 1.5s ease-in-out infinite',
          animationDelay: '1.2s',
        }}
      >
        <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-full h-full">
          <circle cx="12" cy="12" r="12"/>
        </svg>
      </div>
    </div>
  );
}

function LessonButton({
  lesson,
  sectionColor,
}: {
  lesson: typeof DEMO_LESSONS[0];
  sectionColor: string;
}) {
  const size = CURRICULUM_V2_CONFIG.buttonSize;
  const depthY = CURRICULUM_V2_CONFIG.buttonDepthY;
  const depthX = CURRICULUM_V2_CONFIG.buttonDepthX;

  const isCompleted = lesson.status === 'completed';
  const isCurrent = lesson.status === 'current';
  const isLocked = lesson.status === 'locked';

  let topColor: string;
  let bottomColor: string;
  let iconColor: string;

  if (isCompleted) {
    topColor = CURRICULUM_V2_CONFIG.completedColor;
    bottomColor = CURRICULUM_V2_CONFIG.completedDarkColor;
    iconColor = '#B8860B';
  } else if (isLocked) {
    topColor = CURRICULUM_V2_CONFIG.lockedColor;
    bottomColor = CURRICULUM_V2_CONFIG.lockedDarkColor;
    iconColor = '#9CA3AF';
  } else {
    topColor = sectionColor;
    bottomColor = darkenColor(sectionColor, 0.35);
    iconColor = 'white';
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative ${isLocked ? 'opacity-60' : ''}`}
        style={{ width: size + depthX, height: size + depthY }}
      >
        {/* Pulse ring for current */}
        {isCurrent && (
          <>
            <div
              className="absolute rounded-full"
              style={{
                width: CURRICULUM_V2_CONFIG.ringSize,
                height: CURRICULUM_V2_CONFIG.ringSize,
                top: (size - CURRICULUM_V2_CONFIG.ringSize) / 2 + depthY / 2,
                left: (size - CURRICULUM_V2_CONFIG.ringSize) / 2 + depthX / 2,
                border: `3px solid ${sectionColor}`,
                opacity: 0.6,
                animation: 'pulse-ring-scale 1.5s ease-in-out infinite',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: size + 12,
                height: size + 12,
                top: -3 + depthY / 2,
                left: -3 + depthX / 2,
                border: `2px solid ${sectionColor}`,
                opacity: 0.4,
              }}
            />
          </>
        )}

        {/* Bottom edge - 3D shadow */}
        <div
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            top: depthY,
            left: depthX,
            backgroundColor: bottomColor,
          }}
        />

        {/* Top face */}
        <div
          className="absolute rounded-full flex items-center justify-center overflow-hidden"
          style={{
            width: size,
            height: size,
            top: 0,
            left: 0,
            backgroundColor: topColor,
          }}
        >
          {isCompleted && CURRICULUM_V2_CONFIG.showSparkles && <Sparkles />}
          {isLocked ? (
            <LockIcon size={30} color={iconColor} />
          ) : (
            getIconLongShadow(lesson.piece, iconColor, CURRICULUM_V2_CONFIG.iconSize)
          )}
        </div>
      </div>

      {/* Lesson name below button */}
      <div
        className={`mt-2 text-xs text-center max-w-[120px] leading-tight font-semibold ${
          isLocked ? 'text-[#afafaf]' : 'text-[#4b4b4b]'
        }`}
      >
        {lesson.name}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function TestBackgroundsPage() {
  const [selectedBg, setSelectedBg] = useState(0);
  const sectionColor = CURRICULUM_V2_CONFIG.moduleColors[0]; // Green

  const SelectedBackground = BACKGROUNDS[selectedBg].component;

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes sparkle-2 {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes pulse-ring-scale {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 0.4; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-[#1A2C35]/90 backdrop-blur-sm border-b border-white/10 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Link href="/" className="text-white/60 hover:text-white">
            <ChevronLeft />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Simple Backgrounds</h1>
            <p className="text-xs text-white/50">Clean, light colors - Duolingo style</p>
          </div>
        </div>
      </div>

      {/* Preview Area with Selected Background */}
      <div className="relative min-h-[70vh] overflow-hidden">
        <SelectedBackground />

        {/* Path Preview Content */}
        <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[#3c3c3c]">
              Section 1: First Strikes
            </h2>
            <p className="text-sm text-[#6b6b6b]">
              Master the basics of checkmate
            </p>
          </div>

          {/* Lesson Path - Zigzag Pattern */}
          <div className="flex flex-col items-center">
            {DEMO_LESSONS.map((lesson, index) => {
              // Zigzag pattern: -50, 0, 50, 0
              const patternPosition = index % 4;
              let xOffset = 0;
              if (patternPosition === 0) xOffset = -50;
              else if (patternPosition === 1) xOffset = 0;
              else if (patternPosition === 2) xOffset = 50;
              else xOffset = 0;

              return (
                <div
                  key={lesson.id}
                  className="mb-6"
                  style={{ transform: `translateX(${xOffset}px)` }}
                >
                  <LessonButton
                    lesson={lesson}
                    sectionColor={sectionColor}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Background Selector */}
      <div className="sticky bottom-0 bg-[#0D1A1F] border-t border-white/10 p-4">
        <h3 className="text-sm font-semibold mb-3 text-white/70">Select Background</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {BACKGROUNDS.map((bg, index) => (
            <button
              key={bg.id}
              onClick={() => setSelectedBg(index)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all ${
                selectedBg === index
                  ? 'bg-[#58CC02] text-white'
                  : 'bg-[#1A2C35] text-white/70 hover:bg-[#243a45]'
              }`}
            >
              <div className="text-sm font-medium whitespace-nowrap">{bg.name}</div>
              <div className={`text-xs mt-0.5 whitespace-nowrap ${selectedBg === index ? 'text-white/80' : 'text-white/40'}`}>
                {bg.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
