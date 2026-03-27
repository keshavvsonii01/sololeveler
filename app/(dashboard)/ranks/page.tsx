'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { RankProgressionTimeline } from '../../components/rank-progression-timeline';

interface ProgressionData {
  progression: any;
  currentRankConfig: any;
  allRanks: any[];
}

export default function RanksPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<ProgressionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/progression');
        if (!response.ok) throw new Error('Failed to fetch progression');
        const result = await response.json();
        setData(result);
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
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-functional">Loading ranks...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="surface-card p-8 text-center">
          <p className="text-error font-functional">Error loading ranks: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-system text-display-md text-primary mb-4">RANK PROGRESSION GUIDE</h1>
        <p className="text-on-surface-variant font-functional text-body-md">
          Your path from the weakest to the strongest. From E-Rank to S-Rank supremacy.
        </p>
      </div>

      {/* Current Status */}
      {data.currentRankConfig && (
        <div className="surface-card p-8 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-md text-on-surface-variant mb-2">YOUR CURRENT RANK</p>
              <h2 className="font-system text-headline-lg text-primary mb-2">
                {data.currentRankConfig.title}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                {data.currentRankConfig.description}
              </p>
            </div>
            <div
              className="w-32 h-32 rounded-none border-4 flex items-center justify-center font-system text-display-sm font-bold"
              style={{
                borderColor: data.currentRankConfig.color,
                backgroundColor: data.currentRankConfig.color,
                color: '#00363a',
              }}
            >
              {data.progression.currentRank}
            </div>
          </div>
        </div>
      )}

      {/* Rank Timeline */}
      <div className="surface-card p-8 mb-12">
        <RankProgressionTimeline
          allRanks={data.allRanks}
          currentRank={data.progression.currentRank}
          totalXP={data.progression.totalXPEarned}
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card p-6">
          <p className="text-label-md text-on-surface-variant mb-3">TOTAL XP EARNED</p>
          <h3 className="font-system text-headline-md text-primary">
            {data.progression.totalXPEarned.toLocaleString()}
          </h3>
        </div>

        <div className="surface-card p-6">
          <p className="text-label-md text-on-surface-variant mb-3">CURRENT RANK XP</p>
          <h3 className="font-system text-headline-md text-secondary">
            {data.progression.currentXP.toLocaleString()}
          </h3>
          <p className="text-label-sm text-on-surface-variant mt-2">
            / {data.progression.xpToNextRank.toLocaleString()} to next
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-label-md text-on-surface-variant mb-3">PROGRESSION</p>
          <h3 className="font-system text-headline-md text-success">
            {data.progression.progressPercent.toFixed(1)}%
          </h3>
          <p className="text-label-sm text-on-surface-variant mt-2">To next rank</p>
        </div>
      </div>

      {/* Rank Up History */}
      {data.progression.rankUpHistory && data.progression.rankUpHistory.length > 0 && (
        <div className="mt-12 surface-card p-8">
          <h2 className="font-system text-title-lg text-on-surface mb-6">RANK UP HISTORY</h2>
          <div className="space-y-4">
            {data.progression.rankUpHistory.map((entry: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-surface-high rounded-none border-l-4 border-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-none border-2 border-primary bg-primary bg-opacity-20 flex items-center justify-center font-system font-bold text-primary">
                    {entry.rank}
                  </div>
                  <div>
                    <p className="font-system text-title-sm text-on-surface">Reached {entry.rank}-Rank</p>
                    <p className="text-label-sm text-on-surface-variant">
                      {new Date(entry.achievedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant">
                  {entry.xpAtRankUp.toLocaleString()} XP
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}