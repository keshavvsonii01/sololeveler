import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseTemplate extends Document {
  name: string;
  description?: string;
  instructions?: string[];
  category: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other';
  baseXPValue: number;
  difficultyMultiplier: number;
  unit: 'reps' | 'minutes' | 'km' | 'miles' | 'sets' | 'weight' | 'custom';
  isCustom: boolean;
  creatorId?: mongoose.Types.ObjectId;
  imageUrl?: string;
  videoUrl?: string;
  isActive: boolean;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseTemplateSchema = new Schema<IExerciseTemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: String,
    instructions: [String],
    category: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'sports', 'other'],
      required: true,
      index: true,
    },
    baseXPValue: {
      type: Number,
      required: true,
      min: 1,
    },
    difficultyMultiplier: {
      type: Number,
      required: true,
      default: 1.0,
      min: 0.5,
      max: 3.0,
    },
    unit: {
      type: String,
      enum: ['reps', 'minutes', 'km', 'miles', 'sets', 'weight', 'custom'],
      required: true,
    },
    isCustom: {
      type: Boolean,
      default: false,
      index: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    imageUrl: String,
    videoUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    popularity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

exerciseTemplateSchema.index({ name: 1 });
exerciseTemplateSchema.index({ category: 1 });
exerciseTemplateSchema.index({ isCustom: 1, creatorId: 1 });

export const ExerciseTemplate =
  mongoose.models.ExerciseTemplate ||
  mongoose.model<IExerciseTemplate>('ExerciseTemplate', exerciseTemplateSchema);

// Default exercises
export const DEFAULT_EXERCISES = [
  // Strength
  {
    name: 'Pushup',
    category: 'strength' as const,
    baseXPValue: 10,
    difficultyMultiplier: 1.0,
    unit: 'reps' as const,
    isCustom: false,
    description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
    instructions: [
      'Start in a plank position with hands shoulder-width apart',
      'Lower your body until chest nearly touches the floor',
      'Push yourself back up to starting position',
    ],
  },
  {
    name: 'Pullup',
    category: 'strength' as const,
    baseXPValue: 10,
    difficultyMultiplier: 1.5,
    unit: 'reps' as const,
    isCustom: false,
    description: 'Advanced upper body exercise for back and biceps',
  },
  {
    name: 'Squat',
    category: 'strength' as const,
    baseXPValue: 10,
    difficultyMultiplier: 1.2,
    unit: 'reps' as const,
    isCustom: false,
    description: 'Lower body compound exercise targeting quads and glutes',
  },
  {
    name: 'Deadlift',
    category: 'strength' as const,
    baseXPValue: 10,
    difficultyMultiplier: 1.8,
    unit: 'reps' as const,
    isCustom: false,
    description: 'Heavy compound lift targeting entire posterior chain',
  },
  {
    name: 'Bench Press',
    category: 'strength' as const,
    baseXPValue: 10,
    difficultyMultiplier: 1.3,
    unit: 'reps' as const,
    isCustom: false,
    description: 'Upper body pressing movement for chest and triceps',
  },

  // Cardio
  {
    name: 'Running',
    category: 'cardio' as const,
    baseXPValue: 30,
    difficultyMultiplier: 1.0,
    unit: 'km' as const,
    isCustom: false,
    description: 'Cardiovascular endurance training',
  },
  {
    name: 'Cycling',
    category: 'cardio' as const,
    baseXPValue: 25,
    difficultyMultiplier: 0.9,
    unit: 'km' as const,
    isCustom: false,
    description: 'Low impact cardio exercise',
  },
  {
    name: 'Jump Rope',
    category: 'cardio' as const,
    baseXPValue: 15,
    difficultyMultiplier: 1.1,
    unit: 'reps' as const,
    isCustom: false,
    description: 'Explosive cardio and coordination exercise',
  },

  // Flexibility
  {
    name: 'Plank',
    category: 'flexibility' as const,
    baseXPValue: 5,
    difficultyMultiplier: 1.0,
    unit: 'minutes' as const,
    isCustom: false,
    description: 'Core stability and endurance exercise',
  },
  {
    name: 'Yoga',
    category: 'flexibility' as const,
    baseXPValue: 8,
    difficultyMultiplier: 0.8,
    unit: 'minutes' as const,
    isCustom: false,
    description: 'Flexibility, balance, and mindfulness practice',
  },
];

export default ExerciseTemplate;