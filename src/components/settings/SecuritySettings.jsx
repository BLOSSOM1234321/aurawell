import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ExternalLink, Shield, Lock, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function SecuritySettings() {
  const [user, setUser] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setIsAnonymous(currentUser.is_anonymous || false);
      } catch (error) {
        console.error("Failed to load user");
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const handleAnonymousToggle = async (checked) => {
    setIsAnonymous(checked);
    try {
      await User.updateMyUserData({ is_anonymous: checked });
      toast.success(`Anonymous mode ${checked ? 'enabled' : 'disabled'}. New posts will reflect this change.`);
    } catch (error) {
      toast.error("Failed to update privacy setting.");
      // Revert optimistic update on failure
      setIsAnonymous(!checked);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Password & Security
          </CardTitle>
          <CardDescription>
            Your account is secured with Google Authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            This app uses your Google account for sign-in. To change your password or manage two-factor authentication (2FA), please visit your Google Account security settings.
          </p>
          <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-2xl">
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage on Google
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeOff className="w-5 h-5" />
            Community Privacy
          </CardTitle>
          <CardDescription>
            Control how you appear in community groups.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading privacy settings...</p>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <Label htmlFor="anonymous-mode" className="font-semibold text-gray-800">
                  Enable Anonymous Mode
                </Label>
                <p className="text-sm text-gray-600">
                  Post anonymously in all community groups. Your name and avatar will be hidden.
                </p>
              </div>
              <Switch
                id="anonymous-mode"
                checked={isAnonymous}
                onCheckedChange={handleAnonymousToggle}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}