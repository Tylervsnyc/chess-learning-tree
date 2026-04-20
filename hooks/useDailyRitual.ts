import { useMemo } from 'react';
import { useLessonProgress } from '@/hooks/useProgress';
import { selectByCategory } from '@/lib/speech/priority-queue';
import { QUIP_POOL } from '@/lib/quips/quip-pool';

export type RitualActivity = 'play' | 'tactics' | 'daily';

export interface DailyRitualStatus {
  play: boolean;
  tactics: boolean;
  daily: boolean;
  allDone: boolean;
  completedCount: number;
  nextActivity: RitualActivity | null;
}

/** Natural next activity after completing one */
const NEXT_MAP: Record<RitualActivity, RitualActivity[]> = {
  play: ['tactics', 'daily'],
  tactics: ['daily', 'play'],
  daily: ['play', 'tactics'],
};

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function useDailyRitual(justCompleted?: RitualActivity) {
  const {
    ritualPlayDate,
    ritualTacticsDate,
    ritualDailyDate,
    recordRitualPlay,
  } = useLessonProgress();

  const status: DailyRitualStatus = useMemo(() => {
    const today = getToday();
    const play = ritualPlayDate === today;
    const tactics = ritualTacticsDate === today;
    const daily = ritualDailyDate === today;
    const completedCount = [play, tactics, daily].filter(Boolean).length;
    const allDone = completedCount === 3;

    // Find next uncompleted activity
    let nextActivity: RitualActivity | null = null;
    if (!allDone && justCompleted) {
      const order = NEXT_MAP[justCompleted];
      const statusMap: Record<RitualActivity, boolean> = { play, tactics, daily };
      nextActivity = order.find(a => !statusMap[a]) ?? null;
    }

    return { play, tactics, daily, allDone, completedCount, nextActivity };
  }, [ritualPlayDate, ritualTacticsDate, ritualDailyDate, justCompleted]);

  // Pick a Rookie line for the suggestion
  const suggestionLine = useMemo(() => {
    if (status.allDone) {
      return selectByCategory(QUIP_POOL, 'ritual:all_done')?.text ?? null;
    }
    if (status.nextActivity) {
      return selectByCategory(QUIP_POOL, `ritual:${status.nextActivity}_next`)?.text ?? null;
    }
    return null;
  }, [status.allDone, status.nextActivity]);

  return { status, suggestionLine, recordRitualPlay };
}
