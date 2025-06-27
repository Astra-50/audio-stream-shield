
import { useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDiscordBot = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const sendTestAlert = async (channelId?: string) => {
    if (!user) {
      toast.error('Please log in to test alerts');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('discord-bot', {
        body: {
          action: 'test_alert',
          channelId: channelId,
          userId: user.id
        }
      });

      if (error) throw error;

      toast.success('Test alert sent to Discord! Check your channel.');
    } catch (error) {
      console.error('Error sending test alert:', error);
      toast.error('Failed to send test alert. Please check your Discord bot setup.');
    } finally {
      setLoading(false);
    }
  };

  const sendAlert = async (alert: any, channelId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('discord-bot', {
        body: {
          action: 'send_alert',
          alert,
          channelId
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error sending alert:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBotInviteUrl = async () => {
    try {
      // Get the Discord Application ID from our edge function
      const { data, error } = await supabase.functions.invoke('discord-bot', {
        body: {
          action: 'get_invite_url'
        }
      });

      if (error) throw error;

      return data.inviteUrl;
    } catch (error) {
      console.error('Error getting bot invite URL:', error);
      // Fallback to a generic message if we can't get the URL
      toast.error('Unable to generate Discord bot invite. Please contact support.');
      return null;
    }
  };

  return {
    sendTestAlert,
    sendAlert,
    getBotInviteUrl,
    loading
  };
};
