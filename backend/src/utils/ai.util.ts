import openai from '../config/openai.config.ts';
import db from '../config/db.config.ts';

export const MAX_AI_REQUESTS_PER_DAY = 8;

export async function attemptImproveDescription(description: string) {
  const prompt = "You are a marketing expert. Improve the user's provided description for their upcoming event. Your response can only have a maximum of 500 characters.";

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "developer", content: prompt},
      {role: "user", content: description},
    ]
  });

  if (response) {
    return response.choices[0].message.content;
  }

  throw new Error("Something went wrong. Try again later.");
}

export async function logAiRequest(user_id: string, request_text: string, response_text: string) {
  try {
    await db.query("INSERT INTO ai_requests(user_id, request_text, response_text) VALUES ($1, $2, $3)", [user_id, request_text, response_text]);
    return true;
  } catch (e) {
    console.error("Error logging AI request: ", e);
    return false;
  }
}

export async function countAiRequestTodayByUserId(user_id: string) {
  const result = await db.query("SELECT id FROM ai_requests WHERE user_id = $1 AND created_at >= CURRENT_DATE", [user_id]);
  return result.rowCount;
}