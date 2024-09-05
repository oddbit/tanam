/**
 * Extend the global `window` interface to include custom speech recognition classes.
 * This is useful for environments where `SpeechRecognition` or `webkitSpeechRecognition`
 * are available or need to be assigned to a custom implementation.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition} for
 *      standard SpeechRecognition API documentation.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebkitSpeechRecognition} for
 *      WebkitSpeechRecognition API documentation.
 */
declare global {
  /**
   * The global `window` object, extended with additional properties for speech recognition.
   */
  interface Window {
    /**
     * A reference to the custom `SpeechRecognition` implementation or standard implementation.
     * This can be used to access speech recognition features in browsers that support it.
     *
     * @type {typeof TanamSpeechRecognition}
     * @example
     * // Example usage
     * const recognition = new window.SpeechRecognition();
     * recognition.start();
     */
    SpeechRecognition: typeof TanamSpeechRecognition;

    /**
     * A reference to the Webkit-specific `SpeechRecognition` implementation.
     * This is particularly relevant for browsers that use the `webkit` prefix.
     *
     * @type {typeof TanamSpeechRecognition}
     * @example
     * // Example usage
     * const recognition = new window.webkitSpeechRecognition();
     * recognition.start();
     */
    webkitSpeechRecognition: typeof TanamSpeechRecognition;
  }
}

export interface SpeechRecognition {
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

export interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  item(index: number): SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export class TanamSpeechRecognition implements SpeechRecognition {
  constructor() {
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      throw new Error("SpeechRecognition is not supported in this browser.");
    }

    this.recognition = new SpeechRecognitionConstructor();

    // Bind event handlers
    this.recognition.onstart = this.handleEvent.bind(this, "onstart");
    this.recognition.onend = this.handleEvent.bind(this, "onend");
    this.recognition.onerror = this.handleEvent.bind(this, "onerror");
    this.recognition.onresult = this.handleEvent.bind(this, "onresult");
    this.recognition.onspeechstart = this.handleEvent.bind(this, "onspeechstart");
    this.recognition.onspeechend = this.handleEvent.bind(this, "onspeechend");
    this.recognition.onsoundstart = this.handleEvent.bind(this, "onsoundstart");
    this.recognition.onsoundend = this.handleEvent.bind(this, "onsoundend");
    this.recognition.onaudiostart = this.handleEvent.bind(this, "onaudiostart");
    this.recognition.onaudioend = this.handleEvent.bind(this, "onaudioend");
    this.recognition.onnomatch = this.handleEvent.bind(this, "onnomatch");
  }

  public lang: string = "en-US";
  public interimResults: boolean = false;
  public maxAlternatives: number = 1;
  public continuous: boolean = false;

  public onaudiostart?: (event: Event) => void;
  public onsoundstart?: (event: Event) => void;
  public onspeechstart?: (event: Event) => void;
  public onspeechend?: (event: Event) => void;
  public onsoundend?: (event: Event) => void;
  public onaudioend?: (event: Event) => void;
  public onresult?: (event: SpeechRecognitionEvent) => void;
  public onnomatch?: (event: Event) => void;
  public onerror?: (event: Event) => void;
  public onstart?: (event: Event) => void;
  public onend?: (event: Event) => void;

  private recognition: SpeechRecognition;

  private handleEvent(eventName: keyof SpeechRecognition, event: Event | SpeechRecognitionEvent): void {
    const handler = this[eventName];

    if (typeof handler === "function") {
      handler(event as Event & SpeechRecognitionEvent);
    }
  }

  start(): void {
    this.recognition.start();
  }

  stop(): void {
    this.recognition.stop();
  }

  abort(): void {
    this.recognition.abort();
  }
}
