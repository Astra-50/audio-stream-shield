
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface AudioAlert {
  id: string;
  session_id: string;
  user_id: string;
  track_title: string | null;
  track_artist: string | null;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number | null;
  timestamp_in_stream: number | null;
  was_resolved: boolean;
  created_at: string;
}

export const useAudioAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AudioAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAlerts();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audio_alerts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching audio alerts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('audio_alerts_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audio_alerts',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('New alert received:', payload);
          setAlerts(prev => [payload.new as AudioAlert, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'audio_alerts',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          setAlerts(prev => prev.map(alert => 
            alert.id === payload.new.id ? payload.new as AudioAlert : alert
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('audio_alerts')
        .update({ was_resolved: true })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, was_resolved: true } : alert
      ));
    } catch (err) {
      console.error('Error resolving alert:', err);
      throw err;
    }
  };

  return {
    alerts,
    loading,
    error,
    resolveAlert,
    refetch: fetchAlerts
  };
};
