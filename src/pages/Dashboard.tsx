
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Activity, AlertTriangle, Settings, Play, Pause } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for development
  const mockStats = {
    alertsToday: 3,
    totalAlerts: 24,
    activeSession: false,
    lastStream: '2 hours ago'
  };

  const mockAlerts = [
    {
      id: '1',
      trackTitle: 'Shape of You',
      trackArtist: 'Ed Sheeran',
      riskLevel: 'high' as const,
      timestamp: '14:32',
      confidenceScore: 0.92,
      wasResolved: false
    },
    {
      id: '2',
      trackTitle: 'Blinding Lights',
      trackArtist: 'The Weeknd',
      riskLevel: 'critical' as const,
      timestamp: '12:15',
      confidenceScore: 0.98,
      wasResolved: true
    },
    {
      id: '3',
      trackTitle: 'Watermelon Sugar',
      trackArtist: 'Harry Styles',
      riskLevel: 'medium' as const,
      timestamp: '09:43',
      confidenceScore: 0.76,
      wasResolved: false
    }
  ];

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
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
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
                  {mockStats.activeSession ? 'Live' : 'Offline'}
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
                <p className="text-2xl font-bold text-gray-900">{mockStats.alertsToday}</p>
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
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                {mockStats.activeSession ? (
                  <Play className="h-6 w-6 text-purple-600" />
                ) : (
                  <Pause className="h-6 w-6 text-purple-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Stream</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.lastStream}</p>
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
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${getRiskColor(alert.riskLevel)}`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {alert.trackTitle}
                    </p>
                    <p className="text-sm text-gray-600">
                      by {alert.trackArtist} • {alert.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={getRiskTextColor(alert.riskLevel)}
                    >
                      {alert.riskLevel.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      {Math.round(alert.confidenceScore * 100)}% confidence
                    </p>
                  </div>
                  {alert.wasResolved && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Resolved
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {mockAlerts.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No alerts yet. Your stream is protected!</p>
            </div>
          )}
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
            <Button className="h-20 flex flex-col gap-2 bg-accent hover:bg-accent/90">
              <AlertTriangle className="h-6 w-6" />
              <span>Panic Button</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span>Configure Alerts</span>
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
