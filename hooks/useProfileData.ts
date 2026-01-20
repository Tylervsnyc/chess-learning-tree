'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from './useUser';

export interface ThemePerformanceData {
  theme: string;
  attempts: number;
  solved: number;
  accuracy: number;
  avgRating: number | null;
}

export interface ProfileStats {
  totalAttempts: number;
  totalSolved: number;
  overallAccuracy: number;
  eloRating: number;
}

export function useProfileData() {
  const { user, profile, loading: userLoading } = useUser();
  const [themeData, setThemeData] = useState<ThemePerformanceData[]>([]);
  const [stats, setStats] = useState<ProfileStats>({
    totalAttempts: 0,
    totalSolved: 0,
    overallAccuracy: 0,
    eloRating: 800,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch until user loading is complete
    if (userLoading) return;

    // Not logged in - show empty state immediately
    if (!user) {
      setThemeData([]);
      setStats({
        totalAttempts: 0,
        totalSolved: 0,
        overallAccuracy: 0,
        eloRating: 800,
      });
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const supabase = createClient();

        // Fetch theme performance (may be empty for new users - that's OK)
        const { data: themes, error: themesError } = await supabase
          .from('theme_performance')
          .select('*')
          .eq('user_id', user.id)
          .order('attempts', { ascending: false });

        if (themesError) {
          console.error('Error fetching theme performance:', themesError);
          // Don't block on error - just show empty data
        }

        // Process theme data (empty array is valid for new users)
        const processedThemes: ThemePerformanceData[] = (themes || []).map(t => ({
          theme: t.theme,
          attempts: t.attempts,
          solved: t.solved,
          accuracy: t.attempts > 0 ? Math.round((t.solved / t.attempts) * 100) : 0,
          avgRating: t.avg_rating,
        }));

        setThemeData(processedThemes);

        // Calculate overall stats
        const totalAttempts = processedThemes.reduce((sum, t) => sum + t.attempts, 0);
        const totalSolved = processedThemes.reduce((sum, t) => sum + t.solved, 0);

        setStats({
          totalAttempts,
          totalSolved,
          overallAccuracy: totalAttempts > 0 ? Math.round((totalSolved / totalAttempts) * 100) : 0,
          eloRating: profile?.elo_rating || 800,
        });
      } catch (err) {
        console.error('Error in fetchData:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, profile, userLoading]);

  return {
    user,
    profile,
    themeData,
    stats,
    loading: loading || userLoading,
    isAuthenticated: !!user,
  };
}
