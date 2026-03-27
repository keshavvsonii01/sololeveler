/**
 * XP Calculation System
 * Formula: (reps/duration × baseXPValue × difficultyMultiplier) × userXPMultiplier
 */

export interface ExerciseData {
  baseXPValue: number;
  difficultyMultiplier: number;
  repsOrDuration: number;
  userMultiplier?: number;
}

export function calculateXP(exerciseData: ExerciseData): number {
  const { baseXPValue, difficultyMultiplier, repsOrDuration, userMultiplier = 1 } = exerciseData;
  
  const xpEarned = repsOrDuration * baseXPValue * difficultyMultiplier * userMultiplier;
  
  return Math.round(xpEarned);
}

export function calculateTotalWorkoutXP(exercises: ExerciseData[]): number {
  return exercises.reduce((total, exercise) => total + calculateXP(exercise), 0);
}

/**
 * Rank Configuration
 * XP thresholds from E-Rank to S-Rank
 */

export const RANK_CONFIG = [
  {
    rank: 'E',
    xpRequired: 0,
    xpToNextRank: 2000,
    displayName: 'E-Rank',
    color: '#808080',
  },
  {
    rank: 'D',
    xpRequired: 2000,
    xpToNextRank: 5000,
    displayName: 'D-Rank',
    color: '#4169E1',
  },
  {
    rank: 'C',
    xpRequired: 5000,
    xpToNextRank: 9000,
    displayName: 'C-Rank',
    color: '#32CD32',
  },
  {
    rank: 'B',
    xpRequired: 9000,
    xpToNextRank: 15000,
    displayName: 'B-Rank',
    color: '#FFD700',
  },
  {
    rank: 'A',
    xpRequired: 15000,
    xpToNextRank: 30000,
    displayName: 'A-Rank',
    color: '#FF6347',
  },
  {
    rank: 'S',
    xpRequired: 30000,
    xpToNextRank: Infinity,
    displayName: 'S-Rank',
    color: '#FFD700',
  },
];

export function getRankByXP(totalXP: number): { rank: string; index: number } {
  for (let i = RANK_CONFIG.length - 1; i >= 0; i--) {
    if (totalXP >= RANK_CONFIG[i].xpRequired) {
      return { rank: RANK_CONFIG[i].rank, index: i };
    }
  }
  return { rank: 'E', index: 0 };
}

export function getXPToNextRank(totalXP: number): number {
  const { index } = getRankByXP(totalXP);
  const nextRankXP = RANK_CONFIG[index].xpRequired + RANK_CONFIG[index].xpToNextRank;
  return Math.max(0, nextRankXP - totalXP);
}

export function getCurrentRankProgress(totalXP: number): {
  currentXP: number;
  xpToNextRank: number;
  progressPercent: number;
} {
  const { index } = getRankByXP(totalXP);
  const rankStartXP = RANK_CONFIG[index].xpRequired;
  const currentXP = totalXP - rankStartXP;
  const xpToNextRank = RANK_CONFIG[index].xpToNextRank;
  const progressPercent = (currentXP / xpToNextRank) * 100;
  
  return {
    currentXP,
    xpToNextRank,
    progressPercent: Math.min(progressPercent, 100),
  };
}

/**
 * Default Exercise Templates
 */

export const DEFAULT_EXERCISES = [
  // Strength
  {
    name: 'Pushup',
    category: 'strength',
    baseXPValue: 5,
    difficultyMultiplier: 1.0,
    unit: 'reps',
    description: 'Classic upper body exercise!',
  },
  {
    name: 'Pullup',
    category: 'strength',
    baseXPValue: 10,
    difficultyMultiplier: 1.2,
    unit: 'reps',
    description: 'Pull yourself up!',
  },
  {
    name: 'Squat',
    category: 'strength',
    baseXPValue: 10,
    difficultyMultiplier: 1.1,
    unit: 'reps',
    description: 'Leg exercise!',
  },
  {
    name: 'Deadlift',
    category: 'strength',
    baseXPValue: 10,
    difficultyMultiplier: 1.3,
    unit: 'reps',
    description: 'Heavy lifting!',
  },
  
  // Cardio
  {
    name: 'Running',
    category: 'cardio',
    baseXPValue: 30,
    difficultyMultiplier: 1.0,
    unit: 'km',
    description: 'Cardio endurance!',
  },
  {
    name: 'Cycling',
    category: 'cardio',
    baseXPValue: 20,
    difficultyMultiplier: 0.9,
    unit: 'km',
    description: 'Low impact cardio!',
  },
  {
    name: 'Jump Rope',
    category: 'cardio',
    baseXPValue: 10,
    difficultyMultiplier: 1.1,
    unit: 'reps',
    description: 'Explosive cardio!',
  },
  
  // Flexibility
  {
    name: 'Plank',
    category: 'flexibility',
    baseXPValue: 10,
    difficultyMultiplier: 1.0,
    unit: 'minutes',
    description: 'Core endurance!',
  },
  {
    name: 'Yoga',
    category: 'flexibility',
    baseXPValue: 8,
    difficultyMultiplier: 0.8,
    unit: 'minutes',
    description: 'Flexibility and balance!',
  },
];