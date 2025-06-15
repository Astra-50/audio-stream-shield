
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
      toast.error('Failed to send test alert');
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

  const getBotInviteUrl = () => {
    const applicationId = 'YOUR_DISCORD_APPLICATION_ID'; // This will be replaced with actual ID
    const permissions = '2048'; // Send Messages permission
    return `https://discord.com/api/oauth2/authorize?client_id=${applicationId}&permissions=${permissions}&scope=bot%20applications.commands`;
  };

  return {
    sendTestAlert,
    sendAlert,
    getBotInviteUrl,
    loading
  };
};
