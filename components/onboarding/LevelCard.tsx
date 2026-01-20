'use client';

import { SelectedLevel } from '@/hooks/useOnboarding';

interface LevelCardProps {
  level: SelectedLevel;
  title: string;
  eloRange: string;
  description: string;
  icon: string;
  gradient: string;
  selected: boolean;
  onClick: () => void;
}

export function LevelCard({
  title,
  eloRange,
  description,
  icon,
  gradient,
  selected,
  onClick,
}: LevelCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl text-left transition-all duration-200
        ${selected
          ? 'ring-2 ring-white scale-[1.02]'
          : 'ring-1 ring-white/10 hover:ring-white/30'
        }
      `}
      style={{
        background: selected ? gradient : '#1A2C35',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-white text-lg">{title}</h3>
            <span className={`text-sm ${selected ? 'text-white/80' : 'text-gray-400'}`}>
              {eloRange}
            </span>
          </div>
          <p className={`text-sm ${selected ? 'text-white/90' : 'text-gray-400'}`}>
            {description}
          </p>
        </div>
        {selected && (
          <div className="text-white text-xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
              <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// Level data configurations
export const LEVEL_CONFIGS = {
  beginner: {
    title: 'Beginner',
    eloRange: '< 800 ELO',
    description: 'Just learning the basics - piece movement and simple tactics',
    icon: '🌱',
    gradient: 'linear-gradient(135deg, #58CC02, #2FCBEF)',
  },
  intermediate: {
    title: 'Intermediate',
    eloRange: '800-1200 ELO',
    description: 'Know the rules well and learning tactical patterns',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #1CB0F6, #A560E8)',
  },
  advanced: {
    title: 'Advanced',
    eloRange: '1200+ ELO',
    description: 'Comfortable with tactics, looking to sharpen skills',
    icon: '🏆',
    gradient: 'linear-gradient(135deg, #FF9600, #FF6B6B)',
  },
} as const;
