import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Sparkles, Gem, Trophy, Star, Crown } from 'lucide-react';
import { toast } from 'sonner';
import AchievementBadge from '../rewards/AchievementBadge';

const allBadges = [
  { id: 'You Showed Up', title: 'You Showed Up', icon: Sparkles, description: "Completed your first meditation." },
  { id: 'One Week of Calm', title: 'Mindful Streaker', icon: Award, description: "Maintained a 7-day streak." },
  { id: 'Grounded & Growing', title: 'Grounded & Growing', icon: Trophy, description: "Meditated for 14 days straight." },
  { id: 'One Month of Mindfulness', title: 'Consistency Champion', icon: Gem, description: "Maintained a 30-day streak." },
  { id: '100 Moments of Peace', title: '100 Moments of Peace', icon: Star, description: "Completed 100 meditations." },
  { id: 'Premium Explorer', title: 'Premium Explorer', icon: Crown, description: "Explored the benefits of Premium." },
];

export default function RewardsCenter() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await User.me();
        setUserData(user);
      } catch (error) {
        console.error("Failed to load user for rewards:", error);
      }
      setIsLoading(false);
    };
    loadUserData();
    const interval = setInterval(loadUserData, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-card border-0 shadow-color">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-24" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return null; // Don't show for logged-out users
  }

  const { meditation_streak = 0, unlocked_badges = [] } = userData;

  return (
    <Card className="bg-card border-0 shadow-color">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
            <Star className="w-5 h-5 text-white" />
          </div>
          Your Journey & Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-secondary mb-2">Current Streak</h3>
          <p className="text-4xl font-bold text-primary">{meditation_streak} {meditation_streak === 1 ? 'Day' : 'Days'}</p>
          <p className="text-sm text-secondary">Keep showing up for yourself!</p>
        </div>

        <div>
          <h3 className="font-semibold text-secondary mb-3">Achievements</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allBadges.map(badge => (
              <AchievementBadge 
                key={badge.id}
                badge={badge}
                isUnlocked={unlocked_badges.includes(badge.id)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}