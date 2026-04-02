import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutRegime extends Document {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // weeks
  benefits: string[];
  muscleGroups: string[];
  weeks: Array<{
    weekNumber: number;
    workouts: Array<{
      day: number; // 1-7 (Monday-Sunday)
      dayName: string;
      exercises: Array<{
        exerciseId: mongoose.Types.ObjectId;
        exerciseName: string;
        sets: number;
        reps: number;
        weight?: number;
        notes?: string;
      }>;
    }>;
  }>;
  isDefault: boolean;
  createdAt: Date;
}

const workoutRegimeSchema = new Schema<IWorkoutRegime>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    benefits: {
      type: [String],
      required: true,
    },
    muscleGroups: {
      type: [String],
      required: true,
    },
    weeks: [
      {
        weekNumber: {
          type: Number,
          required: true,
        },
        workouts: [
          {
            day: {
              type: Number,
              required: true,
              min: 1,
              max: 7,
            },
            dayName: {
              type: String,
              required: true,
            },
            exercises: [
              {
                exerciseId: {
                  type: Schema.Types.ObjectId,
                  ref: 'ExerciseTemplate',
                  required: true,
                },
                exerciseName: {
                  type: String,
                  required: true,
                },
                sets: {
                  type: Number,
                  required: true,
                  min: 1,
                },
                reps: {
                  type: Number,
                  required: true,
                  min: 1,
                },
                weight: Number,
                notes: String,
              },
            ],
          },
        ],
      },
    ],
    isDefault: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Indexes
workoutRegimeSchema.index({ difficulty: 1 });
workoutRegimeSchema.index({ difficulty: 1, isDefault: 1 });

export const WorkoutRegime =
  mongoose.models.WorkoutRegime ||
  mongoose.model<IWorkoutRegime>('WorkoutRegime', workoutRegimeSchema);

export default WorkoutRegime;