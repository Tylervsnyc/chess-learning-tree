'use client'

import { use, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import OpeningTreeView from '@/components/openings/OpeningTreeView'
import { useOpeningProgress } from '@/hooks/useOpeningProgress'
import { TREE_LOOKUP } from '@/lib/opening-trees'

export default function OpeningTreePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const unlockAll = searchParams.get('unlock') === 'all'
  const tree = TREE_LOOKUP[slug]
  const { getProgress } = useOpeningProgress()

  // Derive completed + current from persisted progress
  const { completedIds, currentId } = useMemo(() => {
    if (!tree) return { completedIds: [], currentId: null }

    // Debug: unlock all lessons for testing
    if (unlockAll) {
      return { completedIds: tree.completionOrder, currentId: tree.completionOrder[0] }
    }

    const { completedLessons } = getProgress(slug)
    const order = tree.completionOrder

    // Find the first uncompleted lesson in the order
    let current: string | null = null
    for (const id of order) {
      if (!completedLessons.includes(id)) {
        current = id
        break
      }
    }

    return { completedIds: completedLessons, currentId: current }
  }, [tree, slug, getProgress, unlockAll])

  if (!tree) {
    return (
      <div className="h-full bg-chess-page flex flex-col items-center justify-center p-6">
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
      className="h-full flex flex-col"
      style={{ backgroundColor: '#eef6fc' }}
    >
      {/* Sticky 3D Floating Header */}
      <div className="flex-shrink-0 z-20 px-4 pt-3 pb-2">
        <div className="relative">
          {/* Back layers for 3D depth */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              backgroundColor: tree.color,
              transform: 'translate(6px, 6px)',
              opacity: 0.25,
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              backgroundColor: tree.color,
              transform: 'translate(3px, 3px)',
              opacity: 0.45,
            }}
          />

          {/* Main card */}
          <div
            className="relative rounded-2xl px-4 py-3 border-2 overflow-hidden flex items-center gap-3"
            style={{
              background: `linear-gradient(135deg, ${tree.colorDark} 0%, ${tree.color} 100%)`,
              borderColor: tree.colorDark,
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            }}
          >
            <button
              onClick={() => router.push(`/openings/${slug}`)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-xl">←</span>
            </button>
            <h1 className="text-white font-bold text-lg truncate">{tree.name}</h1>
          </div>
        </div>
      </div>

      {/* Tree View */}
      <OpeningTreeView
        tree={tree}
        completedLessonIds={completedIds}
        currentLessonId={currentId}
        accentColor={tree.color}
        accentColorDark={tree.colorDark}
        onLessonTap={(nodeId) => {
          if (unlockAll || nodeId === currentId || completedIds.includes(nodeId)) {
            router.push(`/openings/${slug}/${nodeId}`)
          }
        }}
      />
    </div>
  )
}
