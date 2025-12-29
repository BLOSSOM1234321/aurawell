import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isToday } from "date-fns";
import { Activity, Calendar, Smile, Frown, Meh, Plus, Flame, Trophy, Target, Edit, Bird } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from 'sonner';

import MoodCalendar from "../components/mood/MoodCalendar";
import GuidedMoodFlow from "../components/mood/GuidedMoodFlow";
import BackHeader from "../components/navigation/BackHeader";
import { createPageUrl } from "@/utils";

export default function MoodTracker() {
  const [todayEntry, setTodayEntry] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [view, setView] = useState('summary'); // summary, flow
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState({
    averageMood: 0,
    entriesThisWeek: 0,
    streak: 0
  });

  const loadUserData = useCallback(async () => {
    try {
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        setUserData(user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const loadMoodData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get current user
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (!currentUserData) {
        setIsLoading(false);
        return;
      }
      const currentUser = JSON.parse(currentUserData);

      // Load mood entries from localStorage
      const storedEntries = localStorage.getItem('mood_entries');
      const allEntries = storedEntries ? JSON.parse(storedEntries) : [];

      // Filter entries for current user and sort by date
      const userEntries = allEntries
        .filter(entry => entry.user_id === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 30);

      setRecentEntries(userEntries);

      const today = format(new Date(), "yyyy-MM-dd");
      const todayEntryFound = userEntries.find(entry => entry.date === today);
      setTodayEntry(todayEntryFound);

      // Calculate weekly stats
      const thisWeekEntries = userEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entryDate >= weekAgo;
      });

      const averageMood = thisWeekEntries.length > 0
        ? thisWeekEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / thisWeekEntries.length
        : 0;

      // Calculate streak
      const sortedEntries = userEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
      let streak = 0;
      const today_date = new Date();
      today_date.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedEntries.length; i++) {
        const entryDate = new Date(sortedEntries[i].date);
        entryDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today_date);
        expectedDate.setDate(expectedDate.getDate() - i);
        expectedDate.setHours(0, 0, 0, 0);

        if (entryDate.getTime() === expectedDate.getTime()) {
          streak++;
        } else {
          break;
        }
      }

      setWeeklyStats({
        averageMood: Math.round(averageMood * 10) / 10,
        entriesThisWeek: thisWeekEntries.length,
        streak: streak
      });

    } catch (error) {
      console.error("Error loading mood data:", error);
      toast.error("Failed to load mood data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMoodData();
    loadUserData();
  }, [loadMoodData, loadUserData]);

  // This useEffect now handles the view logic, separated from data fetching
  useEffect(() => {
    // Don't change the view if we're loading
    if (isLoading) {
      return;
    }

    if (!todayEntry) {
      setView('flow'); // If no entry for today, start the flow
    } else if (todayEntry && view === 'flow') {
      setView('summary'); // If an entry exists and we were in the flow, switch to summary
    }
  }, [todayEntry, isLoading, view]);

  useEffect(() => {
    if (userData) {
      setWeeklyStats(prev => ({ ...prev, streak: userData.mood_streak || 0 }));
    }
  }, [userData]);

  const handleFlowComplete = () => {
    loadMoodData();
    loadUserData();
    setView('summary');
  };

  const getMoodIcon = (score) => {
    if (score >= 8) return <Smile className="w-5 h-5 text-white" />;
    if (score >= 6) return <Meh className="w-5 h-5 text-white" />;
    return <Frown className="w-5 h-5 text-white" />;
  };

  const getMoodColor = (score) => {
    if (score >= 8) return "from-green-400 to-emerald-500";
    if (score >= 6) return "from-yellow-400 to-orange-500";
    return "from-red-400 to-rose-500";
  };

  const getMoodLabel = (score) => {
    if (score >= 9) return "Amazing";
    if (score >= 8) return "Great";
    if (score >= 7) return "Good";
    if (score >= 6) return "Okay";
    if (score >= 5) return "Neutral";
    if (score >= 4) return "Not great";
    if (score >= 3) return "Struggling";
    return "Very difficult";
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
            key="loading-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-96 bg-card rounded-xl border-light shadow-xl"
        >
          <Bird className="w-12 h-12 text-accent animate-pulse" />
          <p className="mt-4 text-secondary">Loading your emotional journey...</p>
        </motion.div>
      );
    }

    switch (view) {
      case 'flow':
        return (
            <motion.div
                key="flow-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <GuidedMoodFlow
                    existingEntry={todayEntry}
                    onComplete={handleFlowComplete}
                    onCancel={() => setView('summary')}
                />
            </motion.div>
        );
      case 'summary':
      default:
        return (
          <motion.div
            key="summary-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Weekly Overview Stats Cards */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <Card className="bg-card border-light shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary">Current Streak</p>
                                <p className="text-2xl font-bold text-primary">
                                    {weeklyStats.streak || 0} days
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-accent/20">
                                <Flame className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-light shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary">This Week</p>
                                <p className="text-2xl font-bold text-primary">
                                    {weeklyStats.entriesThisWeek}/7 days
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-accent/20">
                                <Target className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-light shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-secondary">Weekly Average</p>
                                <p className="text-2xl font-bold text-primary">
                                    {weeklyStats.averageMood > 0 ? `${weeklyStats.averageMood}/10` : 'No data'}
                                </p>
                            </div>
                            <div className="p-3 rounded-2xl bg-accent/20">
                                <Trophy className="w-6 h-6 text-accent" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Today's Check-in Card */}
            <Card className="bg-card border-light shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-accent/20 rounded-xl">
                            <Activity className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-primary">Today's Check-in</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {todayEntry ? (
                      <motion.div
                          key="summary-today-entry"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                      >
                          <div className="text-center">
                              <div className={`inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${getMoodColor(todayEntry.mood_score)} text-white shadow-lg`}>
                                  {getMoodIcon(todayEntry.mood_score)}
                                  <div>
                                      <p className="text-sm opacity-90">Your mood today</p>
                                      <p className="text-xl font-bold">
                                          {getMoodLabel(todayEntry.mood_score)} ({todayEntry.mood_score}/10)
                                      </p>
                                  </div>
                              </div>
                          </div>

                          {todayEntry.emotions && todayEntry.emotions.length > 0 && (
                              <div>
                                  <h4 className="font-semibold text-primary mb-3">Emotions</h4>
                                  <div className="flex flex-wrap gap-2">
                                      {todayEntry.emotions.map((emotion, index) => (
                                          <Badge key={index} variant="secondary" className="px-3 py-1 rounded-2xl bg-white/10 text-secondary border-0">
                                              {emotion}
                                          </Badge>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {todayEntry.activities && todayEntry.activities.length > 0 && (
                              <div>
                                  <h4 className="font-semibold text-primary mb-3">Influences</h4>
                                  <div className="flex flex-wrap gap-2">
                                      {todayEntry.activities.map((activity, index) => (
                                          <Badge key={index} variant="outline" className="px-3 py-1 rounded-2xl border-accent/50 text-secondary">
                                              {activity}
                                          </Badge>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {todayEntry.notes && (
                              <div>
                                  <h4 className="font-semibold text-primary mb-3">Reflection</h4>
                                  <div className="bg-white/5 p-4 rounded-2xl">
                                      <p className="text-secondary italic">"{todayEntry.notes}"</p>
                                  </div>
                              </div>
                          )}

                          <Button
                              onClick={() => setView('flow')}
                              variant="outline"
                              className="w-full rounded-2xl border-accent text-accent hover:bg-accent/10"
                          >
                              <Edit className="w-4 h-4 mr-2"/>
                              Edit Today's Entry
                          </Button>
                      </motion.div>
                  ) : (
                      <motion.div
                          key="start-checkin"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center space-y-6"
                      >
                          <div className="p-8">
                              <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Plus className="w-12 h-12 text-accent" />
                              </div>
                              <h3 className="text-xl font-semibold text-primary mb-2">
                                  Ready for your daily check-in?
                              </h3>
                              <p className="text-secondary mb-6">
                                  Take a moment to reflect on how you're feeling today. It only takes 2 minutes!
                              </p>
                              <Button
                                  onClick={() => setView('flow')}
                                  className="btn-coral text-white rounded-2xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
                              >
                                  Start Check-in
                              </Button>
                          </div>
                      </motion.div>
                  )}
                </CardContent>
            </Card>

            {/* MoodCalendar */}
            <MoodCalendar entries={recentEntries} />
            
            {/* Recent Entries Card */}
            <Card className="bg-card border-light shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-accent/20 rounded-xl">
                            <Calendar className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-primary">Recent Entries</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {recentEntries.slice(0, 5).map((entry) => (
                        <motion.div 
                            key={entry.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {getMoodIcon(entry.mood_score)}
                                <div>
                                    <p className="font-medium text-primary">
                                        {format(new Date(entry.date), "MMM d")}
                                        {isToday(new Date(entry.date)) && (
                                            <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                                                Today
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-secondary">
                                        {getMoodLabel(entry.mood_score)} ({entry.mood_score}/10)
                                    </p>
                                </div>
                            </div>
                            <Badge variant="outline" className="rounded-2xl text-xs border-accent/50 text-secondary">
                                {entry.emotions?.[0] || 'No emotion'}
                            </Badge>
                        </motion.div>
                    ))}
                    {recentEntries.length === 0 && (
                        <div className="text-center py-6 text-secondary">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-white/20" />
                            <p>No entries yet</p>
                            <p className="text-sm">Start your mood tracking journey!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back Header */}
        <BackHeader 
          title="Mood Tracker" 
          subtitle={`Track your emotional journey, ${format(new Date(), "EEEE, MMMM d")}`}
          backTo={createPageUrl("Growth")}
          backLabel="Growth"
        />

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mt-6"
        >
            <Button
              variant={view === 'summary' || view === 'flow' ? 'default' : 'outline'}
              onClick={() => setView('summary')}
              className={`rounded-2xl ${view === 'summary' || view === 'flow' ? 'btn-coral text-white' : 'border-accent text-accent hover:bg-accent/10'}`}
            >
              Overview
            </Button>
        </motion.div>

        {/* Main Content Area handled by renderContent */}
        <AnimatePresence mode="wait">
            {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}