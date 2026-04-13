'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useUser } from './useUser'

const STORAGE_KEY = 'chess-opening-progress'

// Shape stored in localStorage and returned by the hook
export interface OpeningProgressData {
  completedLessons: string[]
  lastPlayedAt: string
}

export type AllOpeningProgress = Record<string, OpeningProgressData>

// ─── localStorage helpers ───

function loadLocalProgress(): AllOpeningProgress {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveLocalProgress(data: AllOpeningProgress) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage full or unavailable
  }
}

// Union merge: never lose progress from either source
function mergeProgress(local: AllOpeningProgress, server: AllOpeningProgress): AllOpeningProgress {
  const merged: AllOpeningProgress = { ...local }

  for (const [slug, serverData] of Object.entries(server)) {
    if (!merged[slug]) {
      merged[slug] = serverData
    } else {
      const localLessons = new Set(merged[slug].completedLessons)
      for (const id of serverData.completedLessons) {
        localLessons.add(id)
      }
      merged[slug] = {
        completedLessons: Array.from(localLessons),
        lastPlayedAt: serverData.lastPlayedAt > merged[slug].lastPlayedAt
          ? serverData.lastPlayedAt
          : merged[slug].lastPlayedAt,
      }
    }
  }

  return merged
}

/**
 * Opening progress hook — localStorage for anon, Supabase for logged-in users.
 * Merges on login. Used by tree page, lesson page, and landing page.
 */
export function useOpeningProgress() {
  const { user, loading: userLoading } = useUser()
  const [progress, setProgress] = useState<AllOpeningProgress>({})
  const [loading, setLoading] = useState(true)
  const mergedRef = useRef(false)
  const fetchedRef = useRef(false)

  // Load localStorage on mount (once only)
  const initRef = useRef(false)
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    const local = loadLocalProgress()
    setProgress(local)
  }, [])

  // When auth resolves as no-user, stop loading
  useEffect(() => {
    if (!userLoading && !user) {
      setLoading(false)
    }
  }, [userLoading, user])

  // When logged in: fetch from Supabase + merge
  useEffect(() => {
    if (userLoading || !user || fetchedRef.current) return
    fetchedRef.current = true

    async function fetchAndMerge() {
      try {
        const res = await fetch('/api/opening-progress')
        if (!res.ok) {
          setLoading(false)
          return
        }
        const { progress: serverProgress } = await res.json()
        const local = loadLocalProgress()
        const merged = mergeProgress(local, serverProgress || {})

        setProgress(merged)
        saveLocalProgress(merged)

        // Push local-only data to server (merge on login)
        if (!mergedRef.current && Object.keys(local).length > 0) {
          mergedRef.current = true
          fetch('/api/opening-progress', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progress: merged }),
          }).catch(() => {
            // Silent — will merge next time
          })
        }
      } catch {
        // Offline — localStorage is still the source of truth
      }
      setLoading(false)
    }

    fetchAndMerge()
  }, [user, userLoading])

  // Complete a lesson
  const completeLesson = useCallback((slug: string, lessonId: string) => {
    const now = new Date().toISOString()

    setProgress(prev => {
      const existing = prev[slug] || { completedLessons: [], lastPlayedAt: now }

      // Already completed — no-op
      if (existing.completedLessons.includes(lessonId)) return prev

      const updated: AllOpeningProgress = {
        ...prev,
        [slug]: {
          completedLessons: [...existing.completedLessons, lessonId],
          lastPlayedAt: now,
        },
      }

      saveLocalProgress(updated)
      return updated
    })

    // If logged in, also persist to Supabase
    if (user) {
      fetch('/api/opening-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, lessonId }),
      }).catch(() => {
        // Silent — localStorage has the data, will merge next login
      })
    }
  }, [user])

  // Get progress for a specific opening
  const getProgress = useCallback((slug: string): OpeningProgressData => {
    return progress[slug] || { completedLessons: [], lastPlayedAt: '' }
  }, [progress])

  // Get all openings sorted by last played (most recent first)
  const getMyOpenings = useCallback((): Array<{ slug: string } & OpeningProgressData> => {
    return Object.entries(progress)
      .map(([slug, data]) => ({ slug, ...data }))
      .sort((a, b) => b.lastPlayedAt.localeCompare(a.lastPlayedAt))
  }, [progress])

  return {
    progress,
    loading,
    completeLesson,
    getProgress,
    getMyOpenings,
  }
}
