"use client";
import { useEffect, useState, useRef } from "react";
import axiosClient from "@/utils/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProtectedRoute from "../protected/ProtectedRoute";

export default function InterviewPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [role, setRole] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const router = useRouter();

  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    const id = localStorage.getItem("interviewId");
    const storedQuestions = JSON.parse(localStorage.getItem("questions") || "[]");
    const storedRole = localStorage.getItem("role");
    if (!id || !storedQuestions.length) router.push("/dashboard");
    else {
      setInterviewId(id);
      setQuestions(storedQuestions);
      setRole(storedRole || "");
      speak(`Let's start your interview for ${storedRole}.`);
      setTimeout(() => speak(storedQuestions[0].question), 1800);
    }
  }, []);

  // ---------------- SPEECH ----------------
  const speak = (text, callback) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    setSpeaking(true);
    utter.onend = () => {
      setSpeaking(false);
      if (callback) callback();
    };
    synth.speak(utter);
  };

  // ---------------- VOICE INPUT ----------------
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal)
          finalTranscript += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      setAnswer(finalTranscript + interim);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  };

  // ---------------- SUBMIT ANSWER ----------------
  const submitAnswer = async () => {
    if (!answer.trim()) return speak("Please answer first.");
    setLoading(true);
    try {
      const res = await axiosClient.post("/interview/evaluate", {
        interviewId,
        question: questions[current].question,
        answer,
      });

      const feedback = res.data.feedback?.comment || "No feedback available.";
      speak(`Feedback: ${feedback}`, () => {
        // Move to next only after speaking feedback
        if (current + 1 < questions.length) {
          setCurrent((prev) => prev + 1);
          setAnswer("");
          setTimeout(() => speak(questions[current + 1].question), 1500);
        } else {
          speak("Interview complete! Well done.", () =>
            setTimeout(() => router.push("/result"), 4000)
          );
        }
      });
    } catch (err) {
      alert("Error submitting answer.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <ProtectedRoute>
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-[90%] max-w-lg text-center border border-indigo-100"
      >
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">
          🎧 AI Interview – {role}
        </h1>

        {questions.length ? (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((current + 1) / questions.length) * 100}%` }}
              />
            </div>

            <p className="text-lg font-semibold text-gray-800 mb-2">
              {questions[current]?.question}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Question {current + 1} of {questions.length}
            </p>

            {/* Voice Controls */}
            <div className="flex gap-4 justify-center mb-4">
              {!listening ? (
                <button
                  onClick={startListening}
                  disabled={speaking || loading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition disabled:opacity-50"
                >
                  🎙️ Start Listening
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition"
                >
                  🛑 Stop
                </button>
              )}
            </div>

            {/* Answer Section */}
            {answer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-100 text-gray-800 p-4 rounded-xl shadow-inner mb-4 text-left"
              >
                <span className="font-semibold">🗣️ Your Answer: </span>
                {answer}
              </motion.div>
            )}

            {/* Submit Button */}
            {answer && (
              <button
                onClick={submitAnswer}
                disabled={loading || speaking}
                className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition disabled:opacity-50"
              >
                {loading
                  ? "Evaluating..."
                  : speaking
                  ? "Speaking feedback..."
                  : "Submit Answer"}
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500">Loading questions...</p>
        )}
      </motion.div>
    </main>
    </ProtectedRoute>
  );
}
