
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Flame, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format, getDayOfYear, isToday, isYesterday, subDays } from 'date-fns';

const genericChallenges = [
  { text: "Write 3 things you’re grateful for in your journal.", type: 'journal', link: createPageUrl("Journal") },
  { text: "Do a 5-minute breathing meditation.", type: 'meditation', link: createPageUrl("Meditations") },
  { text: "Track your mood for today, noting one positive feeling.", type: 'mood', link: createPageUrl("MoodTracker") },
  { text: "Spend 5 minutes tidying up your physical space.", type: 'action' },
  { text: "Read one educational article in the Resources section.", type: 'resource', link: createPageUrl("Resources") },
  { text: "Take a 10-minute walk outside without your phone.", type: 'action' },
  { text: "Listen to a favorite uplifting song from start to finish.", type: 'action' },
  { text: "Drink a full glass of water right now.", type: 'action' },
];

const groupChallenges = {
  'anxiety-support': [
    { text: "Try a 5-4-3-2-1 grounding exercise. Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.", type: 'action' },
    { text: "Complete the 'Anxiety Relief' meditation.", type: 'meditation', link: createPageUrl("Meditations") },
  ],
  'depression-support': [
    { text: "Step outside for 5 minutes of sunlight.", type: 'action' },
    { text: "Share one small victory or positive thought in your group today.", type: 'community', link: createPageUrl("Community") },
  ],
  'trauma-recovery-ptsd': [
    { text: "Write down one positive affirmation about your strength in your journal.", type: 'journal', link: createPageUrl("Journal") },
  ],
  'adhd-neurodivergence': [
    { text: "Use the 'Focus Boost' meditation to start a task.", type: 'meditation', link: createPageUrl("Meditations") },
  ],
  'bpd-support': [
      { text: "Practice a self-soothing activity for 5 minutes, like listening to calming music or holding a warm mug.", type: 'action'}
  ]
};

const getTodaysChallenge = (user) => {
  const day = getDayOfYear(new Date());
  const primaryGroup = user?.quiz_results?.primary?.group;

  // Every 3rd day, try to show a group-specific challenge if available
  if (primaryGroup && groupChallenges[primaryGroup] && day % 3 === 0) {
    const groupChallengesList = groupChallenges[primaryGroup];
    return groupChallengesList[day % groupChallengesList.length];
  }
  
  // Otherwise, show a generic challenge
  return genericChallenges[day % genericChallenges.length];
};

export default function DailyChallengeCard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');
  const challenge = user ? getTodaysChallenge(user) : genericChallenges[0];

  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.last_challenge_completed_date === todayFormatted) {
        setIsCompletedToday(true);
      } else {
        setIsCompletedToday(false); // Explicitly set to false if not completed today
      }
    } catch (error) {
      console.error("Failed to load user for challenges:", error);
    }
    setIsLoading(false);
  }, [todayFormatted]); // todayFormatted is a dependency because it's used inside loadUserData

  useEffect(() => {
    loadUserData();
  }, [loadUserData]); // loadUserData is a dependency because it's a stable function now due to useCallback
  
  const handleCompleteChallenge = async () => {
    if (!user || isCompletedToday) return;

    let { challenge_streak = 0, last_challenge_completed_date } = user;
    const yesterday = format(subDays(today, 1), 'yyyy-MM-dd');

    if (last_challenge_completed_date === yesterday) {
      challenge_streak++;
    } else if (last_challenge_completed_date !== todayFormatted) { // Ensure it's not today already (though isCompletedToday should prevent)
      challenge_streak = 1; // Reset
    }

    try {
      await User.updateMyUserData({
        challenge_streak,
        last_challenge_completed_date: todayFormatted
      });
      setIsCompletedToday(true);
      await loadUserData(); // Refresh user data
    } catch (error) {
      console.error("Failed to update challenge status:", error);
    }
  };
  
  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-3xl" />;
  }

  if (!user) return null; // Don't show for logged-out users

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 border-0 shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Daily Challenge
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-100 px-3 py-1 rounded-full text-sm">
            <Flame className="w-4 h-4" />
            <span>{user.challenge_streak || 0} Day Streak</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-lg font-medium text-gray-800">{challenge.text}</p>
        
        {isCompletedToday ? (
          <div className="flex flex-col items-center gap-2 text-green-600">
            <div className="flex items-center gap-2 font-semibold bg-green-100 px-4 py-2 rounded-full">
              <Check className="w-5 h-5" />
              <span>Challenge Complete! See you tomorrow.</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-3">
            {challenge.link && (
              <Link to={challenge.link}>
                <Button variant="outline" className="rounded-2xl">
                  Go to {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                </Button>
              </Link>
            )}
            <Button 
              onClick={handleCompleteChallenge}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Check className="w-5 h-5 mr-2" />
              Mark as Complete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
