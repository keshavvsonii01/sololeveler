import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { connectDB } from '../../lib/db';
import { WorkoutRegime } from '../../models/workoutregime';
import { RegimeProgress } from '../../models/regimeprogress';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get('difficulty');
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Build query for regimes
    const query: any = { isDefault: true };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const regimes = await WorkoutRegime.find(query).lean();

    // Get user's active regime progress
    const activeProgress = await RegimeProgress.findOne({
      userId: session.user.id,
      status: 'active',
    }).lean();

    return NextResponse.json(
      { regimes, activeProgress },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Regime fetch error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch regimes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { regimeId } = body;

    if (!regimeId) {
      return NextResponse.json(
        { error: 'Regime ID required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if regime exists
    const regime = await WorkoutRegime.findById(regimeId);
    if (!regime) {
      return NextResponse.json(
        { error: 'Regime not found' },
        { status: 404 }
      );
    }

    // Check if user already has an active regime
    const existingProgress = await RegimeProgress.findOne({
      userId: session.user.id,
      status: 'active',
    });

    if (existingProgress) {
      return NextResponse.json(
        { error: 'You already have an active regime' },
        { status: 400 }
      );
    }

    // Create new regime progress
    const progress = new RegimeProgress({
      userId: session.user.id,
      regimeId,
      startDate: new Date(),
      currentWeek: 1,
      status: 'active',
    });

    await progress.save();

    return NextResponse.json({ progress }, { status: 201 });
  } catch (error: unknown) {
    console.error('Regime start error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to start regime' },
      { status: 500 }
    );
  }
}