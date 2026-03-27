'use client';

import React from 'react';
import { clsx } from '../lib/utils';

interface XPProgressBarProps {
  currentXP: number;
  xpToNextRank: number;
  animated?: boolean;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXP,
  xpToNextRank,
  animated = true,
  showLabels = true,
  size = 'md',
}) => {
  const progress = Math.min((currentXP / xpToNextRank) * 100, 100);

  const heightMap = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between items-center mb-2">
          <p className="text-label-md text-on-surface-variant uppercase">XP Progress</p>
          <p className="text-label-md text-primary font-system">
            {currentXP.toLocaleString()} / {xpToNextRank.toLocaleString()}
          </p>
        </div>
      )}

      {/* Progress bar container */}
      <div className={clsx('w-full bg-surface-container-highest rounded-none overflow-hidden', heightMap[size])}>
        {/* Gradient fill */}
        <div
          className={clsx('h-full transition-all duration-500 relative', animated && 'animate-pulse-glow')}
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00F2FF 0%, #7701d0 100%)',
          }}
        >
          {/* Leading edge glow */}
          <div className="absolute right-0 top-0 h-full w-1 bg-white opacity-50 blur-sm"></div>
        </div>
      </div>

      {/* Percentage display */}
      {showLabels && (
        <p className="text-label-sm text-on-surface-variant mt-2">
          {progress.toFixed(1)}% to next rank
        </p>
      )}
    </div>
  );
};