export function clsx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export function formatDateTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}

export function calculateRankProgress(currentXP: number, xpToNextRank: number): number {
  return Math.min((currentXP / xpToNextRank) * 100, 100);
}

export function getRankColor(rank: string): string {
  const rankColors: Record<string, string> = {
    E: '#808080', // Gray
    D: '#4169E1', // Blue
    C: '#32CD32', // Green
    B: '#FFD700', // Gold
    A: '#FF6347', // Tomato
    S: '#FFD700', // Gold (legendary)
  };
  return rankColors[rank] || '#ffffff';
}

export function getRankDisplayName(rank: string): string {
  const displayNames: Record<string, string> = {
    E: 'E-Rank',
    D: 'D-Rank',
    C: 'C-Rank',
    B: 'B-Rank',
    A: 'A-Rank',
    S: 'S-Rank',
  };
  return displayNames[rank] || 'Unknown';
}