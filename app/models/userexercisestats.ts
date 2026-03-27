import mongoose, { Schema, Document } from 'mongoose';

export interface IUserExerciseStats extends Document {
  userId: mongoose.Types.ObjectId;
  exerciseId: mongoose.Types.ObjectId;
  totalRepsOrDuration: number;
  personalBest: number;
  timesCompleted: number;
  averagePerSession: number;
  firstCompleted?: Date;
  lastCompleted?: Date;
  totalXPFromExercise: number;
  createdAt: Date;
  updatedAt: Date;
}

const userExerciseStatsSchema = new Schema<IUserExerciseStats>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: 'ExerciseTemplate',
      required: true,
      index: true,
    },
    totalRepsOrDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
    personalBest: {
      type: Number,
      default: 0,
      min: 0,
    },
    timesCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    averagePerSession: {
      type: Number,
      default: 0,
      min: 0,
    },
    firstCompleted: Date,
    lastCompleted: Date,
    totalXPFromExercise: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index
userExerciseStatsSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });
userExerciseStatsSchema.index({ userId: 1, timesCompleted: -1 });
userExerciseStatsSchema.index({ userId: 1, personalBest: -1 });

export const UserExerciseStats =
  mongoose.models.UserExerciseStats ||
  mongoose.model<IUserExerciseStats>('UserExerciseStats', userExerciseStatsSchema);

export default UserExerciseStats;