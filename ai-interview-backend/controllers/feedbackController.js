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
    // fallback: store raw text as summary
    return { summary: cleaned };
  }
}

export const generateFeedbackReport = async (req, res) => {
  const { interviewId } = req.body;

  try {
    // 1️⃣ Fetch interview
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // 2️⃣ Extract the role from interview (assuming interview.role exists)
    const interviewRole = interview.role || "Unknown Role";
    // 3️⃣ Build AI prompt
    const prompt = `
    You are a highly skilled AI interviewer and career mentor with deep expertise in assessing both technical and behavioral performance.

Generate a comprehensive and empathetic **JSON-formatted interview feedback report** based on the candidate’s answers below.

Context:
- Role: ${interviewRole}
- Answers: ${JSON.stringify(interview.answers)}

Your feedback must reflect **professional evaluation standards**, with a tone that feels **encouraging, insightful, and constructive** — helping the user learn and grow.

Follow this exact JSON format (return only valid JSON, no extra text):

{
  "role": string,
  "technicalScore": number (1-10),
  "communication": string, // concise assessment of clarity, articulation, and coherence
  "confidence": string, // describe overall confidence and delivery style
  "strengths": [string], // highlight specific strong points
  "weaknesses": [string], // point out key improvement areas constructively
  "summary": string // a motivational summary with actionable feedback and next steps
}

    `;

    // 4️⃣ Generate feedback from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const rawResponse = completion.choices[0].message.content;

    // 5️⃣ Parse and clean AI JSON
    const parsedReport = cleanAndParseReport(rawResponse);

    // 6️⃣ Attach role to report (in case AI skips it)
    parsedReport.role = interviewRole;

    // 7️⃣ Store feedback in DB
    const feedback = await Feedback.create({
      interview: interview._id,
      user: req.user._id,
      role: interviewRole, // 👈 store role in feedback collection
      report: parsedReport,
    });

    // 8️⃣ Increment usage counter
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "usage.feedbacksGenerated": 1 },
    });

    // 9️⃣ Respond to client
    res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
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
