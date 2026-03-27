'use client';

import React from 'react';
import { getRankColor, getRankDisplayName, clsx } from '../lib/utils';

interface RankBadgeProps {
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'outlined';
  showLabel?: boolean;
  animate?: boolean;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  size = 'md',
  variant = 'filled',
  showLabel = true,
  animate = false,
}) => {
  const rankColor = getRankColor(rank);
  const displayName = getRankDisplayName(rank);

  const sizeMap = {
    sm: { box: 'w-12 h-12', text: 'text-label-md' },
    md: { box: 'w-16 h-16', text: 'text-title-md' },
    lg: { box: 'w-24 h-24', text: 'text-headline-sm' },
    xl: { box: 'w-32 h-32', text: 'text-display-sm' },
  };

  const sizeClass = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={clsx(
          sizeClass.box,
          'flex items-center justify-center rounded-none border-2 font-system font-bold',
          variant === 'filled' ? 'text-primary-dark' : 'text-surface',
          animate && 'animate-pulse-glow',
          'transition-all duration-300'
        )}
        style={{
          backgroundColor: variant === 'filled' ? rankColor : 'transparent',
          borderColor: rankColor,
          color: variant === 'filled' ? '#00363a' : rankColor,
          boxShadow: animate ? `0 0 20px ${rankColor}` : 'none',
        }}
      >
        {rank}
      </div>
      {showLabel && (
        <p className={clsx('font-system font-bold', sizeClass.text)} style={{ color: rankColor }}>
          {displayName}
        </p>
      )}
    </div>
  );
};