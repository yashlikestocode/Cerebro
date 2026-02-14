import "dotenv/config";
import OpenAI from "openai";
import readline from "readline";

const client = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_TOKEN,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
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
  "plan": [...]
}

Return STRICT JSON only.
`;

async function callModel(messages) {
  const response = await client.chat.completions.create({
    model: "openai/gpt-4o",
    temperature: 0.6,
    max_tokens: 1500,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  return JSON.parse(response.choices[0].message.content);
}

async function startConversation() {
  let messages = [];

  rl.question("You: ", async function handleUserInput(input) {
    messages.push({ role: "user", content: input });

    try {
      const result = await callModel(messages);

      if (result.type === "question") {
        console.log("AI:", result.question);
        messages.push({
          role: "assistant",
          content: JSON.stringify(result),
        });

        rl.question("You: ", handleUserInput);
      } else if (result.type === "plan") {
        console.log("\nFinal Plan:\n");
        console.log(JSON.stringify(result, null, 2));
        rl.close();
      }
    } catch (err) {
      console.error("Error:", err);
      rl.close();
    }
  });
}

startConversation();
