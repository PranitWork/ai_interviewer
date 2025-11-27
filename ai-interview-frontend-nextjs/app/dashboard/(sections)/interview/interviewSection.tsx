"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { toast } from "react-toastify";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAppDispatch } from "@/app/Store/hook";
import {
  asyncStartInterview,
  asyncEvaluateInterview,
} from "@/app/Store/actions/interviewActions";
import { generateFeedback } from "@/app/Store/actions/feedbackAction";
import FeedbackSection from "../feedbacks/feedbackSection";

/* ---------- Helpers for device & browser ---------- */
const detectDevice = () => {
  if (typeof navigator === "undefined") return "Detecting...";
  const ua = navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS Device";
  if (/Android/i.test(ua)) return "Android Device";
  if (/Mac/i.test(ua)) return "MacOS";
  if (/Win/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";

  return "Unknown Device";
};

const detectBrowser = () => {
  if (typeof navigator === "undefined") return "Detecting...";
  const ua = navigator.userAgent;

  if (/Edg/i.test(ua)) return "Microsoft Edge";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/Firefox/i.test(ua)) return "Firefox";

  return "Unknown Browser";
};

/* ---------- Minimal custom SpeechRecognition hook (no external lib) ---------- */
function useBrowserSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] =
    useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SR) {
      setBrowserSupportsSpeechRecognition(false);
      return;
    }

    setBrowserSupportsSpeechRecognition(true);

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      try {
        let combined = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          combined += event.results[i][0].transcript;
        }
        setTranscript(combined);
      } catch (err) {
        console.error("Speech result error:", err);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event?.error);
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  const startListening = (options?: { continuous?: boolean; language?: string }) => {
    if (!recognitionRef.current) return;
    try {
      if (options?.language) {
        recognitionRef.current.lang = options.language;
      }
      recognitionRef.current.continuous = options?.continuous ?? true;
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      console.error("startListening error:", e);
      setListening(false);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch (e) {
      console.error("stopListening error:", e);
    } finally {
      setListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
    startListening,
    stopListening,
  };
}

export default function InterviewSection() {
  const dispatch = useAppDispatch();

  /* ---------------------- STATE ---------------------- */
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

  const [micBlocked, setMicBlocked] = useState(false);
  const [showMicPermissionPopup, setShowMicPermissionPopup] = useState(true);
  const [compatibility, setCompatibility] = useState({
    mic: false,
    recognition: false,
    synthesis: false,
    device: "Detecting...",
    browser: "Detecting...",
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showSpeechGuidePopup, setShowSpeechGuidePopup] = useState(false);

  /* ---------------------- REFS ---------------------- */
  const draftAnswersRef = useRef<Record<number, string>>({});
  const finalTextRef = useRef("");
  const evaluationInterruptedRef = useRef(false);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  /* ---------------- Custom speech hook ---------------- */
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
    startListening,
    stopListening,
  } = useBrowserSpeechRecognition();

  /* ---------------- Sync transcript with UI ---------------- */
  useEffect(() => {
    setInterimText(transcript);
    setFinalText(transcript);
    finalTextRef.current = transcript;
  }, [transcript]);

  /* ---------- TTS cancel ---------- */
  const cancelSpeaking = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
  }, []);

  /* ---------- Speak Question ---------- */
  const speakQuestion = useCallback(
    (text: string) => {
      if (!text || typeof window === "undefined") return;

      cancelSpeaking();
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = 1;

        u.onstart = () => {
          stopListening();
          setRecording(false);
        };

        u.onend = () => {
          const isMobileUA = /iPhone|iPad|iPod|Android/i.test(
            navigator.userAgent
          );
          if (!isMobileUA) setTimeout(() => toggleMic(), 400);
        };

        window.speechSynthesis.speak(u);
      } catch {
        toast.error("Speech synthesis failed");
      }
    },
    [cancelSpeaking, stopListening] // toggleMic is defined below; closure sees runtime value
  );

  /* ---------- Speak Evaluation ---------- */
  const speakEvaluation = useCallback(
    (text: string) => {
      if (!text || typeof window === "undefined") return;

      cancelSpeaking();
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = 1;

        evaluationInterruptedRef.current = false;

        u.onstart = () => {
          stopListening();
          setRecording(false);
        };

        u.onend = () => {
          if (!evaluationInterruptedRef.current) {
            const nextIndex = questionIndex + 1;
            if (nextIndex < (interviewData?.questions?.length ?? 0)) {
              proceedToNext();
            }
          }
        };

        window.speechSynthesis.speak(u);
      } catch {
        toast.error("Speech output error");
      }
    },
    [cancelSpeaking, questionIndex, interviewData, stopListening]
  );

  /* ---------- Toggle mic ---------- */
  const toggleMic = () => {
    // If browser doesn't support Web Speech, show guide popup instead
    if (!browserSupportsSpeechRecognition) {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
      setShowSpeechGuidePopup(true);
      return;
    }

    // Web Speech API path (desktop Chrome, some Android Chrome)
    if (listening) {
      stopListening();
      setRecording(false);
    } else {
      resetTranscript();
      startListening({ continuous: true, language: "en-US" });
      setRecording(true);
    }
  };

  /* ---------- Evaluate ---------- */
  const handleSubmitAnswer = async () => {
    stopListening();
    setRecording(false);

    const ans = finalTextRef.current || finalText;
    draftAnswersRef.current[questionIndex] = ans;

    if (!ans.trim()) {
      toast.info("Please speak or type your answer.");
      return;
    }

    setEvaluating(true);
    setLoading(true);

    try {
      const q = interviewData.questions[questionIndex].question;
      const res: any = await dispatch(
        asyncEvaluateInterview(interviewData._id, q, ans)
      );

      const fb = res?.data || { feedback: "No feedback available" };
      setQuestionFeedback(fb);

      speakEvaluation(fb?.feedback?.comment || fb?.feedback);
    } catch (err) {
      console.error("Evaluation error:", err);
      toast.error("Evaluation failed");
    } finally {
      setEvaluating(false);
      setLoading(false);
    }
  };

  /* ---------- Next Question ---------- */
  const proceedToNext = useCallback(() => {
    cancelSpeaking();

    const next = questionIndex + 1;
    const total = interviewData?.questions?.length ?? 0;

    if (next < total) {
      finalTextRef.current = "";
      resetTranscript();
      setFinalText("");
      setInterimText("");

      setQuestionIndex(next);
      setQuestionFeedback(null);

      speakQuestion(interviewData.questions[next].question);
    } else {
      toast.success("Interview finished");
    }
  }, [
    cancelSpeaking,
    questionIndex,
    interviewData,
    speakQuestion,
    resetTranscript,
  ]);

  /* ---------- Manual actions ---------- */
  const handleManualNext = () => {
    evaluationInterruptedRef.current = true;
    cancelSpeaking();
    proceedToNext();
  };

  const handleSkipQuestion = () => handleManualNext();

  const handleRepeatQuestion = () => {
    evaluationInterruptedRef.current = true;
    cancelSpeaking();
    speakQuestion(interviewData?.questions?.[questionIndex]?.question);
  };

  /* ---------- Mic Permissions ---------- */
  const requestMic = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicBlocked(true);
        return false;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicBlocked(false);
      return true;
    } catch (err) {
      console.error("getUserMedia error:", err);
      setMicBlocked(true);
      return false;
    }
  };

  /* ---------- START INTERVIEW ---------- */
  const handleStart = async () => {
    if (!role.trim()) return toast.info("Enter role name");

    const ok = await requestMic();
    if (!ok) return toast.error("Microphone access required or blocked.");

    setLoading(true);
    try {
      const response = await dispatch(asyncStartInterview({ role, details }));

      if (response.success) {
        setInterviewData(response.data);
        setStarted(true);
        draftAnswersRef.current = {};

        setTimeout(
          () => speakQuestion(response.data.questions[0].question),
          400
        );
      } else toast.error(response.error || "Failed to start interview");
    } catch (err) {
      console.error("Start interview error:", err);
      toast.error("Unexpected error starting interview");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESET ---------- */
  const handleReset = () => {
    cancelSpeaking();
    stopListening();
    resetTranscript();

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

  /* ---------- Report ---------- */
  const handleGenerateReport = async () => {
    if (!interviewData) return;

    setLoading(true);
    try {
      const res: any = await dispatch(
        generateFeedback({ interviewId: interviewData._id })
      );
      if (res?.success) {
        setShowPopup(false);
        setShowReport(true);
      } else {
        toast.error("Failed to generate report");
      }
    } catch (err) {
      console.error("Report error:", err);
      toast.error("Report failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Device Compatibility check ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const device = detectDevice();
    const browser = detectBrowser();
    const isMobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(isMobileUA);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCompatibility({
        mic: false,
        recognition: browserSupportsSpeechRecognition || isMobileUA,
        synthesis: !!window.speechSynthesis,
        device,
        browser,
      });
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        stream.getTracks().forEach((t) => t.stop());
        setCompatibility({
          mic: true,
          recognition: browserSupportsSpeechRecognition || isMobileUA,
          synthesis: !!window.speechSynthesis,
          device,
          browser,
        });
      })
      .catch((err) => {
        console.error("Mic compatibility error:", err);
        setCompatibility({
          mic: false,
          recognition: browserSupportsSpeechRecognition || isMobileUA,
          synthesis: !!window.speechSynthesis,
          device,
          browser,
        });
      });
  }, [browserSupportsSpeechRecognition]);

  /* =============================== UI FULL CODE =============================== */
  return (
    <ProtectedRoute>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative">
        {/* ============ MIC PERMISSION POPUP ============ */}
        <AnimatePresence>
          {showMicPermissionPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-voxy-surface border border-voxy-border rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative"
              >
                <button
                  onClick={() => setShowMicPermissionPopup(false)}
                  className="absolute top-4 right-4 text-voxy-muted hover:text-voxy-text"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl sm:text-2xl font-bold text-voxy-text mb-2">
                  Get Ready for Your AI Interview 🎤
                </h2>
                <p className="text-sm text-voxy-muted mb-5">
                  We’ll quickly check your device, browser, and microphone so your
                  voice interview runs smoothly.
                </p>

                <div className="bg-voxy-surface/70 border border-voxy-border rounded-xl p-4 text-left text-sm space-y-2">
                  <p>
                    <span className="font-semibold text-voxy-text">Device:</span>{" "}
                    {compatibility.device}
                  </p>
                  <p>
                    <span className="font-semibold text-voxy-text">Browser:</span>{" "}
                    {compatibility.browser}
                  </p>
                  <p>
                    <span className="font-semibold text-voxy-text">Microphone:</span>{" "}
                    {compatibility.mic ? (
                      <span className="text-green-400 font-semibold">
                        ✔ Enabled
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold">
                        ✘ Blocked / Not Accessible
                      </span>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold text-voxy-text">
                      Speech Recognition:
                    </span>{" "}
                    {compatibility.recognition ? (
                      <span className="text-green-400 font-semibold">
                        ✔ Available
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold">
                        ✘ Limited / Not Supported
                      </span>
                    )}
                  </p>
                  <p>
                    <span className="font-semibold text-voxy-text">
                      Voice Output:
                    </span>{" "}
                    {compatibility.synthesis ? (
                      <span className="text-green-400 font-semibold">
                        ✔ Supported
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold">
                        ✘ Not Supported
                      </span>
                    )}
                  </p>
                </div>

                {!compatibility.recognition && (
                  <p className="text-xs text-red-400 mt-3">
                    ⚠ Speech recognition is limited on this device. You can always
                    type your answers or use your keyboard&apos;s mic if available.
                  </p>
                )}

                <div className="flex gap-3 justify-center mt-6 flex-wrap">
                  {!compatibility.mic && (
                    <button
                      onClick={requestMic}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text text-sm font-semibold"
                    >
                      Enable Microphone
                    </button>
                  )}

                  <button
                    onClick={() => setShowMicPermissionPopup(false)}
                    className="px-6 py-3 rounded-lg border border-voxy-border text-voxy-muted text-sm font-semibold"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============ SPEECH GUIDE POPUP (WHEN NO WEB SPEECH) ============ */}
        <AnimatePresence>
          {showSpeechGuidePopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-voxy-surface border border-voxy-border rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative"
              >
                <button
                  onClick={() => setShowSpeechGuidePopup(false)}
                  className="absolute top-4 right-4 text-voxy-muted hover:text-voxy-text"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl sm:text-2xl font-bold text-voxy-text mb-2">
                  Use Voice Input on Your Device 🎙️
                </h2>

                <p className="text-sm text-voxy-muted mb-5">
                  This browser doesn&apos;t support automatic speech recognition, but
                  you can still answer using your keyboard&apos;s microphone.
                </p>

                <div className="bg-voxy-surface/70 border border-voxy-border rounded-xl p-4 text-left text-sm space-y-2">
                  <p className="font-semibold text-voxy-text mb-1">
                    How to record your answer:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-voxy-muted">
                    <li>Tap inside the &quot;Your Response&quot; box.</li>
                    <li>Your keyboard will open.</li>
                    <li>
                      Tap the <span className="font-semibold">🎤 microphone</span> icon{" "}
                      on your keyboard.
                    </li>
                    <li>Speak your answer clearly.</li>
                    <li>
                      When text appears, review it and click{" "}
                      <span className="font-semibold">Submit Answer</span>.
                    </li>
                  </ol>
                </div>

                <p className="text-[11px] text-voxy-muted mt-3">
                  Tip: Most Android &amp; iOS keyboards (like Gboard, Apple Keyboard)
                  have a built-in mic icon for voice typing.
                </p>

                <div className="flex gap-3 justify-center mt-6 flex-wrap">
                  <button
                    onClick={() => setShowSpeechGuidePopup(false)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text text-sm font-semibold"
                  >
                    OK, I Understand
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================== INTERVIEW OR SETUP SCREEN =================== */}
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full max-w-lg bg-voxy-surface/80 border border-voxy-border rounded-2xl shadow-xl p-6 sm:p-8 text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-voxy-text">
                AI Voice Interview 🎤
              </h2>
              <p className="text-voxy-muted text-sm mb-6">
                Describe your target role & job description to get tailored questions.
              </p>

              {/* Role input */}
              <div className="mb-4 text-left">
                <label className="text-sm text-voxy-muted mb-2 block">
                  Target Role
                </label>
                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-voxy-muted"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-voxy-surface border border-voxy-border rounded-lg text-voxy-text text-sm outline-none focus:border-voxy-primary"
                  />
                </div>
              </div>

              {/* Details input */}
              <div className="mb-6 text-left">
                <label className="text-sm text-voxy-muted mb-2 block">
                  Job Description / Focus Areas
                </label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tech stack, experience level, domain, etc."
                  className="w-full px-3 py-3 bg-voxy-surface border border-voxy-border rounded-lg text-voxy-text text-sm outline-none focus:border-voxy-primary resize-none"
                />
                <p className="text-xs text-voxy-muted mt-1">
                  The more information you provide, the smarter the questions.
                </p>
              </div>

              {/* Start button */}
              <motion.button
                whileHover={!loading && role.trim() ? { scale: 1.03 } : {}}
                onClick={handleStart}
                disabled={!role.trim() || loading}
                className={`w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 ${
                  !role.trim() || loading
                    ? "bg-voxy-border text-voxy-muted cursor-not-allowed"
                    : "bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Preparing
                    interview...
                  </>
                ) : (
                  <>
                    Start Interview <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              <p className="text-[11px] text-voxy-muted mt-3">
                Ensure your microphone works.
              </p>
            </motion.div>
          ) : (
            /* =================== INTERVIEW SCREEN =================== */
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full max-w-3xl text-center"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-voxy-text">
                    AI Interview Session
                  </h2>
                  <p className="text-voxy-muted text-sm">
                    Question {questionIndex + 1} /{" "}
                    {interviewData?.questions?.length}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleRepeatQuestion}
                    className="p-2 rounded-md border border-voxy-border text-voxy-muted text-sm flex items-center gap-1"
                  >
                    <RotateCcw size={16} /> Repeat
                  </button>

                  <button
                    onClick={handleSkipQuestion}
                    className="p-2 rounded-md border border-voxy-border text-voxy-muted text-sm flex items-center gap-1"
                  >
                    <SkipForward size={16} /> Skip
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-2 rounded-md border border-voxy-border text-voxy-muted text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* ================== QUESTION BOX ================== */}
              <div className="bg-voxy-surface/70 border border-voxy-border rounded-xl p-4 sm:p-6 mb-6 text-left shadow-lg">
                <div className="flex gap-3 items-start">
                  <Brain size={22} className="text-voxy-primary mt-1" />
                  <p className="text-sm sm:text-base text-voxy-text leading-relaxed">
                    {interviewData?.questions?.[questionIndex]?.question}
                  </p>
                </div>
              </div>

              {/* ================== MIC BUTTON ================== */}
              <div className="mb-4 cursor-pointer" onClick={toggleMic}>
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center shadow-lg transition ${
                    listening
                      ? "bg-gradient-to-br from-voxy-accent to-voxy-secondary animate-pulse"
                      : "bg-gradient-to-br from-voxy-primary to-voxy-secondary"
                  }`}
                >
                  <Mic size={36} className="text-voxy-text" />
                </div>
                <p className="text-voxy-muted text-sm mt-2">
                  {listening
                    ? "Listening... tap to stop"
                    : "Tap the mic to start speaking"}
                </p>

                {!browserSupportsSpeechRecognition && !isMobile && (
                  <p className="text-[11px] text-red-400 mt-1">
                    Speech recognition not supported. Type or use keyboard mic.
                  </p>
                )}
              </div>

              {/* ================== USER RESPONSE AREA ================== */}
              <div className="w-full max-w-2xl mx-auto text-left mb-6">
                <h3 className="text-sm text-voxy-muted font-semibold mb-2">
                  Your Response
                </h3>

                <div className="p-4 bg-voxy-surface/60 border border-voxy-border rounded-lg text-sm text-voxy-text min-h-[120px]">
                  {finalText || interimText ? (
                    <textarea
                      id="voxy-answer-textarea"
                      ref={textAreaRef}
                      value={finalText}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFinalText(v);
                        finalTextRef.current = v;
                        draftAnswersRef.current[questionIndex] = v;
                      }}
                      rows={6}
                      className="w-full bg-transparent resize-none outline-none text-voxy-text"
                    />
                  ) : (
                    <textarea
                      id="voxy-answer-textarea"
                      ref={textAreaRef}
                      value={finalText}
                      onChange={(e) => {
                        const v = e.target.value;
                        setFinalText(v);
                        finalTextRef.current = v;
                        draftAnswersRef.current[questionIndex] = v;
                      }}
                      rows={6}
                      placeholder="Your speech or text will appear here..."
                      className="w-full bg-transparent resize-none outline-none text-voxy-text italic"
                    />
                  )}
                </div>

                {/* ================= ACTION BUTTONS ================= */}
                <div className="flex gap-3 flex-wrap mt-4">
                  <motion.button
                    whileHover={
                      !loading && !evaluating && (finalText || interimText)
                        ? { scale: 1.03 }
                        : {}
                    }
                    onClick={handleSubmitAnswer}
                    disabled={
                      loading || evaluating || (!finalText && !interimText)
                    }
                    className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm ${
                      loading ||
                      evaluating ||
                      (!finalText && !interimText)
                        ? "bg-voxy-border text-voxy-muted cursor-not-allowed"
                        : "bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text"
                    }`}
                  >
                    {loading || evaluating ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> Evaluating...
                      </>
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
                    className="px-4 py-2 rounded-lg border border-voxy-border text-voxy-muted text-sm"
                  >
                    Save Draft
                  </button>

                  <button
                    onClick={() => {
                      setFinalText("");
                      finalTextRef.current = "";
                      draftAnswersRef.current[questionIndex] = "";
                    }}
                    className="px-4 py-2 rounded-lg border border-voxy-border text-voxy-muted text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* ================= EVALUATION RESULTS ================= */}
              {questionFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-2 w-full max-w-2xl mx-auto border border-voxy-border rounded-xl p-4 sm:p-6 bg-voxy-surface/70 text-left"
                >
                  <h3 className="text-lg font-semibold flex gap-2 items-center text-voxy-text mb-2">
                    <Sparkles size={20} className="text-voxy-primary" />
                    AI Evaluation
                  </h3>

                  <p className="text-sm text-voxy-muted leading-relaxed">
                    {questionFeedback?.feedback?.comment ||
                      questionFeedback?.feedback ||
                      "Good attempt!"}
                  </p>

                  <div className="mt-4 flex gap-3 flex-wrap">
                    {questionIndex <
                    (interviewData?.questions?.length ?? 0) - 1 ? (
                      <button
                        onClick={handleManualNext}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text text-sm"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          evaluationInterruptedRef.current = true;
                          setShowPopup(true);
                          cancelSpeaking();
                        }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text text-sm"
                      >
                        Finish Interview
                      </button>
                    )}

                    <button
                      onClick={() => {
                        evaluationInterruptedRef.current = true;
                        cancelSpeaking();
                        setQuestionFeedback(null);
                      }}
                      className="px-4 py-2 rounded-lg border border-voxy-border text-voxy-muted text-sm"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================== INTERVIEW COMPLETE POPUP =================== */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-voxy-bg/70 flex items-center justify-center z-50 backdrop-blur-md px-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-voxy-surface/90 border border-voxy-border rounded-2xl shadow-2xl p-8 sm:p-10 text-center w-full max-w-md relative"
              >
                <CheckCircle2
                  className="text-voxy-primary mx-auto mb-4"
                  size={48}
                />

                <h3 className="text-xl sm:text-2xl font-bold text-voxy-text">
                  Interview Completed!
                </h3>

                <p className="text-voxy-muted mb-8 text-sm">
                  View your detailed feedback report to understand your strengths &
                  improvement areas.
                </p>

                <div className="flex gap-4 flex-wrap justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleGenerateReport}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text text-sm font-semibold"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "View Report"
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg border border-voxy-border text-voxy-muted text-sm font-semibold"
                  >
                    Back
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =================== REPORT VIEW =================== */}
        <AnimatePresence>
          {showReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-voxy-bg/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.97, opacity: 0 }}
                className="relative bg-voxy-surface/95 border border-voxy-border rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => {
                    setShowReport(false);
                    handleReset();
                  }}
                  className="absolute top-4 right-4 text-voxy-muted hover:text-voxy-text"
                >
                  <X size={22} />
                </button>

                <FeedbackSection />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
