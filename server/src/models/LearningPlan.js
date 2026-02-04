import mongoose from "mongoose";

const PlanStepSchema = new mongoose.Schema({
  stepId: String,
  title: String,
  description: String,

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },

  estimatedTime: String,
});

const LearningPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LearningGoal",
    required: true,
  },

  steps: [PlanStepSchema],

  createdBy: {
    type: String,
    default: "system", // later: planner-agent
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LearningPlan", LearningPlanSchema);
