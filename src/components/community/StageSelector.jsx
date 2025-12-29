import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Calendar, CheckCircle2 } from "lucide-react";
import { format, addDays, isBefore } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";

const stageInfo = {
  beginner: {
    title: "New to This Journey",
    description: "Just starting out and learning the basics",
    color: "from-green-400 to-emerald-500",
    textColor: "text-green-700"
  },
  intermediate: {
    title: "Growing & Learning", 
    description: "Have some experience and ready to deepen understanding",
    color: "from-blue-400 to-indigo-500",
    textColor: "text-blue-700"
  },
  advanced: {
    title: "Experienced & Supporting",
    description: "Well-versed and able to support others in their journey",
    color: "from-purple-400 to-violet-500", 
    textColor: "text-purple-700"
  }
};

export default function StageSelector({ onStageSet, showTitle = true }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);

  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load your information");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleStageSelection = async (selectedStage) => {
    if (isSelecting || !user) return;

    // Check if user is trying to change stages before the lock period expires
    if (user.community_stage && user.stage_can_change_after) {
      const canChangeAfter = new Date(user.stage_can_change_after);
      const now = new Date();
      
      if (isBefore(now, canChangeAfter)) {
        const daysLeft = Math.ceil((canChangeAfter - now) / (1000 * 60 * 60 * 24));
        toast.error(`You can switch stages after ${daysLeft} days (${format(canChangeAfter, 'MMM d, yyyy')})`);
        return;
      }

      // If trying to select the same stage after lock period
      if (user.community_stage === selectedStage) {
        toast.info(`You are already in the ${stageInfo[selectedStage].title} stage.`);
        return;
      }
    }

    setIsSelecting(true);
    try {
      const now = new Date();
      const canChangeAfter = addDays(now, 30);
      
      const updatedUserData = {
        community_stage: selectedStage,
        stage_selected_date: now.toISOString(),
        stage_can_change_after: canChangeAfter.toISOString()
      };

      await User.updateMyUserData(updatedUserData);
      
      // Update local user state
      const updatedUser = { ...user, ...updatedUserData };
      setUser(updatedUser);
      
      toast.success(`Welcome to the ${stageInfo[selectedStage].title} stage! You can change this again on ${format(canChangeAfter, 'MMM d, yyyy')}.`);
      
      // Notify parent component
      if (onStageSet) {
        onStageSet(updatedUser);
      }
      
    } catch (error) {
      console.error("Error selecting stage:", error);
      toast.error("Failed to select stage. Please try again.");
    }
    setIsSelecting(false);
  };

  const isStageChangeAllowed = () => {
    if (!user?.community_stage || !user?.stage_can_change_after) return true;
    
    const canChangeAfter = new Date(user.stage_can_change_after);
    const now = new Date();
    return !isBefore(now, canChangeAfter);
  };

  const getDaysUntilUnlock = () => {
    if (!user?.stage_can_change_after || isStageChangeAllowed()) return 0;
    
    const canChangeAfter = new Date(user.stage_can_change_after);
    const now = new Date();
    return Math.ceil((canChangeAfter - now) / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-secondary">Loading your stage information...</div>
      </div>
    );
  }

  // If user has a current stage and it's locked, show the locked stage
  if (user?.community_stage && !isStageChangeAllowed()) {
    const currentStage = stageInfo[user.community_stage];
    const daysLeft = getDaysUntilUnlock();
    const unlockDate = new Date(user.stage_can_change_after);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {showTitle && (
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-primary">Your Current Stage</h2>
            <p className="text-sm text-secondary">You can change your stage selection in {daysLeft} days</p>
          </div>
        )}

        <Card className={`bg-gradient-to-r ${currentStage.color} border-0 shadow-lg relative overflow-hidden`}>
          <div className="absolute top-2 right-2">
            <Lock className="w-5 h-5 text-white/80" />
          </div>
          <CardContent className="p-6 text-center text-white">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="text-lg font-bold">{currentStage.title}</h3>
              </div>
              <p className="text-white/90">{currentStage.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-white/80 mt-4">
                <Calendar className="w-4 h-4" />
                <span>Can change on {format(unlockDate, 'MMM d, yyyy')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-secondary">
            This 30-day commitment helps maintain meaningful discussions within each stage.
          </p>
        </div>
      </motion.div>
    );
  }

  // Show stage selection options
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {showTitle && (
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-primary">
            {user?.community_stage ? "Change Your Stage" : "Choose Your Stage"}
          </h2>
          <p className="text-sm text-secondary">
            {user?.community_stage 
              ? "Your 30-day commitment period has ended. You can now select a new stage."
              : "Select the stage that best describes your current journey. You'll be able to change this in 30 days."
            }
          </p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(stageInfo).map(([stage, info]) => (
          <Card 
            key={stage}
            className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-2 ${
              user?.community_stage === stage 
                ? 'border-accent shadow-lg' 
                : 'border-light hover:border-accent/50'
            }`}
            onClick={() => handleStageSelection(stage)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${info.color}`}></div>
                    <h3 className="font-semibold text-primary">{info.title}</h3>
                    {user?.community_stage === stage && (
                      <Badge className="bg-accent/20 text-accent border-0">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-secondary">{info.description}</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {isSelecting ? (
                    <div className="w-5 h-5 border-2 border-accent border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${info.color} flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold">
                        {stage === 'beginner' ? '1' : stage === 'intermediate' ? '2' : '3'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs text-secondary">
          💡 Once selected, you'll be committed to this stage for 30 days to foster meaningful connections.
        </p>
        <p className="text-xs text-secondary">
          This helps maintain consistent discussions and prevents stage-hopping.
        </p>
      </div>
    </motion.div>
  );
}