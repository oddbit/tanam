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
        {isRecording ? (
          <button
            onClick={handleStopRecording}
            className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none"
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
