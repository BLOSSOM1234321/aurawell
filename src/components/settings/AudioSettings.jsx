import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Volume2, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function AudioSettings() {
  const [settings, setSettings] = useState({
    meditation_sounds: true,
    sound_volume: 50,
    achievement_sounds_enabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentUser = await User.me();
      setSettings({
        meditation_sounds: currentUser.meditation_sounds ?? true,
        sound_volume: currentUser.sound_volume ?? 50,
        achievement_sounds_enabled: currentUser.achievement_sounds_enabled ?? true,
      });
    } catch (error) {
      console.error("Failed to load audio settings:", error);
    }
    setIsLoading(false);
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await User.updateMyUserData({ [key]: value });
      toast.success("Settings updated!");
    } catch (error) {
      console.error("Failed to update setting:", error);
      toast.error("Failed to update setting");
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Audio Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
          <div>
            <Label className="font-medium">Meditation Background Sounds</Label>
            <p className="text-sm text-gray-600">Nature sounds during meditation</p>
          </div>
          <Switch
            checked={settings.meditation_sounds}
            onCheckedChange={(checked) => updateSetting('meditation_sounds', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-2xl">
            <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-600" />
                <div>
                    <Label className="font-medium">Achievement Sounds</Label>
                    <p className="text-sm text-gray-600">Play a sound for streaks and unlocks</p>
                </div>
            </div>
            <Switch
                checked={settings.achievement_sounds_enabled}
                onCheckedChange={(checked) => updateSetting('achievement_sounds_enabled', checked)}
            />
        </div>
        
        <div className="p-4 bg-blue-50 rounded-2xl">
          <Label className="font-medium mb-3 block">Global Sound Volume</Label>
          <div className="flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <Slider
              value={[settings.sound_volume]}
              onValueChange={([value]) => updateSetting('sound_volume', value)}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 min-w-[3ch]">{settings.sound_volume}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}