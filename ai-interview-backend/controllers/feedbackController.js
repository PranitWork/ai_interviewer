import openai from "../utils/openaiClient.js";
import Interview from "../models/Interview.js";
import Feedback from "../models/Feedback.js";

export const generateFeedbackReport = async (req, res) => {
  const { interviewId } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    const prompt = `Generate a performance report based on the following data:
    ${JSON.stringify(interview.answers)}
    Include: 
    - Technical Score (1-10)
    - Communication Rating
    - Confidence Rating
    - Strengths
    - Weaknesses
    - Final Summary`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const report = completion.choices[0].message.content;

    const feedback = await Feedback.create({
      interview: interview._id,
      user: req.user._id,
      report,
    });

    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Feedback generation failed" });
  }
};
