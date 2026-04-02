import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutTemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  muscleGroups: string[];
  exercises: Array<{
    exerciseId: mongoose.Types.ObjectId;
    exerciseName: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
  }>;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const workoutTemplateSchema = new Schema<IWorkoutTemplate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !this.isDefault;
      },
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: String,
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
      index: true,
    },
    muscleGroups: {
      type: [String],
      required: true,
      index: true,
    },
    exercises: [
      {
        exerciseId: {
          type: Schema.Types.ObjectId,
          ref: "ExerciseTemplate",
          required: true,
        },
        exerciseName: {
          type: String,
          required: true,
        },
        sets: {
          type: Number,
          required: true,
          min: 1,
        },
        reps: {
          type: Number,
          required: true,
          min: 1,
        },
        weight: Number,
        notes: String,
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Index for common queries
workoutTemplateSchema.index({ userId: 1, difficulty: 1 });
workoutTemplateSchema.index({ userId: 1, isDefault: 1 });
workoutTemplateSchema.index({ difficulty: 1, isDefault: 1 });

export const WorkoutTemplate =
  mongoose.models.WorkoutTemplate ||
  mongoose.model<IWorkoutTemplate>("WorkoutTemplate", workoutTemplateSchema);

export default WorkoutTemplate;
