'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../components/button';
import { LeaderboardRow } from '../../components/leaderboard-row';

interface LeaderboardEntry {
  _id: string;
  userId: string;
  username: string;
  currentRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  totalXP: number;
  adjustedXP: number;
  missedDays: number;
  workoutStreak: number;
  weeklyXP: number;
  globalRank: number;
  weeklyRank: number;
  rankTypeRank: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function LeaderboardsPage() {
  const { data: session } = useSession();
  const [leaderboards, setLeaderboards] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'weekly' | 'rank'>('global');
  const [selectedRank, setSelectedRank] = useState<string>('S');
  const [showUserPosition, setShowUserPosition] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      let url = `/api/leaderboards?type=${leaderboardType}&page=${page}&limit=50`;
      if (leaderboardType === 'rank') {
        url += `&rank=${selectedRank}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();

      setLeaderboards(data.leaderboards);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const response = await fetch('/api/leaderboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: leaderboardType }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserRank(data);
      }
    } catch (err: any) {
      console.error('Failed to fetch user rank:', err);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [leaderboardType, selectedRank]);

  useEffect(() => {
    fetchLeaderboard();
    if (session?.user) {
      fetchUserRank();
    }
  }, [page, leaderboardType, selectedRank, session]);

  const getRankLabel = (type: string) => {
    switch (type) {
      case 'weekly':
        return 'WEEKLY_LEADERBOARD';
      case 'rank':
        return `${selectedRank}-RANK_LEADERBOARD`;
      default:
        return 'GLOBAL_LEADERBOARD';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-system mb-2">
          {getRankLabel(leaderboardType)}
        </h1>
        <p className="text-on-surface-variant font-functional text-body-md">
          Compete with hunters worldwide. Climb the ranks.
        </p>
      </div>

      {error && (
        <div className="surface-card p-6 text-error mb-6 font-functional">
          {error}
        </div>
      )}

      {/* Leaderboard Type Selector */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant={leaderboardType === 'global' ? 'primary' : 'secondary'}
          size="md"
          onClick={() => setLeaderboardType('global')}
        >
          Global
        </Button>
        <Button
          variant={leaderboardType === 'weekly' ? 'primary' : 'secondary'}
          size="md"
          onClick={() => setLeaderboardType('weekly')}
        >
          This Week
        </Button>

        {/* Rank Filter */}
        <div className="m-auto sm:m-0 sm:ml-auto flex gap-2">
          {['S', 'A', 'B', 'C', 'D', 'E'].map((rank) => (
            <button
              key={rank}
              onClick={() => {
                setLeaderboardType('rank');
                setSelectedRank(rank);
              }}
              className={`w-10 h-10 rounded-none font-system font-bold transition-all ${
                leaderboardType === 'rank' && selectedRank === rank
                  ? 'bg-primary text-primary-dark'
                  : 'border-2 border-outline-variant text-on-surface hover:border-primary'
              }`}
            >
              {rank}
            </button>
          ))}
        </div>
      </div>

      {/* User Position Card */}
      {userRank && (
        <div className="surface-card p-8 mb-12 border-l-4 border-secondary">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-label-md text-on-surface-variant mb-2">YOUR_POSITION</p>
              <h2 className="font-system text-display-sm text-primary">
                #{userRank.userPosition}
              </h2>
              <p className="text-on-surface-variant text-body-sm mt-2">
                Out of {pagination?.total || 0} hunters
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {leaderboardType === 'weekly' ? (
                <div>
                  <p className="text-label-md text-on-surface-variant mb-1">XP_THIS_WEEK</p>
                  <p className="font-system text-title-lg text-secondary">
                    {userRank.user.weeklyXP.toLocaleString()}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-label-md text-on-surface-variant mb-1">ADJUSTED_XP</p>
                    <p className="font-system text-title-lg text-secondary">
                      {userRank.user.adjustedXP.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-label-md text-on-surface-variant mb-1">PENALTY</p>
                    <p className={`font-system text-title-lg ${
                      userRank.user.missedDays > 0 ? 'text-error' : 'text-success'
                    }`}>
                      {userRank.user.missedDays > 0 ? `-${userRank.user.missedDays * 10}` : 'None'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Neighbors */}
          {userRank.neighbors && userRank.neighbors.length > 0 && (
            <div className="mt-8 border-t border-outline-variant border-opacity-15 pt-8">
              <p className="text-label-md text-on-surface-variant mb-4">NEARBY_HUNTERS</p>
              <div className="space-y-3">
                {userRank.neighbors.map((neighbor: any, idx: number) => {
                  const actualRank =
                    leaderboardType === 'weekly'
                      ? neighbor.weeklyRank
                      : leaderboardType === 'rank'
                      ? neighbor.rankTypeRank
                      : neighbor.globalRank;

                  return (
                    <LeaderboardRow
                      key={neighbor._id}
                      rank={actualRank}
                      username={neighbor.username}
                      currentRank={neighbor.currentRank}
                      totalXP={neighbor.totalXP}
                      adjustedXP={neighbor.adjustedXP}
                      missedDays={neighbor.missedDays}
                      workoutStreak={neighbor.workoutStreak}
                      xpThisWeek={neighbor.weeklyXP}
                      isCurrentUser={neighbor.userId === session?.user?.id}
                      variant={leaderboardType as any}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Leaderboard */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-on-surface-variant font-functional">Loading leaderboard...</p>
          </div>
        </div>
      ) : leaderboards.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <p className="text-on-surface-variant font-functional">No hunters on this leaderboard yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-12">
            {leaderboards.map((entry, idx) => {
              const actualRank =
                leaderboardType === 'weekly'
                  ? entry.weeklyRank
                  : leaderboardType === 'rank'
                  ? entry.rankTypeRank
                  : entry.globalRank;

              return (
                <LeaderboardRow
                  key={entry._id}
                  rank={actualRank}
                  username={entry.username}
                  currentRank={entry.currentRank}
                  totalXP={entry.totalXP}
                  adjustedXP={entry.adjustedXP}
                  missedDays={entry.missedDays}
                  workoutStreak={entry.workoutStreak}
                  xpThisWeek={entry.weeklyXP}
                  isCurrentUser={entry.userId === session?.user?.id}
                  variant={leaderboardType as any}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ← Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }).map((_, idx) => {
                  const pageNum = page - 2 + idx;
                  if (pageNum < 1 || pageNum > pagination.pages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-none font-system transition-all ${
                        page === pageNum
                          ? 'bg-primary text-primary-dark'
                          : 'border border-outline-variant text-on-surface hover:border-primary'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}

      {/* Info Footer */}
      <div className="mt-12 surface-card p-8">
        <h2 className="font-system text-2xl mb-6">HOW_RANKINGS_WORK</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-body-sm text-on-surface-variant font-functional">
          <div>
            <p className="font-system text-title-sm text-on-surface mb-2">🌍 Global Leaderboard</p>
            <p>
              Ranked by adjusted XP. Earn XP through workouts and climb the global rankings against all hunters.
            </p>
          </div>

          <div>
            <p className="font-system text-title-sm text-on-surface mb-2">⚠️ Leaderboard Penalties</p>
            <p>
              Each missed scheduled workout day costs 10 XP on the leaderboard (not your actual progression).
              Stay consistent!
            </p>
          </div>

          <div>
            <p className="font-system text-title-sm text-on-surface mb-2">🔄 Weekly Reset</p>
            <p>
              Weekly leaderboard resets every Sunday. Fresh start every week—show your consistency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}