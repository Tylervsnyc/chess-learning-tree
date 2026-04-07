'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SCOTCH_GAME } from '@/data/openings/scotch'
import OpeningTreeView from '@/components/openings/OpeningTreeView'

function isUnlocked(nodeId: string, completed: Set<string>): boolean {
  const node = SCOTCH_GAME.nodes.find(n => n.id === nodeId)
  if (!node) return false
  if (!node.unlockedBy) return true
  if (Array.isArray(node.unlockedBy)) return node.unlockedBy.every(id => completed.has(id))
  return completed.has(node.unlockedBy)
}

export default function Scotch1TestPage() {
  const router = useRouter()
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [currentId, setCurrentId] = useState<string | null>('sc-1')
  const [treeKey, setTreeKey] = useState(0)

  const completeNext = useCallback(() => {
    if (!currentId) return

    const newCompleted = [...completedIds, currentId]
    const completedSet = new Set(newCompleted)

    const idx = SCOTCH_GAME.completionOrder.indexOf(currentId)
    let nextId: string | null = null
    for (let i = idx + 1; i < SCOTCH_GAME.completionOrder.length; i++) {
      const candidateId = SCOTCH_GAME.completionOrder[i]
      if (!completedSet.has(candidateId) && isUnlocked(candidateId, completedSet)) {
        nextId = candidateId
        break
      }
    }
    if (!nextId) {
      const fallback = SCOTCH_GAME.nodes.find(n => !completedSet.has(n.id) && isUnlocked(n.id, completedSet))
      nextId = fallback?.id ?? null
    }

    setCompletedIds(newCompleted)
    setCurrentId(nextId)
  }, [currentId, completedIds])

  const resetTree = useCallback(() => {
    setCompletedIds([])
    setCurrentId('sc-1')
    setTreeKey(k => k + 1)
  }, [])

  const completeAll = useCallback(() => {
    setCompletedIds(SCOTCH_GAME.nodes.map(n => n.id))
    setCurrentId(null)
    setTreeKey(k => k + 1)
  }, [])

  return (
    <div className="min-h-screen bg-chess-page flex items-center justify-center overflow-auto p-4">
      <div className="flex flex-col overflow-hidden" style={{
        width: 375,
        height: 720,
        background: 'var(--color-chess-page)',
        borderRadius: 32,
        border: '3px solid #2A3C45',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ background: 'var(--color-chess-page)' }}>
          <button
            onClick={() => router.push('/test')}
            className="text-chess-text-muted text-xl bg-transparent border-none cursor-pointer"
          >
            &larr;
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--color-chess-text)' }}>Scotch Game</h1>
            <p className="text-xs" style={{ color: 'var(--color-chess-text-muted)' }}>
              {completedIds.length} / {SCOTCH_GAME.nodes.length} lessons
            </p>
          </div>
        </div>

        {/* Tree frame */}
        <OpeningTreeView
          key={treeKey}
          tree={SCOTCH_GAME}
          completedLessonIds={completedIds}
          currentLessonId={currentId}
          onLessonTap={(nodeId) => {
            if (nodeId === currentId) {
              completeNext()
            } else {
              router.push(`/openings/scotch/${nodeId}`)
            }
          }}
        />

        {/* Controls */}
        <div className="flex-shrink-0 flex gap-2 px-3 py-2 border-t border-gray-200 bg-white">
          <button
            onClick={resetTree}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-[13px] bg-gray-100 text-chess-text-muted"
          >
            Reset
          </button>
          <button
            onClick={completeNext}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-[13px] text-white"
            style={{ background: '#E03030' }}
          >
            Complete
          </button>
          <button
            onClick={completeAll}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-[13px] text-white"
            style={{ background: '#B02020' }}
          >
            All
          </button>
        </div>
      </div>
    </div>
  )
}
