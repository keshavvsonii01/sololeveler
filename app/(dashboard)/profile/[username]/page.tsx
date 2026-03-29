'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RankBadge } from '../../../components/rank-badge';
import Link from 'next/link';
import { Button } from '../../../components/button';

interface UserProfile {
  _id: string;
  username: string;
  bio: string;
  createdAt: string;
  isPublic: boolean;
}

interface UserStats {
  globalRank: number;
  weeklyRank: number;
  currentRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  totalXP: number;
  adjustedXP: number;
  missedDays: number;
  workoutStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  weeklyXP: number;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // This would need a new API endpoint
        // For now, we'll create a placeholder
        setError('User not found');
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

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-functional">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="surface-card p-12 text-center">
          <p className="text-error font-functional mb-6">{error || 'User not found'}</p>
          <Link href="/leaderboards">
            <Button variant="primary" size="lg">
              Back to Leaderboards
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const penalty = stats ? stats.totalXP - stats.adjustedXP : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="surface-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* User Info */}
          <div className="flex-1">
            <h1 className="font-system text-display-sm text-primary mb-2">{profile.username}</h1>
            <p className="text-on-surface-variant font-functional text-body-md mb-4">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
            {profile.bio && (
              <p className="text-on-surface font-functional text-body-md max-w-xl">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Rank Badge */}
          {stats && (
            <div className="flex-shrink-0">
              <RankBadge
                rank={stats.currentRank}
                size="lg"
                variant="filled"
                animate={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <>
          {/* Rankings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="surface-card p-6">
              <p className="text-label-md text-on-surface-variant mb-3">GLOBAL_RANK</p>
              <h3 className="font-system text-headline-lg text-primary">
                #{stats.globalRank}
              </h3>
            </div>

            <div className="surface-card p-6">
              <p className="text-label-md text-on-surface-variant mb-3">WEEKLY_RANK</p>
              <h3 className="font-system text-headline-lg text-secondary">
                #{stats.weeklyRank}
              </h3>
            </div>

            <div className="surface-card p-6">
              <p className="text-label-md text-on-surface-variant mb-3">CURRENT_STREAK</p>
              <h3 className="font-system text-headline-lg text-success">
                {stats.workoutStreak} 🔥
              </h3>
            </div>
          </div>

          {/* XP & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* XP Info */}
            <div className="surface-card p-6 border-l-4 border-primary">
              <p className="text-label-md text-on-surface-variant mb-4">XP_BREAKDOWN</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-body-sm text-on-surface">Total XP</p>
                  <p className="font-system text-title-md text-secondary">
                    {stats.totalXP.toLocaleString()}
                  </p>
                </div>
                {penalty > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-body-sm text-error">Leaderboard Penalty</p>
                    <p className="font-system text-title-md text-error">-{penalty}</p>
                  </div>
                )}
                <div className="border-t border-outline-variant border-opacity-15 pt-3 flex items-center justify-between">
                  <p className="text-body-sm font-system text-on-surface">Adjusted XP</p>
                  <p className="font-system text-title-md text-primary">
                    {stats.adjustedXP.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="surface-card p-6 border-l-4 border-secondary">
              <p className="text-label-md text-on-surface-variant mb-4">ACTIVITY</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-body-sm text-on-surface">Total Workouts</p>
                  <p className="font-system text-title-md">{stats.totalWorkouts}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-body-sm text-on-surface">This Week XP</p>
                  <p className="font-system text-title-md text-secondary">
                    {stats.weeklyXP.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-body-sm text-on-surface">Longest Streak</p>
                  <p className="font-system text-title-md text-success">
                    {stats.longestStreak} days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Missed Days Warning */}
          {stats.missedDays > 0 && (
            <div className="surface-card p-6 border-l-4 border-error bg-error bg-opacity-5">
              <p className="text-label-md text-error mb-2">⚠️ MISSED SCHEDULED DAYS</p>
              <p className="text-body-sm text-on-surface-variant">
                {stats.missedDays} missed scheduled workouts (-{stats.missedDays * 10} XP penalty)
              </p>
            </div>
          )}
        </>
      )}

      {/* Back Button */}
      <div className="mt-12">
        <Link href="/leaderboards">
          <Button variant="secondary" size="lg">
            ← Back to Leaderboards
          </Button>
        </Link>
      </div>
    </div>
  );
}