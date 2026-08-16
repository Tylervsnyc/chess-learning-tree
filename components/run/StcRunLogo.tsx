'use client';

import Image from 'next/image';
import { RookiesRunLogo } from './RookiesRunLogo';

interface StcRunLogoProps {
  scale?: number;
  className?: string;
}

export function StcRunLogo({ scale = 1, className }: StcRunLogoProps) {
  const stcHeight = 90 * scale;
  const stcWidth = stcHeight * (3000 / 2157);
  const crossSize = 22 * scale;

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <Image
        src="/stc/logo.png"
        alt="Story Time Chess"
        width={stcWidth}
        height={stcHeight}
        priority
        style={{ height: stcHeight, width: 'auto' }}
      />
      <span
        className="font-black text-chess-text-muted leading-none"
        style={{ fontSize: crossSize }}
      >
        ×
      </span>
      <RookiesRunLogo scale={scale * 0.55} />
    </div>
  );
}
