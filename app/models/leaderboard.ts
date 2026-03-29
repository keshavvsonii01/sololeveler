import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  profilePicture?: string;
  currentRank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  totalXP: number;
  adjustedXP: number; // XP with penalties applied
  missedDays: number;
  workoutStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  weeklyXP: number;
  lastWorkoutDate?: Date;
  globalRank: number;
  weeklyRank: number;
  rankTypeRank: number; // Rank among same rank tier
  isPublic: boolean;
  updatedAt: Date;
}

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    profilePicture: String,
    currentRank: {
      type: String,
      enum: ['E', 'D', 'C', 'B', 'A', 'S'],
      required: true,
      index: true,
    },
    totalXP: {
      type: Number,
      required: true,
      index: true,
    },
    adjustedXP: {
      type: Number,
      required: true,
      index: true,
    },
    missedDays: {
      type: Number,
      default: 0,
    },
    workoutStreak: {
      type: Number,
      default: 0,
      index: true,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalWorkouts: {
      type: Number,
      default: 0,
    },
    weeklyXP: {
      type: Number,
      default: 0,
      index: true,
    },
    lastWorkoutDate: Date,
    globalRank: {
      type: Number,
      index: true,
    },
    weeklyRank: {
      type: Number,
      index: true,
    },
    rankTypeRank: {
      type: Number,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Indexes for common queries
leaderboardSchema.index({ adjustedXP: -1, globalRank: 1 });
leaderboardSchema.index({ weeklyXP: -1, weeklyRank: 1 });
leaderboardSchema.index({ currentRank: 1, adjustedXP: -1 });
leaderboardSchema.index({ workoutStreak: -1 });

export const Leaderboard =
  mongoose.models.Leaderboard ||
  mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);

export default Leaderboard;