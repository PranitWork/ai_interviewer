// types/react-speech-recognition.d.ts
declare module "react-speech-recognition" {
  export interface UseSpeechRecognitionOptions {
    commands?: Array<{
      command: string | string[];
      callback: (...args: any[]) => void;
      matchInterim?: boolean;
      isFuzzyMatch?: boolean;
      fuzzyMatchingThreshold?: number;
    }>;
  }

  export interface SpeechRecognitionResult {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  }

  export function useSpeechRecognition(
    options?: UseSpeechRecognitionOptions
  ): SpeechRecognitionResult;

  export interface SpeechRecognitionInstance {
    startListening: (options?: {
      continuous?: boolean;
      language?: string;
    }) => void;
    stopListening: () => void;
    abortListening: () => void;
  }

  const SpeechRecognition: SpeechRecognitionInstance;

  export default SpeechRecognition;
}
