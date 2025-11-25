import openai from "../utils/openaiClient.js";
import Interview from "../models/Interview.js";
import User from "../models/User.js";

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
  const { role, details } = req.body;

  try {
    const prompt = `
You are an experienced AI interviewer trained to assess candidates for the role of ${role}. 
Use the following job description as context: ${details}.

Your goal is to generate realistic, challenging, and well-balanced interview questions that reflect real-world expectations for this position. 
Focus on technical depth, problem-solving, and behavioral evaluation relevant to the provided role and job description.

Generate exactly **7 questions**:
- **5 Technical** questions related to the required skills, tools, frameworks, or problem-solving relevant to the role.
- **2 Behavioral** questions focused on communication, adaptability, leadership, teamwork, and conflict resolution.

Output must be a **pure JSON array** in this exact format:
[
  {"question": "Explain how you would optimize system performance under heavy load.", "category": "Technical"},
  {"question": "Tell me about a time when you had to resolve a team conflict.", "category": "Behavioral"}
]

Guidelines:
- Do NOT include markdown, code blocks, or extra commentary.
- Keep questions concise, professional, and realistic.
- Ensure the questions align naturally with the ${role} and ${details}.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let raw = completion.choices[0].message.content;

    // 🧹 Clean GPT response
    let cleaned = cleanAIResponse(raw);

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (err) {
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
      await User.findByIdAndUpdate(req.user._id, {
      $inc: { "usage.interviewsConducted": 1 },
    });


    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: `Failed to start interview${error}` });
  }
};

// 🚀 Evaluate Answer
export const evaluateAnswer = async (req, res) => {
  const { interviewId, question, answer } = req.body;

  try {
    const prompt = `
You are an expert interviewer and professional evaluator trained to assess candidate responses across all job roles and domains.

Evaluate the following answer for **accuracy, depth, clarity, and relevance** to the question context. 
Consider whether the response demonstrates understanding, structured thinking, and appropriate use of examples.

Question: ${question}
Answer: ${answer}

Return ONLY valid JSON in this format:
{
  "score": number (1–10),
  "comment": "Brief, professional evaluation summary highlighting strengths and weaknesses.",
  "suggestions": "Constructive feedback on how the candidate could improve the answer, such as adding more detail, examples, or clarity."
}

Guidelines:
- Be fair and objective.
- Score 1–10, where 10 = exceptional, 5 = average, and 1 = poor.
- Do NOT include markdown, code fences, or extra text.
- Keep comments natural, professional, and globally understandable.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    let raw = completion.choices[0].message.content;

    let cleaned = cleanAIResponse(raw);

    let feedback;
    try {
      feedback = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({
        message: "AI returned invalid JSON format",
        rawResponse: raw,
        cleanedResponse: cleaned,
      });
    }

    const interview = await Interview.findById(interviewId);
    interview.answers.push({ question, answer, feedback });
    await interview.save();

       await User.findByIdAndUpdate(req.user._id, {
      $inc: { "usage.answersEvaluated": 1 },
    });

    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ message: "Evaluation failed" });
  }
};


export const getInterviewById = async (req, res) => {
  const interview = await Interview.findById(req.params.id).populate("user", "name email");
  if (!interview) return res.status(404).json({ message: "Interview not found" });
  res.json(interview);
};

export const getUserInterviews = async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(interviews);
};
