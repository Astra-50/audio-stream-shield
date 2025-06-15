
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAudioCapture } from '@/hooks/useAudioCapture';
import { useAudioDetection } from '@/hooks/useAudioDetection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Mic, MicOff, Activity, AlertTriangle, Play, Square } from 'lucide-react';
import PanicButton from '@/components/discord/PanicButton';

const AudioProtectionPanel = () => {
  const { user } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [userSettings, setUserSettings] = useState<any>(null);
  
  const { 
    isDetecting, 
    detectedTracks, 
    startDetection, 
    stopDetection 
  } = useAudioDetection();

  const { 
    isCapturing, 
    audioLevel, 
    startCapture, 
    stopCapture, 
    error 
  } = useAudioCapture();

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setUserSettings(data);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const startStreamSession = async () => {
    if (!user) return;

    try {
      // Create new stream session
      const { data, error } = await supabase
        .from('stream_sessions')
        .insert({
          user_id: user.id,
          stream_title: 'Live Stream Protection',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(data.id);
      
      // Start audio capture
      await startCapture();
      
      // Start detection
      startDetection(data.id, userSettings?.discord_channel_id);
      
      toast.success('🛡️ AudioGuard protection activated!');
      
    } catch (error) {
      console.error('Error starting stream session:', error);
      toast.error('Failed to start protection session');
    }
  };

  const stopStreamSession = async () => {
    try {
      // Stop audio systems
      stopCapture();
      stopDetection();
      
      // End stream session
      if (currentSessionId) {
        await supabase
          .from('stream_sessions')
          .update({
            is_active: false,
            end_time: new Date().toISOString()
          })
          .eq('id', currentSessionId);
      }

      setCurrentSessionId('');
      toast.info('AudioGuard protection stopped');
      
    } catch (error) {
      console.error('Error stopping stream session:', error);
      toast.error('Error stopping protection session');
    }
  };

  const isProtectionActive = isCapturing && isDetecting;

  return (
    <div className="space-y-6">
      {/* Protection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className={`h-5 w-5 ${isProtectionActive ? 'text-green-600' : 'text-gray-400'}`} />
            AudioGuard Protection
          </CardTitle>
          <CardDescription>
            Real-time DMCA detection for your stream
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={isProtectionActive ? "default" : "secondary"}>
                {isProtectionActive ? 'PROTECTED' : 'INACTIVE'}
              </Badge>
              {isProtectionActive && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Activity className="h-3 w-3 mr-1" />
                  Live Monitoring
                </Badge>
              )}
            </div>
            
            {isProtectionActive ? (
              <Button onClick={stopStreamSession} variant="outline">
                <Square className="h-4 w-4 mr-2" />
                Stop Protection
              </Button>
            ) : (
              <Button onClick={startStreamSession}>
                <Play className="h-4 w-4 mr-2" />
                Start Protection
              </Button>
            )}
          </div>

          {/* Audio Level Indicator */}
          {isCapturing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="text-sm font-medium">Audio Input Level</span>
              </div>
              <Progress value={audioLevel * 100} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Detections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Live Detection Feed
          </CardTitle>
          <CardDescription>
            Real-time alerts from your current stream
          </CardDescription>
        </CardHeader>
        <CardContent>
          {detectedTracks.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {isProtectionActive ? 'No risky content detected - your stream is safe!' : 'Start protection to monitor your stream'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {detectedTracks.map((track, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        track.risk_level === 'critical' ? 'bg-red-500' :
                        track.risk_level === 'high' ? 'bg-orange-500' :
                        track.risk_level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{track.track_title}</p>
                      <p className="text-sm text-gray-600">by {track.track_artist}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        track.risk_level === 'critical' ? 'text-red-600 border-red-600' :
                        track.risk_level === 'high' ? 'text-orange-600 border-orange-600' :
                        track.risk_level === 'medium' ? 'text-yellow-600 border-yellow-600' :
                        'text-green-600 border-green-600'
                      }
                    >
                      {track.risk_level.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round(track.confidence_score * 100)}% confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Controls</CardTitle>
          <CardDescription>
            Quick actions when risky content is detected
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <PanicButton 
              channelId={userSettings?.discord_channel_id}
              size="lg"
              variant="destructive"
            />
            <Button 
              variant="outline" 
              size="lg"
              onClick={isCapturing ? stopCapture : startCapture}
            >
              {isCapturing ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isCapturing ? 'Mute Audio' : 'Unmute Audio'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioProtectionPanel;
