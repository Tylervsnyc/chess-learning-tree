'use client';

import React from 'react';
import { ChessKnightIcon } from '@/components/ui/icons';

interface HeaderProps {
  level?: number;
  eloRange?: string;
}

export function Header({ level = 1, eloRange = '400-600 ELO' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#131F24] border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        {/* Logo / App name */}
        <div className="flex items-center gap-2">
          <ChessKnightIcon size={28} className="text-[#FFD700]" />
          <span className="text-lg font-bold text-white">ChessPro</span>
        </div>

        {/* Level indicator */}
        <div className="flex items-center gap-2 bg-[#1A2C35] px-3 py-1.5 rounded-full">
          <span className="text-sm font-medium text-[#58CC02]">Level {level}</span>
          <span className="text-xs text-gray-400">{eloRange}</span>
        </div>
      </div>
    </header>
  );
}
