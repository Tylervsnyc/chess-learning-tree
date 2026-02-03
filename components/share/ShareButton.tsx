'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PuzzleShareCard } from './PuzzleShareCard';
import { generatePuzzleImageFile } from '@/lib/share/generate-puzzle-image';
import { ShareEvents } from '@/lib/analytics/posthog';

interface ShareButtonProps {
  fen: string;
  playerColor: 'white' | 'black';
  lastMoveFrom?: string;
  lastMoveTo?: string;
  source?: 'lesson' | 'daily_challenge';
}

type ShareState = 'idle' | 'generating' | 'preview' | 'error';

interface GeneratedAsset {
  imageFile: File;
  imageUrl: string;
}

/**
 * Share button that generates and shares a puzzle image
 */
export function ShareButton({
  fen,
  playerColor,
  lastMoveFrom,
  lastMoveTo,
  source = 'lesson',
}: ShareButtonProps) {
  const [state, setState] = useState<ShareState>('idle');
  const [asset, setAsset] = useState<GeneratedAsset | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    ShareEvents.shareClicked(source);
    setState('generating');

    try {
      // Wait for the card to render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Generate static image
      const cardElement = document.getElementById('puzzle-share-card');
      if (!cardElement) {
        throw new Error('Share card not found');
      }

      const imageFile = await generatePuzzleImageFile(cardElement as HTMLElement);
      const imageUrl = URL.createObjectURL(imageFile);

      setAsset({ imageFile, imageUrl });
      setState('preview');
      ShareEvents.shareGenerated(source);
    } catch (error) {
      console.error('Share failed:', error);
      ShareEvents.shareFailed(source, error instanceof Error ? error.message : 'Unknown error');
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  const handleClose = () => {
    if (asset) {
      URL.revokeObjectURL(asset.imageUrl);
    }
    setAsset(null);
    setState('idle');
  };

  const handleDownload = () => {
    if (!asset) return;
    const url = URL.createObjectURL(asset.imageFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chess-puzzle.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    ShareEvents.shareCompleted(source, 'download');
  };

  const handleNativeShare = async () => {
    if (!asset) return;

    try {
      if (navigator.share && navigator.canShare({ files: [asset.imageFile] })) {
        await navigator.share({
          files: [asset.imageFile],
          title: 'Chess Puzzle',
          text: 'Can you solve this chess puzzle?',
        });
        ShareEvents.shareCompleted(source, 'native');
        handleClose();
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Share failed:', error);
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' &&
    navigator.share &&
    asset &&
    navigator.canShare?.({ files: [asset.imageFile] });

  return (
    <>
      {/* Share button */}
      <button
        onClick={handleShare}
        disabled={state === 'generating'}
        className={`
          relative w-12 h-12 rounded-xl flex items-center justify-center transition-all overflow-hidden
          ${state === 'generating' ? 'cursor-wait opacity-80' : 'hover:opacity-90 active:scale-95'}
          ${state === 'error' ? 'bg-red-500/20' : ''}
        `}
        style={{
          background: state === 'error'
            ? undefined
            : 'linear-gradient(135deg, #FFE135 0%, #FFC700 100%)',
          boxShadow: state === 'error' ? undefined : '0 2px 0 0 #CCA000',
        }}
        title="Share puzzle"
      >
        {/* Shimmer effect */}
        {state === 'idle' && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        )}
        {state === 'generating' ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : state === 'error' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4B4B" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        )}
      </button>

      {/* Hidden share card for image generation */}
      {state === 'generating' &&
        createPortal(
          <div
            ref={cardRef}
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              zIndex: 9999,
              background: '#131F24',
            }}
          >
            <PuzzleShareCard
              fen={fen}
              playerColor={playerColor}
              lastMoveFrom={lastMoveFrom}
              lastMoveTo={lastMoveTo}
            />
          </div>,
          document.body
        )}

      {/* Loading overlay */}
      {state === 'generating' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(19, 31, 36, 0.95)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <div className="text-white/70 text-sm">Creating image...</div>
          </div>,
          document.body
        )}

      {/* Preview Modal */}
      {state === 'preview' && asset &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={handleClose}
          >
            <div
              className="bg-[#1A2C35] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Share Puzzle</h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Image Preview */}
              <div className="p-4">
                <div className="rounded-xl overflow-hidden bg-black/20">
                  <img
                    src={asset.imageUrl}
                    alt="Puzzle card"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/10 flex gap-3">
                {canNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)',
                      boxShadow: '0 3px 0 0 #3D8B02',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    Share
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className={`${canNativeShare ? 'flex-1' : 'w-full'} py-3 px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
