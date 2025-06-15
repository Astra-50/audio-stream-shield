import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useDiscordBot } from './useDiscordBot';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DetectedTrack {
  track_title: string;
  track_artist: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
}

interface AudioDetectionHook {
  isDetecting: boolean;
  detectedTracks: DetectedTrack[];
  startDetection: (sessionId: string, channelId?: string) => void;
  stopDetection: () => void;
}

// Mock DMCA risk database for testing
const MOCK_RISK_DATABASE = [
  { title: 'Shape of You', artist: 'Ed Sheeran', risk: 'critical', fingerprint: 'ed_sheeran_shape' },
  { title: 'Blinding Lights', artist: 'The Weeknd', risk: 'critical', fingerprint: 'weeknd_blinding' },
  { title: 'Watermelon Sugar', artist: 'Harry Styles', risk: 'high', fingerprint: 'harry_watermelon' },
  { title: 'Levitating', artist: 'Dua Lipa', risk: 'high', fingerprint: 'dua_levitating' },
  { title: 'Good 4 U', artist: 'Olivia Rodrigo', risk: 'medium', fingerprint: 'olivia_good4u' },
  { title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', risk: 'critical', fingerprint: 'laroi_stay' },
  { title: 'Industry Baby', artist: 'Lil Nas X & Jack Harlow', risk: 'high', fingerprint: 'lil_nas_industry' },
  { title: 'Heat Waves', artist: 'Glass Animals', risk: 'medium', fingerprint: 'glass_heat_waves' },
];

export const useAudioDetection = (): AudioDetectionHook => {
  const { user } = useAuth();
  const { sendAlert } = useDiscordBot();
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedTracks, setDetectedTracks] = useState<DetectedTrack[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [channelId, setChannelId] = useState<string>('');
  
  const detectionIntervalRef = useRef<NodeJS.Timeout>();
  const audioBufferRef = useRef<Float32Array[]>([]);

  const analyzeAudioChunk = (audioData: Float32Array) => {
    // Store audio chunks for analysis (simulate 5-second buffer)
    audioBufferRef.current.push(audioData);
    
    // Keep only last 5 seconds of audio (assuming 44.1kHz sample rate)
    const maxChunks = Math.ceil(5 * 44100 / 4096); // 5 seconds worth of 4096-sample chunks
    if (audioBufferRef.current.length > maxChunks) {
      audioBufferRef.current = audioBufferRef.current.slice(-maxChunks);
    }
  };

  const generateAudioFingerprint = (audioBuffer: Float32Array[]): string => {
    // Simplified fingerprinting: analyze frequency spectrum
    let energySum = 0;
    let peakFrequency = 0;
    
    audioBuffer.forEach(chunk => {
      chunk.forEach(sample => {
        energySum += Math.abs(sample);
      });
    });
    
    // Simple hash based on audio characteristics
    const avgEnergy = energySum / (audioBuffer.length * 4096);
    const fingerprint = Math.floor(avgEnergy * 10000).toString();
    
    return fingerprint;
  };

  const detectRiskyContent = async () => {
    if (audioBufferRef.current.length === 0) return;

    const fingerprint = generateAudioFingerprint(audioBufferRef.current);
    
    // Simulate detection with random chance for demo purposes
    const detectionChance = Math.random();
    
    if (detectionChance > 0.95) { // 5% chance of detection per analysis cycle
      const randomTrack = MOCK_RISK_DATABASE[Math.floor(Math.random() * MOCK_RISK_DATABASE.length)];
      
      const detection: DetectedTrack = {
        track_title: randomTrack.title,
        track_artist: randomTrack.artist,
        risk_level: randomTrack.risk as 'low' | 'medium' | 'high' | 'critical',
        confidence_score: 0.75 + Math.random() * 0.25 // 75-100% confidence
      };

      // Log to database
      if (user && sessionId) {
        try {
          const { error } = await supabase
            .from('audio_alerts')
            .insert({
              user_id: user.id,
              session_id: sessionId,
              track_title: detection.track_title,
              track_artist: detection.track_artist,
              risk_level: detection.risk_level,
              confidence_score: detection.confidence_score,
              timestamp_in_stream: Date.now()
            });

          if (error) {
            console.error('Error logging alert:', error);
          }
        } catch (error) {
          console.error('Database error:', error);
        }
      }

      // Send Discord alert if channel configured
      if (channelId) {
        try {
          await sendAlert(detection, channelId);
        } catch (error) {
          console.error('Failed to send Discord alert:', error);
        }
      }

      // Update local state
      setDetectedTracks(prev => [detection, ...prev.slice(0, 9)]); // Keep last 10 detections

      // Show toast notification
      const riskColors = {
        low: '🟢',
        medium: '🟡', 
        high: '🟠',
        critical: '🔴'
      };

      toast.error(
        `${riskColors[detection.risk_level]} DMCA RISK: ${detection.track_title} by ${detection.track_artist}`,
        {
          duration: detection.risk_level === 'critical' ? 10000 : 5000,
        }
      );

      console.log('DMCA Risk Detection:', detection);
    }
  };

  const startDetection = (newSessionId: string, newChannelId?: string) => {
    setSessionId(newSessionId);
    setChannelId(newChannelId || '');
    setIsDetecting(true);
    
    // Run detection every 2 seconds
    detectionIntervalRef.current = setInterval(detectRiskyContent, 2000);
    
    toast.success('DMCA detection started - Monitoring your stream for risky content');
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = undefined;
    }
    
    setIsDetecting(false);
    audioBufferRef.current = [];
    
    toast.info('DMCA detection stopped');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  return {
    isDetecting,
    detectedTracks,
    startDetection,
    stopDetection
  };
};
