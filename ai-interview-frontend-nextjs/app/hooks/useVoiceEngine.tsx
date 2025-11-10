"use client";


import { useCallback, useEffect, useRef, useState } from "react";


export type VoiceEngineOptions = {
language?: string; // e.g., "en-US"
questionAutoListenDelayMs?: number; // start STT this long after question TTS ends
ttsRate?: number;
ttsPitch?: number;
};


export function useVoiceEngine(options?: VoiceEngineOptions) {
const {
language = "en-US",
questionAutoListenDelayMs = 300,
ttsRate = 1,
ttsPitch = 1,
} = options || {};


// ====== STT State ======
const recognitionRef = useRef<SpeechRecognition | null>(null as any);
const isListeningRef = useRef(false);
const [recording, setRecording] = useState(false);
const [interimText, setInterimText] = useState("");
const [finalText, setFinalText] = useState("");
const finalTextRef = useRef("");


// ====== TTS State ======
const speakingRef = useRef(false);
const autoStartTimerRef = useRef<number | null>(null);


// ====== Helpers ======
const cancelSpeaking = useCallback(() => {
if (typeof window !== "undefined" && "speechSynthesis" in window) {
window.speechSynthesis.cancel();
}
speakingRef.current = false;
}, []);


const initRecognition = useCallback(() => {
if (typeof window === "undefined") return null;
const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
if (!SR) return null;
const r: SpeechRecognition = new SR();
r.lang = language;
r.interimResults = true;
r.continuous = false;
return r;
}, [language]);


const setupRecognitionIfNeeded = useCallback(() => {
if (!recognitionRef.current) {
const r = initRecognition();