
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Shield, Bot, Webhook, Settings as SettingsIcon } from 'lucide-react';
import BotSetup from '@/components/discord/BotSetup';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    alert_sensitivity: 0.75,
    discord_channel_id: '',
    webhook_url: '',
    panic_button_enabled: true,
    auto_mute_enabled: false
  });

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

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setSettings({
          alert_sensitivity: data.alert_sensitivity || 0.75,
          discord_channel_id: data.discord_channel_id || '',
          webhook_url: data.webhook_url || '',
          panic_button_enabled: data.panic_button_enabled ?? true,
          auto_mute_enabled: data.auto_mute_enabled ?? false
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings
        });

      if (error) {
        throw error;
      }

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your AudioGuard protection preferences
        </p>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alert Settings</TabsTrigger>
          <TabsTrigger value="discord">Discord Bot</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Alert Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Alert Configuration
              </CardTitle>
              <CardDescription>
                Configure how sensitive AudioGuard should be when detecting risky audio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Alert Sensitivity: {Math.round(settings.alert_sensitivity * 100)}%</Label>
                <Slider
                  value={[settings.alert_sensitivity]}
                  onValueChange={(value) => setSettings({...settings, alert_sensitivity: value[0]})}
                  max={1}
                  min={0.1}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-sm text-gray-600">
                  Higher sensitivity = more alerts, Lower sensitivity = fewer false positives
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Panic Button</Label>
                  <p className="text-sm text-gray-600">Enable emergency mute command</p>
                </div>
                <Switch
                  checked={settings.panic_button_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, panic_button_enabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Mute (Pro Feature)</Label>
                  <p className="text-sm text-gray-600">Automatically mute detected audio</p>
                </div>
                <Switch
                  checked={settings.auto_mute_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, auto_mute_enabled: checked})}
                  disabled
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={saveSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Alert Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discord" className="space-y-6">
          <BotSetup />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {/* Webhook Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Integration
              </CardTitle>
              <CardDescription>
                Send alerts to external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-webhook-endpoint.com"
                  value={settings.webhook_url}
                  onChange={(e) => setSettings({...settings, webhook_url: e.target.value})}
                />
                <p className="text-sm text-gray-600">
                  AudioGuard will POST alert data to this endpoint
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={saveSettings} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Webhook Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
