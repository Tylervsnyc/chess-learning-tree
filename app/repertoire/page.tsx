'use client';

import { useState, useEffect, useCallback } from 'react';
import { redirect } from 'next/navigation';
import { FEATURE_FLAGS } from '@/lib/config/feature-flags';
import { ConnectAccountForm } from '@/components/repertoire/ConnectAccountForm';
import { DiagnosisView } from '@/components/repertoire/DiagnosisView';
import { LineDrillBoard } from '@/components/repertoire/LineDrillBoard';
import { DrillStats } from '@/components/repertoire/DrillStats';
import type { ChessPlatform, Gap, SrsCard, DiagnosisResult } from '@/lib/repertoire/types';

type Tab = 'connect' | 'diagnosis' | 'drill';

export default function RepertoirePage() {
  if (!FEATURE_FLAGS.SHOW_OPENINGS) {
    redirect('/');
  }
  const [tab, setTab] = useState<Tab>('connect');
  const [color, setColor] = useState<'white' | 'black'>('white');
  const [lichessUsername, setLichessUsername] = useState<string | null>(null);
  const [chesscomUsername, setChesscomUsername] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<{ gamesAnalyzed: number; gapsFound: number; cardsGenerated: number } | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [drillCards, setDrillCards] = useState<SrsCard[]>([]);
  const [allCards, setAllCards] = useState<SrsCard[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [drilling, setDrilling] = useState(false);
  const [error, setError] = useState('');

  // Load profile data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/progress');
        if (res.ok) {
          // Profile loaded — now fetch usernames from a separate call
          // For now we just check if connect was already done by trying diagnosis
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleConnected = useCallback((platform: ChessPlatform, username: string) => {
    if (platform === 'lichess') setLichessUsername(username);
    else setChesscomUsername(username);
  }, []);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    setError('');
    setAnalyzeResult(null);

    try {
      const res = await fetch('/api/repertoire/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Analysis failed');
        return;
      }

      setAnalyzeResult({
        gamesAnalyzed: data.gamesAnalyzed,
        gapsFound: data.gapsFound,
        cardsGenerated: data.cardsGenerated,
      });

      // Auto-load diagnosis
      await loadDiagnosis();
      setTab('diagnosis');
    } catch {
      setError('Network error during analysis');
    } finally {
      setAnalyzing(false);
    }
  }, [color]);

  const loadDiagnosis = useCallback(async () => {
    try {
      const res = await fetch(`/api/repertoire/diagnosis?color=${color}`);
      if (res.ok) {
        const data = await res.json();
        setDiagnosis(data);
      }
    } catch {
      // ignore
    }
  }, [color]);

  const loadDrillCards = useCallback(async () => {
    try {
      const res = await fetch(`/api/repertoire/drill?color=${color}`);
      if (res.ok) {
        const data = await res.json();
        // Combine due + new for the session (max 3 new per session)
        const sessionCards = [
          ...data.dueCards,
          ...data.newCards.slice(0, 3),
        ];
        setDrillCards(sessionCards);
        setAllCards([...data.dueCards, ...data.newCards]);
        setDueCount(data.totalDue);
        setNewCount(data.totalNew);
      }
    } catch {
      // ignore
    }
  }, [color]);

  const handleDrillGap = useCallback(async () => {
    await loadDrillCards();
    setDrilling(true);
    setTab('drill');
  }, [loadDrillCards]);

  const handleReview = useCallback(async (cardId: string, correct: boolean) => {
    try {
      await fetch('/api/repertoire/drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, correct }),
      });
    } catch {
      // ignore — optimistic UI
    }
  }, []);

  const handleSessionComplete = useCallback(() => {
    setDrilling(false);
    loadDrillCards(); // Refresh stats
  }, [loadDrillCards]);

  // Load data when switching tabs
  useEffect(() => {
    if (tab === 'diagnosis') loadDiagnosis();
    if (tab === 'drill') loadDrillCards();
  }, [tab, loadDiagnosis, loadDrillCards]);

  return (
    <div className="bg-chess-page min-h-[calc(100dvh-45px)]">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-chess-text">Opening Repertoire</h1>
          <p className="text-xs text-chess-text-muted">
            Connect your account, find gaps, drill the fixes
          </p>
        </div>

        {/* Color toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setColor('white')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              color === 'white'
                ? 'bg-chess-surface border-2 border-chess-text text-chess-text shadow-sm'
                : 'bg-slate-100 text-chess-text-muted border-2 border-transparent'
            }`}
          >
            &#9812; White
          </button>
          <button
            onClick={() => setColor('black')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              color === 'black'
                ? 'bg-chess-text text-white border-2 border-chess-text shadow-sm'
                : 'bg-slate-100 text-chess-text-muted border-2 border-transparent'
            }`}
          >
            &#9818; Black
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex bg-slate-100 rounded-xl p-1">
          {([
            { id: 'connect' as Tab, label: 'Connect' },
            { id: 'diagnosis' as Tab, label: 'Diagnosis' },
            { id: 'drill' as Tab, label: 'Drill' },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setDrilling(false); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === t.id
                  ? 'bg-chess-surface text-chess-text shadow-sm'
                  : 'text-chess-text-muted'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-chess-wrong-bg rounded-xl px-4 py-3">
            <p className="text-xs text-chess-red font-medium">{error}</p>
          </div>
        )}

        {/* Tab content */}
        {tab === 'connect' && (
          <div className="space-y-4">
            <ConnectAccountForm
              lichessUsername={lichessUsername}
              chesscomUsername={chesscomUsername}
              onConnected={handleConnected}
            />

            {(lichessUsername || chesscomUsername) && (
              <div className="space-y-3">
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-chess-text-muted uppercase tracking-wide mb-3">
                    Analyze Repertoire
                  </p>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full py-3 bg-chess-blue text-white font-bold rounded-xl text-sm transition-all hover:bg-chess-blue-dark disabled:opacity-50 shadow-[0_3px_0_0_var(--color-chess-blue-dark)]"
                  >
                    {analyzing ? 'Analyzing... (this takes ~60s)' : `Analyze ${color === 'white' ? 'White' : 'Black'} Repertoire`}
                  </button>
                </div>

                {analyzeResult && (
                  <div className="bg-chess-correct-bg rounded-xl px-4 py-3 space-y-1">
                    <p className="text-sm font-bold text-chess-green">Analysis Complete!</p>
                    <p className="text-xs text-chess-text-muted">
                      {analyzeResult.gamesAnalyzed} games analyzed &middot;{' '}
                      {analyzeResult.gapsFound} gaps found &middot;{' '}
                      {analyzeResult.cardsGenerated} drill cards created
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'diagnosis' && (
          diagnosis ? (
            <DiagnosisView
              gaps={diagnosis.gaps}
              summary={diagnosis.summary}
              onDrillGap={handleDrillGap}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-chess-text-muted">
                No diagnosis yet. Connect an account and run analysis first.
              </p>
            </div>
          )
        )}

        {tab === 'drill' && (
          drilling && drillCards.length > 0 ? (
            <LineDrillBoard
              cards={drillCards}
              onReview={handleReview}
              onSessionComplete={handleSessionComplete}
            />
          ) : (
            <div className="space-y-4">
              {allCards.length > 0 ? (
                <>
                  <DrillStats
                    cards={allCards}
                    dueCount={dueCount}
                    newCount={newCount}
                  />
                  {(dueCount > 0 || newCount > 0) && (
                    <button
                      onClick={() => { setDrilling(true); }}
                      className="w-full py-3 bg-chess-green text-white font-bold rounded-xl text-sm transition-all hover:bg-chess-green-dark shadow-[0_3px_0_0_var(--color-chess-green-dark)]"
                    >
                      Start Drill Session ({dueCount + Math.min(newCount, 3)} cards)
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-chess-text-muted">
                    No drill cards yet. Run analysis to generate cards from your gaps.
                  </p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
