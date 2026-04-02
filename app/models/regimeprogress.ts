import mongoose, { Schema, Document } from 'mongoose';

export interface IRegimeProgress extends Document {
  userId: mongoose.Types.ObjectId;
  regimeId: mongoose.Types.ObjectId;
  startDate: Date;
  currentWeek: number;
  completedWorkouts: mongoose.Types.ObjectId[];
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  progressNotes: string;
  updatedAt: Date;
}

const regimeProgressSchema = new Schema<IRegimeProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    regimeId: {
      type: Schema.Types.ObjectId,
      ref: 'WorkoutRegime',
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    currentWeek: {
      type: Number,
      default: 1,
      min: 1,
    },
    completedWorkouts: {
      type: [Schema.Types.ObjectId],
      ref: 'Workout',
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'abandoned'],
      default: 'active',
      index: true,
    },
    progressNotes: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
regimeProgressSchema.index({ userId: 1, status: 1 });
regimeProgressSchema.index({ userId: 1, regimeId: 1 });

export const RegimeProgress =
  mongoose.models.RegimeProgress ||
  mongoose.model<IRegimeProgress>('RegimeProgress', regimeProgressSchema);

export default RegimeProgress;