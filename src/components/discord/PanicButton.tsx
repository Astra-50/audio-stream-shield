
import { useState } from 'react';
import { useDiscordBot } from '@/hooks/useDiscordBot';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface PanicButtonProps {
  channelId?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'destructive' | 'outline';
}

const PanicButton = ({ channelId, size = 'default', variant = 'destructive' }: PanicButtonProps) => {
  const { sendAlert, loading } = useDiscordBot();
  const [cooldown, setCooldown] = useState(false);

  const handlePanic = async () => {
    if (cooldown) {
      toast.error('Panic button is on cooldown. Wait a moment before using again.');
      return;
    }

    if (!channelId) {
      toast.error('🚨 PANIC ACTIVATED - MUTE YOUR STREAM NOW!', {
        duration: 10000,
      });
      
      // Set cooldown to prevent spam
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);
      return;
    }

    try {
      const panicAlert = {
        track_title: 'PANIC BUTTON ACTIVATED',
        track_artist: 'Emergency Alert',
        risk_level: 'critical',
        confidence_score: 1.0
      };

      await sendAlert(panicAlert, channelId);
      
      toast.error('🚨 PANIC ALERT SENT - MUTE YOUR STREAM NOW!', {
        duration: 10000,
      });

      // Set cooldown to prevent spam
      setCooldown(true);
      setTimeout(() => setCooldown(false), 5000);

    } catch (error) {
      toast.error('Failed to send panic alert to Discord, but MUTE YOUR STREAM NOW!', {
        duration: 10000,
      });
    }
  };

  return (
    <Button
      onClick={handlePanic}
      disabled={loading || cooldown}
      variant={variant}
      size={size}
      className={`${variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''} font-bold`}
    >
      <AlertTriangle className="h-4 w-4 mr-2" />
      {cooldown ? 'COOLDOWN...' : '🚨 PANIC'}
    </Button>
  );
};

export default PanicButton;
