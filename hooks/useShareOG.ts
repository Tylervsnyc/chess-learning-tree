'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ShareEvents, type ShareSource } from '@/lib/analytics/posthog'

export interface ShareOGConfig {
  ogEndpoint: string
  ogParams: Record<string, string>
  shareUrl: string
  source: ShareSource
  title: string
  text: string
}

type FeedbackState = 'idle' | 'sharing' | 'success' | 'error'

export function useShareOG(config: ShareOGConfig | undefined) {
  const imageRef = useRef<Blob | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle')

  // Pre-fetch OG image on mount
  useEffect(() => {
    if (!config) return
    const params = new URLSearchParams(config.ogParams)
    fetch(`${config.ogEndpoint}?${params.toString()}`)
      .then(res => res.ok ? res.blob() : null)
      .then(blob => {
        if (blob) {
          imageRef.current = blob
          setIsReady(true)
        }
      })
      .catch(() => {})
  }, [config?.ogEndpoint, config?.shareUrl])

  const share = useCallback(async () => {
    if (!config) return
    const { source, shareUrl, title, text } = config

    ShareEvents.shareClicked(source, 'rook')
    setFeedbackState('sharing')

    // Try Web Share API first
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        const shareData: ShareData = { title, text, url: shareUrl }
        if (imageRef.current) {
          shareData.files = [new File([imageRef.current], 'chess-path.png', { type: 'image/png' })]
        }
        await navigator.share(shareData)
        ShareEvents.shareCompleted(source, imageRef.current ? 'native_image' : 'native')
        setFeedbackState('success')
        setTimeout(() => setFeedbackState('idle'), 1500)
        return
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setFeedbackState('idle')
          return
        }
      }
    }

    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      ShareEvents.shareCompleted(source, 'clipboard')
      setFeedbackState('success')
      setTimeout(() => setFeedbackState('idle'), 1500)
    } catch {
      ShareEvents.shareFailed(source, 'clipboard_failed')
      setFeedbackState('error')
      setTimeout(() => setFeedbackState('idle'), 1500)
    }
  }, [config])

  return { isReady, share, feedbackState }
}
