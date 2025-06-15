
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Download, Settings, Headphones, Monitor } from 'lucide-react';

const OBSSetupGuide = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            OBS Audio Setup Guide
          </CardTitle>
          <CardDescription>
            Configure OBS with virtual audio routing for AudioGuard protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Download VB-Audio Cable */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">1</span>
              <h3 className="font-medium">Download VB-Audio Virtual Cable</h3>
              <Badge variant="outline">Required</Badge>
            </div>
            <p className="text-sm text-gray-600 ml-8">
              VB-Audio Virtual Cable creates virtual audio devices that route audio between applications.
            </p>
            <div className="ml-8">
              <Button asChild variant="outline">
                <a href="https://vb-audio.com/Cable/" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download VB-Audio Cable
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Step 2: Install and Configure */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">2</span>
              <h3 className="font-medium">Install and Configure Virtual Audio</h3>
            </div>
            <div className="ml-8 space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Installation Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Run the VB-Audio Cable installer as Administrator</li>
                  <li>Restart your computer after installation</li>
                  <li>Verify "CABLE Input" and "CABLE Output" appear in Windows Sound settings</li>
                </ol>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Windows Audio Settings:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Right-click the speaker icon in your system tray</li>
                  <li>Select "Open Sound settings"</li>
                  <li>Set your default playback device to "CABLE Input"</li>
                  <li>Set your recording device to include "CABLE Output"</li>
                </ol>
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 3: OBS Configuration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">3</span>
              <h3 className="font-medium">Configure OBS Studio</h3>
            </div>
            <div className="ml-8 space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Audio Sources Setup:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Open OBS Studio</li>
                  <li>Go to Settings → Audio</li>
                  <li>Set Desktop Audio to "CABLE Output"</li>
                  <li>Add your microphone as Mic/Auxiliary Audio</li>
                  <li>Click Apply and OK</li>
                </ol>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Audio Monitoring:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>In OBS, go to your audio mixer</li>
                  <li>Click the gear icon next to Desktop Audio</li>
                  <li>Select "Advanced Audio Properties"</li>
                  <li>Set Desktop Audio monitoring to "Monitor and Output"</li>
                  <li>This allows you to hear audio while routing it to AudioGuard</li>
                </ol>
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 4: Browser Setup */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">4</span>
              <h3 className="font-medium">Configure AudioGuard Browser Access</h3>
            </div>
            <div className="ml-8 space-y-3">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Browser Permissions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Open AudioGuard in your browser</li>
                  <li>When prompted, allow microphone access</li>
                  <li>In browser settings, ensure "CABLE Output" is selected as microphone</li>
                  <li>Test audio capture to verify AudioGuard can hear your stream audio</li>
                </ol>
              </div>
            </div>
          </div>

          <Separator />

          {/* Alternative Solutions */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Alternative Solutions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="h-4 w-4" />
                  <h4 className="font-medium">Windows Users</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Alternative virtual audio solutions for Windows
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• VoiceMeeter (Advanced)</li>
                  <li>• Virtual Audio Cable</li>
                  <li>• OBS Virtual Camera Plugin</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="h-4 w-4" />
                  <h4 className="font-medium">Mac Users</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Recommended virtual audio for macOS
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Loopback by Rogue Amoeba</li>
                  <li>• SoundFlower (Free)</li>
                  <li>• BlackHole (Free)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Support Note */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600">
              Having trouble with the setup? Join our Discord community or check our troubleshooting guide for detailed solutions and community support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OBSSetupGuide;
