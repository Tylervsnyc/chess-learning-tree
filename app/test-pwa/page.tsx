'use client';

import { useState } from 'react';

export default function TestPWAPage() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`]);
  };

  const triggerInstallPrompt = () => {
    window.dispatchEvent(new Event('chess-path:puzzle-complete'));
    addLog('Dispatched chess-path:puzzle-complete event');
  };

  const resetDismissed = () => {
    localStorage.removeItem('chess-path-install-dismissed');
    addLog('Cleared dismissed state — refresh the page to re-enable prompt');
  };

  const checkServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      addLog('Service workers not supported in this browser');
      return;
    }
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length === 0) {
      addLog('No service worker registered yet');
    } else {
      registrations.forEach((reg) => {
        addLog(`SW registered — scope: ${reg.scope}, state: ${reg.active?.state ?? 'installing'}`);
      });
    }
  };

  const checkManifest = async () => {
    try {
      const res = await fetch('/manifest.json');
      const data = await res.json();
      addLog(`Manifest loaded — name: "${data.name}", start_url: ${data.start_url}, theme: ${data.theme_color}`);
      addLog(`Icons: ${data.icons.map((i: { sizes: string; purpose?: string }) => `${i.sizes}${i.purpose ? ` (${i.purpose})` : ''}`).join(', ')}`);
    } catch {
      addLog('Failed to load manifest.json');
    }
  };

  const checkStandaloneMode = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    addLog(isStandalone ? 'Running as installed PWA (standalone)' : 'Running in browser (not installed)');
  };

  const checkCaches = async () => {
    if (!('caches' in window)) {
      addLog('Cache API not available');
      return;
    }
    const keys = await caches.keys();
    if (keys.length === 0) {
      addLog('No caches found');
    } else {
      for (const key of keys) {
        const cache = await caches.open(key);
        const cacheKeys = await cache.keys();
        addLog(`Cache "${key}" — ${cacheKeys.length} entries`);
      }
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-lg mx-auto w-full p-4 pb-32 space-y-4">
        <h1 className="text-xl font-bold text-chess-text">PWA Test Page</h1>
        <p className="text-sm text-chess-text-muted">
          Test each PWA feature below. The install prompt bottom sheet will
          appear when you trigger it (if not previously dismissed).
        </p>

        <div className="space-y-3">
          <Section title="Install Prompt">
            <Button onClick={triggerInstallPrompt} color="green">
              Trigger Install Prompt
            </Button>
            <Button onClick={resetDismissed} color="gray">
              Reset Dismissed State
            </Button>
            <p className="text-xs text-chess-text-faint">
              If you dismissed the prompt before, click reset then refresh.
            </p>
          </Section>

          <Section title="Service Worker">
            <Button onClick={checkServiceWorker} color="blue">
              Check SW Status
            </Button>
          </Section>

          <Section title="Manifest">
            <Button onClick={checkManifest} color="blue">
              Load Manifest
            </Button>
          </Section>

          <Section title="Environment">
            <Button onClick={checkStandaloneMode} color="blue">
              Check Display Mode
            </Button>
            <Button onClick={checkCaches} color="blue">
              Check Caches
            </Button>
          </Section>
        </div>

        {log.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-chess-text">Log</h2>
              <button
                onClick={() => setLog([])}
                className="text-xs text-chess-text-faint hover:text-chess-text-muted"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1 text-xs font-mono text-chess-text-muted">
              {log.map((entry, i) => (
                <p key={i}>{entry}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
      <h2 className="text-sm font-semibold text-chess-text">{title}</h2>
      {children}
    </div>
  );
}

function Button({
  onClick,
  color,
  children,
}: {
  onClick: () => void;
  color: 'green' | 'blue' | 'gray';
  children: React.ReactNode;
}) {
  const colors = {
    green: 'bg-chess-green hover:bg-chess-green-dark text-white',
    blue: 'bg-chess-blue hover:bg-chess-blue-dark text-white',
    gray: 'bg-gray-100 hover:bg-gray-200 text-chess-text',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${colors[color]}`}
    >
      {children}
    </button>
  );
}
