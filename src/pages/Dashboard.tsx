import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStreamSessions } from '@/hooks/useStreamSessions';
import { useAudioAlerts } from '@/hooks/useAudioAlerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Activity, AlertTriangle, Settings, Play, Pause, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PanicButton from '@/components/discord/PanicButton';

const Dashboard = () => {
  const { user } = useAuth();
  const { sessions, loading: sessionsLoading } = useStreamSessions();
  const { alerts, loading: alertsLoading, resolveAlert } = useAudioAlerts();
  const [userSettings, setUserSettings] = useState(null);

  const activeSession = sessions.find(session => session.is_active);
  const todayAlerts = alerts.filter(alert => {
    const today = new Date();
    const alertDate = new Date(alert.created_at);
    return alertDate.toDateString() === today.toDateString();
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

      if (data) {
        setUserSettings(data);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await resolveAlert(alertId);
      toast.success('Alert marked as resolved');
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const handlePanicButton = () => {
    toast.error('🚨 PANIC BUTTON ACTIVATED - MUTE YOUR STREAM!', {
      duration: 5000,
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskTextColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    return `${diffInHours} hours ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.email?.split('@')[0] || 'Streamer'}! Monitor your stream's DMCA risk in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            Free Tier
          </Badge>
          <Button size="sm" asChild>
            <a href="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Stream Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeSession ? 'Live' : 'Offline'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alertsLoading ? '...' : todayAlerts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alertsLoading ? '...' : alerts.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                {activeSession ? (
                  <Play className="h-6 w-6 text-purple-600" />
                ) : (
                  <Pause className="h-6 w-6 text-purple-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Stream</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessionsLoading ? '...' : 
                   activeSession ? 'Live now' : 
                   sessions.length > 0 ? formatTimeAgo(sessions[0].created_at) : 'Never'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audio Alerts</CardTitle>
          <CardDescription>
            Latest DMCA risk detections from your streams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading alerts...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No alerts yet. Your stream is protected!</p>
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${getRiskColor(alert.risk_level)}`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {alert.track_title || 'Unknown Track'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {alert.track_artist ? `by ${alert.track_artist}` : 'Unknown Artist'} • {formatTimeAgo(alert.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={getRiskTextColor(alert.risk_level)}
                      >
                        {alert.risk_level.toUpperCase()}
                      </Badge>
                      {alert.confidence_score && (
                        <p className="text-sm text-gray-600 mt-1">
                          {Math.round(alert.confidence_score * 100)}% confidence
                        </p>
                      )}
                    </div>
                    {alert.was_resolved ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resolved
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your AudioGuard protection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PanicButton 
              channelId={userSettings?.discord_channel_id}
              size="lg"
              variant="destructive"
            />
            <Button variant="outline" className="h-20 flex flex-col gap-2" asChild>
              <a href="/settings">
                <Settings className="h-6 w-6" />
                <span>Configure Alerts</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Shield className="h-6 w-6" />
              <span>Start Protection</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
