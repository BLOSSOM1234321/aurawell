
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { SacredSpaceSession } from "@/api/entities";
import { SacredSpaceEntry } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Crown, 
  Play, 
  Pause, 
  Timer, 
  Sparkles, 
  Book, 
  Brain,
  Heart,
  Star,
  Mountain,
  Waves,
  Lock,
  ArrowLeft
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import SacredSpaceTimer from "../components/sacred/SacredSpaceTimer";
import SacredSpaceJournal from "../components/sacred/SacredSpaceJournal";
import SacredSpaceVault from "../components/sacred/SacredSpaceVault";
import ReflectionModal from "../components/sacred/ReflectionModal";

const themes = [
  {
    id: 'cosmic',
    name: 'Cosmic',
    icon: Sparkles,
    description: 'Floating stars and nebula',
    colors: 'from-indigo-900 via-purple-900 to-pink-900'
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: Mountain,
    description: 'Forest and flowing water',
    colors: 'from-green-800 via-emerald-700 to-teal-800'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    icon: Waves,
    description: 'Clean gradients and soft light',
    colors: 'from-gray-600 via-slate-700 to-gray-800'
  }
];

export default function SacredSpacePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('cosmic');
  const [showReflection, setShowReflection] = useState(false);
  const [completedSession, setCompletedSession] = useState(null);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [activeMode, setActiveMode] = useState('timer'); // timer, journal, vault

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setSessionStreak(currentUser.sacred_space_streak || 0);
      setSelectedTheme(currentUser.preferred_sacred_theme || 'cosmic');
    } catch (error) {
      console.error("Failed to load user:", error);
    }
    setIsLoading(false);
  };

  const handleSessionStart = (sessionData) => {
    setActiveSession(sessionData);
    // Silence notifications during session
    if ('Notification' in window) {
      // This would require proper notification permission handling
      toast.success("Sacred Space activated - notifications silenced", { duration: 2000 });
    }
  };

  const handleSessionComplete = async (sessionData) => {
    try {
      // Save session
      await SacredSpaceSession.create({
        ...sessionData,
        theme_used: selectedTheme,
        date: new Date().toISOString().split('T')[0]
      });

      // Update user streak
      const newStreak = sessionStreak + 1;
      await User.updateMyUserData({ 
        sacred_space_streak: newStreak,
        preferred_sacred_theme: selectedTheme
      });
      setSessionStreak(newStreak);

      // Check for streak achievements
      if (newStreak === 3) {
        toast.success("Sacred Space Streak!", { 
          description: "3 sessions in a row! You've unlocked the Divine Dove animation ✨" 
        });
      }

      setCompletedSession(sessionData);
      setActiveSession(null);
      setShowReflection(true);

    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Failed to save session");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Sacred Space...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-4">Please sign in to access Sacred Space</p>
            <Button onClick={() => User.login()}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user.is_premium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="text-center p-8">
            <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-4">Sacred Space is available for Premium members only</p>
            <Link to={createPageUrl("GoPremium")}>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center">
          <Link to={createPageUrl('Sanctuary')}>
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Sacred Space
          </h1>
          <p className="text-gray-600 text-lg">
            Your premium focus sanctuary for deep reflection and peace
          </p>
          {sessionStreak > 0 && (
            <Badge className="bg-purple-100 text-purple-700">
              🔥 {sessionStreak} session streak
            </Badge>
          )}
        </div>

        {/* Mode Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Choose Your Sacred Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={activeMode === 'timer' ? 'default' : 'outline'}
                onClick={() => setActiveMode('timer')}
                className="h-24 flex flex-col gap-2 rounded-2xl"
              >
                <Timer className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Focus Timer</div>
                  <div className="text-xs opacity-70">Timed meditation & reflection</div>
                </div>
              </Button>
              
              <Button
                variant={activeMode === 'journal' ? 'default' : 'outline'}
                onClick={() => setActiveMode('journal')}
                className="h-24 flex flex-col gap-2 rounded-2xl"
              >
                <Book className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Sacred Journal</div>
                  <div className="text-xs opacity-70">Write in peaceful focus</div>
                </div>
              </Button>
              
              <Button
                variant={activeMode === 'vault' ? 'default' : 'outline'}
                onClick={() => setActiveMode('vault')}
                className="h-24 flex flex-col gap-2 rounded-2xl"
              >
                <Heart className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Sacred Vault</div>
                  <div className="text-xs opacity-70">Your sacred writings</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        {(activeMode === 'timer' || activeMode === 'journal') && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">Sacred Atmosphere</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {themes.map(theme => (
                  <Button
                    key={theme.id}
                    variant={selectedTheme === theme.id ? 'default' : 'outline'}
                    onClick={() => setSelectedTheme(theme.id)}
                    className="h-20 flex flex-col gap-2 rounded-2xl relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.colors} opacity-20`} />
                    <theme.icon className="w-6 h-6 relative z-10" />
                    <div className="relative z-10">
                      <div className="font-semibold text-sm">{theme.name}</div>
                      <div className="text-xs opacity-70">{theme.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Component */}
        <div className="relative">
          {activeMode === 'timer' && (
            <SacredSpaceTimer
              theme={selectedTheme}
              onSessionStart={handleSessionStart}
              onSessionComplete={handleSessionComplete}
              activeSession={activeSession}
            />
          )}
          
          {activeMode === 'journal' && (
            <SacredSpaceJournal
              theme={selectedTheme}
              user={user}
            />
          )}
          
          {activeMode === 'vault' && (
            <SacredSpaceVault user={user} />
          )}
        </div>

        {/* Reflection Modal */}
        <AnimatePresence>
          {showReflection && completedSession && (
            <ReflectionModal
              session={completedSession}
              streak={sessionStreak}
              onClose={() => {
                setShowReflection(false);
                setCompletedSession(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
