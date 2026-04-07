'use client';

import { BreathingRook } from '@/components/ui/BreathingRook';

const ERROR_MESSAGES = [
  "Well, something broke. Even I don't know what happened.",
  "I tripped over a wire somewhere. Try refreshing?",
  "My circuits got confused. This is embarrassing.",
];

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];

  // Log for debugging
  console.error('[GlobalError]', error);

  return (
    <html lang="en">
      <body className="antialiased" style={{ margin: 0, backgroundColor: '#eef6fc' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100dvh',
            padding: '0 24px',
            textAlign: 'center',
            gap: 24,
          }}
        >
          <BreathingRook size="lg" mood="defeated" animate />
          <p style={{ color: '#1a2a3a', fontSize: 18, maxWidth: 360 }}>{message}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={reset}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: 600,
                fontSize: 14,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: '1px solid #d1d5db',
                color: '#1a2a3a',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
