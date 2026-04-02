import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectDB } from "../app/lib/db";
import {
  DEFAULT_EXERCISES,
  ExerciseTemplate,
} from "../app/models/exercisetemplate";
import {
  DEFAULT_REGIMES,
  DEFAULT_TEMPLATES,
} from "../app/models/workout-constants";
import { WorkoutRegime } from "../app/models/workoutregime";
import { WorkoutTemplate } from "../app/models/workouttemplate";

type ExerciseDoc = {
  _id: unknown;
  name: string;
};

function normalizeExerciseName(name: string) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/ups$/, "up")
    .replace(/flies$/, "fly")
    .replace(/ies$/, "y")
    .replace(/s$/, "");
}

function inferExerciseCategory(name: string) {
  const normalized = name.toLowerCase();

  if (
    /(run|jog|walk|sprint|cycling|rope|hiit|interval|burpee|climber)/.test(
      normalized,
    )
  ) {
    return "cardio" as const;
  }

  if (
    /(plank|yoga|stretch|twist|leg raise|ab wheel|hanging leg raise)/.test(
      normalized,
    )
  ) {
    return "flexibility" as const;
  }

  return "strength" as const;
}

function inferExerciseUnit(name: string) {
  const normalized = name.toLowerCase();

  if (/(running|jogging|walking|sprinting|cycling)/.test(normalized)) {
    return "km" as const;
  }

  if (/(plank|yoga|stretch|hiit|interval)/.test(normalized)) {
    return "minutes" as const;
  }

  return "reps" as const;
}

function collectReferencedExerciseNames() {
  const names = new Set<string>();

  for (const template of DEFAULT_TEMPLATES) {
    for (const exercise of template.exercises) {
      names.add(exercise.exerciseName);
    }
  }

  for (const regime of DEFAULT_REGIMES) {
    for (const week of regime.weeks) {
      for (const workout of week.workouts) {
        for (const exercise of workout.exercises) {
          names.add(exercise.exerciseName);
        }
      }
    }
  }

  return names;
}

async function ensureExerciseCatalog() {
  const existingExercises = (await ExerciseTemplate.find({})
    .select({ _id: 1, name: 1 })
    .lean()) as ExerciseDoc[];
  const existingByName = new Map(
    existingExercises.map((exercise) => [exercise.name, exercise]),
  );

  const missingBaseExercises = DEFAULT_EXERCISES.filter(
    (exercise) => !existingByName.has(exercise.name),
  );

  if (missingBaseExercises.length > 0) {
    await ExerciseTemplate.insertMany(missingBaseExercises, { ordered: false });
    console.log(`Added ${missingBaseExercises.length} missing base exercises`);
  }

  const refreshedExercises = (await ExerciseTemplate.find({})
    .select({ _id: 1, name: 1 })
    .lean()) as ExerciseDoc[];
  const normalizedExerciseMap = new Map<string, ExerciseDoc>();

  for (const exercise of refreshedExercises) {
    normalizedExerciseMap.set(normalizeExerciseName(exercise.name), exercise);
  }

  const unresolvedNames = Array.from(collectReferencedExerciseNames()).filter(
    (name) => !normalizedExerciseMap.has(normalizeExerciseName(name)),
  );

  if (unresolvedNames.length > 0) {
    await ExerciseTemplate.insertMany(
      unresolvedNames.map((name) => ({
        name,
        category: inferExerciseCategory(name),
        baseXPValue: 8,
        difficultyMultiplier: 1.0,
        unit: inferExerciseUnit(name),
        isCustom: false,
        isActive: true,
        popularity: 0,
        description: `Auto-generated default exercise used by workout templates and regimes: ${name}.`,
        instructions: [],
      })),
      { ordered: false },
    );

    console.log(`Added ${unresolvedNames.length} missing template exercises`);
  }

  const allExercises = (await ExerciseTemplate.find({})
    .select({ _id: 1, name: 1 })
    .lean()) as ExerciseDoc[];
  const exactNameMap = new Map<string, ExerciseDoc>();
  const normalizedNameMap = new Map<string, ExerciseDoc>();

  for (const exercise of allExercises) {
    exactNameMap.set(exercise.name, exercise);
    normalizedNameMap.set(normalizeExerciseName(exercise.name), exercise);
  }

  return { exactNameMap, normalizedNameMap };
}

function getExerciseId(
  exerciseName: string,
  exactNameMap: Map<string, ExerciseDoc>,
  normalizedNameMap: Map<string, ExerciseDoc>,
) {
  const exactMatch = exactNameMap.get(exerciseName);

  if (exactMatch) {
    return exactMatch._id;
  }

  return (
    normalizedNameMap.get(normalizeExerciseName(exerciseName))?._id ?? null
  );
}

export async function seedWorkoutTemplatesAndRegimes() {
  try {
    await connectDB();

    console.log("Seeding workout templates and regimes...");

    const { exactNameMap, normalizedNameMap } = await ensureExerciseCatalog();

    console.log("Seeding templates...");
    for (const template of DEFAULT_TEMPLATES) {
      const exercises = template.exercises.map((exercise: any) => ({
        ...exercise,
        exerciseId: getExerciseId(
          exercise.exerciseName,
          exactNameMap,
          normalizedNameMap,
        ),
      }));

      const missingExercises = exercises.filter(
        (exercise: any) => !exercise.exerciseId,
      );

      if (missingExercises.length > 0) {
        console.warn(
          `Missing exercise IDs for template "${template.name}": ${missingExercises
            .map((exercise: any) => exercise.exerciseName)
            .join(", ")}`,
        );
      }

      await WorkoutTemplate.updateOne(
        {
          name: template.name,
          isDefault: true,
        },
        {
          $set: {
            userId: null,
            name: template.name,
            description: template.description,
            difficulty: template.difficulty,
            muscleGroups: template.muscleGroups,
            exercises: exercises.filter((exercise: any) => exercise.exerciseId),
            isDefault: true,
          },
        },
        { upsert: true },
      );

      console.log(`Upserted template: ${template.name}`);
    }

    console.log("Seeding regimes...");
    for (const regime of DEFAULT_REGIMES) {
      const weeks = regime.weeks.map((week: any) => ({
        weekNumber: week.weekNumber,
        workouts: week.workouts.map((workout: any) => ({
          day: workout.day,
          dayName: workout.dayName,
          exercises: workout.exercises
            .map((exercise: any) => ({
              ...exercise,
              exerciseId: getExerciseId(
                exercise.exerciseName,
                exactNameMap,
                normalizedNameMap,
              ),
            }))
            .filter((exercise: any) => exercise.exerciseId),
        })),
      }));

      await WorkoutRegime.updateOne(
        {
          name: regime.name,
          isDefault: true,
        },
        {
          $set: {
            name: regime.name,
            description: regime.description,
            difficulty: regime.difficulty,
            duration: regime.duration,
            benefits: regime.benefits,
            muscleGroups: regime.muscleGroups,
            weeks,
            isDefault: true,
          },
        },
        { upsert: true },
      );

      console.log(`Upserted regime: ${regime.name}`);
    }

    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding error:", error);
    throw error;
  }
}

if (require.main === module) {
  seedWorkoutTemplatesAndRegimes().then(() => process.exit(0));
}
