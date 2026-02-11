'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';

// ─── Mock data ───────────────────────────────────────────────────────────────
const COLORS = ['#58CC02', '#1CB0F6', '#FF9600', '#FF4B4B', '#A560E8'];
const PIECES = ['♔', '♕', '♖', '♗', '♘', '♙'];

function mockLessons(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `lesson-${i}`,
    piece: PIECES[i % PIECES.length],
  }));
}

const SECTIONS = [
  { id: '1', name: 'Mate in One: Queen & Rook', desc: '4 lessons • Basic checkmates', lessons: mockLessons(4) },
  { id: '2', name: 'Fork Fundamentals', desc: '5 lessons • Knight & bishop forks', lessons: mockLessons(5) },
  { id: '3', name: 'Pin & Skewer Basics', desc: '4 lessons • Line attacks', lessons: mockLessons(4) },
  { id: '4', name: 'Review: Block 1', desc: '3 lessons • Mixed practice', lessons: mockLessons(3), isReview: true },
];

// ─── Lesson puck (visual only) ──────────────────────────────────────────────
function LessonPuck({ piece, color, delay }: { piece: string; color: string; delay?: number }) {
  return (
    <div
      className="flex flex-col items-center"
      style={{ animationDelay: delay ? `${delay}ms` : undefined }}
    >
      <div className="relative" style={{ width: 76, height: 82 }}>
        {/* Shadow layer */}
        <div
          className="absolute rounded-full"
          style={{
            width: 76, height: 76,
            top: 6, left: 3,
            backgroundColor: `color-mix(in srgb, ${color} 60%, black)`,
          }}
        />
        {/* Top layer */}
        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: 76, height: 76,
            backgroundColor: color,
          }}
        >
          <span className="text-white text-3xl" style={{ textShadow: '1px 2px 3px rgba(0,0,0,0.3)' }}>
            {piece}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Section header ─────────────────────────────────────────────────────────
function SectionHeader({
  section,
  index,
  isExpanded,
  onToggle,
}: {
  section: typeof SECTIONS[number];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const color = section.isReview ? '#E91E63' : COLORS[index % COLORS.length];
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300"
      style={{
        backgroundColor: isExpanded ? color : 'white',
        boxShadow: isExpanded ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
        style={{
          backgroundColor: isExpanded ? 'rgba(255,255,255,0.2)' : color,
          color: 'white',
        }}
      >
        {section.isReview ? '★' : index + 1}
      </div>
      <div className="flex-1 text-left">
        <div className={`font-bold ${isExpanded ? 'text-white' : 'text-[#3c3c3c]'}`}>{section.name}</div>
        <div className={`text-xs ${isExpanded ? 'text-white/70' : 'text-[#afafaf]'}`}>{section.desc}</div>
      </div>
      <div
        className={`text-xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        style={{ color: isExpanded ? 'rgba(255,255,255,0.7)' : color }}
      >
        ▾
      </div>
    </button>
  );
}

// ─── Lessons row ────────────────────────────────────────────────────────────
function LessonsRow({ section, index, stagger }: { section: typeof SECTIONS[number]; index: number; stagger?: boolean }) {
  const color = section.isReview ? '#E91E63' : COLORS[index % COLORS.length];
  return (
    <div className="mt-4 px-2">
      <div className="flex flex-row justify-evenly items-start">
        {section.lessons.map((lesson, li) => (
          <div key={lesson.id} className={stagger ? 'stagger-child' : ''} style={stagger ? { animationDelay: `${li * 60}ms` } : undefined}>
            <LessonPuck piece={lesson.piece} color={color} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

// 1. MAX-HEIGHT ACCORDION ────────────────────────────────────────────────────
function MaxHeightAccordion({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  return (
    <div className="mb-3">
      <SectionHeader section={section} index={index} isExpanded={expanded} onToggle={() => setExpanded(!expanded)} />
      <div
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ maxHeight: expanded ? height : 0, opacity: expanded ? 1 : 0 }}
      >
        <div ref={contentRef}>
          <LessonsRow section={section} index={index} />
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

// 2. SPRING BOUNCE ───────────────────────────────────────────────────────────
function SpringBounce({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  return (
    <div className="mb-3">
      <SectionHeader section={section} index={index} isExpanded={expanded} onToggle={() => setExpanded(!expanded)} />
      <div
        className="overflow-hidden"
        style={{
          maxHeight: expanded ? height : 0,
          opacity: expanded ? 1 : 0,
          transition: expanded
            ? 'max-height 600ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease'
            : 'max-height 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease',
        }}
      >
        <div ref={contentRef}>
          <LessonsRow section={section} index={index} />
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

// 3. SCALE-Y UNFOLD ──────────────────────────────────────────────────────────
function ScaleYUnfold({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-3">
      <SectionHeader section={section} index={index} isExpanded={expanded} onToggle={() => setExpanded(!expanded)} />
      <div
        style={{
          transformOrigin: 'top center',
          transform: expanded ? 'scaleY(1)' : 'scaleY(0)',
          opacity: expanded ? 1 : 0,
          maxHeight: expanded ? 200 : 0,
          transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease, max-height 400ms ease',
          overflow: 'hidden',
        }}
      >
        <LessonsRow section={section} index={index} />
        <div className="h-2" />
      </div>
    </div>
  );
}

// 4. SLIDE DOWN + FADE ───────────────────────────────────────────────────────
function SlideDownFade({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  return (
    <div className="mb-3">
      <SectionHeader section={section} index={index} isExpanded={expanded} onToggle={() => setExpanded(!expanded)} />
      <div
        className="overflow-hidden"
        style={{
          maxHeight: expanded ? height : 0,
          transition: 'max-height 450ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          ref={contentRef}
          style={{
            transform: expanded ? 'translateY(0)' : 'translateY(-20px)',
            opacity: expanded ? 1 : 0,
            transition: expanded
              ? 'transform 400ms cubic-bezier(0.0, 0.0, 0.2, 1) 50ms, opacity 350ms ease 50ms'
              : 'transform 300ms ease, opacity 200ms ease',
          }}
        >
          <LessonsRow section={section} index={index} />
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

// 5. STAGGERED CHILDREN ──────────────────────────────────────────────────────
function StaggeredChildren({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  const color = section.isReview ? '#E91E63' : COLORS[index % COLORS.length];

  return (
    <div className="mb-3">
      <SectionHeader section={section} index={index} isExpanded={expanded} onToggle={() => setExpanded(!expanded)} />
      <div
        className="overflow-hidden"
        style={{
          maxHeight: expanded ? height + 40 : 0,
          transition: 'max-height 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div ref={contentRef} className="mt-4 px-2">
          <div className="flex flex-row justify-evenly items-start">
            {section.lessons.map((lesson, li) => (
              <div
                key={lesson.id}
                style={{
                  opacity: expanded ? 1 : 0,
                  transform: expanded ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
                  transition: expanded
                    ? `opacity 300ms ease ${li * 75 + 100}ms, transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${li * 75 + 100}ms`
                    : `opacity 150ms ease ${(section.lessons.length - li) * 30}ms, transform 200ms ease ${(section.lessons.length - li) * 30}ms`,
                }}
              >
                <LessonPuck piece={lesson.piece} color={color} />
              </div>
            ))}
          </div>
        </div>
        <div className="h-2" />
      </div>
    </div>
  );
}

// 6. ELASTIC REVEAL ──────────────────────────────────────────────────────────
function ElasticReveal({ section, index }: { section: typeof SECTIONS[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  return (
    <div className="mb-3">
      <SectionHeader section={section} index={index} isExpanded={expanded} onToggle={() => setExpanded(!expanded)} />
      <div
        className="overflow-hidden"
        style={{
          maxHeight: expanded ? height : 0,
          transition: expanded
            ? 'max-height 700ms cubic-bezier(0.22, 1, 0.36, 1)'
            : 'max-height 350ms cubic-bezier(0.4, 0, 1, 1)',
        }}
      >
        <div
          ref={contentRef}
          style={{
            transform: expanded ? 'translateY(0)' : 'translateY(-10px)',
            opacity: expanded ? 1 : 0,
            filter: expanded ? 'blur(0px)' : 'blur(4px)',
            transition: expanded
              ? 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1) 80ms, opacity 400ms ease 80ms, filter 400ms ease 80ms'
              : 'transform 250ms ease, opacity 200ms ease, filter 200ms ease',
          }}
        >
          <LessonsRow section={section} index={index} />
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO COLUMN — wraps a variant and renders all 4 mock sections
// ═══════════════════════════════════════════════════════════════════════════════

function DemoColumn({
  title,
  subtitle,
  Variant,
}: {
  title: string;
  subtitle: string;
  Variant: React.ComponentType<{ section: typeof SECTIONS[number]; index: number }>;
}) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-black text-[#3c3c3c]">{title}</h2>
        <p className="text-xs text-[#afafaf]">{subtitle}</p>
      </div>
      {SECTIONS.map((section, i) => (
        <Variant key={section.id} section={section} index={i} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const VARIANTS: { title: string; subtitle: string; Component: React.ComponentType<{ section: typeof SECTIONS[number]; index: number }> }[] = [
  {
    title: '1. Smooth Accordion',
    subtitle: 'Height transition with ease-out. Clean, no frills.',
    Component: MaxHeightAccordion,
  },
  {
    title: '2. Spring Bounce',
    subtitle: 'Overshoots slightly then settles. Playful, Duolingo-esque.',
    Component: SpringBounce,
  },
  {
    title: '3. Scale-Y Unfold',
    subtitle: 'Unfolds from header like a paper fold. Fast and snappy.',
    Component: ScaleYUnfold,
  },
  {
    title: '4. Slide Down + Fade',
    subtitle: 'Content slides in from above with fade. Polished feel.',
    Component: SlideDownFade,
  },
  {
    title: '5. Staggered Children',
    subtitle: 'Each lesson puck bounces in one by one. Delightful.',
    Component: StaggeredChildren,
  },
  {
    title: '6. Elastic + Blur',
    subtitle: 'Deblurs and slides into place. Premium, iOS-like.',
    Component: ElasticReveal,
  },
];

export default function TestSectionAnimations() {
  const [activeVariant, setActiveVariant] = useState(0);

  return (
    <div className="min-h-screen bg-[#eef6fc] pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#131F24] text-white px-4 py-3 shadow-lg">
        <h1 className="text-lg font-black">Section Unfold Animations</h1>
        <p className="text-xs text-white/60">Tap sections to test each animation. Watch how content below shifts.</p>
      </div>

      {/* Tab selector */}
      <div className="sticky top-[60px] z-40 bg-[#eef6fc] border-b border-black/5 px-2 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {VARIANTS.map((v, i) => (
            <button
              key={i}
              onClick={() => setActiveVariant(i)}
              className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeVariant === i ? '#131F24' : 'white',
                color: activeVariant === i ? 'white' : '#3c3c3c',
                boxShadow: activeVariant === i ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              {v.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active demo */}
      <div className="px-4 pt-4">
        <DemoColumn
          key={activeVariant}
          title={VARIANTS[activeVariant].title}
          subtitle={VARIANTS[activeVariant].subtitle}
          Variant={VARIANTS[activeVariant].Component}
        />
      </div>

      {/* Side-by-side comparison */}
      <div className="px-4 pt-8 mt-8 border-t border-black/10">
        <h2 className="text-lg font-black text-[#3c3c3c] mb-1">Side-by-Side Comparison</h2>
        <p className="text-xs text-[#afafaf] mb-4">Open the same section on two variants to compare the push-down effect.</p>
        <div className="grid grid-cols-2 gap-4">
          <ComparisonColumn />
          <ComparisonColumn />
        </div>
      </div>
    </div>
  );
}

// Side-by-side selector
function ComparisonColumn() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const V = VARIANTS[selectedIdx].Component;

  return (
    <div>
      <select
        value={selectedIdx}
        onChange={(e) => setSelectedIdx(Number(e.target.value))}
        className="w-full mb-3 p-2 rounded-lg text-xs font-bold bg-white text-[#3c3c3c] border border-black/10"
      >
        {VARIANTS.map((v, i) => (
          <option key={i} value={i}>{v.title}</option>
        ))}
      </select>
      {SECTIONS.map((section, i) => (
        <V key={section.id} section={section} index={i} />
      ))}
    </div>
  );
}
