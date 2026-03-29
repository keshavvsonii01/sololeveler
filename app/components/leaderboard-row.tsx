'use client';

import React from 'react';
import Link from 'next/link';
import { getRankColor, getRankDisplayName, clsx } from '../lib/utils';

interface LeaderboardRowProps {
  rank: number;
  username: string;
  currentRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  totalXP: number;
  adjustedXP: number;
  missedDays: number;
  workoutStreak: number;
  xpThisWeek?: number;
  isCurrentUser?: boolean;
  variant?: 'global' | 'weekly' | 'rank';
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  rank,
  username,
  currentRank,
  totalXP,
  adjustedXP,
  missedDays,
  workoutStreak,
  xpThisWeek = 0,
  isCurrentUser = false,
  variant = 'global',
}) => {
  const rankColor = getRankColor(currentRank);
  const penalty = totalXP - adjustedXP;
  const medalEmoji = rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : '';

  return (
    <div
      className={clsx(
        'flex items-center justify-between p-4 rounded-none border-l-4 transition-all',
        isCurrentUser
          ? 'bg-primary bg-opacity-10 border-primary ring-2 ring-primary ring-opacity-30'
          : 'bg-surface-high border-outline-variant hover:border-primary'
      )}
    >
      {/* Rank & User Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Rank Number */}
        <div className="flex-shrink-0 w-12 text-center">
          {medalEmoji ? (
            <span className="text-2xl">{medalEmoji}</span>
          ) : (
            <p className="font-system text-title-md text-on-surface-variant">{rank}</p>
          )}
        </div>

        {/* Username & Tier */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-system text-title-sm text-on-surface truncate">
              {username}
              {isCurrentUser && <span className="text-primary ml-2">(You)</span>}
            </p>
            {/* Rank Badge */}
            <div
              className="flex-shrink-0 w-8 h-8 rounded-none border-2 flex items-center justify-center font-system text-label-md font-bold"
              style={{
                backgroundColor: rankColor,
                borderColor: rankColor,
                color: '#00363a',
              }}
            >
              {currentRank}
            </div>
          </div>
          {/* Streak Info */}
          <p className="text-label-sm text-on-surface-variant mt-1">
            🔥 {workoutStreak} day streak
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 flex items-center gap-6 ml-4">
        {/* XP Info */}
        <div className="text-right">
          {variant === 'weekly' ? (
            <p className="font-system text-title-md text-secondary">{xpThisWeek.toLocaleString()}</p>
          ) : (
            <>
              <p className="font-system text-title-md text-secondary">
                {adjustedXP.toLocaleString()}
              </p>
              {penalty > 0 && (
                <p className="text-label-sm text-error">-{penalty} penalty</p>
              )}
            </>
          )}
        </div>

        {/* Missed Days Indicator */}
        {missedDays > 0 && (
          <div className="text-right">
            <p className="text-label-sm text-error">⚠️ {missedDays} missed</p>
          </div>
        )}
      </div>
    </div>
  );
};