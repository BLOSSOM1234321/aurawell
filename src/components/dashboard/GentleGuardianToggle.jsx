
import React, { useState } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Crown } from 'lucide-react';
import { toast } from 'sonner';

const gentleMessages = [
  "You are safe. Breathe.",
  "This moment will pass. You're okay.",
  "Take it one breath at a time.",
  "You are stronger than you know.",
  "Peace is within reach. Let it find you.",
  "Ground yourself. You are here. You are safe.",
  "Gentle healing is happening now.",
  "Your feelings are valid. You matter."
];

export default function GentleGuardianToggle({ user, onToggle }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!user?.is_premium) {
      toast.error("Gentle Guardian Mode is a Premium feature");
      return;
    }

    setIsLoading(true);
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      if (user.gentle_guardian_enabled) {
        // Turning OFF - end current session
        const sessions = user.gentle_guardian_sessions || [];
        const currentSession = sessions[sessions.length - 1];
        
        if (currentSession && !currentSession.end_time) {
          const sessionDuration = Math.round((now - new Date(currentSession.start_time)) / (1000 * 60));
          currentSession.end_time = now.toISOString();
          currentSession.duration_minutes = sessionDuration;
        }

        await User.updateMyUserData({
          gentle_guardian_enabled: false,
          gentle_guardian_sessions: sessions,
          total_gentle_guardian_minutes: (user.total_gentle_guardian_minutes || 0) + (currentSession?.duration_minutes || 0)
        });
        
        toast.success("Gentle Guardian Mode deactivated. You did great. 💜");
      } else {
        // Turning ON - start new session and update streak
        const sessions = [...(user.gentle_guardian_sessions || [])];
        sessions.push({
          start_time: now.toISOString(),
          end_time: null,
          duration_minutes: 0
        });

        // Calculate streak
        let newStreak = user.gentle_guardian_streak || 0;
        if (user.last_gentle_guardian_date === today) {
          // Already used today, don't increment
        } else if (user.last_gentle_guardian_date) {
          const lastDate = new Date(user.last_gentle_guardian_date);
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
            newStreak += 1;
          } else {
            newStreak = 1; // Reset streak
          }
        } else {
          newStreak = 1; // First time
        }

        await User.updateMyUserData({
          gentle_guardian_enabled: true,
          gentle_guardian_sessions: sessions,
          gentle_guardian_streak: newStreak,
          last_gentle_guardian_date: today
        });
        
        toast.success("Gentle Guardian Mode activated. You're safe here. 🛡️");
      }
      
      onToggle();
    } catch (error) {
      console.error("Failed to toggle Gentle Guardian Mode:", error);
      toast.error("Failed to toggle mode. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {user?.is_premium ? (
        <Button
          onClick={handleToggle}
          disabled={isLoading}
          className={`rounded-2xl font-medium text-white hover:opacity-90`}
          style={{ backgroundColor: user?.gentle_guardian_enabled ? 'rgb(var(--accent-coral))' : '#5C4B99' }}
        >
          <Shield className={`w-4 h-4 mr-2 text-white`} />
          {user?.gentle_guardian_enabled ? 'Guardian On' : 'Gentle Guardian'}
        </Button>
      ) : (
        <Badge className="bg-accent/20 text-accent px-3 py-2 rounded-2xl cursor-not-allowed opacity-60 border-0">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      )}
    </div>
  );
}

export { gentleMessages };
