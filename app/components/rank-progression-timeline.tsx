'use client';

import React from 'react';
import { RankBadge } from './rank-badge';
import { clsx } from '../lib/utils';

interface RankData {
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  title: string;
  description: string;
  color: string;
  rankOrder: number;
  xpRequired: number;
}

interface RankProgressionTimelineProps {
  allRanks: RankData[];
  currentRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  totalXP: number;
}

export const RankProgressionTimeline: React.FC<RankProgressionTimelineProps> = ({
  allRanks,
  currentRank,
  totalXP,
}) => {
  const currentRankIndex = allRanks.findIndex(r => r.rank === currentRank);

  return (
    <div className="w-full">
      <h2 className="font-system text-title-lg text-on-surface mb-8">RANK PROGRESSION TIMELINE</h2>

      {/* Timeline Container */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-surface-container-high"></div>

        {/* Animated progress line */}
        <div
          className="absolute top-8 left-0 h-1 bg-primary transition-all duration-500 shadow-bloom"
          style={{
            width: `${Math.min(((currentRankIndex + 1) / allRanks.length) * 100, 100)}%`,
          }}
        ></div>

        {/* Rank nodes */}
        <div className="relative grid grid-cols-6 gap-4 pt-4">
          {allRanks.map((rankData, index) => {
            const isCompleted = index <= currentRankIndex;
            const isCurrent = rankData.rank === currentRank;

            return (
              <div key={rankData.rank} className="flex flex-col items-center">
                {/* Rank circle */}
                <div
                  className={clsx(
                    'w-12 h-12 rounded-none border-2 flex items-center justify-center font-system font-bold text-lg transition-all duration-300',
                    isCurrent && 'ring-2 ring-primary shadow-bloom-lg',
                    isCompleted && !isCurrent && 'opacity-70'
                  )}
                  style={{
                    backgroundColor: isCompleted ? rankData.color : 'transparent',
                    borderColor: rankData.color,
                    color: isCompleted ? '#00363a' : rankData.color,
                  }}
                >
                  {rankData.rank}
                </div>

                {/* Rank label */}
                <p className="text-label-sm font-system mt-2 text-center">{rankData.rank}-RANK</p>

                {/* XP requirement (on hover/desktop) */}
                <p
                  className="text-label-sm text-on-surface-variant mt-1 text-center hidden sm:block"
                  title={rankData.description}
                >
                  {rankData.xpRequired.toLocaleString()} XP
                </p>

                {/* Mobile: Show under each rank */}
                <p className="text-label-sm text-on-surface-variant mt-1 text-center sm:hidden">
                  {rankData.xpRequired.toLocaleString()}
                </p>

                {/* Status badge */}
                {isCurrent && (
                  <div className="mt-2 px-2 py-1 bg-primary bg-opacity-20 rounded-none border border-primary">
                    <p className="text-label-sm text-primary font-system">CURRENT</p>
                  </div>
                )}

                {isCompleted && !isCurrent && (
                  <div className="mt-2 px-2 py-1 bg-success bg-opacity-20 rounded-none border border-success">
                    <p className="text-label-sm text-success font-system">✓</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info section */}
      <div className="mt-12 surface-card p-6">
        <h3 className="font-system text-title-md text-on-surface mb-4">RANK INFORMATION</h3>
        <div className="space-y-4">
          {allRanks.map((rank) => (
            <div
              key={rank.rank}
              className={clsx(
                'p-4 rounded-none border-l-4 transition-all',
                rank.rank === currentRank ? 'border-primary bg-primary bg-opacity-10' : 'border-outline-variant'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-system text-title-sm" style={{ color: rank.color }}>
                    {rank.title}
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-1">{rank.description}</p>
                </div>
                <p className="text-label-md text-on-surface-variant font-system">
                  {rank.xpRequired.toLocaleString()} XP
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};