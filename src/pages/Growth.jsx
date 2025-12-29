
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Activity, 
  Sprout, 
  Star, 
  Gem, 
  Flame,
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  Bird,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const growthFeatures = [
  {
    id: "mood",
    title: "Mood Tracking",
    description: "Daily check-ins and emotional insights",
    icon: Activity,
    color: "from-blue-400 to-indigo-500",
    route: "MoodTracker",
    premium: false
  },
  {
    id: "achievements",
    title: "Progress & Rewards",
    description: "Streaks, badges & milestones",
    icon: Trophy,
    color: "from-amber-400 to-orange-500",
    route: null,
    premium: false
  }
];

export default function Growth() {
  const [user, setUser] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
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

  const handleFeatureClick = (feature) => {
    if (feature.route) {
      // Use Link navigation instead of window.location
      return;
    } else {
      setSelectedFeature(feature);
    }
  };

  const closeModal = () => setSelectedFeature(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Bird className="w-8 h-8 text-accent animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <Sprout className="w-10 h-10 mx-auto" style={{ color: '#5C4B99' }} />
          <h1 className="text-2xl font-light text-primary">Your Growth Journey</h1>
          <p className="text-secondary">Track progress, celebrate wins, keep growing</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-light shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4" style={{ color: '#5C4B99' }} />
                    <span className="text-xl font-semibold text-primary">
                      {user?.mood_streak || 0}
                    </span>
                  </div>
                  <p className="text-xs text-secondary">Mood Streak</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4" style={{ color: '#5C4B99' }} />
                    <span className="text-xl font-semibold text-primary">
                      {(user?.unlocked_badges || []).length}
                    </span>
                  </div>
                  <p className="text-xs text-secondary">Badges</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="w-4 h-4" style={{ color: '#5C4B99' }} />
                    <span className="text-xl font-semibold text-primary">
                      {user?.challenge_streak || 0}
                    </span>
                  </div>
                  <p className="text-xs text-secondary">Challenges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Growth Features */}
        <div className="space-y-3">
          {growthFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {feature.route ? (
                <Link to={createPageUrl(feature.route)}>
                  <Card className="bg-card border-light shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full bg-white/10`}>
                          <feature.icon className="w-6 h-6" style={{ color: '#5C4B99' }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-primary">{feature.title}</h3>
                            {feature.premium && (
                              <Badge className="bg-accent/20 text-accent border-0">Premium</Badge>
                            )}
                          </div>
                          <p className="text-sm text-secondary">{feature.description}</p>
                        </div>
                        <div style={{ color: '#5C4B99' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card 
                  className="bg-card border-light shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleFeatureClick(feature)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-white/10`}>
                        <feature.icon className="w-6 h-6" style={{ color: '#5C4B99' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-primary">{feature.title}</h3>
                          {feature.premium && (
                            <Badge className="bg-accent/20 text-accent border-0">Premium</Badge>
                          )}
                        </div>
                        <p className="text-sm text-secondary">{feature.description}</p>
                      </div>
                      <div style={{ color: '#5C4B99' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Gentle encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center py-6"
        >
          <Bird className="w-6 h-6 mx-auto mb-2" style={{ color: '#5C4B9980' }} />
          <p className="text-sm text-secondary">Every small step counts on your journey</p>
        </motion.div>
      </div>

      {/* Achievement Modal */}
      <AnimatePresence>
        {selectedFeature && selectedFeature.id === 'achievements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border-light rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-accent/20 rounded-full">
                    <Trophy className="w-6 h-6" style={{ color: '#5C4B99' }} />
                  </div>
                  <h2 className="text-xl font-medium text-primary">Your Achievements</h2>
                </div>

                {/* Streaks */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium text-primary">Current Streaks</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <Flame className="w-5 h-5 mx-auto mb-1" style={{ color: '#5C4B99' }} />
                      <p className="text-lg font-semibold text-primary">{user?.mood_streak || 0}</p>
                      <p className="text-xs text-secondary">Mood Days</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg text-center">
                      <Brain className="w-5 h-5 mx-auto mb-1" style={{ color: '#5C4B99' }} />
                      <p className="text-lg font-semibold text-primary">{user?.meditation_streak || 0}</p>
                      <p className="text-xs text-secondary">Meditation Days</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="space-y-4">
                  <h3 className="font-medium text-primary">Earned Badges</h3>
                  {(user?.unlocked_badges || []).length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {(user?.unlocked_badges || []).slice(0, 6).map((badge, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg text-center">
                          <Star className="w-5 h-5 mx-auto mb-1" style={{ color: '#5C4B99' }} />
                          <p className="text-xs text-secondary">{badge}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-secondary text-center py-4">
                      Keep growing to earn your first badge!
                    </p>
                  )}
                </div>

                <Button onClick={closeModal} className="w-full mt-6 btn-peach rounded-xl">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
