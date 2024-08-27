import {useEffect, useRef, useState} from "react";

export interface VoiceRecorderProps {
  title?: string;
  value: string;
  onChange: (value: string) => void;
  onTranscriptChange?: (transcript: string) => void;
}

/**
 * VoiceRecorder component allows users to record audio, convert it to a base64 string,
 * and automatically performs speech recognition to provide a text transcript of the recorded audio.
 *
 * @param {VoiceRecorderProps} props - The props for the component.
 * @return {JSX.Element} The rendered VoiceRecorder component.
 */
export function VoiceRecorder(props: VoiceRecorderProps): JSX.Element {
  const {title, value, onChange, onTranscriptChange} = props;

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [amplitudeArray, setAmplitudeArray] = useState<number[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | undefined>();
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | undefined>();
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Effect to trigger onChange whenever the value prop changes.
   */
  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value, onChange]);

  /**
   * Effect hook that sets up the SpeechRecognition instance and its event handlers.
   * It handles starting, stopping, and restarting the speech recognition process.
   */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    console.info("SpeechRecognition :: ", SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      if (!recognition) return;

      console.info("recognition before :: ", recognition);

      // recognition.lang = "en-US"; // Set language for speech recognition
      recognition.interimResults = false; // Only return final results
      recognition.continuous = true;

      console.info("recognition after :: ", recognition);

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

    console.info("isRecording :: ", isRecording);
  }, [onTranscriptChange, isRecording]);

  /**
   * Starts recording audio using the user's microphone.
   * It sets up the MediaRecorder, gathers audio data, and pushes it to the audioChunksRef.
   * When recording stops, it converts the audio chunks to a base64 string and passes it to onChange.
   */
  async function handleStartRecording() {
    handleReset();
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    streamRef.current = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {type: "audio/wav"});
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!reader.result) return;

        console.info("reader result :: ", reader.result);

        const base64String = reader.result?.toString().split(",")[1] || "";
        console.info("base64String :: ", base64String);
        onChange(base64String);
      };
      reader.readAsDataURL(audioBlob);
      audioChunksRef.current = [];

      // Clear amplitude data when recording stops
      setAmplitudeArray([]);
    };

    mediaRecorderRef.current.start();
    recognitionRef.current?.start();

    visualizeAmplitude();
  }

  /**
   * Stops the current audio recording.
   */
  function handleStopRecording() {
    setIsRecording(false);
    setAmplitudeArray([]);

    if (!mediaRecorderRef.current || !recognitionRef.current || !streamRef.current) return;

    console.info("handleStopRecording");

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
    handleStopRecording();
  }

  function drawAmplitude(data: Uint8Array) {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!data || !analyser || !canvas) return;

    analyser.getByteTimeDomainData(data);

    console.info("drawAmplitude canvas :: ", canvas);
    console.info("drawAmplitude :: ", data);

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 2;
    context.strokeStyle = "green";

    context.beginPath();

    const sliceWidth = canvas.width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }

      x += sliceWidth;

      console.info("drawAmplitude loop :: ", x);
    }

    context.lineTo(canvas.width, canvas.height / 2);
    context.stroke();
  }

  /**
   * Visualizes the amplitude of the audio input in real-time.
   */
  function visualizeAmplitude() {
    const analyser = analyserRef.current;

    if (!analyser) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    console.info("visualizeAmplitude bufferLength :: ", bufferLength);
    console.info("visualizeAmplitude :: ", dataArray);

    const renderFrame = () => {
      drawAmplitude(dataArray);

      if (isRecording) {
        requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();
  }

  return (
    <div className="relative w-full">
      {title && <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>}
      <div className="flex justify-center mb-4">
        {isRecording ? (
          <button
            onClick={handleStopRecording}
            className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none animate-pulse border"
          >
            <svg className="h-12 w-12 " viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>
        ) : (
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
        )}
      </div>
      <canvas ref={canvasRef} id="soundWave" className="w-full mb-4 border rounded-md" height={100} />
      {value && (
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Your Recording:</h3>
          <audio controls src={`data:audio/wav;base64,${value}`} className="w-full rounded-md shadow-sm"></audio>
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
          <h3 className="text-lg font-medium mb-2">Transcript:</h3>
          <p className="bg-gray-100 p-2 rounded-md border border-gray-300">{transcript}</p>
        </div>
      )}
    </div>
  );
}
