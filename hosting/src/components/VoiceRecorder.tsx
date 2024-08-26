import {useEffect, useRef, useState} from "react";

export interface VoiceRecorderProps {
  title?: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * VoiceRecorder component that allows users to record audio and returns the recorded audio
 * as a base64 string. The component is interactive, using Tailwind CSS for styling.
 *
 * @param {VoiceRecorderProps} props - The props for the component.
 * @returns {JSX.Element} The rendered VoiceRecorder component.
 */
export function VoiceRecorder(props: VoiceRecorderProps): JSX.Element {
  const {title, value, onChange} = props;

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | undefined>();
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * Effect to trigger onChange whenever the value prop changes.
   */
  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value, onChange]);

  /**
   * Starts recording audio using the user's microphone.
   * It sets up the MediaRecorder, gathers audio data, and pushes it to the audioChunksRef.
   * When recording stops, it converts the audio chunks to a base64 string and passes it to onChange.
   */
  async function handleStartRecording() {
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {type: "audio/wav"});
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!reader.result) return;

        const base64String = reader.result?.toString().split(",")[1] || "";
        onChange(base64String);
      };
      reader.readAsDataURL(audioBlob);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
  }

  /**
   * Stops the current audio recording.
   */
  function handleStopRecording() {
    setIsRecording(false);

    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
  }

  /**
   * Resets the recorded audio by clearing the base64 string.
   */
  function handleReset() {
    onChange("");
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {title && <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>}
      <div className="flex justify-center mb-4">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`px-4 py-2 rounded-full text-white ${
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isRecording ? "focus:ring-red-500" : "focus:ring-green-500"
          }`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
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
    </div>
  );
}
