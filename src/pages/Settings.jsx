
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserIcon, Bell, Shield, Palette, Volume2, Heart, HelpCircle, ArrowLeft, Bird, LogOut, Stethoscope, ShieldCheck, Code, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { toast } from 'sonner';

import ProfileSettings from "../components/settings/ProfileSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import PrivacySettings from "../components/settings/PrivacySettings";
import ThemeSelector from "../components/rewards/ThemeSelector";
import AudioSettings from "../components/settings/AudioSettings";
import JournalingSettings from "../components/settings/JournalingSettings";
import SupportSettings from "../components/settings/SupportSettings";
import TherapistSettings from "../components/settings/TherapistSettings";

const themeLibrary = [
  { id: 'light', name: 'Light', isPremium: false },
  { id: 'dark', name: 'Dark', isPremium: false },
  { id: 'sunset', name: 'Sunset', isPremium: false },
  { id: 'forest', name: 'Forest', isPremium: false, unlockDay: 3 },
  { id: 'sunrise', name: 'Sunrise', isPremium: false, unlockDay: 7 },
  { id: 'night', name: 'Night', isPremium: false, unlockDay: 14 },
  { id: 'sakura_premium', name: 'Sakura', isPremium: true },
  { id: 'ocean_premium', name: 'Ocean', isPremium: true },
  { id: 'aurora_premium', name: 'Aurora', isPremium: true },
  { id: 'lotus_premium', name: 'Lotus', isPremium: true },
];

const getIsUnlocked = (theme, currentUser) => {
    if (!currentUser) return false;
    if (theme.isPremium) {
        return currentUser.is_premium;
    }
    // Default themes are always unlocked
    if (!theme.unlockDay) {
        return true;
    }
    return (currentUser.unlocked_themes || []).includes(theme.id);
};

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Get user from localStorage
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const handleThemeSelect = async (theme) => {
    if (!getIsUnlocked(theme, user)) {
      if (theme.isPremium) {
        toast.info("This is a Premium theme.", { description: "Upgrade to unlock more beautiful themes!" });
      } else {
        toast.info("Keep up your streak!", { description: `This theme unlocks with a ${theme.unlockDay}-day meditation streak.` });
      }
      return;
    }

    try {
      await User.updateMyUserData({ active_theme: theme.id });
      loadUserData(); // Reloads user data to reflect the change
      toast.success(`Theme changed to ${theme.name}!`);
    } catch (error) {
      toast.error("Failed to change theme.");
      console.error("Error updating theme:", error);
    }
  };

  // Check if current user is blossom alabor (developer account)
  const isDeveloper = user?.name?.toLowerCase() === 'blossom alabor';

  // Developer toggle functions
  const toggleModeratorMode = () => {
    const currentUser = JSON.parse(localStorage.getItem('aurawell_current_user'));
    currentUser.is_moderator = !currentUser.is_moderator;
    localStorage.setItem('aurawell_current_user', JSON.stringify(currentUser));
    loadUserData();
    toast.success(`Moderator mode ${currentUser.is_moderator ? 'enabled' : 'disabled'}`);
  };

  const toggleTherapistMode = () => {
    const currentUser = JSON.parse(localStorage.getItem('aurawell_current_user'));
    currentUser.user_type = currentUser.user_type === 'therapist' ? 'user' : 'therapist';
    localStorage.setItem('aurawell_current_user', JSON.stringify(currentUser));
    loadUserData();
    toast.success(`Therapist mode ${currentUser.user_type === 'therapist' ? 'enabled' : 'disabled'}`);
  };

  const togglePremiumMode = () => {
    const currentUser = JSON.parse(localStorage.getItem('aurawell_current_user'));
    currentUser.is_premium = !currentUser.is_premium;
    localStorage.setItem('aurawell_current_user', JSON.stringify(currentUser));
    loadUserData();
    toast.success(`Premium mode ${currentUser.is_premium ? 'enabled' : 'disabled'}`);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure? This will clear all crisis logs, moderator notifications, and chat messages.')) {
      localStorage.removeItem('moderator_notifications');
      localStorage.removeItem('crisis_log');
      localStorage.removeItem('moderator_actions');
      // Clear all live chat sessions
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('live_chat_')) {
          localStorage.removeItem(key);
        }
      });
      toast.success('All testing data cleared');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main py-6 flex items-center justify-center">
        <Bird className="w-8 h-8 text-accent animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header with Back Button */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between py-4"
        >
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Profile")}>
              <Button 
                variant="ghost" 
                size="sm"
                className="p-2 hover:bg-accent-light/10 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-accent" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-light text-primary">Settings</h1>
              <p className="text-sm text-secondary mt-1">Customize your AuraWell experience</p>
            </div>
          </div>
          <Bird className="w-6 h-6 text-accent/50" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-light shadow-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className={`grid ${
                  isDeveloper
                    ? user?.user_type === 'therapist' && user?.is_moderator
                      ? 'grid-cols-3 md:grid-cols-8'
                      : user?.user_type === 'therapist' || user?.is_moderator
                        ? 'grid-cols-3 md:grid-cols-7'
                        : 'grid-cols-3 md:grid-cols-6'
                    : user?.user_type === 'therapist' && user?.is_moderator
                      ? 'grid-cols-3 md:grid-cols-7'
                      : user?.user_type === 'therapist' || user?.is_moderator
                        ? 'grid-cols-3 md:grid-cols-6'
                        : 'grid-cols-3 md:grid-cols-5'
                } w-full mb-6`}>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span className="hidden sm:inline">Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Audio</span>
                  </TabsTrigger>
                  <TabsTrigger value="support" className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Help</span>
                  </TabsTrigger>
                  {user?.user_type === 'therapist' && (
                    <TabsTrigger value="therapist" className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      <span className="hidden sm:inline">Therapist</span>
                    </TabsTrigger>
                  )}
                  {user?.is_moderator && (
                    <TabsTrigger value="moderator" className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Moderator</span>
                    </TabsTrigger>
                  )}
                  {isDeveloper && (
                    <TabsTrigger value="developer" className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      <span className="hidden sm:inline">Dev Tools</span>
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="profile">
                  <ProfileSettings user={user} onUserUpdate={loadUserData} />
                </TabsContent>

                <TabsContent value="notifications">
                  <NotificationSettings user={user} onUserUpdate={loadUserData} />
                </TabsContent>

                <TabsContent value="privacy">
                  <PrivacySettings user={user} onUserUpdate={loadUserData} />
                </TabsContent>

                <TabsContent value="audio">
                  <AudioSettings user={user} onUserUpdate={loadUserData} />
                </TabsContent>

                <TabsContent value="support">
                  <SupportSettings />
                </TabsContent>

                {user?.user_type === 'therapist' && (
                  <TabsContent value="therapist">
                    <TherapistSettings user={user} onUserUpdate={loadUserData} />
                  </TabsContent>
                )}

                {user?.is_moderator && (
                  <TabsContent value="moderator">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-primary mb-2">Moderator Tools</h3>
                        <p className="text-sm text-secondary mb-4">Access moderation dashboard and safety monitoring tools</p>
                      </div>

                      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-purple-600 rounded-xl">
                              <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-purple-900 mb-2">
                                Moderator Dashboard
                              </h4>
                              <p className="text-sm text-purple-800 mb-4">
                                Monitor and respond to safety alerts from live sessions. Review flagged messages, access host redirection scripts, and manage crisis interventions.
                              </p>
                              <ul className="text-sm text-purple-700 space-y-1 mb-4">
                                <li>• View active safety alerts (HIGH, MEDIUM, BEHAVIORAL)</li>
                                <li>• Remove triggering messages from chats</li>
                                <li>• Access host redirection scripts</li>
                                <li>• Escalate severe cases to senior staff</li>
                                <li>• Review crisis detection logs</li>
                              </ul>
                            </div>
                          </div>

                          <Button
                            onClick={() => navigate('/ModeratorDashboard')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-base font-semibold"
                          >
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            Open Moderator Dashboard
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-2">Moderator Guidelines</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-medium text-green-800 mb-1">What You Can Do:</p>
                                  <ul className="text-gray-700 space-y-0.5">
                                    <li>✓ Remove triggering messages</li>
                                    <li>✓ Use host redirection scripts</li>
                                    <li>✓ Log all incidents</li>
                                    <li>✓ Escalate repeated concerns</li>
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-medium text-red-800 mb-1">What You Cannot Do:</p>
                                  <ul className="text-gray-700 space-y-0.5">
                                    <li>✗ Diagnose users</li>
                                    <li>✗ Ask follow-up questions</li>
                                    <li>✗ Attempt therapy</li>
                                    <li>✗ Make medical recommendations</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                )}

                {isDeveloper && (
                  <TabsContent value="developer">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-primary mb-2">Developer Tools</h3>
                        <p className="text-sm text-secondary mb-4">Testing and debugging tools (Only visible to: Blossom Alabor)</p>
                      </div>

                      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-slate-700 rounded-xl">
                              <Code className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                                Account Mode Toggles
                              </h4>
                              <p className="text-sm text-slate-700 mb-4">
                                Quickly switch between different account types for testing purposes
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Button
                              onClick={toggleModeratorMode}
                              variant="outline"
                              className={`w-full py-6 border-2 ${
                                user?.is_moderator
                                  ? 'bg-purple-100 border-purple-500 text-purple-700'
                                  : 'border-gray-300 text-gray-700'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <ShieldCheck className="w-6 h-6" />
                                <div className="text-center">
                                  <div className="font-semibold">Moderator Mode</div>
                                  <div className="text-xs">{user?.is_moderator ? 'ON' : 'OFF'}</div>
                                </div>
                              </div>
                            </Button>

                            <Button
                              onClick={toggleTherapistMode}
                              variant="outline"
                              className={`w-full py-6 border-2 ${
                                user?.user_type === 'therapist'
                                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                                  : 'border-gray-300 text-gray-700'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Stethoscope className="w-6 h-6" />
                                <div className="text-center">
                                  <div className="font-semibold">Therapist Mode</div>
                                  <div className="text-xs">{user?.user_type === 'therapist' ? 'ON' : 'OFF'}</div>
                                </div>
                              </div>
                            </Button>

                            <Button
                              onClick={togglePremiumMode}
                              variant="outline"
                              className={`w-full py-6 border-2 ${
                                user?.is_premium
                                  ? 'bg-amber-100 border-amber-500 text-amber-700'
                                  : 'border-gray-300 text-gray-700'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Heart className="w-6 h-6" />
                                <div className="text-center">
                                  <div className="font-semibold">Premium Mode</div>
                                  <div className="text-xs">{user?.is_premium ? 'ON' : 'OFF'}</div>
                                </div>
                              </div>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-red-50 border-red-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-red-900 mb-2">
                                Clear Testing Data
                              </h4>
                              <p className="text-sm text-red-800 mb-4">
                                Remove all crisis logs, moderator notifications, and live chat messages. This cannot be undone.
                              </p>
                              <Button
                                onClick={clearAllData}
                                variant="outline"
                                className="w-full border-2 border-red-400 text-red-700 hover:bg-red-100 py-4 font-semibold"
                              >
                                Clear All Testing Data
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-2">Current Account Status</h4>
                              <div className="text-sm text-blue-800 space-y-1">
                                <p><strong>Name:</strong> {user?.name}</p>
                                <p><strong>Email:</strong> {user?.email}</p>
                                <p><strong>User Type:</strong> {user?.user_type || 'user'}</p>
                                <p><strong>Moderator:</strong> {user?.is_moderator ? 'Yes' : 'No'}</p>
                                <p><strong>Premium:</strong> {user?.is_premium ? 'Yes' : 'No'}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card border-light shadow-sm">
            <CardContent className="p-6">
              <Button
                onClick={() => {
                  localStorage.removeItem('aurawell_current_user');
                  toast.success("Logged out successfully");
                  navigate('/auth');
                }}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
