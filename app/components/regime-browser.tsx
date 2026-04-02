'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../components/button';

interface WorkoutRegime {
  _id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  benefits: string[];
  muscleGroups: string[];
  weeks: Array<{
    weekNumber: number;
    workouts: Array<{
      day: number;
      dayName: string;
      exercises: Array<{
        exerciseName: string;
        sets: number;
        reps: number;
      }>;
    }>;
  }>;
}

interface RegimeBrowserProps {
  onStartRegime: (regimeId: string) => void;
  isLoading?: boolean;
}

const difficultyColor: Record<string, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400',
};

const difficultyEmoji: Record<string, string> = {
  beginner: '🟢',
  intermediate: '🟡',
  advanced: '🔴',
};

export const RegimeBrowser: React.FC<RegimeBrowserProps> = ({
  onStartRegime,
  isLoading = false,
}) => {
  const [regimes, setRegimes] = useState<WorkoutRegime[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isLoadingRegimes, setIsLoadingRegimes] = useState(true);
  const [startingRegime, setStartingRegime] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegimes = async () => {
      try {
        let url = '/api/workout-regimes';
        if (selectedDifficulty) {
          url += `?difficulty=${selectedDifficulty}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch regimes');
        const data = await response.json();
        setRegimes(data.regimes);
      } catch (error) {
        console.error('Failed to fetch regimes:', error);
      } finally {
        setIsLoadingRegimes(false);
      }
    };

    fetchRegimes();
  }, [selectedDifficulty]);

  const handleStartRegime = async (regimeId: string) => {
    setStartingRegime(regimeId);
    try {
      const response = await fetch('/api/workout-regimes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regimeId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      onStartRegime(regimeId);
    } catch (error) {
      console.error('Failed to start regime:', error);
    } finally {
      setStartingRegime(null);
    }
  };

  return (
    <div className="surface-card p-8">
      <h2 className="font-system text-title-lg text-on-surface mb-2">
        🎯 GUIDED_WORKOUT_PROGRAMS
      </h2>
      <p className="text-on-surface-variant text-body-sm mb-6">
        Complete programs designed by experts. Pick your level and commit to 4 weeks!
      </p>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedDifficulty(null)}
          className={`px-4 py-2 rounded-none font-system transition-all ${
            selectedDifficulty === null
              ? 'bg-primary text-primary-dark'
              : 'border border-outline-variant text-on-surface hover:border-primary'
          }`}
        >
          All Levels
        </button>
        {['beginner', 'intermediate', 'advanced'].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-4 py-2 rounded-none font-system transition-all ${
              selectedDifficulty === diff
                ? 'bg-primary text-primary-dark'
                : 'border border-outline-variant text-on-surface hover:border-primary'
            }`}
          >
            {difficultyEmoji[diff]} {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Regimes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regimes.map((regime) => (
          <div
            key={regime._id}
            className="border border-outline-variant rounded-none p-6 hover:border-primary transition-all"
          >
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-system text-title-md text-on-surface flex-1">
                  {regime.name}
                </h3>
                <span className={`text-label-sm font-system px-2 py-1 ${difficultyColor[regime.difficulty]}`}>
                  {difficultyEmoji[regime.difficulty]} {regime.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-label-sm text-on-surface-variant mb-4">
                {regime.duration} weeks • {regime.weeks.reduce((acc, w) => acc + w.workouts.length, 0)} workouts
              </p>
            </div>

            {/* Description */}
            <p className="text-body-sm text-on-surface-variant mb-4">
              {regime.description}
            </p>

            {/* Muscle Groups */}
            <div className="mb-4">
              <p className="text-label-sm text-on-surface-variant mb-2">Focus Areas:</p>
              <div className="flex flex-wrap gap-2">
                {regime.muscleGroups.map((group) => (
                  <span
                    key={group}
                    className="text-label-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded-none"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-6 border-t border-outline-variant border-opacity-15 pt-4">
              <p className="text-label-sm text-on-surface-variant mb-2">Benefits:</p>
              <ul className="space-y-1">
                {regime.benefits.slice(0, 3).map((benefit, idx) => (
                  <li key={idx} className="text-label-sm text-on-surface flex items-center gap-2">
                    <span>✓</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Start Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleStartRegime(regime._id)}
              isLoading={startingRegime === regime._id}
              disabled={startingRegime !== null}
              className="w-full"
            >
              Start Program
            </Button>
          </div>
        ))}
      </div>

      {regimes.length === 0 && !isLoadingRegimes && (
        <div className="text-center py-12">
          <p className="text-on-surface-variant">No programs available for this difficulty level.</p>
        </div>
      )}

      {isLoadingRegimes && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};