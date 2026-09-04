/** Tiny 7-day bar sparkline; last bar (today) is highlighted. */
export default function Sparkline({ values, tone = '#58CC02' }: { values: number[]; tone?: string }) {
  const max = Math.max(1, ...values);
  const w = 8, gap = 3, h = 22;
  return (
    <svg width={values.length * (w + gap)} height={h} aria-hidden className="shrink-0">
      {values.map((v, i) => {
        const bh = Math.max(2, Math.round((v / max) * h));
        const last = i === values.length - 1;
        return (
          <rect key={i} x={i * (w + gap)} y={h - bh} width={w} height={bh} rx={2}
            fill={tone} opacity={last ? 1 : 0.4} />
        );
      })}
    </svg>
  );
}
