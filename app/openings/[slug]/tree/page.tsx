'use client'

import { use, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
  const tree = TREE_LOOKUP[slug]
  const { getProgress } = useOpeningProgress()

  // Derive completed + current from persisted progress
  const { completedIds, currentId } = useMemo(() => {
    if (!tree) return { completedIds: [], currentId: null }

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
  }, [tree, slug, getProgress])

  if (!tree) {
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
      className="h-full flex flex-col"
      style={{ backgroundColor: '#eef6fc' }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 z-20 px-4 py-3 flex items-center gap-3"
        style={{
          background: `linear-gradient(135deg, ${tree.colorDark} 0%, ${tree.color} 100%)`,
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

      {/* Tree View */}
      <OpeningTreeView
        tree={tree}
        completedLessonIds={completedIds}
        currentLessonId={currentId}
        accentColor={tree.color}
        accentColorDark={tree.colorDark}
        onLessonTap={(nodeId) => {
          if (nodeId === currentId || completedIds.includes(nodeId)) {
            router.push(`/openings/${slug}/${nodeId}`)
          }
        }}
      />
    </div>
  )
}
