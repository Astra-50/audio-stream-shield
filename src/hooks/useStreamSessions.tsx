
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface StreamSession {
  id: string;
  user_id: string;
  stream_title: string | null;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  created_at: string;
}

export const useStreamSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StreamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stream_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setSessions(data || []);
    } catch (err) {
      console.error('Error fetching stream sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (streamTitle?: string) => {
    try {
      const { data, error } = await supabase
        .from('stream_sessions')
        .insert({
          user_id: user?.id,
          stream_title: streamTitle,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setSessions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating session:', err);
      throw err;
    }
  };

  const endSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('stream_sessions')
        .update({
          end_time: new Date().toISOString(),
          is_active: false
        })
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, end_time: new Date().toISOString(), is_active: false }
          : session
      ));
    } catch (err) {
      console.error('Error ending session:', err);
      throw err;
    }
  };

  return {
    sessions,
    loading,
    error,
    createSession,
    endSession,
    refetch: fetchSessions
  };
};
