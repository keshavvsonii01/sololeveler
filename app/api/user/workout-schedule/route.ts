import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { WorkoutSchedule } from '../../../models/workoutschedule';
import { Progression } from '../../../models/progression';

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

    let schedule = await WorkoutSchedule.findOne({ userId: session.user.id });

    // Create default schedule if doesn't exist
    if (!schedule) {
      schedule = new WorkoutSchedule({
        userId: session.user.id,
        selectedDays: ['monday', 'wednesday', 'friday'],
        goal: 'Stay consistent and grow stronger',
      });
      await schedule.save();
    }

    const progression = await Progression.findOne({ userId: session.user.id });

    return NextResponse.json(
      {
        schedule: {
          selectedDays: schedule.selectedDays,
          goal: schedule.goal,
        },
        progression: {
          workoutStreak: progression?.workoutStreak || 0,
          lastWorkoutDate: progression?.lastWorkoutDate || null,
          longestStreak: progression?.longestStreak || 0,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Schedule fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { selectedDays, goal } = await req.json();

    if (!selectedDays || !Array.isArray(selectedDays) || selectedDays.length === 0) {
      return NextResponse.json(
        { error: 'At least one day must be selected' },
        { status: 400 }
      );
    }

    const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    if (!selectedDays.every((day: string) => validDays.includes(day))) {
      return NextResponse.json(
        { error: 'Invalid day names' },
        { status: 400 }
      );
    }

    await connectDB();

    let schedule = await WorkoutSchedule.findOne({ userId: session.user.id });

    if (!schedule) {
      schedule = new WorkoutSchedule({
        userId: session.user.id,
        selectedDays,
        goal: goal || 'Stay consistent and grow stronger',
      });
    } else {
      schedule.selectedDays = selectedDays;
      if (goal) schedule.goal = goal;
    }

    await schedule.save();

    return NextResponse.json(
      {
        message: 'Schedule updated successfully',
        schedule: {
          selectedDays: schedule.selectedDays,
          goal: schedule.goal,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Schedule update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update schedule' },
      { status: 500 }
    );
  }
}