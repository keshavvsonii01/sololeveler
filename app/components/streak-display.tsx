'use client';

import React from 'react';
import { clsx } from '../lib/utils';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: Date | null;
  nextScheduledDay?: string;
  daysUntilNext?: number;
  status?: 'active' | 'at-risk' | 'broken';
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  lastWorkoutDate,
  nextScheduledDay,
  daysUntilNext = 0,
  status = 'active',
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'at-risk':
        return 'text-warning';
      case 'broken':
        return 'text-error';
      default:
        return 'text-primary';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'active':
        return 'bg-success bg-opacity-10';
      case 'at-risk':
        return 'bg-warning bg-opacity-10';
      case 'broken':
        return 'bg-error bg-opacity-10';
      default:
        return 'bg-primary bg-opacity-10';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'active':
        return '🔥 Streak Active';
      case 'at-risk':
        return '⚠️ Streak At Risk';
      case 'broken':
        return '❌ Streak Broken';
      default:
        return 'Keep Going';
    }
  };

  return (
    <div className="w-full">
      {/* Streak Counter */}
      <div className="flex flex-col items-center justify-center p-8 surface-card rounded-none">
        <div className={clsx('text-6xl font-system font-bold mb-2', getStatusColor())}>
          {currentStreak}
        </div>
        <p className="text-on-surface-variant font-functional text-label-lg uppercase">
          Day Streak
        </p>

        {/* Status Badge */}
        <div className={clsx('mt-6 px-4 py-2 rounded-none', getStatusBg())}>
          <p className={clsx('font-system text-label-md', getStatusColor())}>
            {getStatusMessage()}
          </p>
        </div>

        {/* Last Workout */}
        {lastWorkoutDate && (
          <p className="text-on-surface-variant font-functional text-body-sm mt-4">
            Last workout: {new Date(lastWorkoutDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Longest Streak */}
        <div className="surface-card p-6 text-center">
          <p className="text-on-surface-variant text-label-md mb-3">LONGEST STREAK</p>
          <p className="font-system text-headline-lg text-secondary">{longestStreak}</p>
        </div>

        {/* Next Workout */}
        <div className="surface-card p-6 text-center">
          <p className="text-on-surface-variant text-label-md mb-3">NEXT WORKOUT</p>
          {nextScheduledDay ? (
            <div>
              <p className="font-system text-headline-md text-primary capitalize">
                {nextScheduledDay}
              </p>
              {daysUntilNext && (
                <p className="text-on-surface-variant text-body-sm mt-1">
                  In {daysUntilNext} {daysUntilNext === 1 ? 'day' : 'days'}
                </p>
              )}
            </div>
          ) : (
            <p className="text-on-surface-variant text-body-md">No schedule set</p>
          )}
        </div>
      </div>

      {/* Motivation Message */}
      <div className="mt-6 surface-card p-6 border-l-4 border-primary text-center">
        {currentStreak === 0 ? (
          <p className="text-on-surface font-functional">
            💪 Start your streak now. Every day counts.
          </p>
        ) : currentStreak === 1 ? (
          <p className="text-on-surface font-functional">
            🔥 Great start! One day down, many more to go.
          </p>
        ) : currentStreak === 7 ? (
          <p className="text-on-surface font-functional">
            🏆 One week streak! Momentum is building!
          </p>
        ) : currentStreak === 30 ? (
          <p className="text-on-surface font-functional">
            👑 30 day legend! You are unstoppable!
          </p>
        ) : (
          <p className="text-on-surface font-functional">
            💎 Keep the streak alive. You are doing amazing!
          </p>
        )}
      </div>
    </div>
  );
};