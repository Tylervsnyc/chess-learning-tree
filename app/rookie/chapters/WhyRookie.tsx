export interface TourStats {
  voicedLines: number;
  moods: number;
  liveMoods: number;
  tapReactions: number;
  alarms: number;
  sfxGags: number;
}

export function WhyRookie({ stats }: { stats: TourStats }) {
  const tiles: [string, string][] = [
    [String(stats.voicedLines), 'voiced lines, recorded and shipping'],
    [String(stats.moods), `color moods (${stats.liveMoods} live in games)`],
    [String(stats.tapReactions), 'tap-to-play reactions on the Play screen'],
    [String(stats.alarms + 1), 'meltdown alarms when she is losing'],
    [String(stats.sfxGags), 'sabotage gags with sound effects'],
    ['Live', 'mood driven by the engine evaluation'],
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {tiles.map(([n, label]) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            <p className="text-3xl font-black tabular-nums">{n}</p>
            <p className="mt-1 text-sm text-chess-text-muted">{label}</p>
          </div>
        ))}
      </div>
      <ul className="mt-6 space-y-2 text-chess-text max-w-prose">
        <li><b>A point of view.</b> She is a rook, and every opinion she has comes from that.</li>
        <li><b>Readable at a glance.</b> Her color tells you who is winning before you read a word.</li>
        <li><b>Funny when it counts.</b> Losing to a beginner is the moment she shines, which makes beginners feel great.</li>
        <li><b>Already built.</b> Everything on this page is the live production character, not a mockup.</li>
      </ul>
    </>
  );
}
