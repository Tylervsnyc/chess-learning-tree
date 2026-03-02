'use client'

import { use, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Chess } from 'chess.js'
import { getOpeningBySlug, PIECE_SVGS } from '@/data/openings/registry'
import type { OpeningConfig } from '@/data/openings/registry'
import { ChessPathBoard } from '@/components/puzzle/ChessPathBoard'

/** Parse registry moves like "1.e4 e5 2.Nf3 Nc6 3.Bc4" → FEN + last move squares */
function parseOpeningMoves(movesStr: string) {
  const chess = new Chess()
  let lastFrom = ''
  let lastTo = ''

  const tokens = movesStr.split(/\s+/)
  for (const token of tokens) {
    // Strip move numbers like "1." "2." etc.
    const san = token.replace(/^\d+\.+/, '')
    if (!san) continue
    try {
      const result = chess.move(san)
      if (result) {
        lastFrom = result.from
        lastTo = result.to
      }
    } catch {
      // skip unparseable tokens
    }
  }

  return { fen: chess.fen(), lastFrom, lastTo }
}

// SVG Piece Icon Component
function PieceIcon({
  type,
  size = 26,
  className = '',
}: {
  type: string
  size?: number
  className?: string
}) {
  const svg = PIECE_SVGS[type as keyof typeof PIECE_SVGS]
  if (!svg) return null

  return (
    <svg
      viewBox={svg.viewBox}
      width={size}
      height={size}
      className={`flex-shrink-0 ${className}`}
      fill="white"
    >
      {/* Main paths */}
      {svg.paths?.map((path: string, i: number) => (
        <path key={`path-${i}`} d={path} />
      ))}
      {/* Circles (bishop) */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {('circles' in svg) && ((svg as any).circles as readonly {cx: number; cy: number; r: number}[])?.map((circle, i) => (
        <circle key={`circle-${i}`} cx={circle.cx} cy={circle.cy} r={circle.r} />
      ))}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {('extraPaths' in svg) && ((svg as any).extraPaths as readonly string[])?.map((path, i) => (
        <path key={`extra-${i}`} d={path} />
      ))}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {('polygons' in svg) && ((svg as any).polygons as readonly {points: string}[])?.map((polygon, i) => (
        <polygon key={`polygon-${i}`} points={polygon.points} />
      ))}
    </svg>
  )
}

// 3D Puck Component
function Puck3D({
  icon,
  size = 52,
  opening,
}: {
  icon: string
  size?: number
  opening: OpeningConfig
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      className="relative rounded-full flex items-center justify-center"
    >
      {/* Shadow base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(0, 0, 0, 0.1))`,
          pointerEvents: 'none',
        }}
      />
      {/* Main gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 50%, ${opening.colorLight} 100%)`,
          opacity: 0.9,
        }}
      />
      {/* Face highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.2), transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      {/* Icon */}
      <div className="relative z-10">
        <PieceIcon type={icon} size={size === 52 ? 26 : 18} />
      </div>
    </div>
  )
}

// Main Page Component
export default function OpeningDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const opening = getOpeningBySlug(slug)

  const board = useMemo(
    () => (opening ? parseOpeningMoves(opening.moves) : null),
    [opening],
  )

  if (!opening) {
    return (
      <div className="min-h-screen bg-chess-page flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Opening not found
          </h1>
          <button
            onClick={() => router.push('/openings')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-lg">←</span>
            <span className="font-medium text-sm">Back</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="overflow-auto"
      style={{
        minHeight: '100vh',
        backgroundColor: '#eef6fc',
      }}
    >
      {/* Back button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => router.push('/openings')}
          className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <span className="text-lg text-chess-text">←</span>
          <span className="text-xs font-medium text-chess-text/60">Back</span>
        </button>
      </div>

      {/* Sticky 3D Floating Header */}
      <div className="sticky top-2 z-40 px-4 py-2 mb-6">
        <div className="relative">
          {/* Back layers for 3D depth */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              backgroundColor: opening.color,
              transform: 'translate(8px, 8px)',
              opacity: 0.25,
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              backgroundColor: opening.color,
              transform: 'translate(4px, 4px)',
              opacity: 0.45,
            }}
          />

          {/* Main card */}
          <div
            className="relative rounded-2xl p-4 border-2 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 40%, ${opening.colorLight} 100%)`,
              borderColor: opening.colorDark,
              boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
            }}
          >
            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.08) 50%)`,
                borderTopRightRadius: '1rem',
              }}
            />

            <div className="flex items-center gap-4 relative z-10">
              {/* Board preview */}
              {board && (
                <div
                  className="flex-shrink-0"
                  style={{
                    width: 140,
                    height: 140,
                  }}
                >
                  <ChessPathBoard
                    options={{
                      position: board.fen,
                      allowDragging: false,
                      showAnimations: false,
                      showNotation: false,
                      boardOrientation: opening.side === 'black' ? 'black' : 'white',
                      squareStyles: {
                        [board.lastFrom]: { backgroundColor: 'rgba(255, 170, 0, 0.5)' },
                        [board.lastTo]: { backgroundColor: 'rgba(255, 170, 0, 0.6)' },
                      },
                      boardStyle: {
                        borderRadius: '0px',
                        boxShadow: 'none',
                      },
                    }}
                  />
                </div>
              )}

              {/* Copy */}
              <div className="flex-1 min-w-0">
                <h1 className="text-[20px] font-[900] leading-tight mb-1.5 text-white">
                  {opening.name}
                </h1>
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-2"
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                >
                  <span className="font-mono text-[10px] text-white/80 tracking-wider">
                    {opening.moves}
                  </span>
                </div>
                <p className="text-[12px] text-white/80 leading-relaxed">
                  {opening.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 py-8 max-w-2xl mx-auto">
        {/* Main Line Section */}
        <div className="mb-10">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Main Line
          </div>

          <button
            onClick={() => router.push(`/openings/${slug}/tree`)}
            style={{
              background: `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 40%, ${opening.colorLight} 100%)`,
            }}
            className="w-full rounded-[18px] p-6 text-white flex items-center justify-between gap-4 active:scale-[0.97] transition-transform"
          >
            {/* Left side: puck + text */}
            <div className="flex items-center gap-4 flex-1">
              <Puck3D icon={opening.icon} size={52} opening={opening} />
              <div className="text-left min-w-0">
                <h3 className="font-bold text-base leading-tight">
                  {opening.mainLine.name}
                </h3>
                <p className="text-[11px] text-white/70 mt-1">
                  {opening.mainLine.subtitle}
                </p>
              </div>
            </div>

            {/* Right arrow */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-lg">→</span>
            </div>
          </button>
        </div>

        {/* Variations Section */}
        {opening.variations.length > 0 && (
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Variations
            </div>

            <div className="space-y-3">
              {opening.variations.map((variation, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    variation.hasData &&
                    router.push(`/openings/${slug}/tree`)
                  }
                  disabled={!variation.hasData}
                  style={{
                    opacity: variation.hasData ? 1 : 0.5,
                    pointerEvents: variation.hasData ? 'auto' : 'none',
                  }}
                  className="w-full bg-white rounded-[14px] p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow disabled:hover:shadow-sm"
                >
                  {/* Left: puck + text */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Puck3D icon={variation.icon} size={36} opening={opening} />
                    <div className="text-left min-w-0">
                      <h4 className="font-bold text-[14px] text-gray-900 truncate">
                        {variation.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                        {variation.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: arrow or "Coming Soon" */}
                  {variation.hasData ? (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">→</span>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 px-2 py-1 rounded-full bg-[#f0f4f8]">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
