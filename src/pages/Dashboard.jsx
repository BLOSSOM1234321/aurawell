
import React, { useState, useEffect } from "react";
import { MoodEntry } from "@/api/entities";
import { JournalEntry } from "@/api/entities"; 
import { MeditationSession } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Bird,
  Edit3,
  Brain,
  Activity,
  Flame,
  Calendar,
  Sun,
  Moon,
  Sparkles,
  MessageSquare,
  Stethoscope,
  Video
} from "lucide-react";
import { format }                       from "date-fns";
import { motion }                       from "framer-motion";
import GentleGuardianToggle from "../components/dashboard/GentleGuardianToggle";
import UpcomingLiveCard from "../components/live/UpcomingLiveCard";

const dailyPrompts = [
  "What brought you peace today?",
  "Describe a moment that made you smile.",
  "What are you grateful for right now?",
  "How did you show yourself kindness today?",
  "What would you tell a friend who needed encouragement?",
  "What small victory can you celebrate today?"
];

const quickMeditations = [
  { title: "5-Minute Breathing", duration: 5, category: "breathing" },
  { title: "Morning Gratitude", duration: 3, category: "mindfulness" },
  { title: "Stress Relief", duration: 10, category: "stress" },
  { title: "Evening Calm", duration: 7, category: "sleep" }
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [streakData, setStreakData] = useState({
    meditation: 0,
    mood: 0,
    challenge: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingLiveSession, setUpcomingLiveSession] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get user from localStorage
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        setUser(currentUser);

        // Set streak data (default to 0 for now)
        setStreakData({
          meditation: currentUser.meditation_streak || 0,
          mood: currentUser.mood_streak || 0,
          challenge: currentUser.challenge_streak || 0
        });
      }

      // Load upcoming live sessions
      const sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
      const now = new Date();

      // Find the next upcoming session within 24 hours
      const upcoming = sessions
        .filter(s => !s.isLive && new Date(s.start_time) > now)
        .filter(s => {
          const diff = new Date(s.start_time) - now;
          return diff < 24 * 60 * 60 * 1000; // Within 24 hours
        })
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0];

      setUpcomingLiveSession(upcoming || null);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sun };
    if (hour < 18) return { text: "Good afternoon", icon: Sun };
    return { text: "Good evening", icon: Moon };
  };

  const getTodaysPrompt = () => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dailyPrompts[dayOfYear % dailyPrompts.length];
  };

  const greeting = getTimeGreeting();
  const todaysPrompt = getTodaysPrompt();

  // Gentle Guardian Mode
  if (user?.gentle_guardian_enabled) {
    return (
      <div className="min-h-screen py-6">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Bird className="w-12 h-12 mx-auto" style={{ color: '#5C4B99' }} />
            <div>
              <h1 className="text-2xl font-light text-primary">You are safe</h1>
              <p className="text-secondary">Breathe. Take your time.</p>
            </div>
            <GentleGuardianToggle user={user} onToggle={loadData} />
          </motion.div>

          <div className="grid gap-4">
            <Card className="bg-card border-light shadow-sm text-center">
              <CardContent className="p-6">
                <Activity className="w-8 h-8 mx-auto mb-3" style={{ color: '#5C4B99' }} />
                <h3 className="font-medium text-primary mb-4">How are you feeling?</h3>
                <Link to={createPageUrl("MoodTracker")}>
                  <Button className="w-full btn-peach rounded-xl hover:opacity-90">
                    Check in with yourself
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-light shadow-sm text-center">
              <CardContent className="p-6">
                <Brain className="w-8 h-8 mx-auto mb-3" style={{ color: '#5C4B99' }} />
                <h3 className="font-medium text-primary mb-4">Find some peace</h3>
                <Link to={createPageUrl("Meditations")}>
                  <Button className="w-full btn-peach rounded-xl hover:opacity-90">
                    Start a meditation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Regular Home Dashboard
  return (
    <div className="min-h-screen py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <greeting.icon className="w-8 h-8" style={{ color: '#5C4B99' }} />
            <Bird className="w-10 h-10" style={{ color: '#5C4B99' }} />
          </div>
          <div>
            <h1 className="text-2xl font-light text-primary">
              {greeting.text}, {user?.name || 'friend'}
            </h1>
            <p className="text-secondary">{format(new Date(), "EEEE, MMMM d")}</p>
          </div>

          {user?.is_premium && (
            <div className="pt-2 flex justify-center">
              <GentleGuardianToggle user={user} onToggle={loadData} />
            </div>
          )}
        </motion.div>

        {/* Therapist Quick Access */}
        {user?.user_type === 'therapist' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-600 rounded-full">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Therapist Portal</h3>
                    <p className="text-sm text-purple-600">Manage your practice</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link to={createPageUrl("TherapistMessages")}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages
                    </Button>
                  </Link>
                  <Link to={createPageUrl("TherapistCreateReel")}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl">
                      <Video className="w-4 h-4 mr-2" />
                      Create Reel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upcoming Live Session */}
        {upcomingLiveSession && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <UpcomingLiveCard session={upcomingLiveSession} compact={true} />
          </motion.div>
        )}

        {/* Today's Essentials */}
        <div className="space-y-4">

          {/* Daily Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-light shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/20 rounded-full">
                    <Sparkles className="w-5 h-5" style={{ color: '#5C4B99' }} />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary">Today's Focus</h3>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Flame className="w-4 h-4" style={{ color: '#5C4B99' }} />
                      <span>{streakData.challenge} day streak</span>
                    </div>
                  </div>
                </div>
                <p className="text-primary mb-4">{todaysPrompt}</p>
                <Link to={createPageUrl("Growth")}>
                  <Button className="w-full rounded-xl text-white hover:opacity-90" style={{ backgroundColor: '#5C4B99' }}>
                    Begin today's challenge
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Journal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-light shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/20 rounded-full">
                    <Edit3 className="w-5 h-5" style={{ color: '#5C4B99' }} />
                  </div>
                  <h3 className="font-medium text-primary">Quick Reflection</h3>
                </div>
                <p className="text-secondary text-sm mb-4">
                  What's on your mind today?
                </p>
                <Link to={createPageUrl("Journal")}>
                  <Button className="w-full rounded-xl text-white hover:opacity-90" style={{ backgroundColor: '#5C4B99' }}>
                    Start writing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meditation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-light shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/20 rounded-full">
                    <Brain className="w-5 h-5" style={{ color: '#5C4B99' }} />
                  </div>
                  <h3 className="font-medium text-primary">Mindful Moment</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {quickMeditations.slice(0, 2).map((meditation, index) => (
                    <div key={index} className="p-3 bg-white/5 rounded-lg text-center">
                      <p className="text-sm font-medium text-primary">{meditation.title}</p>
                      <p className="text-xs text-secondary">{meditation.duration} min</p>
                    </div>
                  ))}
                </div>

                <Link to={createPageUrl("Meditations")}>
                  <Button className="w-full rounded-xl text-white hover:opacity-90" style={{ backgroundColor: '#5C4B99' }}>
                    View all meditations
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mood Check */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card border-light shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-full">
                      <Activity className="w-5 h-5" style={{ color: '#5C4B99' }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary">Daily Check-in</h3>
                      {todayMood ? (
                        <p className="text-sm text-secondary">
                          Today: {todayMood.mood_score}/10
                        </p>
                      ) : (
                        <p className="text-sm text-secondary">How are you feeling?</p>
                      )}
                    </div>
                  </div>
                  <Link to={createPageUrl("MoodTracker")}>
                    <Button size="sm" className="rounded-xl text-white hover:opacity-90" style={{ backgroundColor: '#5C4B99' }}>
                      {todayMood ? 'Update' : 'Track'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Gentle Dove at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-6"
        >
          <Bird className="w-8 h-8 mx-auto" style={{ color: '#5C4B9980' }} />
          <p className="text-xs text-secondary mt-2">Take it one moment at a time</p>
        </motion.div>
      </div>
    </div>
  );
}
