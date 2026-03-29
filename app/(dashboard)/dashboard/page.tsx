'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../components/button';
import { RankBadge } from '../../components/rank-badge';
import { XPProgressBar } from '../../components/xp-progress-bar';
import Link from 'next/link';

interface ProgressionData {
  progression: unknown;
  currentRankConfig: unknown;
  allRanks: unknown[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [progressionData, setProgressionData] = useState<ProgressionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/progression');
        if (!response.ok) throw new Error('Failed to fetch progression');
        const data = await response.json();
        setProgressionData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-functional">Initializing system...</p>
        </div>
      </div>
    );
  }

  const prog = progressionData?.progression as { [key: string]: any } | undefined;
  const rankConfig = progressionData?.currentRankConfig as { [key: string]: any } | undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Welcome Section with Rank Badge */}
      <div className="surface-card p-8 mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex-1">
            <h1 className="font-system text-display-md text-primary mb-4">
              LEVEL UP YOUR REALITY
            </h1>
            <p className="text-on-surface-variant font-functional text-body-md mb-6">
              Track every rep, every run, every moment of growth. Your path to strength begins now.
            </p>
            <Link href="/workouts">
              <Button variant="primary" size="lg">
                Log Your Workout
              </Button>
            </Link>
          </div>

          {/* Rank Badge */}
          {rankConfig && (
            <div className="flex flex-col items-center">
              <RankBadge
                rank={prog?.currentRank}
                size="xl"
                variant="filled"
                animate={true}
              />
              <p className="text-on-surface-variant text-body-sm mt-4 text-center max-w-xs">
                {rankConfig.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* XP Progress Section */}
      {prog && (
        <div className="surface-card p-8 mb-12">
          <XPProgressBar
            currentXP={prog.currentXP}
            xpToNextRank={prog.xpToNextRank}
            animated={true}
            showLabels={true}
            size="lg"
          />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total XP */}
        <div className="surface-card p-6">
          <p className="font-system text-label-md text-on-surface-variant mb-3">TOTAL XP EARNED</p>
          <h2 className="font-system text-headline-lg text-secondary">
            {prog?.totalXPEarned.toLocaleString()}
          </h2>
          <p className="text-on-surface-variant font-functional text-body-sm mt-2">
            Experience accumulated
          </p>
        </div>

        {/* Current Streak */}
        <div className="surface-card p-6">
          <p className="font-system text-label-md text-on-surface-variant mb-3">CURRENT STREAK</p>
          <h2 className="font-system text-headline-lg text-success">
            {prog?.workoutStreak || 0} DAYS
          </h2>
          <p className="text-on-surface-variant font-functional text-body-sm mt-2">
            Keep the momentum going
          </p>
        </div>

        {/* XP Multiplier */}
        <div className="surface-card p-6">
          <p className="font-system text-label-md text-on-surface-variant mb-3">XP MULTIPLIER</p>
          <h2 className="font-system text-headline-lg text-primary">
            {prog?.xpMultiplier}x
          </h2>
          <p className="text-on-surface-variant font-functional text-body-sm mt-2">
            Applied to all gains
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="surface-card p-8 mb-12">
        <h2 className="font-system text-title-lg text-on-surface mb-6">QUICK_ACTIONS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/workouts/new">
            <Button variant="primary" size="md" className="w-full">
              Log Workout
            </Button>
          </Link>
          <Link href="/exercises">
            <Button variant="secondary" size="md" className="w-full">
              Exercise Library
            </Button>
          </Link>
          <Link href="/ranks">
            <Button variant="secondary" size="md" className="w-full">
              Rank Guide
            </Button>
          </Link>
          <Link href="/leaderboards">
            <Button variant="secondary" size="md" className="w-full">
              Leaderboards
            </Button>
          </Link>
        </div>
      </div>

      {/* Next Rank Info */}
      {rankConfig && prog && (
        <div className="surface-card p-8" style={{ borderLeft: `4px solid ${rankConfig.color}` }}>
          <h3 className="font-system text-title-md text-on-surface mb-4">NEXT MILESTONE</h3>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-label-md text-on-surface-variant mb-2">PROGRESS TO NEXT RANK</p>
              <p className="text-label-sm text-on-surface font-functional" style={{ color: rankConfig.color }}>
                {prog.xpToNextRank.toLocaleString()} XP required
              </p>
              <p className="text-label-sm text-on-surface-variant mt-2" style={{ color: rankConfig.color }}>
                At {prog.progressPercent.toFixed(1)}% completion
              </p>
            </div>
            <div className="">
              <p className="text-label-md text-on-surface-variant mb-2">CURRENT / REQUIRED</p>
              <p className="font-system text-title-md" style={{ color: rankConfig.color }}>
                {prog.currentXP.toLocaleString()} / {( prog.xpToNextRank).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="mt-12 text-center text-on-surface-variant text-label-sm space-y-1">
        <p>SYSTEM_STATUS: OPERATIONAL</p>
        <p>SHADOW_HUD_ACTIVE: TRUE</p>
      </div>
    </div>
  );
}