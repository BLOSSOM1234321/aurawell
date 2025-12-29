
import React, { useState, useEffect, useRef } from "react";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Crown,
  Camera,
  ExternalLink,
  LogOut,
  Star,
  CreditCard,
  Award,
  Palette,
  Sparkles,
  Trophy,
  Gem
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AchievementBadge from "../rewards/AchievementBadge";

const allBadges = [
  { id: 'You Showed Up', title: 'You Showed Up', icon: Sparkles, description: "Completed your first meditation." },
  { id: 'Mindful Streaker', title: 'Mindful Streaker', icon: Award, description: "Maintained a 7-day streak." },
  { id: 'Grounded & Growing', title: 'Grounded & Growing', icon: Trophy, description: "Meditated for 14 days straight." },
  { id: 'Consistency Champion', title: 'Consistency Champion', icon: Gem, description: "Maintained a 30-day streak." },
  { id: '100 Moments of Peace', title: '100 Moments of Peace', icon: Star, description: "Completed 100 meditations." },
  { id: 'First Theme Unlock', title: 'First Theme Unlock', icon: Palette, description: "Unlocked your first new theme." },
  { id: 'Theme Collector', title: 'Theme Collector', icon: Palette, description: "Unlocked all free themes." },
  { id: 'Premium Explorer', title: 'Premium Explorer', icon: Crown, description: "Explored the benefits of Premium." },
];

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const fileInputRef = useRef(null);
  const avatarFileRef = useRef(null);
  const [newBannerFile, setNewBannerFile] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setEditData({
        preferred_name: currentUser.preferred_name || "",
        bio: currentUser.bio || "",
        wellness_goals: currentUser.wellness_goals || "",
      });
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    try {
      let finalData = { ...editData };
      
      if (newBannerFile) {
        const { file_url } = await UploadFile({ file: newBannerFile });
        finalData.profile_banner_url = file_url;
      }
      
      if (newAvatarFile) {
        const { file_url } = await UploadFile({ file: newAvatarFile });
        finalData.avatar_url = file_url;
      }

      await User.updateMyUserData(finalData);
      setNewBannerFile(null);
      setNewAvatarFile(null);
      await loadUserData();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const togglePremium = async () => {
    try {
      const newPremiumStatus = !user.is_premium;
      let unlockedBadges = [...(user.unlocked_badges || [])]; // Create a mutable copy

      if (newPremiumStatus && !unlockedBadges.includes('Premium Explorer')) {
        unlockedBadges.push('Premium Explorer');
        toast.success("Achievement Unlocked!", { description: "You've earned the 'Premium Explorer' badge! ✨" });
      }
      
      await User.updateMyUserData({ 
        is_premium: newPremiumStatus,
        unlocked_badges: unlockedBadges // Pass the potentially updated badges
      });
      await loadUserData();
      toast.success(`Premium ${newPremiumStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      toast.error("Failed to update premium status");
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="text-center p-8">
          <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">Please Sign In</h3>
          <p className="text-gray-600 mb-4">You need to be signed in to access your settings</p>
          <Button onClick={() => User.login()} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl">
            Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

  const bannerUrl = newBannerFile ? URL.createObjectURL(newBannerFile) : user.profile_banner_url;
  const avatarUrl = newAvatarFile ? URL.createObjectURL(newAvatarFile) : user.avatar_url;

  return (
    <div className="space-y-8"> {/* Changed from space-y-6 to space-y-8 */}
      {/* Profile Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
        <div
          className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center relative"
          style={bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : {}}
        >
          {isEditing && (
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
              <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => setNewBannerFile(e.target.files[0])}
                accept="image/*"
              />
            </Button>
          )}
        </div>
        <CardContent className="p-6 -mt-8 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'
                )}
              </div>
              {isEditing && user.is_premium && (
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 bg-gray-700 text-white hover:bg-gray-900 rounded-full h-6 w-6"
                  onClick={() => avatarFileRef.current?.click()}
                >
                  <Camera className="h-3 w-3" />
                  <Input
                    type="file"
                    className="hidden"
                    ref={avatarFileRef}
                    onChange={(e) => setNewAvatarFile(e.target.files[0])}
                    accept="image/*"
                  />
                </Button>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">
                  {user.preferred_name || user.full_name || 'User'}
                </h2>
                {user.is_premium && <Star className="w-5 h-5 text-yellow-500" />}
              </div>
              <p className="text-gray-600">{user.email}</p>
              <Badge className={user.is_premium ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                {user.is_premium ? "Premium Member" : "Free Member"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profile Information</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-2xl"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <Label>Preferred Name</Label>
                <Input
                  value={editData.preferred_name}
                  onChange={(e) => setEditData({...editData, preferred_name: e.target.value})}
                  placeholder="How would you like to be called?"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="mt-1 rounded-2xl"
                />
              </div>
              <div>
                <Label>Wellness Goals</Label>
                <Textarea
                  value={editData.wellness_goals}
                  onChange={(e) => setEditData({...editData, wellness_goals: e.target.value})}
                  placeholder="What are your wellness goals?"
                  className="mt-1 rounded-2xl"
                />
              </div>
              <Button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl">
                Save Changes
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.bio && (
                <div>
                  <Label className="text-gray-600">Bio</Label>
                  <p className="font-medium">{user.bio}</p>
                </div>
              )}
              {user.wellness_goals && (
                <div>
                  <Label className="text-gray-600">Wellness Goals</Label>
                  <p className="font-medium">{user.wellness_goals}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allBadges.map(badge => (
                <AchievementBadge 
                  key={badge.id}
                  badge={badge}
                  isUnlocked={(user.unlocked_badges || []).includes(badge.id)}
                />
              ))}
            </div>
        </CardContent>
      </Card>

      {/* Premium Features */}
      {user?.is_premium && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Crown className="w-5 h-5" />
              Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gentle Guardian Mode Stats */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Gentle Guardian Mode</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-purple-600">{user.gentle_guardian_streak || 0}</p>
                  <p className="text-xs text-gray-600">Day Streak</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-indigo-600">{Math.round((user.total_gentle_guardian_minutes || 0) / 60)}</p>
                  <p className="text-xs text-gray-600">Hours Used</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-purple-600">{(user.gentle_guardian_sessions || []).length}</p>
                  <p className="text-xs text-gray-600">Total Sessions</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-indigo-600">
                    {user.gentle_guardian_enabled ? 'Active' : 'Off'}
                  </p>
                  <p className="text-xs text-gray-600">Current Status</p>
                </div>
              </div>
              <p className="text-sm text-purple-700 mt-3">
                Gentle Guardian Mode provides a simplified, calming interface during difficult times.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription & Billing */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Subscription & Billing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
            <div>
              <h3 className="font-semibold">Current Plan</h3>
              <p className="text-gray-600">{user.is_premium ? "Premium - $12.99/month" : "Free Plan"}</p>
            </div>
            <div className="flex gap-2">
              {!user.is_premium ? (
                <Link to={createPageUrl("GoPremium")}>
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="rounded-2xl">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              )}
            </div>
          </div>
          
          {/* Demo Toggle for Testing */}
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
            <div>
              <h4 className="font-medium">Demo Premium Features</h4>
              <p className="text-sm text-gray-600">Toggle premium status for testing</p>
            </div>
            <Switch
              checked={user.is_premium}
              onCheckedChange={togglePremium}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full justify-between rounded-2xl">
              <span>Manage Google Account</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
          
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full rounded-2xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
