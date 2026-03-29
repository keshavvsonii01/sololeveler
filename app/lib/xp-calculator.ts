/**
 * XP Calculation System
 * Formula: (reps/duration × baseXPValue × difficultyMultiplier) × userXPMultiplier
 */

export interface ExerciseData {
  baseXPValue: number;
  difficultyMultiplier: number;
  repsOrDuration: number;
  userMultiplier?: number;
  sets?: number;
}

export function calculateXP(exerciseData: ExerciseData): number {
  const {
    baseXPValue,
    difficultyMultiplier,
    repsOrDuration,
    userMultiplier = 1,
    sets = 1,
  } = exerciseData;
  if (
    repsOrDuration <= 0 ||
    sets <= 0 ||
    baseXPValue <= 0 ||
    difficultyMultiplier <= 0
  ) {
    return 0;
  }
  const totalWork = sets * repsOrDuration;

  const xpEarned =
    totalWork * baseXPValue * difficultyMultiplier * userMultiplier;

  return Math.round(xpEarned);
}

export function calculateTotalWorkoutXP(exercises: ExerciseData[]): number {
  return exercises.reduce(
    (total, exercise) => total + calculateXP(exercise),
    0,
  );
}

/**
 * Rank Configuration
 * XP thresholds from E-Rank to S-Rank
 */

export const RANK_CONFIG = [
  {
    rank: "E",
    xpRequired: 0,
    xpToNextRank: 10000,
    displayName: "E-Rank",
    color: "#808080",
  },
  {
    rank: "D",
    xpRequired: 10000,
    xpToNextRank: 15000,
    displayName: "D-Rank",
    color: "#4169E1",
  },
  {
    rank: "C",
    xpRequired: 25000,
    xpToNextRank: 25000,
    displayName: "C-Rank",
    color: "#32CD32",
  },
  {
    rank: "B",
    xpRequired: 50000,
    xpToNextRank: 30000,
    displayName: "B-Rank",
    color: "#FFD700",
  },
  {
    rank: "A",
    xpRequired: 80000,
    xpToNextRank: 700000,
    displayName: "A-Rank",
    color: "#FF6347",
  },
  {
    rank: "S",
    xpRequired: 150000,
    xpToNextRank: Infinity,
    displayName: "S-Rank",
    color: "#FFD700",
  },
];

export function getRankByXP(totalXP: number): { rank: string; index: number } {
  for (let i = RANK_CONFIG.length - 1; i >= 0; i--) {
    if (totalXP >= RANK_CONFIG[i].xpRequired) {
      return { rank: RANK_CONFIG[i].rank, index: i };
    }
  }
  return { rank: "E", index: 0 };
}

export function getXPToNextRank(totalXP: number): number {
  const { index } = getRankByXP(totalXP);
  const nextRankXP =
    RANK_CONFIG[index].xpRequired + RANK_CONFIG[index].xpToNextRank;
  return Math.max(0, nextRankXP - totalXP);
}

export function getCurrentRankProgress(totalXP: number): {
  currentXP: number;
  xpToNextRank: number;
  progressPercent: number;
} {
  const { index } = getRankByXP(totalXP);

  const rankStartXP = RANK_CONFIG[index].xpRequired;
  const xpToNextRank = RANK_CONFIG[index].xpToNextRank;

  const currentXP = totalXP - rankStartXP;

  // ✅ FIX FOR S RANK
  if (xpToNextRank === Infinity) {
    return {
      currentXP,
      xpToNextRank: 0,
      progressPercent: 100,
    };
  }

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
  // ---------------- STRENGTH ----------------
  {
    name: "Pushup",
    category: "strength",
    baseXPValue: 7,
    difficultyMultiplier: 1.0,
    unit: "reps",
    description: "Classic upper body exercise!",
  },
  {
    name: "Pullup",
    category: "strength",
    baseXPValue: 9,
    difficultyMultiplier: 1.2,
    unit: "reps",
    description: "Pull yourself up!",
  },
  {
    name: "Squat",
    category: "strength",
    baseXPValue: 9,
    difficultyMultiplier: 1.15,
    unit: "reps",
    description: "Leg exercise!",
  },
  {
    name: "Deadlift",
    category: "strength",
    baseXPValue: 9,
    difficultyMultiplier: 1.4,
    unit: "reps",
    description: "Heavy lifting!",
  },
  {
    name: "Bench Press",
    category: "strength",
    baseXPValue: 9,
    difficultyMultiplier: 1.25,
    unit: "reps",
    description: "Chest pressing movement",
  },

  {
    name: "Lunges",
    category: "strength",
    baseXPValue: 8,
    difficultyMultiplier: 1.1,
    unit: "reps",
    description: "Lower body movement",
  },
  {
    name: "Dips",
    category: "strength",
    baseXPValue: 9,
    difficultyMultiplier: 1.3,
    unit: "reps",
    description: "Triceps and chest exercise",
  },
  {
    name: "Overhead Press",
    category: "strength",
    baseXPValue: 9,
    difficultyMultiplier: 1.3,
    unit: "reps",
    description: "Shoulder press movement",
  },
  {
    name: "Bicep Curl",
    category: "strength",
    baseXPValue: 7,
    difficultyMultiplier: 1.0,
    unit: "reps",
    description: "Biceps isolation exercise",
  },
  {
    name: "Tricep Extension",
    category: "strength",
    baseXPValue: 7,
    difficultyMultiplier: 1.0,
    unit: "reps",
    description: "Triceps isolation exercise",
  },

  {
    name: "Incline Pushup",
    category: "strength",
    baseXPValue: 6,
    difficultyMultiplier: 0.9,
    unit: "reps",
    description: "Easier pushup variation",
  },
  {
    name: "Decline Pushup",
    category: "strength",
    baseXPValue: 8,
    difficultyMultiplier: 1.2,
    unit: "reps",
    description: "Harder pushup variation",
  },
  {
    name: "Calf Raises",
    category: "strength",
    baseXPValue: 6,
    difficultyMultiplier: 1.0,
    unit: "reps",
    description: "Calf strengthening exercise",
  },

  // ---------------- CARDIO ----------------
  {
    name: "Running",
    category: "cardio",
    baseXPValue: 25,
    difficultyMultiplier: 1.0,
    unit: "km",
    description: "Cardio endurance!",
  },
  {
    name: "Cycling",
    category: "cardio",
    baseXPValue: 22,
    difficultyMultiplier: 0.9,
    unit: "km",
    description: "Low impact cardio!",
  },
  {
    name: "Jump Rope",
    category: "cardio",
    baseXPValue: 12,
    difficultyMultiplier: 1.1,
    unit: "reps",
    description: "Explosive cardio!",
  },

  {
    name: "Walking",
    category: "cardio",
    baseXPValue: 15,
    difficultyMultiplier: 0.8,
    unit: "km",
    description: "Low intensity cardio",
  },
  {
    name: "Stair Climbing",
    category: "cardio",
    baseXPValue: 18,
    difficultyMultiplier: 1.2,
    unit: "minutes",
    description: "High intensity cardio",
  },
  {
    name: "Burpees",
    category: "cardio",
    baseXPValue: 10,
    difficultyMultiplier: 1.3,
    unit: "reps",
    description: "Full body cardio",
  },
  {
    name: "Mountain Climbers",
    category: "cardio",
    baseXPValue: 9,
    difficultyMultiplier: 1.2,
    unit: "reps",
    description: "Core cardio movement",
  },
  {
    name: "Sprinting",
    category: "cardio",
    baseXPValue: 28,
    difficultyMultiplier: 1.2,
    unit: "km",
    description: "High intensity running",
  },
  {
    name: "Jogging",
    category: "cardio",
    baseXPValue: 20,
    difficultyMultiplier: 0.95,
    unit: "km",
    description: "Moderate pace running",
  },

  // ---------------- FLEXIBILITY / CORE ----------------
  {
    name: "Plank",
    category: "flexibility",
    baseXPValue: 5,
    difficultyMultiplier: 1.0,
    unit: "minutes",
    description: "Core endurance!",
  },
  {
    name: "Yoga",
    category: "flexibility",
    baseXPValue: 7,
    difficultyMultiplier: 0.85,
    unit: "minutes",
    description: "Flexibility and balance!",
  },

  {
    name: "Side Plank",
    category: "flexibility",
    baseXPValue: 5,
    difficultyMultiplier: 1.1,
    unit: "minutes",
    description: "Oblique core hold",
  },
  {
    name: "Stretching",
    category: "flexibility",
    baseXPValue: 6,
    difficultyMultiplier: 0.9,
    unit: "minutes",
    description: "General flexibility routine",
  },
  {
    name: "Leg Raises",
    category: "flexibility",
    baseXPValue: 7,
    difficultyMultiplier: 1.1,
    unit: "reps",
    description: "Core strengthening",
  },
  {
    name: "Sit Ups",
    category: "flexibility",
    baseXPValue: 7,
    difficultyMultiplier: 1.1,
    unit: "reps",
    description: "Abdominal exercise",
  },
  {
    name: "Russian Twists",
    category: "flexibility",
    baseXPValue: 7,
    difficultyMultiplier: 1.1,
    unit: "reps",
    description: "Core rotation exercise",
  },
];
