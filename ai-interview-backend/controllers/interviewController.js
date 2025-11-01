import openai from "../utils/openaiClient.js";
import Interview from "../models/Interview.js";

// 🔹 Universal cleaner for any GPT output (removes code blocks, markdown, junk)
function cleanAIResponse(str) {
  if (!str) return "";
  return str
    .replace(/```json/gi, "") // remove ```json
    .replace(/```/g, "") // remove ```
    .replace(/^\s*[\r\n]/gm, "") // remove empty lines
    .replace(/^[^{\[]+/, "") // remove text before JSON starts
    .replace(/[^}\]]+$/, "") // remove text after JSON ends
    .trim();
}

// 🚀 Start Interview
export const startInterview = async (req, res) => {
  const { role } = req.body;

  try {
    const prompt = `
You are an interviewer for the role of ${role}.
Generate exactly 5 technical and 2 behavioral questions.
Return ONLY a pure JSON array in this format:
[
  {"question": "What is Node.js?", "category": "Technical"},
  {"question": "Describe a challenge you faced.", "category": "Behavioral"}
]
Do NOT include markdown, code fences, or extra text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let raw = completion.choices[0].message.content;
    console.log("🔹 RAW GPT OUTPUT:\n", raw);

    // 🧹 Clean GPT response
    let cleaned = cleanAIResponse(raw);
    console.log("✅ CLEANED OUTPUT:\n", cleaned);

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Failed:", err.message);
      return res.status(500).json({
        message: "AI returned invalid JSON format",
        rawResponse: raw,
        cleanedResponse: cleaned,
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      role,
      questions,
    });

    res.json(interview);
  } catch (error) {
    console.error("❌ Start Interview Error:", error.message);
    res.status(500).json({ message: "Failed to start interview" });
  }
};

// 🚀 Evaluate Answer
export const evaluateAnswer = async (req, res) => {
  const { interviewId, question, answer } = req.body;

  try {
    const prompt = `
Evaluate this answer for correctness, depth, and clarity.

Question: ${question}
Answer: ${answer}

Return ONLY valid JSON in this format:
{
  "score": number (1–10),
  "comment": "Short evaluation",
  "suggestions": "How to improve"
}
Do NOT include markdown, code fences, or any text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let raw = completion.choices[0].message.content;
    console.log("🔹 RAW FEEDBACK OUTPUT:\n", raw);

    let cleaned = cleanAIResponse(raw);
    console.log("✅ CLEANED FEEDBACK:\n", cleaned);

    let feedback;
    try {
      feedback = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Failed:", err.message);
      return res.status(500).json({
        message: "AI returned invalid JSON format",
        rawResponse: raw,
        cleanedResponse: cleaned,
      });
    }

    const interview = await Interview.findById(interviewId);
    interview.answers.push({ question, answer, feedback });
    await interview.save();

    res.json({ feedback });
  } catch (error) {
    console.error("❌ Evaluate Answer Error:", error.message);
    res.status(500).json({ message: "Evaluation failed" });
  }
};
