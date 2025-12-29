import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Smartphone, Mail, Brain, BookOpen, Heart, Radio } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationSettings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    notifications_push: true,
    notifications_email: true,
    reminders_meditation: true,
    reminders_journaling: true,
    reminders_therapy: false,
    reminders_live_sessions: false,
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
        notifications_push: currentUser.notifications_push ?? true,
        notifications_email: currentUser.notifications_email ?? true,
        reminders_meditation: currentUser.reminders_meditation ?? true,
        reminders_journaling: currentUser.reminders_journaling ?? true,
        reminders_therapy: currentUser.reminders_therapy ?? false,
        reminders_live_sessions: currentUser.reminders_live_sessions ?? false,
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
      toast.success("Settings updated!");
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
            <Bell className="w-5 h-5" />
            General Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <div>
                <Label className="font-medium">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications on your device</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications_push}
              onCheckedChange={(checked) => updateSetting('notifications_push', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-600" />
              <div>
                <Label className="font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={settings.notifications_email}
              onCheckedChange={(checked) => updateSetting('notifications_email', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Wellness Reminders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <div>
                <Label className="font-medium">Meditation Reminders</Label>
                <p className="text-sm text-gray-600">Daily meditation practice reminders</p>
              </div>
            </div>
            <Switch
              checked={settings.reminders_meditation}
              onCheckedChange={(checked) => updateSetting('reminders_meditation', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <div>
                <Label className="font-medium">Journaling Reminders</Label>
                <p className="text-sm text-gray-600">Prompts to write and reflect</p>
              </div>
            </div>
            <Switch
              checked={settings.reminders_journaling}
              onCheckedChange={(checked) => updateSetting('reminders_journaling', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-600" />
              <div>
                <Label className="font-medium">Mental Health Goal Reminders</Label>
                <p className="text-sm text-gray-600">Check-ins for your wellness goals</p>
              </div>
            </div>
            <Switch
              checked={settings.reminders_therapy}
              onCheckedChange={(checked) => updateSetting('reminders_therapy', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-indigo-600" />
              <div>
                <Label className="font-medium">Live Session Notifications</Label>
                <p className="text-sm text-gray-600">Gentle reminders for upcoming support sessions</p>
              </div>
            </div>
            <Switch
              checked={settings.reminders_live_sessions}
              onCheckedChange={(checked) => updateSetting('reminders_live_sessions', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Weekly Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label>How would you like to receive your weekly wellness summary?</Label>
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