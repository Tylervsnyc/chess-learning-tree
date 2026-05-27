import { useMemo } from 'react';
import { useLessonProgress } from '@/hooks/useProgress';
import { selectByCategory } from '@/lib/speech/priority-queue';
import { QUIP_POOL } from '@/lib/quips/quip-pool';
import { toneForLevel } from '@/lib/quips/tone';
import { useUser } from '@/hooks/useUser';

export type WorkoutActivity = 'play' | 'tactics' | 'daily';

export interface DailyWorkoutStatus {
  play: boolean;
  tactics: boolean;
  daily: boolean;
  allDone: boolean;
  completedCount: number;
  nextActivity: WorkoutActivity | null;
}

const NEXT_MAP: Record<WorkoutActivity, WorkoutActivity[]> = {
  play: ['tactics', 'daily'],
  tactics: ['daily', 'play'],
  daily: ['play', 'tactics'],
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function useDailyWorkout(justCompleted?: WorkoutActivity) {
  const {
    ritualPlayDate,
    ritualTacticsDate,
    ritualDailyDate,
    recordRitualPlay,
  } = useLessonProgress();
  const { attitudeLevel } = useUser();
  const tone = toneForLevel(attitudeLevel ?? 3);

  const status: DailyWorkoutStatus = useMemo(() => {
    const today = getToday();
    const play = ritualPlayDate === today;
    const tactics = ritualTacticsDate === today;
    const daily = ritualDailyDate === today;
    const completedCount = [play, tactics, daily].filter(Boolean).length;
    const allDone = completedCount === 3;

    let nextActivity: WorkoutActivity | null = null;
    if (!allDone && justCompleted) {
      const order = NEXT_MAP[justCompleted];
      const statusMap: Record<WorkoutActivity, boolean> = { play, tactics, daily };
      nextActivity = order.find(a => !statusMap[a]) ?? null;
    }

    return { play, tactics, daily, allDone, completedCount, nextActivity };
  }, [ritualPlayDate, ritualTacticsDate, ritualDailyDate, justCompleted]);

  const suggestionLine = useMemo(() => {
    if (status.allDone) {
      return selectByCategory(QUIP_POOL, 'ritual:all_done', undefined, undefined, { tone })?.text ?? null;
    }
    if (status.nextActivity) {
      return selectByCategory(QUIP_POOL, `ritual:${status.nextActivity}_next`, undefined, undefined, { tone })?.text ?? null;
    }
    return null;
  }, [status.allDone, status.nextActivity, tone]);

  return { status, suggestionLine, recordRitualPlay };
}
