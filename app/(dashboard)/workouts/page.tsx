'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../components/button';
import Link from 'next/link';
import { formatDate } from '../../lib/utils';

interface Workout {
  _id: string;
  date: string;
  exercises: Array<{
    exerciseName: string;
    repsOrDuration: number;
    sets: number;
    weight?: number;
    xpEarned: number;
  }>;
  totalXPEarned: number;
  totalExercises: number;
  mood?: string;
  notes?: string;
  isRankedUp: boolean;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function WorkoutsPage() {
  const { data: session } = useSession();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(`/api/workouts?page=${page}&limit=10`);
        if (!response.ok) throw new Error('Failed to fetch workouts');
        const data = await response.json();
        setWorkouts(data.workouts);
        setPagination(data.pagination);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchWorkouts();
    }
  }, [session, page]);

  const moodEmoji: Record<string, string> = {
    excellent: '🔥',
    good: '💪',
    okay: '👍',
    poor: '😤',
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-functional">Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h1 className="font-system text-display-md text-primary mb-2">WORKOUT_HISTORY</h1>
          <p className="text-on-surface-variant font-functional text-body-md">
            {pagination?.total || 0} workouts logged
          </p>
        </div>
        <Link href="/workouts/new">
          <Button variant="primary" size="lg">
            Log New Workout
          </Button>
        </Link>
      </div>

      {error && (
        <div className="surface-card p-6 text-error mb-6">
          {error}
        </div>
      )}

      {workouts.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <p className="text-on-surface-variant font-functional text-body-md mb-6">
            No workouts logged yet. Time to start your journey!
          </p>
          <Link href="/workouts/new">
            <Button variant="primary" size="lg">
              Log Your First Workout
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Workouts List */}
          <div className="space-y-6 mb-12">
            {workouts.map((workout) => (
              <div
                key={workout._id}
                className="surface-card p-6 border-l-4 border-primary hover:bg-surface-low transition-colors"
              >
                {/* Workout Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-system text-title-md text-on-surface">
                        {formatDate(new Date(workout.date))}
                      </h3>
                      {workout.mood && (
                        <span className="text-2xl">{moodEmoji[workout.mood] || '🏋️'}</span>
                      )}
                      {workout.isRankedUp && (
                        <span className="bg-primary bg-opacity-20 text-primary px-2 py-1 rounded-none text-label-sm font-system">
                          RANK UP!
                        </span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-body-sm">
                      {workout.totalExercises} exercises • {workout.totalXPEarned} XP earned
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-on-surface-variant text-label-md mb-1">XP GAINED</p>
                    <p className="font-system text-headline-md text-secondary">
                      +{workout.totalXPEarned}
                    </p>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="border-t border-outline-variant border-opacity-15 pt-6">
                  <p className="text-label-md text-on-surface-variant mb-4 uppercase">
                    Exercises ({workout.totalExercises})
                  </p>
                  <div className="space-y-3">
                    {workout.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-surface-high rounded-none text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-system text-on-surface">{ex.exerciseName}</p>
                          <p className="text-label-sm text-on-surface-variant">
                            {ex.repsOrDuration} {ex.sets > 1 ? `× ${ex.sets} sets` : ''}
                            {ex.weight && ` @ ${ex.weight}kg`}
                          </p>
                        </div>
                        <p className="font-system text-secondary">+{ex.xpEarned} XP</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workout Notes */}
                {workout.notes && (
                  <div className="border-t border-outline-variant border-opacity-15 pt-6 mt-6">
                    <p className="text-label-md text-on-surface-variant mb-2">NOTES</p>
                    <p className="text-body-sm text-on-surface">{workout.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ← Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.pages }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className={`w-10 h-10 rounded-none font-system transition-all ${
                      page === idx + 1
                        ? 'bg-primary text-primary-dark'
                        : 'border border-outline-variant text-on-surface hover:border-primary'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                disabled={page === pagination.pages}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}

      {/* System Status */}
      <div className="mt-12 text-center text-on-surface-variant text-label-sm">
        <p>SYSTEM_STATUS: WORKOUT_LOGGING_ACTIVE</p>
      </div>
    </div>
  );
}