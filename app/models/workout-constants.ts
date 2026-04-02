// Predefined muscle groups for workouts
export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'triceps',
  'biceps',
  'glutes',
  'calves',
  'cardio',
  'core',
];

export const MUSCLE_GROUP_EMOJI: Record<string, string> = {
  chest: '🏋️',
  back: '💪',
  legs: '🦵',
  shoulders: '⬆️',
  triceps: '💪',
  biceps: '💪',
  glutes: '🍑',
  calves: '🦵',
  cardio: '🏃',
  core: '⚙️',
};

export const DEFAULT_TEMPLATES = [
  {
    name: 'Beginner Full Body',
    description: 'Perfect starting point covering all major muscle groups',
    difficulty: 'beginner',
    muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'core'],
    exercises: [
      {
        exerciseName: 'Bench Press',
        sets: 3,
        reps: 10,
        weight: 20,
      },
      {
        exerciseName: 'Barbell Squat',
        sets: 3,
        reps: 10,
        weight: 30,
      },
      {
        exerciseName: 'Bent-Over Rows',
        sets: 3,
        reps: 10,
        weight: 25,
      },
      {
        exerciseName: 'Plank',
        sets: 3,
        reps: 30,
      },
    ],
  },
  {
    name: 'Beginner Chest Day',
    description: 'Focused chest and tricep workout for beginners',
    difficulty: 'beginner',
    muscleGroups: ['chest', 'triceps'],
    exercises: [
      {
        exerciseName: 'Dumbbell Bench Press',
        sets: 4,
        reps: 12,
        weight: 15,
      },
      {
        exerciseName: 'Incline Push-ups',
        sets: 3,
        reps: 10,
      },
      {
        exerciseName: 'Tricep Dips',
        sets: 3,
        reps: 8,
      },
    ],
  },
  {
    name: 'Beginner Back Day',
    description: 'Build a strong back with these fundamental exercises',
    difficulty: 'beginner',
    muscleGroups: ['back', 'biceps'],
    exercises: [
      {
        exerciseName: 'Bent-Over Barbell Rows',
        sets: 4,
        reps: 10,
        weight: 25,
      },
      {
        exerciseName: 'Pull-ups',
        sets: 3,
        reps: 6,
      },
      {
        exerciseName: 'Barbell Curls',
        sets: 3,
        reps: 10,
        weight: 15,
      },
    ],
  },
  {
    name: 'Beginner Leg Day',
    description: 'Strengthen your lower body foundation',
    difficulty: 'beginner',
    muscleGroups: ['legs', 'glutes', 'calves'],
    exercises: [
      {
        exerciseName: 'Barbell Back Squat',
        sets: 4,
        reps: 10,
        weight: 30,
      },
      {
        exerciseName: 'Walking Lunges',
        sets: 3,
        reps: 12,
      },
      {
        exerciseName: 'Leg Press',
        sets: 3,
        reps: 12,
        weight: 40,
      },
      {
        exerciseName: 'Calf Raises',
        sets: 3,
        reps: 15,
      },
    ],
  },
  {
    name: 'Intermediate Upper Body',
    description: 'Advanced upper body split for more muscle growth',
    difficulty: 'intermediate',
    muscleGroups: ['chest', 'back', 'shoulders', 'triceps', 'biceps'],
    exercises: [
      {
        exerciseName: 'Barbell Bench Press',
        sets: 4,
        reps: 8,
        weight: 40,
      },
      {
        exerciseName: 'Incline Dumbbell Press',
        sets: 3,
        reps: 10,
        weight: 25,
      },
      {
        exerciseName: 'Weighted Pull-ups',
        sets: 4,
        reps: 6,
        weight: 10,
      },
      {
        exerciseName: 'Barbell Rows',
        sets: 4,
        reps: 8,
        weight: 45,
      },
      {
        exerciseName: 'Overhead Press',
        sets: 3,
        reps: 8,
        weight: 25,
      },
    ],
  },
  {
    name: 'Intermediate Lower Body',
    description: 'Intense lower body workout for strength and size',
    difficulty: 'intermediate',
    muscleGroups: ['legs', 'glutes', 'calves'],
    exercises: [
      {
        exerciseName: 'Barbell Back Squat',
        sets: 4,
        reps: 6,
        weight: 60,
      },
      {
        exerciseName: 'Romanian Deadlift',
        sets: 3,
        reps: 8,
        weight: 70,
      },
      {
        exerciseName: 'Leg Press',
        sets: 3,
        reps: 10,
        weight: 100,
      },
      {
        exerciseName: 'Bulgarian Split Squats',
        sets: 3,
        reps: 10,
        weight: 20,
      },
    ],
  },
  {
    name: 'Advanced Push/Pull/Legs',
    description: 'High-intensity PPL split for advanced lifters',
    difficulty: 'advanced',
    muscleGroups: ['chest', 'shoulders', 'triceps', 'back', 'biceps', 'legs'],
    exercises: [
      {
        exerciseName: 'Barbell Bench Press',
        sets: 5,
        reps: 5,
        weight: 50,
      },
      {
        exerciseName: 'Incline Barbell Press',
        sets: 4,
        reps: 6,
        weight: 40,
      },
      {
        exerciseName: 'Dumbbell Flyes',
        sets: 3,
        reps: 10,
        weight: 20,
      },
      {
        exerciseName: 'Weighted Dips',
        sets: 3,
        reps: 8,
        weight: 20,
      },
    ],
  },
  {
    name: 'Advanced Cardio & Core',
    description: 'Intense conditioning for cardiovascular fitness',
    difficulty: 'advanced',
    muscleGroups: ['cardio', 'core'],
    exercises: [
      {
        exerciseName: 'Running',
        sets: 1,
        reps: 10,
      },
      {
        exerciseName: 'High Intensity Interval Training',
        sets: 10,
        reps: 30,
      },
      {
        exerciseName: 'Ab Wheel Rollouts',
        sets: 3,
        reps: 15,
      },
      {
        exerciseName: 'Hanging Leg Raises',
        sets: 3,
        reps: 12,
      },
    ],
  },
];

export const DEFAULT_REGIMES = [
  {
    name: 'Beginner 4-Week Full Body',
    description: 'A comprehensive 4-week program for beginners focusing on compound movements and building a solid foundation.',
    difficulty: 'beginner',
    duration: 4,
    benefits: [
      'Build foundational strength',
      'Improve overall fitness',
      'Learn proper form',
      'Increase work capacity',
      'Establish workout habits',
    ],
    muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'core'],
    weeks: [
      {
        weekNumber: 1,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Full Body',
            exercises: [
              { exerciseName: 'Bench Press', sets: 3, reps: 10 },
              { exerciseName: 'Barbell Squat', sets: 3, reps: 10 },
              { exerciseName: 'Bent-Over Rows', sets: 3, reps: 10 },
              { exerciseName: 'Plank', sets: 3, reps: 30 },
            ],
          },
          {
            day: 3,
            dayName: 'Wednesday - Full Body',
            exercises: [
              { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: 12 },
              { exerciseName: 'Leg Press', sets: 3, reps: 12 },
              { exerciseName: 'Pull-ups', sets: 3, reps: 6 },
              { exerciseName: 'Ab Wheel Rollouts', sets: 3, reps: 10 },
            ],
          },
          {
            day: 5,
            dayName: 'Friday - Full Body',
            exercises: [
              { exerciseName: 'Incline Push-ups', sets: 3, reps: 12 },
              { exerciseName: 'Walking Lunges', sets: 3, reps: 12 },
              { exerciseName: 'Bent-Over Rows', sets: 3, reps: 10 },
              { exerciseName: 'Plank', sets: 3, reps: 45 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Full Body',
            exercises: [
              { exerciseName: 'Bench Press', sets: 4, reps: 10 },
              { exerciseName: 'Barbell Squat', sets: 4, reps: 10 },
              { exerciseName: 'Bent-Over Rows', sets: 4, reps: 10 },
              { exerciseName: 'Plank', sets: 3, reps: 45 },
            ],
          },
          {
            day: 3,
            dayName: 'Wednesday - Full Body',
            exercises: [
              { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: 12 },
              { exerciseName: 'Leg Press', sets: 4, reps: 12 },
              { exerciseName: 'Weighted Pull-ups', sets: 3, reps: 6 },
              { exerciseName: 'Ab Wheel Rollouts', sets: 3, reps: 12 },
            ],
          },
          {
            day: 5,
            dayName: 'Friday - Full Body',
            exercises: [
              { exerciseName: 'Incline Push-ups', sets: 3, reps: 12 },
              { exerciseName: 'Walking Lunges', sets: 3, reps: 14 },
              { exerciseName: 'Bent-Over Rows', sets: 4, reps: 10 },
              { exerciseName: 'Plank', sets: 3, reps: 60 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Full Body',
            exercises: [
              { exerciseName: 'Bench Press', sets: 4, reps: 12 },
              { exerciseName: 'Barbell Squat', sets: 4, reps: 12 },
              { exerciseName: 'Bent-Over Rows', sets: 4, reps: 12 },
              { exerciseName: 'Plank', sets: 4, reps: 60 },
            ],
          },
          {
            day: 3,
            dayName: 'Wednesday - Full Body',
            exercises: [
              { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: 12 },
              { exerciseName: 'Leg Press', sets: 4, reps: 14 },
              { exerciseName: 'Weighted Pull-ups', sets: 4, reps: 6 },
              { exerciseName: 'Ab Wheel Rollouts', sets: 3, reps: 15 },
            ],
          },
          {
            day: 5,
            dayName: 'Friday - Full Body',
            exercises: [
              { exerciseName: 'Dumbbell Bench Press', sets: 3, reps: 12 },
              { exerciseName: 'Bulgarian Split Squats', sets: 3, reps: 12 },
              { exerciseName: 'Barbell Rows', sets: 4, reps: 12 },
              { exerciseName: 'Plank', sets: 4, reps: 75 },
            ],
          },
        ],
      },
      {
        weekNumber: 4,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Full Body',
            exercises: [
              { exerciseName: 'Bench Press', sets: 4, reps: 12 },
              { exerciseName: 'Barbell Squat', sets: 4, reps: 12 },
              { exerciseName: 'Bent-Over Rows', sets: 4, reps: 12 },
              { exerciseName: 'Plank', sets: 4, reps: 90 },
            ],
          },
          {
            day: 3,
            dayName: 'Wednesday - Full Body',
            exercises: [
              { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: 12 },
              { exerciseName: 'Leg Press', sets: 4, reps: 15 },
              { exerciseName: 'Weighted Pull-ups', sets: 4, reps: 8 },
              { exerciseName: 'Ab Wheel Rollouts', sets: 4, reps: 15 },
            ],
          },
          {
            day: 5,
            dayName: 'Friday - Full Body',
            exercises: [
              { exerciseName: 'Dumbbell Bench Press', sets: 4, reps: 12 },
              { exerciseName: 'Bulgarian Split Squats', sets: 3, reps: 14 },
              { exerciseName: 'Barbell Rows', sets: 4, reps: 12 },
              { exerciseName: 'Plank', sets: 4, reps: 90 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Intermediate Push/Pull/Legs',
    description: 'A 4-week PPL split designed for intermediate lifters looking to increase strength and muscle mass.',
    difficulty: 'intermediate',
    duration: 4,
    benefits: [
      'Increase muscle mass',
      'Build functional strength',
      'Improve workout frequency',
      'Better recovery management',
      'Progressive overload tracking',
    ],
    muscleGroups: ['chest', 'shoulders', 'triceps', 'back', 'biceps', 'legs'],
    weeks: [
      {
        weekNumber: 1,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Push',
            exercises: [
              { exerciseName: 'Barbell Bench Press', sets: 4, reps: 8 },
              { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: 10 },
              { exerciseName: 'Overhead Press', sets: 3, reps: 8 },
              { exerciseName: 'Weighted Dips', sets: 3, reps: 8 },
            ],
          },
          {
            day: 2,
            dayName: 'Tuesday - Pull',
            exercises: [
              { exerciseName: 'Weighted Pull-ups', sets: 4, reps: 6 },
              { exerciseName: 'Barbell Rows', sets: 4, reps: 8 },
              { exerciseName: 'Barbell Curls', sets: 3, reps: 10 },
              { exerciseName: 'Face Pulls', sets: 3, reps: 15 },
            ],
          },
          {
            day: 4,
            dayName: 'Thursday - Legs',
            exercises: [
              { exerciseName: 'Barbell Back Squat', sets: 4, reps: 8 },
              { exerciseName: 'Romanian Deadlift', sets: 3, reps: 8 },
              { exerciseName: 'Leg Press', sets: 3, reps: 10 },
              { exerciseName: 'Leg Curls', sets: 3, reps: 12 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Push',
            exercises: [
              { exerciseName: 'Barbell Bench Press', sets: 4, reps: 8 },
              { exerciseName: 'Incline Barbell Press', sets: 3, reps: 8 },
              { exerciseName: 'Overhead Press', sets: 3, reps: 10 },
              { exerciseName: 'Tricep Dips', sets: 3, reps: 10 },
            ],
          },
          {
            day: 2,
            dayName: 'Tuesday - Pull',
            exercises: [
              { exerciseName: 'Weighted Pull-ups', sets: 4, reps: 8 },
              { exerciseName: 'Pendlay Rows', sets: 4, reps: 8 },
              { exerciseName: 'Incline Barbell Curls', sets: 3, reps: 10 },
              { exerciseName: 'Chest Supported Rows', sets: 3, reps: 10 },
            ],
          },
          {
            day: 4,
            dayName: 'Thursday - Legs',
            exercises: [
              { exerciseName: 'Front Squat', sets: 4, reps: 8 },
              { exerciseName: 'Deadlift', sets: 3, reps: 5 },
              { exerciseName: 'Hack Squat', sets: 3, reps: 10 },
              { exerciseName: 'Walking Lunges', sets: 3, reps: 12 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Push',
            exercises: [
              { exerciseName: 'Barbell Bench Press', sets: 5, reps: 8 },
              { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: 10 },
              { exerciseName: 'Lateral Raises', sets: 3, reps: 12 },
              { exerciseName: 'Tricep Rope Pushdowns', sets: 3, reps: 12 },
            ],
          },
          {
            day: 2,
            dayName: 'Tuesday - Pull',
            exercises: [
              { exerciseName: 'Weighted Pull-ups', sets: 5, reps: 6 },
              { exerciseName: 'Barbell Rows', sets: 4, reps: 8 },
              { exerciseName: 'Dumbbell Curls', sets: 3, reps: 12 },
              { exerciseName: 'Reverse Flyes', sets: 3, reps: 12 },
            ],
          },
          {
            day: 4,
            dayName: 'Thursday - Legs',
            exercises: [
              { exerciseName: 'Barbell Back Squat', sets: 5, reps: 8 },
              { exerciseName: 'Romanian Deadlift', sets: 4, reps: 8 },
              { exerciseName: 'Leg Press', sets: 3, reps: 12 },
              { exerciseName: 'Leg Curls', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 4,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Push',
            exercises: [
              { exerciseName: 'Barbell Bench Press', sets: 5, reps: 8 },
              { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: 10 },
              { exerciseName: 'Overhead Press', sets: 4, reps: 10 },
              { exerciseName: 'Weighted Dips', sets: 3, reps: 10 },
            ],
          },
          {
            day: 2,
            dayName: 'Tuesday - Pull',
            exercises: [
              { exerciseName: 'Weighted Pull-ups', sets: 5, reps: 8 },
              { exerciseName: 'Barbell Rows', sets: 4, reps: 8 },
              { exerciseName: 'Barbell Curls', sets: 4, reps: 10 },
              { exerciseName: 'Face Pulls', sets: 3, reps: 15 },
            ],
          },
          {
            day: 4,
            dayName: 'Thursday - Legs',
            exercises: [
              { exerciseName: 'Barbell Back Squat', sets: 5, reps: 8 },
              { exerciseName: 'Deadlift', sets: 4, reps: 5 },
              { exerciseName: 'Hack Squat', sets: 3, reps: 12 },
              { exerciseName: 'Calf Raises', sets: 3, reps: 15 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Advanced 5-Day Upper/Lower',
    description: 'High-intensity 4-week program for advanced lifters focused on hypertrophy and strength.',
    difficulty: 'advanced',
    duration: 4,
    benefits: [
      'Maximum muscle growth',
      'Advanced strength gains',
      'High training volume',
      'Expert periodization',
      'Peak performance optimization',
    ],
    muscleGroups: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'],
    weeks: [
      {
        weekNumber: 1,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Upper Power',
            exercises: [
              { exerciseName: 'Barbell Bench Press', sets: 5, reps: 5 },
              { exerciseName: 'Weighted Pull-ups', sets: 5, reps: 5 },
              { exerciseName: 'Incline Barbell Press', sets: 4, reps: 6 },
              { exerciseName: 'Barbell Rows', sets: 4, reps: 6 },
            ],
          },
          {
            day: 2,
            dayName: 'Tuesday - Lower Power',
            exercises: [
              { exerciseName: 'Barbell Back Squat', sets: 5, reps: 5 },
              { exerciseName: 'Deadlift', sets: 5, reps: 3 },
              { exerciseName: 'Front Squat', sets: 4, reps: 6 },
              { exerciseName: 'Walking Lunges', sets: 3, reps: 8 },
            ],
          },
          {
            day: 4,
            dayName: 'Thursday - Upper Hypertrophy',
            exercises: [
              { exerciseName: 'Dumbbell Bench Press', sets: 4, reps: 10 },
              { exerciseName: 'Chest-Supported Rows', sets: 4, reps: 10 },
              { exerciseName: 'Incline Dumbbell Flyes', sets: 3, reps: 12 },
              { exerciseName: 'Machine Rows', sets: 3, reps: 12 },
            ],
          },
          {
            day: 5,
            dayName: 'Friday - Lower Hypertrophy',
            exercises: [
              { exerciseName: 'Hack Squat', sets: 4, reps: 10 },
              { exerciseName: 'Leg Press', sets: 4, reps: 10 },
              { exerciseName: 'Leg Curls', sets: 3, reps: 12 },
              { exerciseName: 'Calf Raises', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 2,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Upper Power',
            exercises: [
              { exerciseName: 'Barbell Bench Press', sets: 5, reps: 5 },
              { exerciseName: 'Weighted Pull-ups', sets: 5, reps: 5 },
              { exerciseName: 'Incline Barbell Press', sets: 4, reps: 6 },
              { exerciseName: 'Pendlay Rows', sets: 4, reps: 6 },
            ],
          },
          {
            day: 2,
            dayName: 'Tuesday - Lower Power',
            exercises: [
              { exerciseName: 'Barbell Back Squat', sets: 5, reps: 5 },
              { exerciseName: 'Deadlift', sets: 5, reps: 3 },
              { exerciseName: 'Front Squat', sets: 4, reps: 6 },
              { exerciseName: 'Bulgarian Split Squats', sets: 3, reps: 8 },
            ],
          },
          {
            day: 4,
            dayName: 'Thursday - Upper Hypertrophy',
            exercises: [
              { exerciseName: 'Incline Dumbbell Press', sets: 4, reps: 10 },
              { exerciseName: 'Dumbbell Rows', sets: 4, reps: 10 },
              { exerciseName: 'Cable Flyes', sets: 3, reps: 12 },
              { exerciseName: 'Lat Pulldowns', sets: 3, reps: 12 },
            ],
          },
          {
            day: 5,
            dayName: 'Friday - Lower Hypertrophy',
            exercises: [
              { exerciseName: 'Leg Press', sets: 4, reps: 10 },
              { exerciseName: 'Romanian Deadlift', sets: 4, reps: 10 },
              { exerciseName: 'Leg Extensions', sets: 3, reps: 12 },
              { exerciseName: 'Seated Calf Raises', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 3,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Upper Power',
            exercises: [
              { exerciseName: 'Barbell Bench Press', sets: 6, reps: 5 },
              { exerciseName: 'Weighted Pull-ups', sets: 6, reps: 5 },
              { exerciseName: 'Close-Grip Bench Press', sets: 4, reps: 6 },
              { exerciseName: 'T-Bar Rows', sets: 4, reps: 6 },
            ],
          },
          {
            day: 2,
            dayName: 'Tuesday - Lower Power',
            exercises: [
              { exerciseName: 'Barbell Back Squat', sets: 6, reps: 5 },
              { exerciseName: 'Deadlift', sets: 6, reps: 3 },
              { exerciseName: 'Safety Bar Squat', sets: 4, reps: 6 },
              { exerciseName: 'Jump Squats', sets: 3, reps: 8 },
            ],
          },
          {
            day: 4,
            dayName: 'Thursday - Upper Hypertrophy',
            exercises: [
              { exerciseName: 'Smith Machine Bench Press', sets: 4, reps: 10 },
              { exerciseName: 'Machine Rows', sets: 4, reps: 10 },
              { exerciseName: 'Pec Deck', sets: 3, reps: 12 },
              { exerciseName: 'Reverse Pec Deck', sets: 3, reps: 12 },
            ],
          },
          {
            day: 5,
            dayName: 'Friday - Lower Hypertrophy',
            exercises: [
              { exerciseName: 'V-Squat', sets: 4, reps: 10 },
              { exerciseName: 'Lever Machine Squat', sets: 4, reps: 10 },
              { exerciseName: 'Hamstring Curls', sets: 3, reps: 12 },
              { exerciseName: 'Leg Press Calf Raises', sets: 3, reps: 15 },
            ],
          },
        ],
      },
      {
        weekNumber: 4,
        workouts: [
          {
            day: 1,
            dayName: 'Monday - Upper Power',
            exercises: [
              { exerciseName: 'Barbell Bench Press', sets: 6, reps: 5 },
              { exerciseName: 'Weighted Pull-ups', sets: 6, reps: 5 },
              { exerciseName: 'Incline Barbell Press', sets: 4, reps: 6 },
              { exerciseName: 'Barbell Rows', sets: 4, reps: 6 },
            ],
          },
          {
            day: 2,
            dayName: 'Tuesday - Lower Power',
            exercises: [
              { exerciseName: 'Barbell Back Squat', sets: 6, reps: 5 },
              { exerciseName: 'Deadlift', sets: 6, reps: 3 },
              { exerciseName: 'Front Squat', sets: 4, reps: 6 },
              { exerciseName: 'Cossack Squats', sets: 3, reps: 8 },
            ],
          },
          {
            day: 4,
            dayName: 'Thursday - Upper Hypertrophy',
            exercises: [
              { exerciseName: 'Dumbbell Bench Press', sets: 4, reps: 10 },
              { exerciseName: 'Seal Rows', sets: 4, reps: 10 },
              { exerciseName: 'Dumbbell Flyes', sets: 3, reps: 12 },
              { exerciseName: 'Supported Rows', sets: 3, reps: 12 },
            ],
          },
          {
            day: 5,
            dayName: 'Friday - Lower Hypertrophy',
            exercises: [
              { exerciseName: 'Hack Squat', sets: 4, reps: 10 },
              { exerciseName: 'Belt Squat', sets: 4, reps: 10 },
              { exerciseName: 'Prone Leg Curls', sets: 3, reps: 12 },
              { exerciseName: 'Donkey Calf Raises', sets: 3, reps: 15 },
            ],
          },
        ],
      },
    ],
  },
];