import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutSchedule extends Document {
  userId: mongoose.Types.ObjectId;
  selectedDays: string[]; // 'monday', 'tuesday', etc.
  goal: string; // User's personal goal description
  createdAt: Date;
  updatedAt: Date;
}

const workoutScheduleSchema = new Schema<IWorkoutSchedule>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    selectedDays: [
      {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
    ],
    goal: {
      type: String,
      default: 'Stay consistent and grow stronger',
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkoutSchedule =
  mongoose.models.WorkoutSchedule ||
  mongoose.model<IWorkoutSchedule>('WorkoutSchedule', workoutScheduleSchema);

export default WorkoutSchedule;