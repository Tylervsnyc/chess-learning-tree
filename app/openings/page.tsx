'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  OPENINGS_REGISTRY,
  PIECE_SVGS,
  type OpeningConfig,
} from '@/data/openings/registry'
import { useOpeningProgress } from '@/hooks/useOpeningProgress'
import { getLessonCount, TREE_LOOKUP } from '@/lib/opening-trees'

type TabName = 'my-openings' | 'library'

// PieceIcon component — renders SVG piece from registry
function PieceIcon({
  icon,
  size = 40,
  color = '#ffffff',
}: {
  icon: keyof typeof PIECE_SVGS
  size?: number
  color?: string
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = PIECE_SVGS[icon] as any
  if (!svg) return null

  return (
    <svg
      viewBox={svg.viewBox}
      width={size}
      height={size}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {svg.paths?.map((path: string, i: number) => (
        <path key={`path-${i}`} d={path} />
      ))}
      {svg.circles?.map((circle: { cx: number; cy: number; r: number }, i: number) => (
        <circle key={`circle-${i}`} {...circle} />
      ))}
      {svg.extraPaths?.map((path: string, i: number) => (
        <path key={`extra-${i}`} d={path} />
      ))}
      {svg.polygons?.map((polygon: { points: string }, i: number) => (
        <polygon key={`polygon-${i}`} points={polygon.points} />
      ))}
    </svg>
  )
}

// V1 Full Gradient Card for "My Openings" tab
function MyOpeningsCard({
  opening,
  progress,
  total,
}: {
  opening: OpeningConfig
  progress: number
  total: number
}) {
  const progressPercent = (progress / total) * 100
  const gradient = `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 50%, ${opening.colorLight} 100%)`

  return (
    <div
      className="w-full rounded-[14px] px-4 py-2 flex items-center gap-3 shadow-md active:scale-[0.97] transition-transform cursor-pointer"
      style={{ background: gradient }}
    >
      {/* 3D Puck Icon */}
      <div className="flex-shrink-0" style={{ width: 56, height: 56, position: 'relative' }}>
        {/* Shadow layer — full circle at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          }}
        />
        {/* Face layer — slightly shorter, sits on top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 56,
            height: 52,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ filter: 'drop-shadow(1px 2px 0 rgba(0,0,0,0.15))' }}>
            <PieceIcon icon={opening.icon} size={28} color="#ffffff" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Double Border Glow name window */}
        <div
          className="rounded-lg p-[2px] mb-1.5 w-fit"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <div
            className="rounded-[6px] px-2.5 py-1 flex items-center gap-1.5"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3)' }}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opening.colorLight, boxShadow: `0 0 6px ${opening.colorLight}80` }} />
            <span className="text-[11px] font-bold text-white tracking-wide">{opening.name}</span>
            <span className="text-[10px] text-white/40 ml-auto font-medium">{opening.side === 'white' ? 'White' : 'Black'}</span>
          </div>
        </div>
        <p className="text-white/70 text-sm">{opening.subtitle}</p>

        {/* Progress Bar */}
        <div className="mt-2.5 w-full">
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: '#ffffff',
              }}
            />
          </div>
          <p className="text-xs text-white/80 mt-1 font-medium">
            {progress}/{total}
          </p>
        </div>
      </div>

      {/* Chevron */}
      <div className="flex-shrink-0 text-white">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  )
}

// V2 Puck-in-Band Card for Library tab
function LibraryCard({
  opening,
  onClickAvailable,
  started = false,
}: {
  opening: OpeningConfig
  onClickAvailable: (slug: string) => void
  started?: boolean
}) {
  const gradient = `linear-gradient(135deg, ${opening.colorDark} 0%, ${opening.color} 100%)`

  return (
    <div
      className="w-full bg-white overflow-hidden active:scale-[0.97] transition-transform flex"
      onClick={() => opening.hasData && onClickAvailable(opening.slug)}
      style={{
        opacity: opening.hasData ? 1 : 0.6,
        cursor: opening.hasData ? 'pointer' : 'default',
        borderRadius: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      }}
    >
      {/* Left color band with 3D puck */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 64, background: gradient, position: 'relative' }}
      >
        {/* Puck container */}
        <div style={{ width: 40, height: 40, position: 'relative' }}>
          {/* Shadow — dark circle at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: opening.colorDark,
            }}
          />
          {/* Face — slightly shorter, gradient top→bottom */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 40,
              height: 36,
              borderRadius: '50%',
              background: `linear-gradient(180deg, ${opening.colorLight} 0%, ${opening.colorDark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ filter: 'drop-shadow(1px 2px 0 rgba(0,0,0,0.15))' }}>
              <PieceIcon icon={opening.icon} size={20} color="#ffffff" />
            </div>
          </div>
        </div>
      </div>

      {/* Right content area */}
      <div style={{ flex: 1, padding: '6px 12px 6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex-1">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#2A3C45' }}>
            {opening.name}
          </h3>
          <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
            {opening.subtitle}
          </p>
        </div>

        {/* Right side: badge, arrow pill, or coming soon */}
        <div className="ml-3 flex-shrink-0">
          {opening.hasData && started ? (
            <div
              className="px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.10)', color: '#059669' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              In My Openings
            </div>
          ) : opening.hasData ? (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: '#f0f5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 2l6 5-6 5" />
              </svg>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ color: '#94a3b8', backgroundColor: '#f0f5fa' }}>
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Empty State for My Openings
function EmptyState({ onBrowseClick }: { onBrowseClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 rounded-full bg-chess-page flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-chess-text-faint"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <h3 className="text-chess-text font-semibold text-lg mb-2">
        No openings yet
      </h3>
      <p className="text-chess-text-faint text-sm mb-6 text-center max-w-xs">
        Start learning your first opening from the Library
      </p>
      <button
        onClick={onBrowseClick}
        className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
        style={{ backgroundColor: '#CE82FF' }}
      >
        Browse Library
      </button>
    </div>
  )
}

// Main Page Component
export default function OpeningsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabName>('my-openings')

  // Real progress from localStorage / Supabase
  const { getMyOpenings, loading: progressLoading } = useOpeningProgress()
  const myOpenings = getMyOpenings()
    .map(({ slug, completedLessons }) => {
      const opening = OPENINGS_REGISTRY.find(o => o.slug === slug)
      if (!opening) return null
      const total = getLessonCount(slug)
      const validIds = new Set(TREE_LOOKUP[slug]?.completionOrder ?? [])
      const progress = completedLessons.filter(id => validIds.has(id)).length
      return { opening, progress, total: total || 1 }
    })
    .filter((o): o is NonNullable<typeof o> => o !== null)

  const handleOpeningClick = (slug: string) => {
    router.push(`/openings/${slug}`)
  }

  return (
    <div className="h-full overflow-auto bg-chess-page">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-chess-page border-b border-chess-text-faint/10 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            <svg
              className="w-5 h-5 text-chess-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-chess-text">Openings</h1>
        </div>

        {/* Sliding Window Tabs */}
        <div
          className="rounded-xl p-1 relative overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 3px 0 #d1dde6, 0 2px 8px rgba(0,0,0,0.06)',
            border: '2px solid #e2ecf3',
          }}
        >
          {/* Sliding highlight */}
          <div
            className="absolute top-1 bottom-1 rounded-lg transition-all duration-300"
            style={{
              width: 'calc(50% - 4px)',
              left: activeTab === 'my-openings' ? '4px' : 'calc(50% + 0px)',
              background: activeTab === 'my-openings'
                ? 'linear-gradient(135deg, #CE82FF, #A855D8)'
                : 'linear-gradient(135deg, #1CB0F6, #1899D6)',
              boxShadow: activeTab === 'my-openings'
                ? '0 3px 10px #CE82FF30'
                : '0 3px 10px #1CB0F630',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
          <div className="relative flex">
            {(['my-openings', 'library'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2.5 flex items-center justify-center gap-2 relative z-10 transition-colors duration-300"
              >
                <span
                  className="font-bold text-sm"
                  style={{ color: activeTab === tab ? '#ffffff' : '#94a3b8' }}
                >
                  {tab === 'my-openings' ? 'My Openings' : 'Library'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* My Openings Tab */}
        {activeTab === 'my-openings' && (
          <div className="space-y-4">
            {myOpenings.length > 0 ? (
              myOpenings.map(({ opening, progress, total }) => (
                <div
                  key={opening.slug}
                  onClick={() => handleOpeningClick(opening.slug)}
                  className="cursor-pointer"
                >
                  <MyOpeningsCard
                    opening={opening}
                    progress={progress}
                    total={total}
                  />
                </div>
              ))
            ) : (
              <EmptyState onBrowseClick={() => setActiveTab('library')} />
            )}
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="space-y-3">
            {OPENINGS_REGISTRY
              .sort((a, b) => a.order - b.order)
              .map(opening => (
                <LibraryCard
                  key={opening.slug}
                  opening={opening}
                  onClickAvailable={handleOpeningClick}
                  started={myOpenings.some(o => o.opening.slug === opening.slug)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
