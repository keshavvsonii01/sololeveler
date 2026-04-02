'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../../components/button';
import { Alert } from '../../../components/alert';
import { MUSCLE_GROUPS } from '../../../models/workout-constants';

interface Exercise {
  _id: string;
  name: string;
  category: string;
}

interface TemplateExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

interface WorkoutTemplate {
  _id: string;
  name: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  exercises: TemplateExercise[];
  isDefault: boolean;
}

export default function TemplatesPage() {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Form states
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateDifficulty, setTemplateDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>([]);
  const [currentExerciseId, setCurrentExerciseId] = useState('');
  const [currentSets, setCurrentSets] = useState('3');
  const [currentReps, setCurrentReps] = useState('10');
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch templates and exercises
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, exercisesRes] = await Promise.all([
          fetch('/api/workout-templates?includeDefault=true'),
          fetch('/api/exercises'),
        ]);

        if (!templatesRes.ok || !exercisesRes.ok) throw new Error('Failed to fetch data');

        const templatesData = await templatesRes.json();
        const exercisesData = await exercisesRes.json();

        setTemplates(templatesData.templates);
        setExercises(exercisesData.exercises);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const handleAddExerciseToTemplate = () => {
    if (!currentExerciseId || !currentSets || !currentReps) {
      setError('Please select exercise and enter sets/reps');
      return;
    }

    const exercise = exercises.find((e) => e._id === currentExerciseId);
    if (!exercise) return;

    const newExercise: TemplateExercise = {
      exerciseId: currentExerciseId,
      exerciseName: exercise.name,
      sets: parseInt(currentSets),
      reps: parseInt(currentReps),
      weight: currentWeight ? parseInt(currentWeight) : undefined,
      notes: currentNotes || undefined,
    };

    setTemplateExercises([...templateExercises, newExercise]);
    setCurrentExerciseId('');
    setCurrentSets('3');
    setCurrentReps('10');
    setCurrentWeight('');
    setCurrentNotes('');
    setError(null);
  };

  const handleRemoveExerciseFromTemplate = (index: number) => {
    setTemplateExercises(templateExercises.filter((_, i) => i !== index));
  };

  const handleMuscleGroupToggle = (group: string) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!templateName || templateExercises.length === 0 || selectedMuscleGroups.length === 0) {
        setError('Please fill all fields and add at least one exercise');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/workout-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          description: templateDescription,
          difficulty: templateDifficulty,
          muscleGroups: selectedMuscleGroups,
          exercises: templateExercises,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create template');
      }

      const data = await response.json();
      setTemplates([...templates, data.template]);

      // Reset form
      setTemplateName('');
      setTemplateDescription('');
      setTemplateDifficulty('beginner');
      setSelectedMuscleGroups([]);
      setTemplateExercises([]);
      setShowCreateForm(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const response = await fetch(`/api/workout-templates?id=${templateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete template');

      setTemplates(templates.filter((t) => t._id !== templateId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredTemplates = selectedDifficulty
    ? templates.filter((t) => t.difficulty === selectedDifficulty)
    : templates;

  const defaultTemplates = filteredTemplates.filter((t) => t.isDefault);
  const customTemplates = filteredTemplates.filter((t) => !t.isDefault);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-functional">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h1 className="font-system text-display-md text-primary mb-2">WORKOUT_TEMPLATES</h1>
          <p className="text-on-surface-variant font-functional text-body-md">
            Create and manage your workout templates
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '+ Create Template'}
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

      {/* Create Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateTemplate} className="surface-card p-8 mb-12 space-y-8">
          <h2 className="font-system text-title-lg text-on-surface">CREATE NEW TEMPLATE</h2>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                Template Name *
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Chest & Triceps Day"
                className="w-full bg-transparent text-on-surface border-b-2 border-outline-variant focus:border-primary outline-none p-2 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                Description
              </label>
              <textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Describe your template..."
                className="w-full bg-transparent text-on-surface border-b-2 border-outline-variant focus:border-primary outline-none p-2 transition-colors"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                Difficulty *
              </label>
              <select
                value={templateDifficulty}
                onChange={(e) => setTemplateDifficulty(e.target.value as any)}
                className="w-full bg-transparent text-on-surface border-b-2 border-outline-variant focus:border-primary outline-none p-2 transition-colors"
              >
                <option className='bg-[#15151b]' value="beginner">Beginner</option>
                <option className='bg-[#15151b]' value="intermediate">Intermediate</option>
                <option className='bg-[#15151b]' value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Muscle Groups */}
          <div>
            <label className="block text-label-md text-on-surface-variant mb-3 uppercase">
              Muscle Groups *
            </label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => handleMuscleGroupToggle(group)}
                  className={`px-4 py-2 rounded-none font-system transition-all text-label-sm ${
                    selectedMuscleGroups.includes(group)
                      ? 'bg-primary text-primary-dark'
                      : 'border border-outline-variant text-on-surface hover:border-primary'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Add Exercises */}
          <div className="border-t border-outline-variant pt-6">
            <h3 className="font-system text-title-md text-on-surface mb-6">Add Exercises *</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                  Exercise
                </label>
                <select
                  value={currentExerciseId}
                  onChange={(e) => setCurrentExerciseId(e.target.value)}
                  className="w-full bg-transparent text-on-surface border-b-2 border-outline-variant focus:border-primary outline-none p-2 transition-colors"
                >
                  <option className='bg-[#15151b]' value="">Select exercise...</option>
                  {exercises.map((ex) => (
                    <option className='bg-[#15151b]' key={ex._id} value={ex._id}>
                      {ex.name} ({ex.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                    Sets
                  </label>
                  <input
                    type="number"
                    value={currentSets}
                    onChange={(e) => setCurrentSets(e.target.value)}
                    className="w-full bg-transparent text-on-surface border-b-2 border-outline-variant focus:border-primary outline-none p-2 transition-colors"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={currentReps}
                    onChange={(e) => setCurrentReps(e.target.value)}
                    className="w-full bg-transparent text-on-surface border-b-2 border-outline-variant focus:border-primary outline-none p-2 transition-colors"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="w-full bg-transparent text-on-surface border-b-2 border-outline-variant focus:border-primary outline-none p-2 transition-colors"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-md text-on-surface-variant mb-2 uppercase">
                  Notes
                </label>
                <textarea
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  placeholder="Optional notes..."
                  className="w-full bg-transparent text-on-surface border-b-2 border-outline-variant focus:border-primary outline-none p-2 transition-colors"
                  rows={2}
                />
              </div>

              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddExerciseToTemplate}
                className="w-full"
              >
                Add Exercise to Template
              </Button>
            </div>

            {/* Template Exercises List */}
            {templateExercises.length > 0 && (
              <div className="space-y-3 mb-6">
                <p className="text-label-md text-on-surface-variant uppercase">Exercises in template:</p>
                {templateExercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-surface-high rounded-none border-l-4 border-primary"
                  >
                    <div>
                      <p className="font-system text-body-md text-on-surface">{ex.exerciseName}</p>
                      <p className="text-label-sm text-on-surface-variant">
                        {ex.sets} sets × {ex.reps} reps
                        {ex.weight && ` @ ${ex.weight}kg`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExerciseFromTemplate(idx)}
                      className="text-error hover:opacity-70 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            Create Template
          </Button>
        </form>
      )}

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
          All
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
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Default Templates */}
      {defaultTemplates.length > 0 && (
        <div className="mb-12">
          <h2 className="font-system text-title-lg text-on-surface mb-6">📌 System Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {defaultTemplates.map((template) => (
              <div key={template._id} className="surface-card p-6 border-l-4 border-primary">
                <h3 className="font-system text-title-md text-on-surface mb-2">{template.name}</h3>
                <p className="text-label-sm text-on-surface-variant mb-4">{template.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.muscleGroups.map((group) => (
                    <span
                      key={group}
                      className="text-label-xs bg-primary bg-opacity-20 text-primary px-2 py-1 rounded-none"
                    >
                      {group}
                    </span>
                  ))}
                </div>

                <p className="text-label-sm text-on-surface-variant">
                  {template.exercises.length} exercises
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Templates */}
      {customTemplates.length > 0 && (
        <div>
          <h2 className="font-system text-title-lg text-on-surface mb-6">⭐ Your Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customTemplates.map((template) => (
              <div key={template._id} className="surface-card p-6 border-l-4 border-secondary">
                <h3 className="font-system text-title-md text-on-surface mb-2">{template.name}</h3>
                <p className="text-label-sm text-on-surface-variant mb-4">{template.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.muscleGroups.map((group) => (
                    <span
                      key={group}
                      className="text-label-xs bg-secondary bg-opacity-20 text-secondary px-2 py-1 rounded-none"
                    >
                      {group}
                    </span>
                  ))}
                </div>

                <p className="text-label-sm text-on-surface-variant mb-4">
                  {template.exercises.length} exercises
                </p>

                <button
                  onClick={() => handleDeleteTemplate(template._id)}
                  className="text-error hover:opacity-70 transition-opacity text-label-sm font-system"
                >
                  Delete Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {templates.length === 0 && (
        <div className="surface-card p-12 text-center">
          <p className="text-on-surface-variant font-functional">
            No templates yet. Create one to get started!
          </p>
        </div>
      )}
    </div>
  );
}