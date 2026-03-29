import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { connectDB } from "../../lib/db";
import { Workout } from "../../models/workout";
import { Progression } from "../../models/progression";
import { UserExerciseStats } from "../../models/userexercisestats";
import { ExerciseTemplate } from "../../models/exercisetemplate";
import { RankConfig } from "../../models/rankconfig";
import { getRankByXP } from "../../lib/xp-calculator";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exercises, date, notes, mood } = await req.json();

    // Validation
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json(
        { error: "At least one exercise is required" },
        { status: 400 },
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: "Workout date is required" },
        { status: 400 },
      );
    }

    await connectDB();

    // Fetch exercises to get their XP values
    const exerciseIds = exercises.map((ex: any) => ex.exerciseId);
    const exerciseTemplates = await ExerciseTemplate.find({
      _id: { $in: exerciseIds },
    });

    const exerciseMap = new Map(
      exerciseTemplates.map((ex) => [ex._id.toString(), ex]),
    );

    // Calculate total XP and prepare workout exercises
    let totalXPEarned = 0;
    const workoutExercises = [];

    for (const exercise of exercises) {
      const template = exerciseMap.get(exercise.exerciseId);

      if (!template) {
        return NextResponse.json(
          { error: `Exercise ${exercise.exerciseId} not found` },
          { status: 404 },
        );
      }

      const sets = exercise.sets || 1;
      const totalWork = sets * exercise.repsOrDuration;

      const xpEarned = Math.round(
        totalWork * template.baseXPValue * template.difficultyMultiplier,
      );

      workoutExercises.push({
        exerciseId: exercise.exerciseId,
        exerciseName: template.name,
        repsOrDuration: exercise.repsOrDuration,
        sets: exercise.sets || 1,
        weight: exercise.weight || null,
        xpEarned,
        notes: exercise.notes || null,
      });

      totalXPEarned += xpEarned;
    }

    // Create workout
    const workout = new Workout({
      userId: session.user.id,
      date: new Date(date),
      exercises: workoutExercises,
      totalXPEarned,
      totalExercises: exercises.length,
      notes: notes || null,
      mood: mood || null,
    });

    await workout.save();

    // Update progression with new XP
    const progression = await Progression.findOne({ userId: session.user.id });

    if (!progression) {
      return NextResponse.json(
        { error: "Progression not found" },
        { status: 404 },
      );
    }

    const oldRank = progression.currentRank;
    progression.currentXP += totalXPEarned;
    progression.totalXPEarned += totalXPEarned;

    // Check for rank up
    const rankData = getRankByXP(progression.totalXPEarned);
    const newRank = rankData.rank as any;

    if (newRank !== oldRank) {
      progression.currentRank = newRank;
      progression.currentXP =
        progression.totalXPEarned -
          (await RankConfig.findOne({ rank: newRank }))?.xpRequired || 0;

      // Add to rank-up history
      progression.rankUpHistory.push({
        rank: newRank,
        achievedAt: new Date(),
        xpAtRankUp: progression.totalXPEarned,
      });

      workout.isRankedUp = true;
    }

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkout = progression.lastWorkoutDate
      ? new Date(progression.lastWorkoutDate)
      : null;

    if (lastWorkout) {
      lastWorkout.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === 1) {
        progression.workoutStreak += 1;
      } else if (daysDiff > 1) {
        progression.workoutStreak = 1;
      }
    } else {
      progression.workoutStreak = 1;
    }

    progression.lastWorkoutDate = new Date();
    if (progression.workoutStreak > progression.longestStreak) {
      progression.longestStreak = progression.workoutStreak;
    }

    await progression.save();

    // Update exercise stats
    for (const exercise of workoutExercises) {
      const stats = await UserExerciseStats.findOne({
        userId: session.user.id,
        exerciseId: exercise.exerciseId,
      });
      const totalWork = exercise.sets * exercise.repsOrDuration;

      if (stats) {
        stats.totalRepsOrDuration += totalWork;
        stats.personalBest = Math.max(stats.personalBest, totalWork);
        stats.timesCompleted += 1;
        stats.averagePerSession =
          stats.totalRepsOrDuration / stats.timesCompleted;
        stats.lastCompleted = new Date();
        stats.totalXPFromExercise += exercise.xpEarned;
        await stats.save();
      } else {
        await UserExerciseStats.create({
          userId: session.user.id,
          exerciseId: exercise.exerciseId,
          totalRepsOrDuration: totalWork,
          personalBest: totalWork,
          timesCompleted: 1,
          averagePerSession: totalWork,
          firstCompleted: new Date(),
          lastCompleted: new Date(),
          totalXPFromExercise: exercise.xpEarned,
        });
      }
    }

    return NextResponse.json(
      {
        message: "Workout logged successfully",
        workout: {
          id: workout._id,
          totalXPEarned,
          isRankedUp: workout.isRankedUp,
          newRank: newRank !== oldRank ? newRank : null,
          streak: progression.workoutStreak,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Workout logging error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log workout" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    await connectDB();

    const workouts = await Workout.find({
      userId: session.user.id,
      isArchived: false,
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Workout.countDocuments({
      userId: session.user.id,
      isArchived: false,
    });

    return NextResponse.json(
      {
        workouts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Workout fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch workouts" },
      { status: 500 },
    );
  }
}
