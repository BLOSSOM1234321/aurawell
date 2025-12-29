import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Brain, TrendingUp, Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function JournalingSettings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    ai_prompts_enabled: false,
    mood_analytics_visible: true,
    weekly_reports: 'email'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setSettings({
        ai_prompts_enabled: currentUser.ai_prompts_enabled ?? false,
        mood_analytics_visible: currentUser.mood_analytics_visible ?? true,
        weekly_reports: currentUser.weekly_reports || 'email'
      });
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    setIsLoading(false);
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await User.updateMyUserData({ [key]: value });
      toast.success("Journaling settings updated!");
    } catch (error) {
      console.error("Failed to update setting:", error);
      toast.error("Failed to update setting");
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Journal Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-amber-600" />
              <div>
                <Label className="font-medium flex items-center gap-2">
                  AI Writing Prompts
                  {!user.is_premium && <Crown className="w-4 h-4 text-yellow-500" />}
                </Label>
                <p className="text-sm text-gray-600">
                  Personalized prompts based on your mood and goals
                </p>
              </div>
            </div>
            <Switch
              checked={settings.ai_prompts_enabled && user.is_premium}
              onCheckedChange={(checked) => {
                if (!user.is_premium && checked) {
                  toast.error("AI prompts are only available for Premium members!");
                  return;
                }
                updateSetting('ai_prompts_enabled', checked);
              }}
              disabled={!user.is_premium}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Mood Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
            <div>
              <Label className="font-medium">Show Mood Analytics</Label>
              <p className="text-sm text-gray-600">Display charts and insights on your dashboard</p>
            </div>
            <Switch
              checked={settings.mood_analytics_visible}
              onCheckedChange={(checked) => updateSetting('mood_analytics_visible', checked)}
            />
          </div>

          <div className="space-y-3">
            <Label>Weekly Report Delivery</Label>
            <Select
              value={settings.weekly_reports}
              onValueChange={(value) => updateSetting('weekly_reports', value)}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No reports</SelectItem>
                <SelectItem value="email">Email only</SelectItem>
                <SelectItem value="push">Push notification only</SelectItem>
                <SelectItem value="both">Both email and push</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}