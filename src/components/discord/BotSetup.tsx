
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiscordBot } from '@/hooks/useDiscordBot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bot, ExternalLink, TestTube, CheckCircle, AlertCircle } from 'lucide-react';

const BotSetup = () => {
  const { user } = useAuth();
  const { sendTestAlert, getBotInviteUrl, loading } = useDiscordBot();
  const [channelId, setChannelId] = useState('');
  const [botConnected, setBotConnected] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBotSettings();
    }
  }, [user]);

  const fetchBotSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('discord_channel_id')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching bot settings:', error);
        return;
      }

      if (data?.discord_channel_id) {
        setChannelId(data.discord_channel_id);
        setBotConnected(true);
      }
    } catch (error) {
      console.error('Error fetching bot settings:', error);
    }
  };

  const saveChannelId = async () => {
    if (!user || !channelId) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          discord_channel_id: channelId
        });

      if (error) throw error;

      setBotConnected(true);
      toast.success('Discord channel configured!');
    } catch (error) {
      console.error('Error saving channel ID:', error);
      toast.error('Failed to save channel ID');
    }
  };

  const testBotConnection = async () => {
    if (!channelId) {
      toast.error('Please enter a Discord Channel ID first');
      return;
    }

    setTestingConnection(true);
    try {
      await sendTestAlert(channelId);
    } catch (error) {
      toast.error('Bot test failed. Check your channel ID and bot permissions.');
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Discord Bot Setup
        </CardTitle>
        <CardDescription>
          Connect AudioGuard bot to your Discord server for real-time alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bot Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {botConnected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-600" />
            )}
            <span className="font-medium">
              Bot Status: 
            </span>
          </div>
          <Badge variant={botConnected ? "default" : "secondary"}>
            {botConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>

        <Separator />

        {/* Step 1: Invite Bot */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">1</span>
            <h3 className="font-medium">Invite AudioGuard Bot to Your Server</h3>
          </div>
          <p className="text-sm text-gray-600 ml-8">
            Click the button below to add AudioGuard bot to your Discord server with the necessary permissions.
          </p>
          <div className="ml-8">
            <Button asChild variant="outline">
              <a href={getBotInviteUrl()} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Invite Bot to Discord
              </a>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Step 2: Configure Channel */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">2</span>
            <h3 className="font-medium">Configure Alert Channel</h3>
          </div>
          <p className="text-sm text-gray-600 ml-8">
            Right-click on your desired Discord channel and copy the Channel ID.
          </p>
          <div className="ml-8 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="channel-id">Discord Channel ID</Label>
              <Input
                id="channel-id"
                placeholder="123456789012345678"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Enable Developer Mode in Discord Settings → Advanced to see Channel IDs
              </p>
            </div>
            <Button onClick={saveChannelId} disabled={!channelId}>
              Save Channel ID
            </Button>
          </div>
        </div>

        <Separator />

        {/* Step 3: Test Connection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">3</span>
            <h3 className="font-medium">Test Bot Connection</h3>
          </div>
          <p className="text-sm text-gray-600 ml-8">
            Send a test alert to verify everything is working correctly.
          </p>
          <div className="ml-8">
            <Button 
              onClick={testBotConnection} 
              disabled={!channelId || testingConnection}
              variant="outline"
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testingConnection ? 'Sending Test...' : 'Send Test Alert'}
            </Button>
          </div>
        </div>

        {/* Bot Commands Info */}
        <Separator />
        
        <div className="space-y-3">
          <h3 className="font-medium">Available Bot Commands</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <code className="bg-gray-100 px-2 py-1 rounded">/panic</code>
              <span className="text-gray-600">Emergency mute alert</span>
            </div>
            <div className="flex justify-between">
              <code className="bg-gray-100 px-2 py-1 rounded">/status</code>
              <span className="text-gray-600">Check protection status</span>
            </div>
            <div className="flex justify-between">
              <code className="bg-gray-100 px-2 py-1 rounded">/settings</code>
              <span className="text-gray-600">View current settings</span>
            </div>
            <div className="flex justify-between">
              <code className="bg-gray-100 px-2 py-1 rounded">/test-alert</code>
              <span className="text-gray-600">Send test DMCA alert</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotSetup;
