import mongoose from "mongoose";

const AchievementsblogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
});

const AchievementsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  blog: [AchievementsblogSchema],
});

const Achievement = mongoose.model("Achievements", AchievementsSchema);
export default Achievement;
