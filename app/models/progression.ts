import mongoose, { Schema, Document } from 'mongoose';

export interface IProgression extends Document {
  userId: mongoose.Types.ObjectId;
  currentRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  currentXP: number;
  totalXPEarned: number;
  workoutStreak: number;
  lastWorkoutDate?: Date;
  longestStreak: number;
  xpMultiplier: number;
  rankUpHistory: Array<{
    rank: string;
    achievedAt: Date;
    xpAtRankUp: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const progressionSchema = new Schema<IProgression>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    currentRank: {
      type: String,
      enum: ['E', 'D', 'C', 'B', 'A', 'S'],
      default: 'E',
      index: true,
    },
    currentXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalXPEarned: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    workoutStreak: {
      type: Number,
      default: 0,
    },
    lastWorkoutDate: {
      type: Date,
      default: null,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    xpMultiplier: {
      type: Number,
      default: 1.0,
    },
    rankUpHistory: [
      {
        rank: String,
        achievedAt: {
          type: Date,
          default: Date.now,
        },
        xpAtRankUp: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for leaderboards
progressionSchema.index({ currentRank: 1, totalXPEarned: -1 });
progressionSchema.index({ workoutStreak: -1 });

export const Progression =
  mongoose.models.Progression || mongoose.model<IProgression>('Progression', progressionSchema);

export default Progression;