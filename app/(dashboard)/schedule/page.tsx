'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../components/button';
import { Alert } from '../../components/alert';
import { StreakDisplay } from '../../components/streak-display';
import {
  DAYS_OF_WEEK,
  getTodayDayName,
  getNextScheduledDay,
  getDaysUntilNextWorkout,
  isScheduledDay,
} from '../../lib/streak-system';

interface ScheduleData {
  schedule: {
    selectedDays: string[];
    goal: string;
  };
  progression: {
    workoutStreak: number;
    lastWorkoutDate: string | null;
    longestStreak: number;
  };
}

export default function WorkoutSchedulePage() {
  const { data: session } = useSession();
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [goal, setGoal] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('/api/user/workout-schedule');
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        setScheduleData(data);
        setSelectedDays(data.schedule.selectedDays);
        setGoal(data.schedule.goal);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchSchedule();
    }
  }, [session]);

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    if (selectedDays.length === 0) {
      setError('Please select at least one day');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/user/workout-schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedDays,
          goal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-functional">Loading schedule...</p>
        </div>
      </div>
    );
  }

  const todayName = getTodayDayName();
  const isScheduledToday = isScheduledDay(selectedDays);
  const nextDay = getNextScheduledDay(selectedDays);
  const daysUntil = getDaysUntilNextWorkout(selectedDays);
  const lastWorkoutDate = scheduleData?.progression.lastWorkoutDate
    ? new Date(scheduleData.progression.lastWorkoutDate)
    : null;

  // Determine streak status
  let streakStatus: 'active' | 'at-risk' | 'broken' = 'active';
  if (scheduleData && scheduleData.progression.workoutStreak === 0) {
    streakStatus = 'broken';
  } else if (isScheduledToday && (!lastWorkoutDate || 
    new Date().getTime() - lastWorkoutDate.getTime() > 24 * 60 * 60 * 1000)) {
    streakStatus = 'at-risk';
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-system text-display-md text-primary mb-4">WORKOUT_SCHEDULE</h1>
        <p className="text-on-surface-variant font-functional text-body-md">
          Set your workout routine. Consistency builds strength.
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Alert
          type="success"
          title="Success"
          message="Schedule updated successfully!"
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        {/* Settings Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Day Selection */}
            <div>
              <h2 className="font-system text-title-lg text-on-surface mb-6">SELECT DAYS</h2>
              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day: string) => {
                  const isSelected = selectedDays.includes(day);
                  const isToday = day === todayName;

                  return (
                    <label
                      key={day}
                      className={`flex items-center gap-3 p-4 rounded-none cursor-pointer transition-all border-l-4 ${
                        isSelected
                          ? 'bg-primary bg-opacity-10 border-primary'
                          : 'bg-surface-high border-outline-variant'
                      } ${isToday ? 'ring-2 ring-secondary ring-opacity-50' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleDayToggle(day)}
                        disabled={isSaving}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="font-system text-title-sm text-on-surface capitalize flex-1">
                        {day}
                      </span>
                      {isToday && <span className="text-primary text-label-md">TODAY</span>}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-label-md text-on-surface-variant mb-3 uppercase tracking-wider">
                Personal Goal
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={isSaving}
                placeholder="What's your fitness goal?"
                className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 p-2"
                rows={3}
                maxLength={200}
              />
              <p className="text-on-surface-variant text-label-sm mt-2">
                {goal.length}/200 characters
              </p>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSaving}
              disabled={isSaving || selectedDays.length === 0}
              className="w-full"
            >
              Save Schedule
            </Button>
          </form>
        </div>

        {/* Streak Display */}
        <div className="lg:col-span-2">
          {scheduleData && (
            <StreakDisplay
              currentStreak={scheduleData.progression.workoutStreak}
              longestStreak={scheduleData.progression.longestStreak}
              lastWorkoutDate={lastWorkoutDate}
              nextScheduledDay={nextDay ?? undefined}
              daysUntilNext={daysUntil}
              status={streakStatus}
            />
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="surface-card p-8">
        <h2 className="font-system text-title-lg text-on-surface mb-6">HOW_IT_WORKS</h2>
        <div className="space-y-4 text-body-sm text-on-surface-variant font-functional">
          <div>
            <p className="text-on-surface font-system text-title-sm mb-2">✅ Log on Scheduled Days</p>
            <p>
              Work out on the days you select. Each completed workout extends your streak.
            </p>
          </div>

          <div>
            <p className="text-on-surface font-system text-title-sm mb-2">❌ Miss a Day, Lose the Streak</p>
            <p>
              If you skip a scheduled workout day, your streak resets to zero. Non-scheduled days don&apos;t affect your streak.
            </p>
          </div>

          <div>
            <p className="text-on-surface font-system text-title-sm mb-2">📊 Leaderboard Impact</p>
            <p>
              Each missed scheduled day costs you 10 XP on the leaderboard. Keep your schedule to stay competitive.
            </p>
          </div>

          <div>
            <p className="text-on-surface font-system text-title-sm mb-2">🔥 Build Momentum</p>
            <p>
              Longer streaks mean more consistent training. Your discipline is measured by your streak.
            </p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      {scheduleData && (
        <div className="mt-12 surface-card p-8 border-l-4 border-primary">
          <h3 className="font-system text-title-md text-on-surface mb-4">TODAY&apos;S STATUS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-label-md text-on-surface-variant mb-2">DAY OF WEEK</p>
              <p className="font-system text-title-md text-on-surface capitalize">
                {todayName}
              </p>
            </div>

            <div>
              <p className="text-label-md text-on-surface-variant mb-2">SCHEDULED</p>
              <p
                className={`font-system text-title-md ${
                  isScheduledToday ? 'text-success' : 'text-on-surface-variant'
                }`}
              >
                {isScheduledToday ? '✓ Yes' : '✗ No'}
              </p>
            </div>

            <div>
              <p className="text-label-md text-on-surface-variant mb-2">ACTION</p>
              <p className="font-system text-title-md text-primary">
                {isScheduledToday ? (
                  lastWorkoutDate &&
                  new Date().getTime() - lastWorkoutDate.getTime() < 24 * 60 * 60 * 1000
                    ? '✓ Done'
                    : '⚠️ Required'
                ) : (
                  '⏭️ Optional'
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}