'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../components/button';
import { Alert } from '../../components/alert';

interface Exercise {
  _id: string;
  name: string;
  category: string;
  description?: string;
  baseXPValue: number;
  difficultyMultiplier: number;
  unit: string;
  isCustom: boolean;
}

interface ExerciseStats {
  _id: string;
  exerciseName: string;
  personalBest: number;
  timesCompleted: number;
  totalXPFromExercise: number;
}

const categoryEmoji: Record<string, string> = {
  strength: '💪',
  cardio: '🏃',
  flexibility: '🧘',
  sports: '⚽',
  other: '🏋️',
};

export default function ExercisesPage() {
  const { data: session } = useSession();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [stats, setStats] = useState<ExerciseStats[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    category: 'strength',
    baseXPValue: 10,
    difficultyMultiplier: 1.0,
    unit: 'reps',
    description: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
      fetchData();
    }
  }, [session]);

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExercise),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();
      setExercises([...exercises, data.exercise]);
      setNewExercise({
        name: '',
        category: 'strength',
        baseXPValue: 10,
        difficultyMultiplier: 1.0,
        unit: 'reps',
        description: '',
      });
      setShowCreateForm(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const filteredExercises = selectedCategory
    ? exercises.filter((ex) => ex.category === selectedCategory)
    : exercises;

  const categories = Array.from(new Set(exercises.map((ex) => ex.category)));

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
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h1 className="font-system text-display-md text-primary mb-2">EXERCISE_LIBRARY</h1>
          <p className="text-on-surface-variant font-functional text-body-md">
            {filteredExercises.length} exercises available
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create Custom Exercise'}
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Create Exercise Form */}
      {showCreateForm && (
        <div className="surface-card p-8 mb-12">
          <h2 className="font-system text-title-lg text-on-surface mb-6">CREATE_CUSTOM_EXERCISE</h2>
          <form onSubmit={handleCreateExercise} className="space-y-6">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                Exercise Name *
              </label>
              <input
                type="text"
                required
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                disabled={isCreating}
                className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 p-2"
                placeholder="e.g., Muscle-ups"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                  Category *
                </label>
                <select
                  value={newExercise.category}
                  onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
                  disabled={isCreating}
                  className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary p-2"
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                  Unit *
                </label>
                <select
                  value={newExercise.unit}
                  onChange={(e) => setNewExercise({ ...newExercise, unit: e.target.value })}
                  disabled={isCreating}
                  className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary p-2"
                >
                  <option value="reps">Reps</option>
                  <option value="minutes">Minutes</option>
                  <option value="km">Kilometers</option>
                  <option value="miles">Miles</option>
                  <option value="sets">Sets</option>
                </select>
              </div>

              <div>
                <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                  Base XP Value *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newExercise.baseXPValue}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, baseXPValue: parseInt(e.target.value) })
                  }
                  disabled={isCreating}
                  className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 p-2"
                />
              </div>

              <div>
                <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                  Difficulty Multiplier *
                </label>
                <input
                  type="number"
                  required
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={newExercise.difficultyMultiplier}
                  onChange={(e) =>
                    setNewExercise({ ...newExercise, difficultyMultiplier: parseFloat(e.target.value) })
                  }
                  disabled={isCreating}
                  className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                Description
              </label>
              <textarea
                value={newExercise.description}
                onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                disabled={isCreating}
                className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 p-2"
                placeholder="Describe your custom exercise"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isCreating}
              disabled={isCreating || !newExercise.name}
              className="w-full"
            >
              Create Exercise
            </Button>
          </form>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-none font-system transition-all ${
              selectedCategory === ''
                ? 'bg-primary text-primary-dark'
                : 'border border-outline-variant text-on-surface hover:border-primary'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-none font-system transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-dark'
                  : 'border border-outline-variant text-on-surface hover:border-primary'
              }`}
            >
              {categoryEmoji[cat]} {cat}
            </button>
          ))}
        </div>
      )}

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => {
          const baseXP = exercise.baseXPValue;
          const multipliedXP = Math.round(baseXP * exercise.difficultyMultiplier);

          return (
            <div
              key={exercise._id}
              className="surface-card p-6 border-l-4 border-secondary hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-system text-title-md text-on-surface">{exercise.name}</h3>
                  <p className="text-label-sm text-on-surface-variant mt-1">
                    {categoryEmoji[exercise.category]} {exercise.category}
                  </p>
                </div>
                {exercise.isCustom && (
                  <span className="bg-secondary bg-opacity-20 text-secondary px-2 py-1 rounded-none text-label-sm font-system">
                    CUSTOM
                  </span>
                )}
              </div>

              {exercise.description && (
                <p className="text-body-sm text-on-surface-variant mb-4">{exercise.description}</p>
              )}

              <div className="border-t border-outline-variant border-opacity-15 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-label-sm text-on-surface-variant">Unit</p>
                  <p className="font-system text-body-sm text-on-surface">{exercise.unit}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-label-sm text-on-surface-variant">Base XP</p>
                  <p className="font-system text-body-sm text-primary">{baseXP}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-label-sm text-on-surface-variant">Multiplier</p>
                  <p className="font-system text-body-sm text-secondary">{exercise.difficultyMultiplier}x</p>
                </div>

                <div className="flex items-center justify-between bg-surface-high p-2 rounded-none">
                  <p className="text-label-sm text-on-surface-variant">Per Unit</p>
                  <p className="font-system text-title-sm text-primary">+{multipliedXP} XP</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div className="surface-card p-12 text-center">
          <p className="text-on-surface-variant font-functional">No exercises found in this category.</p>
        </div>
      )}
    </div>
  );
}