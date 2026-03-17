'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SICILIAN_DEFENSE } from '@/data/openings/sicilian'
import OpeningTreeView from '@/components/openings/OpeningTreeView'

function isUnlocked(nodeId: string, completed: Set<string>): boolean {
  const node = SICILIAN_DEFENSE.nodes.find(n => n.id === nodeId)
  if (!node) return false
  if (!node.unlockedBy) return true
  if (Array.isArray(node.unlockedBy)) return node.unlockedBy.every(id => completed.has(id))
  return completed.has(node.unlockedBy)
}

export default function Sicilian1TestPage() {
  const router = useRouter()
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [currentId, setCurrentId] = useState<string | null>('si-1')
  const [treeKey, setTreeKey] = useState(0)

  const completeNext = useCallback(() => {
    if (!currentId) return

    const newCompleted = [...completedIds, currentId]
    const completedSet = new Set(newCompleted)

    const idx = SICILIAN_DEFENSE.completionOrder.indexOf(currentId)
    let nextId: string | null = null
    for (let i = idx + 1; i < SICILIAN_DEFENSE.completionOrder.length; i++) {
      const candidateId = SICILIAN_DEFENSE.completionOrder[i]
      if (!completedSet.has(candidateId) && isUnlocked(candidateId, completedSet)) {
        nextId = candidateId
        break
      }
    }
    if (!nextId) {
      const fallback = SICILIAN_DEFENSE.nodes.find(n => !completedSet.has(n.id) && isUnlocked(n.id, completedSet))
      nextId = fallback?.id ?? null
    }

    setCompletedIds(newCompleted)
    setCurrentId(nextId)
  }, [currentId, completedIds])

  const resetTree = useCallback(() => {
    setCompletedIds([])
    setCurrentId('si-1')
    setTreeKey(k => k + 1)
  }, [])

  const completeAll = useCallback(() => {
    setCompletedIds(SICILIAN_DEFENSE.nodes.map(n => n.id))
    setCurrentId(null)
    setTreeKey(k => k + 1)
  }, [])

  return (
    <div className="min-h-screen bg-[#c8d6e0] flex items-center justify-center overflow-auto p-4">
      <div className="flex flex-col overflow-hidden" style={{
        width: 375,
        height: 720,
        background: '#eef6fc',
        borderRadius: 32,
        border: '3px solid #2A3C45',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ background: '#eef6fc' }}>
          <button
            onClick={() => router.push('/test')}
            className="text-[#6b7c8a] text-xl bg-transparent border-none cursor-pointer"
          >
            &larr;
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#2A3C45' }}>Sicilian Defense</h1>
            <p className="text-xs" style={{ color: '#6b7c8a' }}>
              {completedIds.length} / {SICILIAN_DEFENSE.nodes.length} lessons
            </p>
          </div>
        </div>

        {/* Tree frame */}
        <OpeningTreeView
          key={treeKey}
          tree={SICILIAN_DEFENSE}
          completedLessonIds={completedIds}
          currentLessonId={currentId}
          onLessonTap={(nodeId) => {
            if (nodeId === currentId) {
              completeNext()
            } else {
              router.push(`/openings/sicilian/${nodeId}`)
            }
          }}
        />

        {/* Controls */}
        <div className="flex-shrink-0 flex gap-2 px-3 py-2 border-t border-gray-200 bg-white">
          <button
            onClick={resetTree}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-[13px] bg-gray-100 text-[#6b7c8a]"
          >
            Reset
          </button>
          <button
            onClick={completeNext}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-[13px] text-white"
            style={{ background: '#58CC02' }}
          >
            Complete
          </button>
          <button
            onClick={completeAll}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-[13px] text-white"
            style={{ background: '#FF4B4B' }}
          >
            All
          </button>
        </div>
      </div>
    </div>
  )
}
