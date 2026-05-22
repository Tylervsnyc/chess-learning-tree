'use client';

const RULES: { n: number; text: string }[] = [
  { n: 1, text: 'Reach the 8th rank' },
  { n: 2, text: 'Capture to charge tempo' },
  { n: 3, text: 'Show no mercy' },
];

export function RulesInline() {
  return (
    <ul className="flex flex-col gap-[1px] sm:gap-1">
      {RULES.map((r) => (
        <li key={r.n} className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-indigo-500 text-white text-[7px] sm:text-[8px] font-black flex items-center justify-center shrink-0 leading-none">
            {r.n}
          </span>
          <span className="text-[9.5px] sm:text-[10.5px] font-bold text-chess-text leading-[1.1]">
            {r.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
