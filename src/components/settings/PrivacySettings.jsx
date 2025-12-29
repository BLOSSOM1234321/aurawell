import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, EyeOff, Filter, ExternalLink, Users, Camera, Mic, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function PrivacySettings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    is_anonymous: false,
    posts_visibility: 'group_only',
    content_filtering: true,
    two_factor_enabled: false
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
        is_anonymous: currentUser.is_anonymous ?? false,
        posts_visibility: currentUser.posts_visibility || 'group_only',
        content_filtering: currentUser.content_filtering ?? true,
        two_factor_enabled: currentUser.two_factor_enabled ?? false
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
      toast.success("Privacy settings updated!");
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
            <Shield className="w-5 h-5" />
            Security & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <h3 className="font-semibold text-blue-800 mb-2">Two-Factor Authentication</h3>
            <p className="text-blue-700 text-sm mb-3">
              Your account is secured with Google Authentication. Manage 2FA through your Google Account.
            </p>
            <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage on Google
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeOff className="w-5 h-5" />
            Community Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <Label className="font-medium">Anonymous Posting</Label>
              <p className="text-sm text-gray-600">Post anonymously in community groups</p>
            </div>
            <Switch
              checked={settings.is_anonymous}
              onCheckedChange={(checked) => updateSetting('is_anonymous', checked)}
            />
          </div>

          <div className="space-y-3">
            <Label>Who can see your posts?</Label>
            <Select
              value={settings.posts_visibility}
              onValueChange={(value) => updateSetting('posts_visibility', value)}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="group_only">Group members only</SelectItem>
                <SelectItem value="private">Private (only me)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Content Filtering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
            <div>
              <Label className="font-medium">Advanced Content Filtering</Label>
              <p className="text-sm text-gray-600">Automatically filter potentially harmful content</p>
            </div>
            <Switch
              checked={settings.content_filtering}
              onCheckedChange={(checked) => updateSetting('content_filtering', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Data Permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-gray-600" />
              <div>
                <Label className="font-medium">Camera Access</Label>
                <p className="text-sm text-gray-600">For profile pictures and journal photos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-gray-600" />
              <div>
                <Label className="font-medium">Microphone Access</Label>
                <p className="text-sm text-gray-600">For voice journaling (Premium feature)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <Label className="font-medium">Location</Label>
                <p className="text-sm text-gray-600">For local therapy recommendations</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            These permissions are managed by your browser. You can revoke them at any time.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}