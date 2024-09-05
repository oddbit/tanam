"use client";
import { TanamSpeechRecognition } from "@tanam/cms/models/TanamSpeechRecognition";
import Peaks from "peaks.js";
import { useEffect, useRef, useState } from "react";

interface VoiceRecorderProps {
  title?: string;
  value: string;
  onChange: (value: string) => void;
  onLoadingChange?: (isRecording: boolean) => void;
  onTranscriptChange?: (transcript: string) => void;
}

/**
 * VoiceRecorder component allows users to record audio, convert it to a base64 string,
 * and automatically performs speech recognition to provide a text transcript of the recorded audio.
 *
 * @param {VoiceRecorderProps} props - The props for the component.
 * @return {JSX.Element} The rendered VoiceRecorder component.
 */
export default function VoiceRecorder(props: VoiceRecorderProps): JSX.Element {
  const {title, value, onChange, onTranscriptChange, onLoadingChange} = props;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | undefined>();
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<TanamSpeechRecognition | undefined>();
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const peaksInstanceRef = useRef<any>(null);

  /**
   * Effect to trigger onChange whenever the value prop changes.
   */
  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value, onChange]);

  /**
   * Effect to trigger onLoadingChange whenever the isRecording prop changes.
   */
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isRecording);
    }
  }, [isRecording, onLoadingChange]);

  /**
   * Effect to trigger initSoundWave whenever the audioUrl changes.
   */
  useEffect(() => {
    if (audioUrl) {
      initSoundWave();
    }

    return () => {
      resetSoundWave();
    };
  }, [audioUrl]);

  /**
   * Effect hook that sets up the SpeechRecognition instance and its event handlers.
   * It handles starting, stopping, and restarting the speech recognition process.
   */
  useEffect(() => {
    const SpeechRecognition = new TanamSpeechRecognition();

    if (SpeechRecognition) {
      recognitionRef.current = SpeechRecognition;
      const recognition = recognitionRef.current;

      if (!recognition) return;

      // Handle the event when speech recognition returns results
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");

        setTranscript(transcript); // Update local state with the transcript

        if (onTranscriptChange) {
          onTranscriptChange(transcript);
        }
      };
    }
  }, [onTranscriptChange, isRecording]);

  /**
   * Starts recording audio using the user"s microphone.
   * It sets up the MediaRecorder, gathers audio data, and pushes it to the audioChunksRef.
   * When recording stops, it converts the audio chunks to a base64 string and passes it to onChange.
   */
  async function handleStartRecording() {
    if (typeof navigator === "undefined" || typeof window === "undefined") return;

    handleReset();
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    streamRef.current = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {type: "audio/wav"});
      const reader = new FileReader();

      reader.onloadend = () => {
        if (!reader.result) return;

        const base64String = reader.result?.toString() || "";
        onChange(base64String);

        // Set audio URL for visualization
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      reader.readAsDataURL(audioBlob);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    recognitionRef.current?.start();
  }

  /**
   * Stops the current audio recording.
   */
  function handleStopRecording() {
    setIsRecording(false);

    if (!mediaRecorderRef.current || !recognitionRef.current || !streamRef.current) return;

    mediaRecorderRef.current.stop();
    recognitionRef.current.stop();
    // Stop all tracks to turn off the microphone
    streamRef.current.getTracks().forEach((track) => track.stop());

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
      });
    }
  }

  /**
   * Resets the recorded audio by clearing the base64 string.
   */
  function handleReset() {
    onChange("");
    setTranscript("");
    setAudioUrl("");
    handleStopRecording();
  }

  /**
   * Loads the audio buffer and initializes Peak.js with the given options.
   */
  function initSoundWave() {
    resetSoundWave();

    // Peak.js options configuration (https://www.npmjs.com/package/peaks.js/v/0.18.1#configuration)
    const options = {
      overview: {
        container: document.getElementById("overviewContainer"),
      },
      mediaElement: document.getElementById("audio"),
      webAudio: {
        audioContext: new AudioContext(),
        audioBuffer: null,
        multiChannel: false,
      },
      height: 200,
      waveformBuilderOptions: {
        scale: 128,
      },
      zoomLevels: [128, 256, 512, 1024, 2048],
      logger: console.error.bind(console),
      emitCueEvents: false,
      segmentStartMarkerColor: "#a0a0a0",
      segmentEndMarkerColor: "#a0a0a0",
      overviewWaveformColor: "rgba(0,0,0,0.2)",
      overviewHighlightColor: "grey",
      overviewHighlightOffset: 11,
      segmentColor: "rgba(255, 161, 39, 1)",
      playheadColor: "rgba(0, 0, 0, 1)",
      playheadTextColor: "#aaa",
      showPlayheadTime: false,
      pointMarkerColor: "#FF0000",
      axisGridlineColor: "#ccc",
      axisLabelColor: "#aaa",
      randomizeSegmentColor: true,
    } as any;

    peaksInstanceRef.current = Peaks.init(options, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
    });
  }

  function resetSoundWave() {
    if (!peaksInstanceRef.current) return;

    peaksInstanceRef.current.destroy();
  }

  return (
    <div className="relative w-full">
      {title && <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>}
      <div className="relative text-center mb-4">
        {isRecording ? (
          <>
            <div className="relative w-full mb-4">
              <button
                onClick={handleStopRecording}
                className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none animate-pulse border"
              >
                <svg className="h-12 w-12 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              </button>
            </div>

            <h3 className="text-lg font-medium">Mic&#39;s Live!</h3>
          </>
        ) : (
          <>
            <div className="relative w-full mb-4">
              <button
                onClick={handleStartRecording}
                className="mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-20 h-20 focus:outline-none"
              >
                <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white">
                  <path
                    fill="currentColor" // Change fill color to the desired color
                    d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                  />
                </svg>
              </button>
            </div>

            <h3 className="text-lg font-medium">{!audioUrl ? "Tap & Speak" : "Tap to Try Again"}</h3>
          </>
        )}
      </div>
      {audioUrl && (
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Your Recording:</h3>
          <div className="waveform-container">
            <div id="overviewContainer" className="w-full h-30"></div>
          </div>
          <audio controls src={audioUrl} id="audio" className="w-full rounded-md shadow-sm"></audio>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      )}
      {transcript && (
        <div className="text-center mt-4">
          <h3 className="text-lg font-medium mb-2">What You Said:</h3>
          <p className="bg-gray-100 p-2 rounded-md border border-gray-300">{transcript}</p>
        </div>
      )}
    </div>
  );
}
