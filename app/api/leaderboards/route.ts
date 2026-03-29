import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { connectDB } from '../../lib/db';
import { Leaderboard } from '../../models/leaderboard';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'global'; // global, weekly, rank
    const rank = searchParams.get('rank');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'));
    const skip = (page - 1) * limit;

    await connectDB();

    const query: any = { isPublic: true };
    let sortBy: any = {};

    // Build query based on type
    if (type === 'weekly') {
      sortBy = { weeklyXP: -1, weeklyRank: 1 };
    } else if (type === 'rank' && rank) {
      query.currentRank = rank.toUpperCase();
      sortBy = { adjustedXP: -1, rankTypeRank: 1 };
    } else {
      // Default to global
      sortBy = { adjustedXP: -1, globalRank: 1 };
    }

    // Fetch leaderboard
    const leaderboards = await Leaderboard.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Leaderboard.countDocuments(query);

    return NextResponse.json(
      {
        leaderboards,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        type,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

// GET user's rank on leaderboards
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type = 'global' } = await req.json();

    await connectDB();

    const userLeaderboard = await Leaderboard.findOne({
      userId: session.user.id,
    }).lean();

    if (!userLeaderboard) {
      return NextResponse.json(
        { error: 'User not found on leaderboard' },
        { status: 404 }
      );
    }

    // Fetch surrounding players (5 above, 5 below)
    let sortBy: any = {};
    const query: any = { isPublic: true };

    if (type === 'weekly') {
      sortBy = { weeklyXP: -1 };
      const surrounding = await Leaderboard.find(query)
        .sort(sortBy)
        .lean();

      const userRankInList = surrounding.findIndex((l) => l.userId.toString() === session.user.id);
      const startIdx = Math.max(0, userRankInList - 5);
      const endIdx = Math.min(surrounding.length, userRankInList + 6);
      const neighbors = surrounding.slice(startIdx, endIdx);

      return NextResponse.json(
        {
          user: userLeaderboard,
          neighbors,
          userPosition: userRankInList + 1,
          type: 'weekly',
        },
        { status: 200 }
      );
    } else {
      // Global
      sortBy = { adjustedXP: -1 };
      const surrounding = await Leaderboard.find(query)
        .sort(sortBy)
        .lean();

      const userRankInList = surrounding.findIndex((l) => l.userId.toString() === session.user.id);
      const startIdx = Math.max(0, userRankInList - 5);
      const endIdx = Math.min(surrounding.length, userRankInList + 6);
      const neighbors = surrounding.slice(startIdx, endIdx);

      return NextResponse.json(
        {
          user: userLeaderboard,
          neighbors,
          userPosition: userRankInList + 1,
          type: 'global',
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('User rank fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user rank' },
      { status: 500 }
    );
  }
}