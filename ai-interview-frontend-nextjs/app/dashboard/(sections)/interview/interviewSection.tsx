"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Brain,
  Briefcase,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Sparkles,
  RotateCcw,
  SkipForward,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  asyncStartInterview,
  asyncEvaluateInterview,
 
} from "@/app/Store/actions/interviewActions";
import { generateFeedback } from "@/app/Store/actions/feedbackAction";
import FeedbackSection from "../feedbacks/feedbackSection";
import { toast } from "react-toastify";

export default function InterviewSection() {
  const dispatch = useDispatch<any>();

  const [started, setStarted] = useState(false);
  const [role, setRole] = useState("");
  const [details, setDetails] = useState("");
  const [interviewData, setInterviewData] = useState<any | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [recording, setRecording] = useState(false);

  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const [questionFeedback, setQuestionFeedback] = useState<any | null>(null);

  const draftAnswersRef = useRef<Record<number, string>>({});

  const recognitionRef = useRef<any | null>(null);
  const isListeningRef = useRef(false);
  const mountedRef = useRef(true);
  const autoStartTimerRef = useRef<number | null>(null);
  const finalTextRef = useRef("");

  const cancelSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
  }, []);

  const speakQuestion = useCallback(
    (text: string) => {
      if (!text || typeof window === "undefined") return;
      cancelSpeaking();
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = 1;
        u.pitch = 1;
        u.onstart = () => {
          if (recognitionRef.current && isListeningRef.current) stopRecognition();
        };
        u.onend = () => {
          if (autoStartTimerRef.current) window.clearTimeout(autoStartTimerRef.current);
          autoStartTimerRef.current = window.setTimeout(() => {
            if (mountedRef.current) startRecognition();
          }, 300);
        };
        window.speechSynthesis.speak(u);
      } catch (err) {
        console.warn("speakQuestion error:", err);
      }
    },
    [cancelSpeaking]
  );

  const initRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    return r;
  }, []);

  const setupRecognitionIfNeeded = useCallback(() => {
    if (!recognitionRef.current) {
      const r = initRecognition();
      if (!r) return false;
      recognitionRef.current = r;

      recognitionRef.current.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            const t = res[0].transcript.trim();
            finalTextRef.current = (finalTextRef.current ? finalTextRef.current + " " : "") + t;
          } else interim += res[0].transcript;
        }
        setInterimText(interim);
        setFinalText(finalTextRef.current);
      };

      recognitionRef.current.onend = () => {
        isListeningRef.current = false;
        setRecording(false);
      };

      recognitionRef.current.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        isListeningRef.current = false;
        setRecording(false);
      };
    }
    return true;
  }, [initRecognition]);

  const startRecognition = useCallback(() => {
    if (!setupRecognitionIfNeeded()) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    if (isListeningRef.current) return;
    try {
      finalTextRef.current = "";
      setInterimText("");
      setFinalText("");
      recognitionRef.current.start();
      isListeningRef.current = true;
      setRecording(true);
    } catch (err) {
      console.warn("Recognition start error:", err);
    }
  }, [setupRecognitionIfNeeded]);

  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {}
    isListeningRef.current = false;
    setRecording(false);
  }, []);

  const toggleMic = useCallback(() => {
    if (isListeningRef.current) stopRecognition();
    else startRecognition();
  }, [startRecognition, stopRecognition]);

  const evaluateAndShow = useCallback(
    async (providedAnswer?: string | undefined, skip = false) => {
      if (!interviewData) return;
      if (evaluating) return;

      setEvaluating(true);
      setLoading(true);

      const answer = (providedAnswer ?? finalTextRef.current ?? "").trim();
      const question = interviewData.questions[questionIndex].question;

      try {
        const res: any = await dispatch(
          asyncEvaluateInterview(interviewData._id, question, skip ? "" : answer)
        );

        if (res?.success && res?.data) {
          setQuestionFeedback(res.data);
        } else if (res?.data) {
          setQuestionFeedback(res.data);
        } else {
          setQuestionFeedback({ feedback: "No feedback returned." });
        }
      } catch (e) {
        console.error("Evaluation error:", e);
        setQuestionFeedback({ feedback: "Evaluation failed. Try again." });
      } finally {
        setEvaluating(false);
        setLoading(false);
      }
    },
    [dispatch, evaluating, interviewData, questionIndex]
  );

  const handleSubmitAnswer = async () => {
    if (isListeningRef.current) stopRecognition();
    await new Promise((r) => setTimeout(r, 250));
    draftAnswersRef.current[questionIndex] = finalTextRef.current || finalText;
    await evaluateAndShow(finalTextRef.current || finalText);
  };

 const handleSkipQuestion = async () => {
  if (isListeningRef.current) stopRecognition();

  // Just skip the question directly — no evaluation
  const nextIndex = questionIndex + 1;
  if (nextIndex < (interviewData?.questions?.length ?? 0)) {
    setQuestionIndex(nextIndex);
    const draft = draftAnswersRef.current[nextIndex] || "";
    finalTextRef.current = draft;
    setFinalText(draft);
    setInterimText("");
    setQuestionFeedback(null);
    speakQuestion(interviewData.questions[nextIndex].question);
  } else {
    setShowPopup(true);
  }
};


  const handleRepeatQuestion = () => {
    const q = interviewData?.questions?.[questionIndex]?.question;
    if (q) speakQuestion(q);
  };

  const handleStart = async () => {
    if (!role.trim()) return;
    setLoading(true);
    try {
      const { success, data, error } = await dispatch(asyncStartInterview({ role, details }));
      if (success && data) {
        setInterviewData(data);
        setStarted(true);
        draftAnswersRef.current = {};
        setTimeout(() => speakQuestion(data.questions[0].question), 400);
      } else {
        console.error("Start interview failed:", error);
        toast.error("Failed to start interview. Try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Unexpected error while starting interview.");
    } finally {
      setLoading(false);
    }
  };

  const proceedToNext = useCallback(() => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < (interviewData?.questions?.length ?? 0)) {
      setQuestionIndex(nextIndex);
      const draft = draftAnswersRef.current[nextIndex] || "";
      finalTextRef.current = draft;
      setFinalText(draft);
      setInterimText("");
      setQuestionFeedback(null);
      speakQuestion(interviewData.questions[nextIndex].question);
    } else {
      setShowPopup(true);
    }
  }, [questionIndex, interviewData, speakQuestion]);

  const handleReset = () => {
    stopRecognition();
    cancelSpeaking();
    setStarted(false);
    setInterviewData(null);
    setShowPopup(false);
    setShowReport(false);
    setRole("");
    setDetails("");
    setQuestionIndex(0);
    setFinalText("");
    setInterimText("");
    finalTextRef.current = "";
    draftAnswersRef.current = {};
    setQuestionFeedback(null);
  };

  const handleGenerateReport = async () => {
    if (!interviewData) return;
    setLoading(true);
    try {
     const res: any = await dispatch(generateFeedback({ interviewId: interviewData._id }));
      if (res?.success) {
        setShowPopup(false);
        setShowReport(true);
      } else {
        console.error("Generate report failed:", res);
        const msg = res?.error || (res?.data?.message ?? "Failed to generate report. Try again.");
        toast.error(msg);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error generating report. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (autoStartTimerRef.current) window.clearTimeout(autoStartTimerRef.current);
      stopRecognition();
      cancelSpeaking();
    };
  }, [stopRecognition, cancelSpeaking]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-voxy-surface/80 border border-voxy-border rounded-2xl shadow-xl p-8 text-center backdrop-blur-md"
          >
            <h2 className="text-3xl font-bold mb-2">AI Voice Interview 🎤</h2>
            <p className="text-voxy-muted text-sm mb-6">
              Describe the role and details before starting your interview.
            </p>

            <div className="mb-4 text-left">
              <label className="block text-sm font-medium mb-2 text-voxy-muted">
                Target Role / Position
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-voxy-muted" size={18} />
                <input
                  type="text"
                  placeholder="e.g. MERN Full Stack Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-voxy-surface border border-voxy-border text-white placeholder-voxy-muted focus:ring-2 focus:ring-voxy-primary/70 transition"
                />
              </div>
            </div>

            <div className="mb-6 text-left">
              <label className="block text-sm font-medium mb-2 text-voxy-muted">
                Job Description / Focus
              </label>
              <textarea
                rows={4}
                placeholder="Describe specific skills or focus areas..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-3 rounded-lg bg-voxy-surface border border-voxy-border text-white placeholder-voxy-muted focus:ring-2 focus:ring-voxy-primary/70 transition resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleStart}
              disabled={!role.trim() || loading}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                loading
                  ? "bg-voxy-border text-gray-400"
                  : "bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin inline mr-2" />
              ) : (
                <>
                  Start Interview <ArrowRight className="inline ml-2" size={18} />
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl text-center"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">AI Interview Session</h2>
                <p className="text-voxy-muted text-sm">
                  Question {questionIndex + 1} of {interviewData?.questions?.length}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  title="Repeat question"
                  onClick={handleRepeatQuestion}
                  className="p-2 rounded-md border border-voxy-border"
                >
                  <RotateCcw />
                </button>
                <button
                  title="Skip question"
                  onClick={handleSkipQuestion}
                  className="p-2 rounded-md border border-voxy-border"
                >
                  <SkipForward />
                </button>
                <button
                  title="Reset interview"
                  onClick={handleReset}
                  className="p-2 rounded-md border border-voxy-border"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-voxy-surface/70 border border-voxy-border rounded-xl p-6 mb-6 text-left shadow-lg">
              <div className="flex items-start gap-3">
                <Brain className="text-voxy-primary mt-1" size={22} />
                <p className="text-sm text-voxy-muted leading-relaxed">
                  {interviewData?.questions?.[questionIndex]?.question}
                </p>
              </div>
            </div>

            <div className="mb-4 cursor-pointer" onClick={toggleMic}>
              <div
                className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg transition ${
                  recording
                    ? "bg-gradient-to-br from-red-500 to-voxy-secondary animate-pulse"
                    : "bg-gradient-to-br from-voxy-primary to-voxy-secondary"
                }`}
              >
                <Mic size={36} className="text-white" />
              </div>
              <p className="text-voxy-muted text-sm mt-2">
                {recording ? "Listening... Click to stop" : "Click to start speaking"}
              </p>
            </div>

            <div className="w-full max-w-2xl mx-auto text-left mb-6">
              <h3 className="text-sm mb-2 text-voxy-muted font-semibold">Your Response</h3>

              <div className="p-4 rounded-lg border border-voxy-border bg-voxy-surface/60 text-sm text-white min-h-[120px]">
                {finalText || interimText ? (
                  <textarea
                    value={finalText}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFinalText(v);
                      finalTextRef.current = v;
                      draftAnswersRef.current[questionIndex] = v;
                    }}
                    rows={6}
                    className="w-full bg-transparent resize-none outline-none text-white"
                  />
                ) : (
                  <div className="text-voxy-muted italic">Your speech will appear here...</div>
                )}
              </div>

              <div className="flex gap-3 items-center mt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={handleSubmitAnswer}
                  disabled={loading || evaluating || (!finalText && !interimText)}
                  className={`px-4 py-2 rounded-lg font-semibold text-white flex items-center gap-2 ${
                    loading || evaluating
                      ? "bg-voxy-border text-gray-400"
                      : "bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90"
                  }`}
                >
                  {(loading || evaluating) ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Submit Answer <MessageSquare size={18} />
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => {
                    const v = interimText || finalTextRef.current || "";
                    setFinalText(v);
                    finalTextRef.current = v;
                    draftAnswersRef.current[questionIndex] = v;
                  }}
                  className="px-4 py-2 rounded-lg border border-voxy-border text-voxy-muted"
                >
                  Save Draft
                </button>

                <button
                  onClick={() => {
                    setFinalText("");
                    finalTextRef.current = "";
                    draftAnswersRef.current[questionIndex] = "";
                  }}
                  className="px-4 py-2 rounded-lg border border-voxy-border text-voxy-muted"
                >
                  Clear
                </button>
              </div>
            </div>

            {questionFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-2 w-full max-w-2xl mx-auto border border-voxy-border rounded-xl p-6 bg-voxy-surface/70 text-left"
              >
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="text-voxy-primary" size={20} />
                  AI Evaluation
                </h3>

                {typeof questionFeedback.feedback === "string" ? (
                  <p className="text-sm text-voxy-muted leading-relaxed">
                    {questionFeedback.feedback}
                  </p>
                ) : questionFeedback.feedback && typeof questionFeedback.feedback === "object" ? (
                  <div className="space-y-3 text-sm text-voxy-muted leading-relaxed">
                    {questionFeedback.feedback.comment && (
                      <p>{questionFeedback.feedback.comment}</p>
                    )}

                    {typeof questionFeedback.feedback.score !== "undefined" && (
                      <p>
                        <strong>Score:</strong> {questionFeedback.feedback.score}
                      </p>
                    )}

                    {Array.isArray(questionFeedback.feedback.suggestions) &&
                      questionFeedback.feedback.suggestions.length > 0 && (
                        <div>
                          <strong>Suggestions:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {questionFeedback.feedback.suggestions.map((s: string, i: number) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <p className="text-sm text-voxy-muted leading-relaxed">
                    Good attempt, let's continue!
                  </p>
                )}

                <div className="mt-4 flex gap-3">
                  {questionIndex < (interviewData?.questions?.length ?? 0) - 1 ? (
                    <button
                      onClick={() => {
                        proceedToNext();
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-voxy-primary to-voxy-secondary text-white"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuestionFeedback(null);
                        setShowPopup(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-voxy-primary to-voxy-secondary text-white"
                    >
                      Finish Interview
                    </button>
                  )}

                  <button
                    onClick={() => setQuestionFeedback(null)}
                    className="px-4 py-2 rounded-lg border border-voxy-border text-voxy-muted"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-voxy-surface/90 border border-voxy-border rounded-2xl shadow-2xl p-10 text-center max-w-md relative">
              <CheckCircle2 className="text-green-400 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-2">Interview Completed!</h3>
              <p className="text-voxy-muted mb-8 text-sm">
                Congratulations! Your AI-generated feedback report is ready.
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleGenerateReport}
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 transition"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "View Report"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleReset}
                  className="px-6 py-3 rounded-lg font-semibold text-voxy-muted border border-voxy-border hover:text-white transition"
                >
                  Back to Dashboard
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6 overflow-y-auto "
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative bg-voxy-surface/95 border border-voxy-border rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto "
            >
              <button
                onClick={() => setShowReport(false)}
                className="absolute top-4 right-4 text-voxy-muted hover:text-white transition"
              >
                <X size={22} />
              </button>
              <FeedbackSection />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
