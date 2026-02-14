import { Router } from "express";
import requireAuth from "../middleware/auth.middleware.js";
import User from "../models/user.js";
import LearningGoal from "../models/learningGoal.js";
import LearningPlan from "../models/LearningPlan.js";
import OpenAI from "openai";
import "dotenv/config";

const router = Router();

const client = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_TOKEN,
});

const systemPrompt = `
You are an AI Study Planning Agent.

Your job:
- Collect ALL required information before generating a study plan.

Required details:
- Topic
- Time duration (weeks/days/date)
- Daily study hours
- Scope (full syllabus or specific topics)

Rules:
- If any required detail is missing, ask ONE clear question.
- Do NOT generate a plan until all details are known.
- Once all details are known, generate plan.

If asking question:
{
  "type": "question",
  "question": "..."
}

If generating plan:
{
  "type": "plan",
  "summary": "...",
  "plan": [
    {
      "title": "...",
      "description": "...",
      "estimatedTime": "..."
    }
  ]
}

Return STRICT JSON only.
`;

router.post("/", requireAuth, async (req, res) => {
  try {
    const { messages } = req.body;
    const supabaseUser = req.user;

    if (!messages)
      return res.status(400).json({ message: "Messages are required" });

    // 1️⃣ Find or create user
    let user = await User.findOne({ supabaseId: supabaseUser.id });

    if (!user) {
      user = await User.create({
        supabaseId: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name,
        avatar: supabaseUser.user_metadata?.avatar_url,
      });
    }

    // 2️⃣ Call AI
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    const raw = response.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Invalid JSON from model:", raw);
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    // 3️⃣ If AI is asking question → return directly (no DB save)
    if (parsed.type === "question") {
      return res.json(parsed);
    }

    // 4️⃣ If AI generated final plan → save it
    if (parsed.type === "plan") {
      const firstUserMessage = messages.find(m => m.role === "user");

      const goal = await LearningGoal.create({
        userId: user._id,
        prompt: firstUserMessage?.content || "Learning Goal",
      });

      const steps = parsed.plan.map((step, index) => ({
        stepId: (index + 1).toString(),
        title: step.title,
        description: step.description,
        estimatedTime: step.estimatedTime || "Flexible",
      }));

      const plan = await LearningPlan.create({
        userId: user._id,
        goalId: goal._id,
        steps,
      });

      return res.json({
        type: "plan",
        summary: parsed.summary,
        plan: plan.steps,
      });
    }

    return res.status(500).json({ message: "Unexpected AI response" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;