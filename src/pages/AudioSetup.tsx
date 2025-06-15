
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Headphones } from 'lucide-react';
import OBSSetupGuide from '@/components/setup/OBSSetupGuide';
import AudioProtectionPanel from '@/components/audio/AudioProtectionPanel';

const AudioSetup = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audio Setup & Protection</h1>
        <p className="text-gray-600 mt-1">
          Configure your audio routing and activate real-time DMCA protection
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="setup">Audio Setup Guide</TabsTrigger>
          <TabsTrigger value="protection">Live Protection</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <OBSSetupGuide />
        </TabsContent>

        <TabsContent value="protection" className="space-y-6">
          <AudioProtectionPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AudioSetup;
