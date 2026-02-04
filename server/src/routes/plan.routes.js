import { Router } from "express";
import requireAuth from "../middleware/auth.middleware.js";
import User from "../models/user.js";
import LearningGoal from "../models/learningGoal.js";
import LearningPlan from "../models/LearningPlan.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const { prompt } = req.body;
  const supabaseUser = req.user;
  // console.log(supabaseUser);

  if (!prompt) return res.status(400).json({ message: "Prompt is required" });

  // 1. Find or create user
  let user = await User.findOne({ supabaseId: supabaseUser.id });

  if (!user) {
    user = await User.create({
      supabaseId: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.full_name,
      avatar: supabaseUser.user_metadata?.avatar_url,
    });
  }

  // 2. Create learning goal
  const goal = await LearningGoal.create({
    userId: user._id,
    prompt,
  });

  // 3. Hardcoded steps (TEMP)
  const steps = [
    {
      stepId: "1",
      title: "Research & Planning",
      description: `Research fundamentals of "${prompt}"`,
      estimatedTime: "30 mins",
    },
    {
      stepId: "2",
      title: "Gather Resources",
      description: "Collect books, tutorials, and videos",
      estimatedTime: "45 mins",
    },
    {
      stepId: "3",
      title: "Create Study Schedule",
      description: "Break learning into daily sessions",
      estimatedTime: "20 mins",
    },
    {
      stepId: "4",
      title: "Start Learning",
      description: `Begin learning ${prompt}`,
      estimatedTime: "Ongoing",
    },
  ];

  // 4. Create plan
  const plan = await LearningPlan.create({
    userId: user._id,
    goalId: goal._id,
    steps,
  });

  res.json({
    plan: plan.steps,
  });
});

export default router;
