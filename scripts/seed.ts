import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { connectDB } from "../app/lib/db";
import { RankConfig, RANK_SEED_DATA } from "../app/models/rankconfig";
import {
  ExerciseTemplate,
  DEFAULT_EXERCISES,
} from "../app/models/exercisetemplate";

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Seed RankConfig
    console.log("📊 Seeding rank configurations...");

    // 🔥 Clear old config (safe because it's static system data)
    await RankConfig.deleteMany({});

    // Insert fresh config
    await RankConfig.insertMany(RANK_SEED_DATA);

    console.log("✅ Rank configurations reset and seeded");

    // Seed ExerciseTemplate
    console.log("🏋️ Seeding exercise templates...");
    await ExerciseTemplate.deleteMany({ isCustom: false }); // Clear old default exercises

    await ExerciseTemplate.insertMany(DEFAULT_EXERCISES);
    console.log("✅ Default exercise templates seeded");

    console.log("✅ Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
