'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Each word gets its own colored segment — like Price is Right wheel panels
const SEGMENTS = [
  { word: 'fun', bg: '#58CC02', text: '#fff' },
  { word: 'easy', bg: '#1CB0F6', text: '#fff' },
  { word: 'free', bg: '#CE82FF', text: '#fff' },
  { word: 'smart', bg: '#FF9500', text: '#fff' },
  { word: 'quick', bg: '#FFC800', text: '#2A3C45' },
  { word: 'best', bg: '#FF4B4B', text: '#fff' },
];

const DISPLAY_MS = 2200; // pause on each word
const SPIN_MS = 1400; // total spin duration
// How many extra segments to scroll past (creates the "wheel spinning" feel)
const EXTRA_SPINS = 2;

// Metallic divider between segments
const DIVIDER_COLOR = '#B0B0B0';

function SegmentPanel({ segment }: { segment: (typeof SEGMENTS)[number] }) {
  return (
    <div
      className="flex items-center justify-center font-black shrink-0"
      style={{
        width: '100%',
        height: 'var(--segment-h)',
        background: `linear-gradient(180deg, ${segment.bg}ee 0%, ${segment.bg} 45%, ${segment.bg}cc 100%)`,
        color: segment.text,
        borderTop: `2px solid ${DIVIDER_COLOR}`,
        borderBottom: `2px solid ${DIVIDER_COLOR}`,
        textShadow:
          segment.text === '#fff'
            ? '0 1px 2px rgba(0,0,0,0.35)'
            : '0 1px 0 rgba(255,255,255,0.5)',
        boxShadow: `inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.15)`,
      }}
    >
      {segment.word}
    </div>
  );
}

export function WheelTagline({ className = '' }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  // Build the segment strip: current word, then EXTRA_SPINS full passes, landing on next word
  const buildStrip = useCallback((fromIndex: number) => {
    const panels: (typeof SEGMENTS)[number][] = [];
    // Start with current segment
    panels.push(SEGMENTS[fromIndex]);
    // Spin through EXTRA_SPINS full cycles + 1 to land on next
    const totalExtra = EXTRA_SPINS * SEGMENTS.length + 1;
    for (let i = 1; i <= totalExtra; i++) {
      panels.push(SEGMENTS[(fromIndex + i) % SEGMENTS.length]);
    }
    return panels;
  }, []);

  const [strip, setStrip] = useState(() => buildStrip(0));

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Build a new strip from current position
      setCurrentIndex((prev) => {
        const newStrip = buildStrip(prev);
        setStrip(newStrip);

        // Reset to top instantly, then animate down
        if (stripRef.current) {
          stripRef.current.style.transition = 'none';
          stripRef.current.style.transform = 'translateY(0)';

          // Force reflow, then animate
          stripRef.current.offsetHeight;
          const totalSlide = newStrip.length - 1;
          stripRef.current.style.transition = `transform ${SPIN_MS}ms cubic-bezier(0.15, 0, 0.1, 1)`;
          stripRef.current.style.transform = `translateY(calc(-${totalSlide} * var(--segment-h)))`;
        }

        // After animation, update index
        timeoutRef.current = setTimeout(() => {
          const next = (prev + 1) % SEGMENTS.length;
          setCurrentIndex(next);
        }, SPIN_MS);

        return prev;
      });
    }, DISPLAY_MS + SPIN_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [buildStrip]);

  return (
    <span
      className={`inline-block relative overflow-hidden align-bottom ${className}`}
      style={{
        width: '4.8em',
        // @ts-expect-error CSS custom property
        '--segment-h': '1.5em',
        height: 'var(--segment-h)',
        borderRadius: '4px',
        boxShadow: `0 0 0 2px ${DIVIDER_COLOR}, 0 2px 8px rgba(0,0,0,0.2)`,
      }}
    >
      <div ref={stripRef} className="flex flex-col" style={{ transform: 'translateY(0)' }}>
        {strip.map((seg, i) => (
          <SegmentPanel key={`${seg.word}-${i}`} segment={seg} />
        ))}
      </div>
    </span>
  );
}
