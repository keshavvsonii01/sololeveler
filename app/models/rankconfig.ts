import mongoose, { Schema, Document } from 'mongoose';

export interface IRankConfig extends Document {
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  rankOrder: number;
  xpRequired: number;
  xpToNextRank: number;
  title: string;
  description: string;
  color: string;
  createdAt: Date;
}

const rankConfigSchema = new Schema<IRankConfig>(
  {
    rank: {
      type: String,
      enum: ['E', 'D', 'C', 'B', 'A', 'S'],
      required: true,
      unique: true,
    },
    rankOrder: {
      type: Number,
      required: true,
      unique: true,
    },
    xpRequired: {
      type: Number,
      required: true,
      index: true,
    },
    xpToNextRank: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RankConfig =
  mongoose.models.RankConfig || mongoose.model<IRankConfig>('RankConfig', rankConfigSchema);

// Seed data for all Solo Leveling ranks
export const RANK_SEED_DATA = [
  {
    rank: 'E',
    rankOrder: 1,
    xpRequired: 0,
    xpToNextRank: 10000,
    title: 'E-Rank',
    description: 'The weakest rank. Your awakening begins.',
    color: '#808080',
  },
  {
    rank: 'D',
    rankOrder: 2,
    xpRequired: 10000,
    xpToNextRank: 15000,
    title: 'D-Rank',
    description: 'You have proven yourself capable. Progress continues.',
    color: '#4169E1',
  },
  {
    rank: 'C',
    rankOrder: 3,
    xpRequired: 25000,
    xpToNextRank: 25000,
    title: 'C-Rank',
    description: 'A competent hunter. The real challenges await.',
    color: '#32CD32',
  },
  {
    rank: 'B',
    rankOrder: 4,
    xpRequired: 50000,
    xpToNextRank: 30000,
    title: 'B-Rank',
    description: 'Elite tier. Few reach this level of power.',
    color: '#FFD700',
  },
  {
    rank: 'A',
    rankOrder: 5,
    xpRequired: 80000,
    xpToNextRank: 700000,
    title: 'A-Rank',
    description: 'The apex of strength. You are among the elite.',
    color: '#FF6347',
  },
  {
    rank: 'S',
    rankOrder: 6,
    xpRequired: 150000,
    xpToNextRank: Infinity,
    title: 'S-Rank',
    description: 'The legendary tier. A solo hunter transcendent.',
    color: '#FFD700',
  },
];

export default RankConfig;