import mongoose, { Schema, Document } from "mongoose";

export interface IExerciseTemplate extends Document {
  name: string;
  description?: string;
  instructions?: string[];
  category: "strength" | "cardio" | "flexibility" | "sports" | "other";
  baseXPValue: number;
  difficultyMultiplier: number;
  unit: "reps" | "minutes" | "km" | "miles" | "sets" | "weight" | "custom";
  isCustom: boolean;
  creatorId?: mongoose.Types.ObjectId;
  imageUrl?: string;
  videoUrl?: string;
  isActive: boolean;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

const exerciseTemplateSchema = new Schema<IExerciseTemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: String,
    instructions: [String],
    category: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "sports", "other"],
      required: true,
      index: true,
    },
    baseXPValue: {
      type: Number,
      required: true,
      min: 1,
    },
    difficultyMultiplier: {
      type: Number,
      required: true,
      default: 1.0,
      min: 0.5,
      max: 3.0,
    },
    unit: {
      type: String,
      enum: ["reps", "minutes", "km", "miles", "sets", "weight", "custom"],
      required: true,
    },
    isCustom: {
      type: Boolean,
      default: false,
      index: true,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    imageUrl: String,
    videoUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    popularity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

exerciseTemplateSchema.index({ name: 1 });
exerciseTemplateSchema.index({ category: 1 });
exerciseTemplateSchema.index({ isCustom: 1, creatorId: 1 });

export const ExerciseTemplate =
  mongoose.models.ExerciseTemplate ||
  mongoose.model<IExerciseTemplate>("ExerciseTemplate", exerciseTemplateSchema);

// Default exercises
export const DEFAULT_EXERCISES = [
  // Strength
  {
    name: "Pushup",
    category: "strength" as const,
    baseXPValue: 7, // ↓ from 10
    difficultyMultiplier: 1.0,
    unit: "reps" as const,
    isCustom: false,
    description:
      "Classic upper body exercise targeting chest, shoulders, and triceps",
    instructions: [
      "Start in a plank position with hands shoulder-width apart.",
      "Lower your body until your chest nearly touches the floor.",
      "Push yourself back up to the starting position.",
    ],
  },
  {
    name: "Pullup",
    category: "strength" as const,
    baseXPValue: 9, // ↓
    difficultyMultiplier: 1.2, // slight nerf
    unit: "reps" as const,
    isCustom: false,
    description: "Advanced upper body exercise for back and biceps",
    instructions: [
      "Grab the pull-up bar with an overhand grip, hands slightly wider than shoulder-width apart.",
      "Hang with arms fully extended and pull yourself up until your chin is above the bar.",
      "Lower yourself back down with control.",
    ],
  },
  {
    name: "Squat",
    category: "strength" as const,
    baseXPValue: 9,
    difficultyMultiplier: 1.15, // slight nerf
    unit: "reps" as const,
    isCustom: false,
    description: "Lower body compound exercise targeting quads and glutes",
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Lower your body by bending your knees and hips, keeping your back straight.",
      "Go down until your thighs are parallel to the floor, then push back up to standing.",
    ],
  },
  {
    name: "Deadlift",
    category: "strength" as const,
    baseXPValue: 9,
    difficultyMultiplier: 1.4, // ↓ from 1.8
    unit: "reps" as const,
    isCustom: false,
    description: "Heavy compound lift targeting entire posterior chain",
    instructions: [
      "Stand with feet hip-width apart, barbell over mid-foot.",
      "Bend at the hips and knees to grip the bar with hands shoulder-width apart.",
      "Lift the bar by extending your hips and knees to full standing, then lower it back down.",
    ],
  },
  {
    name: "Bench Press",
    category: "strength" as const,
    baseXPValue: 9,
    difficultyMultiplier: 1.25,
    unit: "reps" as const,
    isCustom: false,
    description: "Upper body pressing movement for chest and triceps",
    instructions: [
      "Lie on a bench with feet flat on the floor.",
      "Grip the barbell with hands slightly wider than shoulder-width apart.",
      "Lower the bar to your chest, then press it back up to the starting position.",
    ],
  },
  // Additional strength exercises
  {
    name: "Lunges",
    category: "strength" as const,
    baseXPValue: 8,
    difficultyMultiplier: 1.1,
    unit: "reps" as const,
    isCustom: false,
    description: "Lower body exercise targeting quads, glutes, and hamstrings",
    instructions: [
      "Step forward with one leg.",
      "Lower your hips until both knees are bent at about 90 degrees.",
      "Push back up and switch legs.",
    ],
  },
  {
    name: "Dips",
    category: "strength" as const,
    baseXPValue: 9,
    difficultyMultiplier: 1.3,
    unit: "reps" as const,
    isCustom: false,
    description: "Upper body exercise for triceps and chest",
    instructions: [
      "Grip parallel bars or a bench.",
      "Lower your body by bending your elbows.",
      "Push yourself back up.",
    ],
  },
  {
    name: "Overhead Press",
    category: "strength" as const,
    baseXPValue: 9,
    difficultyMultiplier: 1.3,
    unit: "reps" as const,
    isCustom: false,
    description: "Shoulder strength exercise",
    instructions: [
      "Hold weights at shoulder height.",
      "Press upward until arms are fully extended.",
      "Lower back down slowly.",
    ],
  },
  {
    name: "Bicep Curl",
    category: "strength" as const,
    baseXPValue: 7,
    difficultyMultiplier: 1.0,
    unit: "reps" as const,
    isCustom: false,
    description: "Isolation exercise for biceps",
    instructions: [
      "Hold dumbbells at your sides.",
      "Curl the weights up toward your shoulders.",
      "Lower slowly.",
    ],
  },
  {
    name: "Tricep Extension",
    category: "strength" as const,
    baseXPValue: 7,
    difficultyMultiplier: 1.0,
    unit: "reps" as const,
    isCustom: false,
    description: "Isolation exercise for triceps",
    instructions: [
      "Hold weight overhead.",
      "Lower behind your head.",
      "Extend arms back up.",
    ],
  },
  {
    name: "Incline Pushup",
    category: "strength" as const,
    baseXPValue: 6,
    difficultyMultiplier: 0.9,
    unit: "reps" as const,
    isCustom: false,
    description: "Easier pushup variation for beginners",
    instructions: [
      "Place hands on an elevated surface.",
      "Lower your chest toward the surface.",
      "Push back up.",
    ],
  },
  {
    name: "Decline Pushup",
    category: "strength" as const,
    baseXPValue: 8,
    difficultyMultiplier: 1.2,
    unit: "reps" as const,
    isCustom: false,
    description: "Harder pushup variation targeting upper chest",
    instructions: [
      "Place feet on an elevated surface.",
      "Perform pushups as usual.",
    ],
  },
  {
    name: "Calf Raises",
    category: "strength" as const,
    baseXPValue: 6,
    difficultyMultiplier: 1.0,
    unit: "reps" as const,
    isCustom: false,
    description: "Lower leg exercise for calves",
    instructions: [
      "Stand upright.",
      "Raise heels off the ground.",
      "Lower slowly.",
    ],
  },

  // Cardio
  {
    name: "Running",
    category: "cardio" as const,
    baseXPValue: 25, // ↓ from 30
    difficultyMultiplier: 1.0,
    unit: "km" as const,
    isCustom: false,
    description: "Cardiovascular endurance training",
    instructions: [
      "Start with a warm-up jog for 5-10 minutes.",
      "Maintain a steady pace throughout your run.",
      "Cool down with a slow jog or walk for 5-10 minutes.",
    ],
  },
  {
    name: "Cycling",
    category: "cardio" as const,
    baseXPValue: 22, // ↓
    difficultyMultiplier: 0.9,
    unit: "km" as const,
    isCustom: false,
    description: "Low impact cardio exercise",
    instructions: [
      "Adjust the seat and handlebars to a comfortable position.",
      "Start pedaling at a moderate pace to warm up.",
      "Maintain a steady pace throughout your ride.",
      "Cool down with a slower pace for 5-10 minutes.",
    ],
  },
  {
    name: "Jump Rope",
    category: "cardio" as const,
    baseXPValue: 12, // ↓
    difficultyMultiplier: 1.1,
    unit: "reps" as const,
    isCustom: false,
    description: "Explosive cardio and coordination exercise",
    instructions: [
      "Hold the jump rope handles at your sides.",
      "Swing the rope over your head and jump as it passes under your feet.",
      "Maintain a steady rhythm and try to keep jumps low to the ground.",
    ],
  },
  // Additional cardio exercises
  {
    name: "Walking",
    category: "cardio" as const,
    baseXPValue: 15,
    difficultyMultiplier: 0.8,
    unit: "km" as const,
    isCustom: false,
    description: "Low intensity cardio activity",
    instructions: ["Walk at a steady pace.", "Maintain good posture."],
  },
  {
    name: "Stair Climbing",
    category: "cardio" as const,
    baseXPValue: 18,
    difficultyMultiplier: 1.2,
    unit: "minutes" as const,
    isCustom: false,
    description: "High intensity lower body cardio",
    instructions: [
      "Climb stairs at a steady pace.",
      "Use handrails if needed.",
    ],
  },
  {
    name: "Burpees",
    category: "cardio" as const,
    baseXPValue: 10,
    difficultyMultiplier: 1.3,
    unit: "reps" as const,
    isCustom: false,
    description: "Full body explosive cardio exercise",
    instructions: [
      "Start standing.",
      "Drop into a push-up position.",
      "Jump back up explosively.",
    ],
  },
  {
    name: "Mountain Climbers",
    category: "cardio" as const,
    baseXPValue: 9,
    difficultyMultiplier: 1.2,
    unit: "reps" as const,
    isCustom: false,
    description: "Core and cardio exercise",
    instructions: [
      "Start in plank position.",
      "Drive knees toward chest alternately.",
    ],
  },
  {
    name: "Sprinting",
    category: "cardio" as const,
    baseXPValue: 28,
    difficultyMultiplier: 1.2,
    unit: "km" as const,
    isCustom: false,
    description: "High intensity running for speed and power",
    instructions: [
      "Run at maximum speed for short distances.",
      "Rest between sprints.",
    ],
  },
  {
    name: "Jogging",
    category: "cardio" as const,
    baseXPValue: 20,
    difficultyMultiplier: 0.95,
    unit: "km" as const,
    isCustom: false,
    description: "Moderate pace running",
    instructions: [
      "Maintain a comfortable steady pace.",
      "Focus on endurance.",
    ],
  },

  // Flexibility
  {
    name: "Plank",
    category: "flexibility" as const,
    baseXPValue: 5,
    difficultyMultiplier: 1.0,
    unit: "minutes" as const,
    isCustom: false,
    description: "Core stability and endurance exercise",
    instructions: [
      "Start in a forearm plank position with elbows under shoulders.",
      "Keep your body in a straight line from head to heels.",
      "Engage your core and hold the position for the desired time.",
    ],
  },
  {
    name: "Yoga",
    category: "flexibility" as const,
    baseXPValue: 7,
    difficultyMultiplier: 0.85, // slight nerf
    unit: "minutes" as const,
    isCustom: false,
    description: "Flexibility, balance, and mindfulness practice",
    instructions: [
      "Start with a few minutes of deep breathing to center yourself.",
      "Move through a series of yoga poses, holding each for several breaths.",
      "Focus on maintaining proper alignment and breathing deeply throughout the practice.",
    ],
  },
  // Additional flexibility exercises
  {
    name: "Side Plank",
    category: "flexibility" as const,
    baseXPValue: 5,
    difficultyMultiplier: 1.1,
    unit: "minutes" as const,
    isCustom: false,
    description: "Core stability exercise targeting obliques",
    instructions: [
      "Lie on your side.",
      "Lift your body supported on one arm.",
      "Hold position.",
    ],
  },
  {
    name: "Stretching",
    category: "flexibility" as const,
    baseXPValue: 6,
    difficultyMultiplier: 0.9,
    unit: "minutes" as const,
    isCustom: false,
    description: "General flexibility routine",
    instructions: [
      "Stretch major muscle groups.",
      "Hold each stretch for 15–30 seconds.",
    ],
  },
  {
    name: "Leg Raises",
    category: "flexibility" as const,
    baseXPValue: 7,
    difficultyMultiplier: 1.1,
    unit: "reps" as const,
    isCustom: false,
    description: "Core strengthening exercise",
    instructions: [
      "Lie flat on your back.",
      "Raise legs to 90 degrees.",
      "Lower slowly.",
    ],
  },
  {
    name: "Sit Ups",
    category: "flexibility" as const,
    baseXPValue: 7,
    difficultyMultiplier: 1.1,
    unit: "reps" as const,
    isCustom: false,
    description: "Core exercise targeting abs",
    instructions: [
      "Lie on your back with knees bent.",
      "Lift your torso toward your knees.",
      "Lower back down.",
    ],
  },
  {
    name: "Russian Twists",
    category: "flexibility" as const,
    baseXPValue: 7,
    difficultyMultiplier: 1.1,
    unit: "reps" as const,
    isCustom: false,
    description: "Core rotation exercise",
    instructions: ["Sit with knees bent.", "Twist torso side to side."],
  },
];

export default ExerciseTemplate;
