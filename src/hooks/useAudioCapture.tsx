
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface AudioCaptureHook {
  isCapturing: boolean;
  audioLevel: number;
  startCapture: () => Promise<void>;
  stopCapture: () => void;
  error: string | null;
}

export const useAudioCapture = (onAudioChunk?: (audioData: Float32Array) => void): AudioCaptureHook => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const animationFrameRef = useRef<number>();

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate RMS (Root Mean Square) for audio level
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / bufferLength);
    setAudioLevel(rms / 255); // Normalize to 0-1

    if (isCapturing) {
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [isCapturing]);

  const startCapture = async () => {
    try {
      setError(null);
      
      // Request audio input (microphone or system audio)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 44100
        }
      });

      mediaStreamRef.current = stream;

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser for real-time audio analysis
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Create script processor for audio chunks
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = scriptProcessor;

      // Connect audio nodes
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      // Process audio chunks
      scriptProcessor.onaudioprocess = (event) => {
        const audioData = event.inputBuffer.getChannelData(0);
        if (onAudioChunk) {
          onAudioChunk(audioData);
        }
      };

      setIsCapturing(true);
      updateAudioLevel();
      
      toast.success('Audio capture started - AudioGuard is now protecting your stream!');
      
    } catch (err) {
      console.error('Error starting audio capture:', err);
      setError('Failed to access audio input. Please check your microphone permissions.');
      toast.error('Failed to start audio capture. Check microphone permissions.');
    }
  };

  const stopCapture = () => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clean up references
    analyserRef.current = null;
    scriptProcessorRef.current = null;

    setIsCapturing(false);
    setAudioLevel(0);
    
    toast.info('Audio capture stopped - AudioGuard protection paused');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);

  return {
    isCapturing,
    audioLevel,
    startCapture,
    stopCapture,
    error
  };
};
