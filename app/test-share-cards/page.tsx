'use client';

const SAMPLE_RESULTS = '1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0';
// Full FEN with active color (b = black to move), lastMove = opponent's setup move (d3e5), side = player color
const DAILY_BASE_PARAMS = `score=17&time=214000&rank=5&total=142&name=Tyler&results=${SAMPLE_RESULTS}`;
const LESSON_PARAMS = 'score=5/6&lesson=Fork+School+101&level=1&levelName=Begin+to+Believe&accuracy=83&streak=12';

const cards = [
  {
    title: 'Lesson Complete',
    description: 'Score, accuracy, lesson name. Level name big and prominent. Board from player perspective with highlighted last move.',
    src: `/api/og/lesson?${LESSON_PARAMS}`,
  },
  {
    title: 'The Daily Rook - V1: Clean Line',
    description: 'No card. Score big (72px), name/time/rank on a clean line below. Minimal — lets the pills + grid speak.',
    src: `/api/og/daily-challenge?${DAILY_BASE_PARAMS}&variant=1`,
  },
  {
    title: 'The Daily Rook - V2: Scoreboard',
    description: 'Results as pills matching the rules style. Score/name/time/rank each in their own pill. Cohesive.',
    src: `/api/og/daily-challenge?${DAILY_BASE_PARAMS}&variant=2`,
  },
  {
    title: 'The Daily Rook - V3: White Card',
    description: 'Clean white card. Score 56px, green "Top 4%" pill badge, name + time below. Polished.',
    src: `/api/og/daily-challenge?${DAILY_BASE_PARAMS}&variant=3`,
  },
  {
    title: 'The Daily Rook - V4: Challenge',
    description: '"Tyler got 17 in 3:34" as a bold sentence. "Can you beat that?" in blue. Shareable energy.',
    src: `/api/og/daily-challenge?${DAILY_BASE_PARAMS}&variant=4`,
  },
  {
    title: 'The Daily Rook - V5: Score Circle',
    description: 'Score in a big gradient circle badge. Name and stats beside it. Feels like a trophy you earned.',
    src: `/api/og/daily-challenge?${DAILY_BASE_PARAMS}&variant=5`,
  },
];

export default function TestShareCardsPage() {
  return (
    <div className="h-full overflow-auto bg-[#0D1A1F] text-white px-6 py-12">
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 800,
            marginBottom: '8px',
          }}
        >
          Share Card Design Lab
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '16px',
            marginBottom: '48px',
          }}
        >
          Preview all OG image variants. These are generated server-side via Satori and served as PNG images.
        </p>

        {cards.map((card, i) => (
          <div key={i} style={{ marginBottom: '48px' }}>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              {card.title}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: '14px',
                marginBottom: '16px',
              }}
            >
              {card.description}
            </p>
            <div
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt={card.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
            <p
              style={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: '12px',
                marginTop: '8px',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}
            >
              {card.src}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
