import openai from "../utils/openaiClient.js";
import Interview from "../models/Interview.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

// Utility: clean and safely parse AI response
function cleanAndParseReport(text) {
  if (!text) return {};
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("⚠️ Could not parse AI JSON:", e);
    // fallback: store raw text as summary
    return { summary: cleaned };
  }
}

export const generateFeedbackReport = async (req, res) => {
  const { interviewId } = req.body;

  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const prompt = `
    Generate a detailed structured JSON feedback report for this interview:
    ${JSON.stringify(interview.answers)}
    Format strictly as JSON:
    {
      "technicalScore": number (1-10),
      "communication": string,
      "confidence": string,
      "strengths": [string],
      "weaknesses": [string],
      "summary": string
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const rawResponse = completion.choices[0].message.content;
    const parsedReport = cleanAndParseReport(rawResponse);

    const feedback = await Feedback.create({
      interview: interview._id,
      user: req.user._id,
      report: parsedReport,
    });
    await User.findByIdAndUpdate(req.user._id, {
  $inc: { "usage.feedbacksGenerated": 1 },
});
    res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("❌ Feedback generation failed:", error);
    res.status(500).json({ message: "Feedback generation failed", error });
  }
};


export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id })
      .populate("interview", "title date");
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

export const getFeedbackByInterview = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      user: req.user._id,
      interview: req.params.interviewId,
    }).populate("interview");
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
};
