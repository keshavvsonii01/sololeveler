'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { WorkoutLogger } from '../../../components/workout-logger';
import { TemplateSelector } from '../../../components/template-selector';
import { Alert } from '../../../components/alert';

interface Exercise {
  _id: string;
  name: string;
  category: string;
  unit: string;
  baseXPValue: number;
  difficultyMultiplier: number;
}

interface WorkoutTemplate {
  _id: string;
  name: string;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
  }>;
}

export default function LogWorkoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        if (!response.ok) throw new Error('Failed to fetch exercises');
        const data = await response.json();
        setExercises(data.exercises);
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
      fetchExercises();
    }
  }, [session]);

  const handleLogWorkout = async (data: unknown) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to log workout');
      }

      const result = await response.json();

      // Show success and redirect
      setTimeout(() => {
        router.push('/workouts');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-functional">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-system text-display-md text-primary mb-4">LOG_WORKOUT</h1>
        <p className="text-on-surface-variant font-functional text-body-md">
          Record your training session and earn XP towards your next rank.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
          />
        </div>
      )}

      {/* Template Selector */}
      <TemplateSelector
        onSelectTemplate={setSelectedTemplate}
        isLoading={isSubmitting}
      />

      {/* Workout Logger */}
      <div className="surface-card p-8 mb-12">
        <WorkoutLogger
          exercises={exercises}
          onSubmit={handleLogWorkout}
          isLoading={isSubmitting}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
      </div>

      {/* Quick Tips */}
      <div className="surface-card p-8">
        <h2 className="font-system text-title-lg text-on-surface mb-6">SYSTEM_TIPS</h2>
        <div className="space-y-4 text-body-sm text-on-surface-variant font-functional">
          <p>
            💡 <span className="text-on-surface">Every rep counts.</span> The more you do, the more XP you earn.
          </p>
          <p>
            💪 <span className="text-on-surface">Difficulty matters.</span> Some exercises give more XP than others based on intensity.
          </p>
          <p>
            📈 <span className="text-on-surface">Track progress.</span> Your personal bests and stats are recorded automatically.
          </p>
          <p>
            🔥 <span className="text-on-surface">Consistency is key.</span> Daily workouts build your streak and power.
          </p>
          <p>
            ⭐ <span className="text-on-surface">Use templates.</span> Save time by using workout templates or guided programs.
          </p>
        </div>
      </div>
    </div>
  );
}