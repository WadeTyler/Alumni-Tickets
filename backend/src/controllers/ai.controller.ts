
import {attemptImproveDescription, countAiRequestTodayByUserId, logAiRequest, MAX_AI_REQUESTS_PER_DAY} from "../utils/ai.util.ts";
import type {User} from "../../../types/auth.types.ts";


export const improveDescription = async (req: any, res: any) => {
  const user: User = req.body.user;
  const description = req.body.description;

  // Check if user has exceeded the daily limit
  const aiRequestCount = await countAiRequestTodayByUserId(user.id);

  if (aiRequestCount >= MAX_AI_REQUESTS_PER_DAY) {
    return res.status(429).json({ message: "You have exceeded the daily limit of AI usage." });
  }

  if (!description || description.length > 500) {
    return res.status(400).json({ message: "Description is required and should be less than 500 characters." });
  }

  try {
    const improvedDescription = await attemptImproveDescription(description);

    // Log request
    await logAiRequest(user.id, description, improvedDescription);

    if (improvedDescription.length > 500) throw new Error("Improved description exceeds 500 characters.");

    return res.status(200).json({
      message: "Description improved successfully.",
      improvedDescription: improvedDescription
    });
  } catch (e) {
    console.log("Error in improveDescription: ", e);
    return res.status(500).json({message: "Internal Server Error. Try again later."});
  }
}