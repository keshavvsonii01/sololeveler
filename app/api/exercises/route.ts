import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { ExerciseTemplate } from '../../models/exerciseTemplate';

// GET all exercises (default + user's custom)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    await connectDB();

    const query: any = { isActive: true };
    if (category) {
      query.category = category;
    }

    // Get default exercises + user's custom exercises
    const defaultExercises = await ExerciseTemplate.find({
      ...query,
      isCustom: false,
    }).lean();

    let userExercises = [];
    if (session?.user?.id) {
      userExercises = await ExerciseTemplate.find({
        ...query,
        isCustom: true,
        creatorId: session.user.id,
      }).lean();
    }

    const allExercises = [...defaultExercises, ...userExercises];

    return NextResponse.json(
      {
        exercises: allExercises,
        total: allExercises.length,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Exercise fetch error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch exercises' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to fetch exercises' },
        { status: 500 }
      );
    }
  }
}

// POST create custom exercise
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description, category, baseXPValue, difficultyMultiplier, unit } =
      await req.json();

    // Validation
    if (!name || !category || baseXPValue === undefined || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (baseXPValue < 1) {
      return NextResponse.json(
        { error: 'Base XP value must be at least 1' },
        { status: 400 }
      );
    }

    if (difficultyMultiplier < 0.5 || difficultyMultiplier > 3.0) {
      return NextResponse.json(
        { error: 'Difficulty multiplier must be between 0.5 and 3.0' },
        { status: 400 }
      );
    }

    await connectDB();

    const exercise = new ExerciseTemplate({
      name,
      description: description || '',
      category,
      baseXPValue,
      difficultyMultiplier,
      unit,
      isCustom: true,
      creatorId: session.user.id,
    });

    await exercise.save();

    return NextResponse.json(
      {
        message: 'Custom exercise created',
        exercise,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Exercise creation error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to create exercise' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to create exercise' },
        { status: 500 }
      );
    }
  }
}