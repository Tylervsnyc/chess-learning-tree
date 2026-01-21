'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLessonProgress } from '@/hooks/useProgress';
import { level1 } from '@/data/level1-curriculum';
import { level2 } from '@/data/level2-curriculum';
import { level3 } from '@/data/level3-curriculum';
import { level4 } from '@/data/level4-curriculum';

// ============================================================
// USER TIER CONFIGURATION
// ============================================================

export type UserTier = 'admin' | 'free' | 'premium';

export interface TierConfig {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  dailyLessonLimit: number; // -1 = unlimited
  canAccessAllLevels: boolean;
  allowedLevels: number[]; // Level indices (0 = beginner, 1 = casual, etc.)
  canSkipLessons: boolean;
  canResetProgress: boolean;
  showDevTools: boolean;
}

export const TIER_CONFIGS: Record<UserTier, TierConfig> = {
  admin: {
    name: 'Admin',
    description: 'Full access to everything. Can skip lessons, reset progress, access dev tools.',
    color: '#FF4B4B',
    bgColor: '#FF4B4B20',
    dailyLessonLimit: -1,
    canAccessAllLevels: true,
    allowedLevels: [0, 1, 2, 3, 4, 5],
    canSkipLessons: true,
    canResetProgress: true,
    showDevTools: true,
  },
  free: {
    name: 'Free User',
    description: 'Limited to 3 lessons per day. Access to Levels 1-3.',
    color: '#6B7280',
    bgColor: '#6B728020',
    dailyLessonLimit: 3,
    canAccessAllLevels: false,
    allowedLevels: [0, 1, 2], // Levels 1, 2, 3
    canSkipLessons: false,
    canResetProgress: false,
    showDevTools: false,
  },
  premium: {
    name: 'Premium User',
    description: 'Unlimited lessons per day. Access to all levels. Must follow curriculum.',
    color: '#FFD700',
    bgColor: '#FFD70020',
    dailyLessonLimit: -1,
    canAccessAllLevels: true,
    allowedLevels: [0, 1, 2, 3, 4, 5],
    canSkipLessons: false,
    canResetProgress: false,
    showDevTools: false,
  },
};

// ============================================================
// SIMULATED USER CONTEXT
// ============================================================

interface SimulatedUserState {
  tier: UserTier;
  lessonsCompletedToday: number;
  dailyLimitResetTime: Date;
}

interface SimulatedUserContextType {
  state: SimulatedUserState;
  config: TierConfig;
  setTier: (tier: UserTier) => void;
  completeLessonToday: () => void;
  resetDailyCount: () => void;
  canStartLesson: () => { allowed: boolean; reason?: string };
  getRemainingLessons: () => number | 'unlimited';
}

const SimulatedUserContext = createContext<SimulatedUserContextType | null>(null);

function SimulatedUserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulatedUserState>({
    tier: 'free',
    lessonsCompletedToday: 0,
    dailyLimitResetTime: getNextMidnight(),
  });

  const config = TIER_CONFIGS[state.tier];

  function getNextMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight;
  }

  const setTier = (tier: UserTier) => {
    setState(prev => ({ ...prev, tier }));
  };

  const completeLessonToday = () => {
    setState(prev => ({
      ...prev,
      lessonsCompletedToday: prev.lessonsCompletedToday + 1,
    }));
  };

  const resetDailyCount = () => {
    setState(prev => ({
      ...prev,
      lessonsCompletedToday: 0,
      dailyLimitResetTime: getNextMidnight(),
    }));
  };

  const canStartLesson = (): { allowed: boolean; reason?: string } => {
    if (config.dailyLessonLimit === -1) {
      return { allowed: true };
    }
    if (state.lessonsCompletedToday >= config.dailyLessonLimit) {
      return {
        allowed: false,
        reason: `Daily limit reached (${config.dailyLessonLimit} lessons). Resets at midnight.`,
      };
    }
    return { allowed: true };
  };

  const getRemainingLessons = (): number | 'unlimited' => {
    if (config.dailyLessonLimit === -1) return 'unlimited';
    return Math.max(0, config.dailyLessonLimit - state.lessonsCompletedToday);
  };

  return (
    <SimulatedUserContext.Provider
      value={{
        state,
        config,
        setTier,
        completeLessonToday,
        resetDailyCount,
        canStartLesson,
        getRemainingLessons,
      }}
    >
      {children}
    </SimulatedUserContext.Provider>
  );
}

function useSimulatedUser() {
  const context = useContext(SimulatedUserContext);
  if (!context) {
    throw new Error('useSimulatedUser must be used within SimulatedUserProvider');
  }
  return context;
}

// ============================================================
// COMPONENTS
// ============================================================

function TierSelector() {
  const { state, setTier } = useSimulatedUser();

  return (
    <div className="flex gap-2">
      {(Object.keys(TIER_CONFIGS) as UserTier[]).map(tier => {
        const config = TIER_CONFIGS[tier];
        const isActive = state.tier === tier;
        return (
          <button
            key={tier}
            onClick={() => setTier(tier)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              isActive
                ? 'ring-2 ring-white scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: config.bgColor,
              color: config.color,
              borderColor: config.color,
            }}
          >
            {config.name}
          </button>
        );
      })}
    </div>
  );
}

function CurrentUserPanel() {
  const { state, config, getRemainingLessons, resetDailyCount } = useSimulatedUser();
  const remaining = getRemainingLessons();

  return (
    <div
      className="rounded-xl p-4 border-2"
      style={{ backgroundColor: config.bgColor, borderColor: config.color }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold" style={{ color: config.color }}>
          {config.name}
        </h2>
        <span
          className="px-2 py-1 rounded text-xs font-bold"
          style={{ backgroundColor: config.color, color: '#000' }}
        >
          {state.tier.toUpperCase()}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-4">{config.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Daily Lessons:</span>
          <div className="font-bold text-white">
            {config.dailyLessonLimit === -1 ? 'Unlimited' : config.dailyLessonLimit}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Remaining Today:</span>
          <div className="font-bold" style={{ color: remaining === 0 ? '#FF4B4B' : '#58CC02' }}>
            {remaining === 'unlimited' ? '∞' : remaining}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Completed Today:</span>
          <div className="font-bold text-white">{state.lessonsCompletedToday}</div>
        </div>
        <div>
          <span className="text-gray-500">Levels Access:</span>
          <div className="font-bold text-white">
            {config.canAccessAllLevels ? 'All (1-6)' : `1-${config.allowedLevels.length}`}
          </div>
        </div>
      </div>

      {config.dailyLessonLimit !== -1 && (
        <div className="mt-4">
          <div className="h-2 bg-[#0D1A1F] rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${(state.lessonsCompletedToday / config.dailyLessonLimit) * 100}%`,
                backgroundColor: state.lessonsCompletedToday >= config.dailyLessonLimit ? '#FF4B4B' : '#58CC02',
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{state.lessonsCompletedToday} used</span>
            <span>{config.dailyLessonLimit - state.lessonsCompletedToday} left</span>
          </div>
        </div>
      )}

      {config.showDevTools && (
        <button
          onClick={resetDailyCount}
          className="mt-4 w-full py-2 bg-[#0D1A1F] rounded-lg text-sm text-gray-400 hover:text-white"
        >
          Reset Daily Count (Admin)
        </button>
      )}
    </div>
  );
}

function FeatureAccessGrid() {
  const { config } = useSimulatedUser();

  const features = [
    { name: 'Complete Lessons', free: true, premium: true, admin: true },
    { name: 'Daily Limit', free: '3/day', premium: 'Unlimited', admin: 'Unlimited' },
    { name: 'Level 1 (Beginner)', free: true, premium: true, admin: true },
    { name: 'Level 2 (Casual)', free: true, premium: true, admin: true },
    { name: 'Level 3 (Club)', free: true, premium: true, admin: true },
    { name: 'Level 4+ (Advanced)', free: false, premium: true, admin: true },
    { name: 'Skip Lessons', free: false, premium: false, admin: true },
    { name: 'Reset Progress', free: false, premium: false, admin: true },
    { name: 'Dev Tools', free: false, premium: false, admin: true },
    { name: 'Daily Challenge', free: true, premium: true, admin: true },
    { name: 'Workout Mode', free: '15 puzzles', premium: 'Unlimited', admin: 'Unlimited' },
  ];

  const renderCell = (value: boolean | string, tier: UserTier) => {
    const isCurrentTier = config.name.toLowerCase().includes(tier);
    const baseClass = isCurrentTier ? 'ring-2 ring-white/50' : '';

    if (typeof value === 'boolean') {
      return (
        <div className={`text-center p-2 rounded ${baseClass}`}>
          {value ? (
            <span className="text-green-500 text-lg">✓</span>
          ) : (
            <span className="text-red-500 text-lg">✗</span>
          )}
        </div>
      );
    }
    return (
      <div className={`text-center p-2 rounded text-sm ${baseClass}`}>
        <span className="text-gray-300">{value}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#1A2C35] rounded-xl p-4">
      <h3 className="font-bold text-white mb-4">Feature Access by Tier</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 text-gray-400">Feature</th>
              <th className="text-center py-2 text-gray-500">Free</th>
              <th className="text-center py-2 text-yellow-500">Premium</th>
              <th className="text-center py-2 text-red-500">Admin</th>
            </tr>
          </thead>
          <tbody>
            {features.map(feature => (
              <tr key={feature.name} className="border-b border-white/5">
                <td className="py-2 text-gray-300">{feature.name}</td>
                <td>{renderCell(feature.free, 'free')}</td>
                <td>{renderCell(feature.premium, 'premium')}</td>
                <td>{renderCell(feature.admin, 'admin')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SimulatedLessonList() {
  const { state, config, canStartLesson, completeLessonToday } = useSimulatedUser();
  const { completedLessons, isLessonCompleted } = useLessonProgress();
  const router = useRouter();

  // Get lessons from all levels
  const level1Lessons = level1.modules.flatMap(m => m.lessons);
  const level2Lessons = level2.modules.flatMap(m => m.lessons);
  const level3Lessons = level3.modules.flatMap(m => m.lessons);
  const level4Lessons = level4.modules.flatMap(m => m.lessons);

  const getLessonsForLevel = (levelIndex: number) => {
    switch (levelIndex) {
      case 0: return level1Lessons;
      case 1: return level2Lessons;
      case 2: return level3Lessons;
      case 3: return level4Lessons;
      default: return [];
    }
  };

  const handleStartLesson = (lessonId: string, levelIndex: number) => {
    const canStart = canStartLesson();

    if (!canStart.allowed) {
      alert(canStart.reason);
      return;
    }

    if (!config.allowedLevels.includes(levelIndex)) {
      alert(`${config.name} cannot access Level ${levelIndex + 1}. Upgrade to Premium!`);
      return;
    }

    // Check if lesson is unlocked (unless admin or can skip)
    if (!config.canSkipLessons) {
      const allLessons = getLessonsForLevel(levelIndex);
      const lessonIndex = allLessons.findIndex(l => l.id === lessonId);

      if (lessonIndex > 0) {
        const previousLesson = allLessons[lessonIndex - 1];
        if (!isLessonCompleted(previousLesson.id)) {
          alert('Complete the previous lesson first!');
          return;
        }
      }
    }

    // Simulate completing the lesson
    completeLessonToday();
    router.push(`/lesson/${lessonId}`);
  };

  const renderLessonCard = (
    lesson: { id: string; name: string; description: string },
    levelIndex: number,
    lessonIndex: number,
    allLessons: { id: string }[]
  ) => {
    const completed = isLessonCompleted(lesson.id);
    const levelAllowed = config.allowedLevels.includes(levelIndex);

    // Check if unlocked
    let unlocked = true;
    if (!config.canSkipLessons && lessonIndex > 0) {
      const previousLesson = allLessons[lessonIndex - 1];
      unlocked = isLessonCompleted(previousLesson.id);
    }

    const canAccess = levelAllowed && (unlocked || config.canSkipLessons);
    const { allowed: dailyAllowed } = canStartLesson();

    return (
      <button
        key={lesson.id}
        onClick={() => handleStartLesson(lesson.id, levelIndex)}
        disabled={!canAccess || (!dailyAllowed && !completed)}
        className={`w-full text-left p-3 rounded-lg border transition-all ${
          completed
            ? 'bg-green-500/20 border-green-500/50'
            : canAccess && dailyAllowed
            ? 'bg-[#1A2C35] border-transparent hover:border-[#58CC02]'
            : 'bg-[#0D1A1F] border-transparent opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
              completed
                ? 'bg-green-500 text-white'
                : !levelAllowed
                ? 'bg-yellow-500/20 text-yellow-500'
                : !unlocked
                ? 'bg-gray-700 text-gray-500'
                : 'bg-[#58CC02] text-white'
            }`}
          >
            {completed ? '✓' : !levelAllowed ? '👑' : !unlocked ? '🔒' : lessonIndex + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white truncate">{lesson.name}</div>
            <div className="text-xs text-gray-500 truncate">{lesson.description}</div>
          </div>
          {!levelAllowed && (
            <span className="text-xs text-yellow-500 font-semibold">PREMIUM</span>
          )}
        </div>
      </button>
    );
  };

  const levels = [
    { index: 0, name: 'Level 1: Foundations', lessons: level1Lessons },
    { index: 1, name: 'Level 2: Casual Player', lessons: level2Lessons },
    { index: 2, name: 'Level 3: Club Player', lessons: level3Lessons },
    { index: 3, name: 'Level 4: Tournament', lessons: level4Lessons },
  ];

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
      {levels.map(level => (
        <div key={level.index}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-white">{level.name}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                config.allowedLevels.includes(level.index)
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-yellow-500/20 text-yellow-500'
              }`}
            >
              {config.allowedLevels.includes(level.index) ? 'Available' : 'Premium Only'}
            </span>
          </div>
          <div className="space-y-2">
            {level.lessons.slice(0, 4).map((lesson, i) =>
              renderLessonCard(lesson, level.index, i, level.lessons)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionLog() {
  const { state, config } = useSimulatedUser();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const log = `[${new Date().toLocaleTimeString()}] Switched to ${config.name}`;
    setLogs(prev => [log, ...prev].slice(0, 10));
  }, [state.tier, config.name]);

  useEffect(() => {
    if (state.lessonsCompletedToday > 0) {
      const log = `[${new Date().toLocaleTimeString()}] Lesson completed (${state.lessonsCompletedToday} today)`;
      setLogs(prev => [log, ...prev].slice(0, 10));
    }
  }, [state.lessonsCompletedToday]);

  return (
    <div className="bg-[#0D1A1F] rounded-xl p-4">
      <h3 className="font-bold text-white mb-2">Activity Log</h3>
      <div className="space-y-1 text-xs font-mono text-gray-500 max-h-32 overflow-y-auto">
        {logs.length === 0 ? (
          <p>No activity yet...</p>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>
    </div>
  );
}

function UpgradePrompt() {
  const { state, config, canStartLesson } = useSimulatedUser();
  const { allowed, reason } = canStartLesson();

  if (state.tier !== 'free') return null;
  if (allowed && state.lessonsCompletedToday < 2) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl">👑</div>
        <div>
          <h3 className="font-bold text-yellow-500">
            {!allowed ? 'Daily Limit Reached!' : 'Running Low on Lessons'}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {!allowed
              ? reason
              : `You have ${config.dailyLessonLimit - state.lessonsCompletedToday} lesson(s) left today.`}
          </p>
          <button className="mt-3 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg text-sm hover:bg-yellow-400">
            Upgrade to Premium - Unlimited Lessons
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

function TestPageContent() {
  const { state, config } = useSimulatedUser();
  const { resetProgress } = useLessonProgress();

  return (
    <div className="min-h-screen bg-[#131F24] text-white">
      {/* Header */}
      <div
        className="border-b px-6 py-4"
        style={{ borderColor: config.color + '40', backgroundColor: config.bgColor }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">User Role Testing</h1>
              <p className="text-gray-400 text-sm">
                Simulate different user types to test app behavior
              </p>
            </div>
            <TierSelector />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="space-y-6">
            <CurrentUserPanel />
            <UpgradePrompt />
            <ActionLog />

            {config.canResetProgress && (
              <button
                onClick={() => {
                  if (confirm('Reset all lesson progress?')) {
                    resetProgress();
                  }
                }}
                className="w-full py-2 bg-red-500/20 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/30"
              >
                Reset All Progress (Admin)
              </button>
            )}
          </div>

          {/* Middle Column - Lessons */}
          <div className="lg:col-span-1">
            <h2 className="font-bold text-lg mb-4">Curriculum Preview</h2>
            <SimulatedLessonList />
          </div>

          {/* Right Column - Feature Grid */}
          <div>
            <FeatureAccessGrid />

            <div className="mt-6 bg-[#1A2C35] rounded-xl p-4">
              <h3 className="font-bold text-white mb-3">Quick Test Scenarios</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-[#0D1A1F] rounded-lg">
                  <div className="font-semibold text-gray-300">Free User Journey</div>
                  <ol className="text-gray-500 text-xs mt-1 list-decimal list-inside">
                    <li>Select "Free User" tier</li>
                    <li>Complete 3 lessons</li>
                    <li>Try to start 4th lesson - see limit</li>
                    <li>Try Level 2 - see upgrade prompt</li>
                  </ol>
                </div>
                <div className="p-3 bg-[#0D1A1F] rounded-lg">
                  <div className="font-semibold text-gray-300">Premium User Journey</div>
                  <ol className="text-gray-500 text-xs mt-1 list-decimal list-inside">
                    <li>Select "Premium" tier</li>
                    <li>Complete many lessons - no limit</li>
                    <li>Access Level 2 content</li>
                    <li>Must still follow curriculum order</li>
                  </ol>
                </div>
                <div className="p-3 bg-[#0D1A1F] rounded-lg">
                  <div className="font-semibold text-gray-300">Admin Testing</div>
                  <ol className="text-gray-500 text-xs mt-1 list-decimal list-inside">
                    <li>Select "Admin" tier</li>
                    <li>Skip to any lesson</li>
                    <li>Reset progress anytime</li>
                    <li>Reset daily count for testing</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserTestingPage() {
  return (
    <SimulatedUserProvider>
      <TestPageContent />
    </SimulatedUserProvider>
  );
}
