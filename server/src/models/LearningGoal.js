import mongoose from "mongoose";

const LearningGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  prompt: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["active", "completed", "abandoned"],
    default: "active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LearningGoal", LearningGoalSchema);
