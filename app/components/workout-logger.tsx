"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Alert } from "./alert";

interface Exercise {
  _id: string;
  name: string;
  category: string;
  unit: string;
  baseXPValue: number;
  difficultyMultiplier: number;
}

interface WorkoutExerciseEntry {
  exerciseId: string;
  repsOrDuration: number;
  sets?: number;
  weight?: number;
  notes?: string;
}

interface WorkoutLoggerProps {
  exercises: Exercise[];
  onSubmit: (data: unknown) => Promise<void>;
  isLoading?: boolean;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({
  exercises,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedExercises, setSelectedExercises] = useState<
    WorkoutExerciseEntry[]
  >([]);
  const [currentExerciseId, setCurrentExerciseId] = useState<string>("");
  const [currentReps, setCurrentReps] = useState<string>("");
  const [currentSets, setCurrentSets] = useState<string>("1");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [currentNotes, setCurrentNotes] = useState<string>("");
  const [workoutDate, setWorkoutDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [workoutNotes, setWorkoutNotes] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const selectedExercise = exercises.find((ex) => ex._id === currentExerciseId);

  const calculateXP = (exerciseId: string, reps: number, sets: number) => {
    const exercise = exercises.find((ex) => ex._id === exerciseId);
    if (!exercise) return 0;
    return Math.round(
      reps * sets * exercise.baseXPValue * exercise.difficultyMultiplier,
    );
  };

  const handleAddExercise = () => {
    if (!currentExerciseId || !currentReps) {
      setError("Please select an exercise and enter reps/duration");
      return;
    }

    const newEntry: WorkoutExerciseEntry = {
      exerciseId: currentExerciseId,
      repsOrDuration: parseInt(currentReps),
      sets: currentSets ? parseInt(currentSets) : 1,
      weight: currentWeight ? parseInt(currentWeight) : undefined,
      notes: currentNotes || undefined,
    };

    setSelectedExercises([...selectedExercises, newEntry]);
    setCurrentExerciseId("");
    setCurrentReps("");
    setCurrentSets("1");
    setCurrentWeight("");
    setCurrentNotes("");
    setError(null);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedExercises.length === 0) {
      setError("Add at least one exercise");
      return;
    }

    try {
      await onSubmit({
        exercises: selectedExercises,
        date: workoutDate,
        notes: workoutNotes || undefined,
        mood: mood || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        setSelectedExercises([]);
        setWorkoutDate(new Date().toISOString().split("T")[0]);
        setWorkoutNotes("");
        setMood("");
        setSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const totalXP = selectedExercises.reduce((sum, ex) => {
    return sum + calculateXP(ex.exerciseId, ex.repsOrDuration, ex.sets || 1);
  }, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          message="Workout logged successfully!"
        />
      )}

      {/* Workout Date */}
      <div>
        <Input
          type="date"
          label="Workout Date"
          value={workoutDate}
          onChange={(e) => setWorkoutDate(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Exercise Selection */}
      <div className="surface-card p-6">
        <h3 className="font-system text-title-md text-on-surface mb-6">
          ADD EXERCISES
        </h3>

        <div className="space-y-4 mb-6">
          {/* Exercise selector */}
          <div>
            <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">
              Select Exercise
            </label>
            <select
              value={currentExerciseId}
              onChange={(e) => setCurrentExerciseId(e.target.value)}
              disabled={isLoading}
              className="w-full text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed p-2"
            >
              <option className="text-black" value="">Choose an exercise...</option>
              {exercises.map((ex) => (
                <option
                  key={ex._id}
                  className="text-black"
                  value={ex._id}
                >
                  {ex.name} ({ex.category})
                </option>
              ))}
            </select>
          </div>

          {/* Reps/Duration */}
          <Input
            type="number"
            label="Reps / Duration"
            placeholder="Enter amount"
            value={currentReps}
            onChange={(e) => setCurrentReps(e.target.value)}
            disabled={isLoading}
            min="1"
          />

          {/* Sets */}
          <Input
            type="number"
            label="Sets (Optional)"
            placeholder="1"
            value={currentSets}
            onChange={(e) => setCurrentSets(e.target.value)}
            disabled={isLoading}
            min="1"
          />

          {/* Weight */}
          <Input
            type="number"
            label="Weight (Optional, kg)"
            placeholder="0"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            disabled={isLoading}
            min="0"
          />

          {/* Notes */}
          <div>
            <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">
              Notes (Optional)
            </label>
            <textarea
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              disabled={isLoading}
              placeholder="How did it feel?"
              className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed p-2"
              rows={2}
            />
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleAddExercise}
            disabled={isLoading || !currentExerciseId || !currentReps}
            className="w-full"
          >
            Add Exercise
          </Button>
        </div>

        {/* Added exercises list */}
        {selectedExercises.length > 0 && (
          <div className="border-t border-outline-variant border-opacity-15 pt-6">
            <h4 className="font-system text-title-sm text-on-surface mb-4">
              ADDED EXERCISES
            </h4>
            <div className="space-y-3">
              {selectedExercises.map((ex, index) => {
                const exercise = exercises.find((e) => e._id === ex.exerciseId);
                const xp = calculateXP(
                  ex.exerciseId,
                  ex.repsOrDuration,
                  ex.sets || 1,
                );

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-surface-high rounded-none border-l-4 border-primary"
                  >
                    <div className="flex-1">
                      <p className="font-system text-body-md text-on-surface">
                        {exercise?.name}
                      </p>
                      <p className="text-label-sm text-on-surface-variant">
                        {ex.repsOrDuration} {exercise?.unit} × {ex.sets} sets
                        {ex.weight && ` @ ${ex.weight}kg`}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-system text-title-sm text-secondary">
                        +{xp} XP
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(index)}
                      disabled={isLoading}
                      className="text-error hover:opacity-70 transition-opacity text-xl"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Workout Details */}
      <div className="space-y-6">
        <div>
          <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">
            Mood
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            disabled={isLoading}
            className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed p-2"
          >
            <option className="text-black" value="">Select mood...</option>
            <option className="text-black" value="excellent">Excellent</option>
            <option className="text-black" value="good">Good</option>
            <option className="text-black" value="okay">Okay</option>
            <option className="text-black" value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-label-md text-on-surface-variant mb-2 uppercase tracking-wider">
            Workout Notes (Optional)
          </label>
          <textarea
            value={workoutNotes}
            onChange={(e) => setWorkoutNotes(e.target.value)}
            disabled={isLoading}
            placeholder="How was the workout overall?"
            className="w-full bg-transparent text-on-surface font-functional focus:outline-none border-b-2 border-outline-variant transition-colors duration-200 focus:border-primary focus:shadow-[0_0_12px_rgba(0,242,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed p-2"
            rows={3}
          />
        </div>
      </div>

      {/* Summary */}
      {selectedExercises.length > 0 && (
        <div className="surface-card p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-md text-on-surface-variant mb-2">
                WORKOUT SUMMARY
              </p>
              <p className="font-system text-title-md text-on-surface">
                {selectedExercises.length} exercises
              </p>
            </div>
            <div className="text-right">
              <p className="text-label-md text-on-surface-variant mb-2">
                TOTAL XP
              </p>
              <p className="font-system text-display-sm text-secondary">
                +{totalXP}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading || selectedExercises.length === 0}
        className="w-full"
      >
        {isLoading ? "Logging Workout..." : "Log Workout"}
      </Button>
    </form>
  );
};
