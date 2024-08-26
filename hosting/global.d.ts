interface SpeechRecognition {
  start(): void;
  stop(): void;
  abort(): void;
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onaudiostart?: (event: Event) => void;
  onsoundstart?: (event: Event) => void;
  onspeechstart?: (event: Event) => void;
  onspeechend?: (event: Event) => void;
  onsoundend?: (event: Event) => void;
  onaudioend?: (event: Event) => void;
  onresult?: (event: SpeechRecognitionEvent) => void;
  onnomatch?: (event: Event) => void;
  onerror?: (event: Event) => void;
  onstart?: (event: Event) => void;
  onend?: (event: Event) => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}
