import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutExercise {
  exerciseId: mongoose.Types.ObjectId;
  exerciseName: string;
  repsOrDuration: number;
  sets?: number;
  weight?: number;
  xpEarned: number;
  notes?: string;
}

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  exercises: IWorkoutExercise[];
  totalXPEarned: number;
  totalDuration: number;
  totalExercises: number;
  notes?: string;
  mood?: 'excellent' | 'good' | 'okay' | 'poor';
  isRankedUp: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const workoutExerciseSchema = new Schema<IWorkoutExercise>(
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
    repsOrDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    sets: {
      type: Number,
      default: 1,
      min: 1,
    },
    weight: Number,
    xpEarned: {
      type: Number,
      required: true,
    },
    notes: String,
  },
  { _id: false }
);

const workoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    exercises: [workoutExerciseSchema],
    totalXPEarned: {
      type: Number,
      required: true,
      min: 0,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalExercises: {
      type: Number,
      required: true,
      min: 1,
    },
    notes: String,
    mood: {
      type: String,
      enum: ['excellent', 'good', 'okay', 'poor'],
      default: null,
    },
    isRankedUp: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

workoutSchema.index({ userId: 1, date: -1 });
workoutSchema.index({ userId: 1, createdAt: -1 });
workoutSchema.index({ totalXPEarned: -1 });
workoutSchema.index({ isArchived: 1 });

export const Workout =
  mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);

export default Workout;