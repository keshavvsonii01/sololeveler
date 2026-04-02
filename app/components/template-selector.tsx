'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../components/button';

interface Exercise {
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
  exercises: Exercise[];
  isDefault: boolean;
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: WorkoutTemplate) => void;
  isLoading?: boolean;
}

const difficultyColor: Record<string, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400',
};

const difficultyBg: Record<string, string> = {
  beginner: 'bg-green-500 bg-opacity-10',
  intermediate: 'bg-yellow-500 bg-opacity-10',
  advanced: 'bg-red-500 bg-opacity-10',
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
  isLoading = false,
}) => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        let url = '/api/workout-templates?includeDefault=true';
        if (selectedDifficulty) {
          url += `&difficulty=${selectedDifficulty}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch templates');
        const data = await response.json();
        setTemplates(data.templates);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [selectedDifficulty]);

  const defaultTemplates = templates.filter((t) => t.isDefault);
  const customTemplates = templates.filter((t) => !t.isDefault);

  return (
    <div className="surface-card p-8 mb-8">
      <h2 className="font-system text-title-lg text-on-surface mb-6">
        🎯 SELECT_TEMPLATE_(Optional)
      </h2>

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
                ? `${difficultyBg[diff]} border ${difficultyColor[diff]}`
                : 'border border-outline-variant text-on-surface hover:border-primary'
            }`}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Default Templates */}
      {defaultTemplates.length > 0 && (
        <div className="mb-8">
          <p className="text-label-md text-on-surface-variant mb-4 uppercase">
            📌 System Templates
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultTemplates.map((template) => (
              <div
                key={template._id}
                className="border border-outline-variant rounded-none p-4 hover:border-primary transition-all cursor-pointer card-hover"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-system text-title-sm text-on-surface flex-1">
                    {template.name}
                  </h3>
                  <span className={`text-label-sm font-system px-2 py-1 rounded-none ${difficultyColor[template.difficulty]}`}>
                    {template.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-label-sm text-on-surface-variant mb-3">
                  {template.description}
                </p>
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
        <div className="mb-8">
          <p className="text-label-md text-on-surface-variant mb-4 uppercase">
            ⭐ Your Templates
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customTemplates.map((template) => (
              <div
                key={template._id}
                className="border border-secondary rounded-none p-4 hover:border-primary transition-all cursor-pointer card-hover"
                onClick={() => onSelectTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-system text-title-sm text-on-surface flex-1">
                    {template.name}
                  </h3>
                  <span className={`text-label-sm font-system px-2 py-1 rounded-none ${difficultyColor[template.difficulty]}`}>
                    {template.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-label-sm text-on-surface-variant mb-3">
                  {template.description}
                </p>
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
                <p className="text-label-sm text-on-surface-variant">
                  {template.exercises.length} exercises
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {templates.length === 0 && !isLoadingTemplates && (
        <p className="text-on-surface-variant text-center py-8">
          No templates available. Create one or start from scratch!
        </p>
      )}

      {isLoadingTemplates && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};