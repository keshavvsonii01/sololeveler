/**
 * Streak System Utilities
 * Handles workout streak logic and leaderboard penalties
 */

export const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const STREAK_PENALTY_PER_MISSED_DAY = 10; // XP penalty per missed day

/**
 * Get today's day name (lowercase)
 */
export function getTodayDayName(): string {
  const today = new Date();
  return DAYS_OF_WEEK[today.getDay()];
}

/**
 * Check if user should have worked out today
 */
export function isScheduledDay(selectedDays: string[]): boolean {
  const today = getTodayDayName();
  return selectedDays.includes(today);
}

/**
 * Get next scheduled workout day
 */
export function getNextScheduledDay(selectedDays: string[]): string | null {
  if (selectedDays.length === 0) return null;

  const today = new Date().getDay();
  let nextDay = (today + 1) % 7;
  let daysChecked = 0;

  while (daysChecked < 7) {
    if (selectedDays.includes(DAYS_OF_WEEK[nextDay])) {
      return DAYS_OF_WEEK[nextDay];
    }
    nextDay = (nextDay + 1) % 7;
    daysChecked++;
  }

  return null;
}

/**
 * Calculate missed days since last workout
 * Returns 0 if worked out today or on non-scheduled days
 */
export function calculateMissedDays(
  lastWorkoutDate: Date | null,
  selectedDays: string[]
): number {
  if (selectedDays.length === 0) return 0;
  if (!lastWorkoutDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastWorkout = new Date(lastWorkoutDate);
  lastWorkout.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 1) return 0; // Worked out today or in future

  // Count scheduled days between last workout and today
  let missedDays = 0;
  const checkDate = new Date(lastWorkout);
  checkDate.setDate(checkDate.getDate() + 1);

  while (checkDate < today) {
    const dayName = DAYS_OF_WEEK[checkDate.getDay()];
    if (selectedDays.includes(dayName)) {
      missedDays++;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return missedDays;
}

/**
 * Calculate XP penalty for leaderboard based on missed days
 */
export function calculateLeaderboardPenalty(missedDays: number): number {
  return missedDays * STREAK_PENALTY_PER_MISSED_DAY;
}

/**
 * Calculate adjusted rank for leaderboards (with penalties applied)
 */
export function calculateAdjustedRank(totalXP: number, missedDays: number): number {
  const penalty = calculateLeaderboardPenalty(missedDays);
  return Math.max(0, totalXP - penalty);
}

/**
 * Format day names for display
 */
export function formatDayName(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

/**
 * Get days until next scheduled workout
 */
export function getDaysUntilNextWorkout(selectedDays: string[]): number {
  if (selectedDays.length === 0) return Infinity;

  const today = new Date().getDay();
  let nextDay = (today + 1) % 7;
  let daysAhead = 0;

  while (daysAhead < 7) {
    if (selectedDays.includes(DAYS_OF_WEEK[nextDay])) {
      return daysAhead + 1;
    }
    nextDay = (nextDay + 1) % 7;
    daysAhead++;
  }

  return 7; // All days covered, next is same day next week
}

/**
 * Check if streak should be reset
 */
export function shouldResetStreak(
  lastWorkoutDate: Date | null,
  selectedDays: string[]
): boolean {
  if (selectedDays.length === 0) return false;
  
  const today = new Date();
  const todayName = getTodayDayName();
  
  // If today is not a scheduled day, streak shouldn't reset
  if (!selectedDays.includes(todayName)) {
    return false;
  }

  // If no previous workout, don't reset (starting fresh)
  if (!lastWorkoutDate) {
    return false;
  }

  // Check if worked out today
  const today_start = new Date(today);
  today_start.setHours(0, 0, 0, 0);
  
  const today_end = new Date(today);
  today_end.setHours(23, 59, 59, 999);

  const lastWorkout = new Date(lastWorkoutDate);

  return !(lastWorkout >= today_start && lastWorkout <= today_end);
}