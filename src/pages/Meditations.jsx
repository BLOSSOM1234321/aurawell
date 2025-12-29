
import React, { useState, useEffect } from "react";
import { MeditationSession } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Play, Pause, RotateCcw, Star } from "lucide-react";
import { format, differenceInCalendarDays, subDays } from "date-fns";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

import MeditationPlayer from "../components/meditation/MeditationPlayer";
import MeditationLibrary from "../components/meditation/MeditationLibrary";
import RecentSessions from "../components/meditation/RecentSessions";
import StreakAnimation from "../components/rewards/StreakAnimation";
import BackHeader from "../components/navigation/BackHeader";
import { createPageUrl } from "@/utils";

// Reward Definitions
const badgeMilestones = {
  first_meditation: { total: 1, message: "You showed up for yourself. Welcome to the journey! 💙", badge: "You Showed Up" },
  streak_7: { streak: 7, message: "One Week of Calm! Consistency is your superpower. 🌟", badge: "Mindful Streaker" },
  streak_14: { streak: 14, message: "Two weeks strong! You’ve taken 14 mindful steps toward peace.", badge: "Grounded & Growing" },
  streak_30: { streak: 30, message: "One Month of Mindfulness! You're building a powerful habit.", badge: "Consistency Champion" },
  total_100: { total: 100, message: "That's 100 Moments of Peace. Incredible dedication!", badge: "100 Moments of Peace" }
};

const themeMilestones = {
  streak_3: { streak: 3, message: "🎉 Congrats! You unlocked the Forest Green theme for staying mindful 3 days in a row. Keep going!", theme: "forest" },
  streak_7: { streak: 7, message: "🎉 Awesome! Sunrise Orange theme unlocked after 7 days of mindfulness 🌅", theme: "sunrise" },
};


export default function Meditations() {
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const achievementSoundRef = React.useRef(null);

  React.useEffect(() => {
    loadRecentSessions();
    // Initialize the achievement sound effect
    achievementSoundRef.current = new Audio("https://base44.app/api/apps/689f3f2da7c7d92e1b2413a7/files/public/689f3f2da7c7d92e1b2413a7/7d789c738_475839__kausha__ding.mp3");
    achievementSoundRef.current.preload = 'auto';
    achievementSoundRef.current.volume = 0.5; // Set to a more subtle volume
  }, []);

  const loadRecentSessions = async () => {
    const sessions = await MeditationSession.list("-created_date", 10);
    setRecentSessions(sessions);
  };

  const handleMeditationSelect = (meditation) => {
    setSelectedMeditation(meditation);
  };
  
  const processRewards = async () => {
    const user = await User.me();
    let { 
      meditation_streak = 0, 
      last_meditation_date, 
      total_meditations = 0,
      unlocked_badges = [],
      unlocked_themes = ['light', 'dark'] // Initialize with default themes
    } = user;

    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    // Calculate new streak
    if (last_meditation_date) {
      if (last_meditation_date === yesterday) {
        meditation_streak++;
      } else if (last_meditation_date !== today) {
        toast("It’s okay to pause. Your journey continues whenever you’re ready 💫");
        meditation_streak = 1; // Reset but count today
      }
      // If last_meditation_date is today, streak doesn't change
    } else {
      meditation_streak = 1; // First meditation
    }
    
    total_meditations++;
    
    // --- Check for new rewards ---
    let newBadgeAwarded = false;
    let newThemeAwarded = false;
    const initialBadgeCount = unlocked_badges.length;

    // Badges
    for (const key in badgeMilestones) {
      const milestone = badgeMilestones[key];
      if (!unlocked_badges.includes(milestone.badge)) {
        if ((milestone.streak && meditation_streak >= milestone.streak) || (milestone.total && total_meditations >= milestone.total)) {
          unlocked_badges.push(milestone.badge);
          toast.success("Achievement Unlocked!", { description: milestone.message });
        }
      }
    }
    if (unlocked_badges.length > initialBadgeCount) {
        newBadgeAwarded = true; // Simplified: if any new badge was added
    }


    // Themes
    for (const key in themeMilestones) {
        const milestone = themeMilestones[key];
        if (!unlocked_themes.includes(milestone.theme)) {
            if (milestone.streak && meditation_streak >= milestone.streak) {
                unlocked_themes.push(milestone.theme);
                toast.success("New Theme Unlocked!", { description: milestone.message });
                newThemeAwarded = true;
            }
        }
    }
    
    // Special Badges
    if (newThemeAwarded && !unlocked_badges.includes('First Theme Unlock')) {
        unlocked_badges.push('First Theme Unlock');
        toast.success("Achievement Unlocked!", { description: "You've earned the 'First Theme Unlock' badge! 🏅" });
        newBadgeAwarded = true; // A new badge was awarded
    }

    const allFreeThemes = ['light', 'dark', 'forest', 'sunrise'];
    if (allFreeThemes.every(t => unlocked_themes.includes(t)) && !unlocked_badges.includes('Theme Collector')) {
        unlocked_badges.push('Theme Collector');
        toast.success("Achievement Unlocked!", { description: "You’ve earned the Theme Collector badge! 🏆 Keep up your mindful journey." });
        newBadgeAwarded = true; // A new badge was awarded
    }

    // Sacred seed feature removed (Mind Garden deleted)

    if(newBadgeAwarded){
        // Play sound only if user has it enabled (defaults to true)
        if (achievementSoundRef.current && user?.achievement_sounds_enabled !== false) {
            achievementSoundRef.current.currentTime = 0; // Rewind before playing
            achievementSoundRef.current.play().catch(e => console.error("Error playing achievement sound:", e));
        }
        setShowStreakAnimation(true);
        setTimeout(() => setShowStreakAnimation(false), 4000);
    }

    // Update user data
    await User.updateMyUserData({
      meditation_streak,
      total_meditations,
      last_meditation_date: today,
      unlocked_badges,
      unlocked_themes
    });
  };

  const handleSessionComplete = async (sessionData) => {
    setIsLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      await MeditationSession.create({
        ...sessionData,
        date: today
      });
      await processRewards();
      await loadRecentSessions();
      setSelectedMeditation(null);
    } catch (error) {
      console.error("Error saving meditation session:", error);
      toast.error("Failed to save session.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <AnimatePresence>
        {showStreakAnimation && <StreakAnimation />}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Header */}
        <BackHeader 
          title="Guided Meditations" 
          subtitle="Find peace and clarity through mindful practice"
          backTo={createPageUrl("Growth")}
          backLabel="Growth"
        />

        {selectedMeditation ? (
          <div className="max-w-2xl mx-auto">
            <MeditationPlayer
              meditation={selectedMeditation}
              onComplete={handleSessionComplete}
              onBack={() => setSelectedMeditation(null)}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MeditationLibrary onSelect={handleMeditationSelect} />
            </div>
            <div>
              <RecentSessions sessions={recentSessions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
