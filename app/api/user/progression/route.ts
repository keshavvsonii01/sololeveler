import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectDB } from '../../../lib/db';
import { Progression } from '../../../models/progression';
import { RankConfig } from '../../../models/rankconfig';
import { getCurrentRankProgress, getRankByXP } from '../../../lib/xp-calculator';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch user progression
    const progression = await Progression.findOne({ userId: session.user.id });

    if (!progression) {
      return NextResponse.json(
        { error: 'Progression not found' },
        { status: 404 }
      );
    }

    // Fetch current rank config
    const currentRankConfig = await RankConfig.findOne({ rank: progression.currentRank });

    // Calculate progress to next rank
    const rankProgress = getCurrentRankProgress(progression.totalXPEarned);

    // Fetch all rank configs for progression timeline
    const allRanks = await RankConfig.find().sort({ rankOrder: 1 });

    return NextResponse.json(
      {
        progression: {
          userId: progression.userId,
          currentRank: progression.currentRank,
          currentXP: rankProgress.currentXP,
          xpToNextRank: rankProgress.xpToNextRank,
          totalXPEarned: progression.totalXPEarned,
          progressPercent: rankProgress.progressPercent,
          workoutStreak: progression.workoutStreak,
          longestStreak: progression.longestStreak,
          xpMultiplier: progression.xpMultiplier,
          rankUpHistory: progression.rankUpHistory,
        },
        currentRankConfig: currentRankConfig ? {
          rank: currentRankConfig.rank,
          title: currentRankConfig.title,
          description: currentRankConfig.description,
          color: currentRankConfig.color,
          rankOrder: currentRankConfig.rankOrder,
          xpToNextRank: currentRankConfig.xpToNextRank,
        } : null,
        allRanks: allRanks.map(rank => ({
          rank: rank.rank,
          title: rank.title,
          description: rank.description,
          color: rank.color,
          rankOrder: rank.rankOrder,
          xpRequired: rank.xpRequired,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Progression fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch progression' },
      { status: 500 }
    );
  }
}