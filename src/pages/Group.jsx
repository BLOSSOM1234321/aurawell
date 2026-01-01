
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MessageSquare,
  Users,
  Calendar,
  Trophy,
  Video,
  Pin,
  HeartPulse, Sparkles, Sun, Moon, Feather, Baby, GraduationCap, Scale, ShieldHalf, Brain, BookOpen,
  Loader2
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import BackHeader from "../components/navigation/BackHeader";
import LevelSelectionModal from "../components/community/LevelSelectionModal";
import UpcomingLiveCard from "../components/live/UpcomingLiveCard";
import api from "@/api/client";

// Map icon names to Lucide React components
const iconMap = {
    'Heart': Heart,
    'Brain': Brain,
    'BookOpen': BookOpen,
    'MessageSquare': MessageSquare,
    'Users': Users,
    'default': Users,
};

export default function GroupPage() {
  const { id } = useParams();

  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('discussions');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLevelSelection, setShowLevelSelection] = useState(false);
  const [userLevel, setUserLevel] = useState(null);
  const [upcomingLiveSessions, setUpcomingLiveSessions] = useState([]);

  const loadGroup = useCallback(async (groupId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getSupportGroup(groupId);

      if (response.success && response.data) {
        setGroup(response.data);
      } else {
        setError('Group not found.');
      }

      // Load upcoming live sessions
      const sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
      const now = new Date();

      // Find upcoming sessions for this group (within next 7 days)
      const upcoming = sessions
        .filter(s => !s.isLive && new Date(s.start_time) > now)
        .filter(s => {
          const diff = new Date(s.start_time) - now;
          return diff < 7 * 24 * 60 * 60 * 1000; // Within 7 days
        })
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, 2); // Show up to 2 upcoming sessions

      setUpcomingLiveSessions(upcoming);
    } catch (err) {
      console.error('Error loading group:', err);
      setError('Failed to load group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadGroup(id);
    } else {
      setError("No group specified in the URL.");
      setIsLoading(false);
    }
  }, [id, loadGroup]);

  // Check for user level selection
  useEffect(() => {
    const savedLevel = localStorage.getItem('userLevel');
    if (savedLevel) {
      const levelData = JSON.parse(savedLevel);
      // Check if 30-day lock has expired
      const lockExpired = new Date(levelData.lockedUntil) < new Date();
      if (lockExpired) {
        localStorage.removeItem('userLevel');
        setShowLevelSelection(true);
      } else {
        setUserLevel(levelData.level);
      }
    } else {
      // No level selected, show modal
      setShowLevelSelection(true);
    }
  }, []);

  const handleLevelSelect = (level) => {
    setUserLevel(level);
    setShowLevelSelection(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#5C4B99' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
        <MessageCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Oops! An Error Occurred.</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to={createPageUrl('Community')}>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">Back to Community Hub</Button>
        </Link>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center p-4 bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Group Not Found</h2>
        <p className="text-gray-600 mb-6">The community group you're looking for does not exist or has been removed.</p>
        <Link to={createPageUrl('Community')}>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">Back to Community Hub</Button>
        </Link>
      </div>
    );
  }

  // No user check needed for now in mock mode

  const title = group.name;
  const description = group.description;
  const groupIcon = group.icon; // This is the emoji from the database
  const groupColor = group.color || '#5C4B99';

  const groupBgGradient = 'from-purple-500 to-indigo-500';
  const groupIconBg = 'from-purple-500 to-indigo-500';

  // Define stage information for display purposes
  const stageInfo = {
    beginner: { title: "New to This Journey", color: "from-green-400 to-emerald-500" },
    intermediate: { title: "Growing & Learning", color: "from-blue-400 to-indigo-500" },
    advanced: { title: "Experienced & Supporting", color: "from-purple-400 to-violet-500" }
  };

  return (
    <>
      {/* Level Selection Modal - shows FIRST before everything */}
      {showLevelSelection && (
        <LevelSelectionModal onSelectLevel={handleLevelSelect} />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`min-h-screen bg-gradient-to-br ${groupBgGradient} p-4 md:p-8`}
      >
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Back Header */}
          <BackHeader
            title={title}
            subtitle={description}
            backTo={createPageUrl("Groups")}
            backLabel="All Groups"
          />

        {/* Current Level Display */}
        {userLevel && (
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl shadow-lg bg-gradient-to-br ${stageInfo[userLevel]?.color || groupIconBg} flex items-center justify-center text-4xl`}>
              {groupIcon}
            </div>
            <div className="flex flex-col gap-1">
              <Badge className="bg-white/20 text-white border-white/30 self-start">
                <Users className="w-3 h-3 mr-1" />
                {stageInfo[userLevel]?.title || userLevel} level
              </Badge>
              <span className="text-sm text-white/90">You're in the {userLevel} level of this community</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4">
          <Button
            onClick={() => setActiveTab('discussions')}
            className={`rounded-2xl ${activeTab === 'discussions'
              ? 'bg-white text-gray-800'
              : 'bg-white/20 text-white border border-white/30'
            }`}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Discussions
          </Button>
          <Button
            onClick={() => setActiveTab('events')}
            className={`rounded-2xl ${activeTab === 'events'
              ? 'bg-white text-gray-800'
              : 'bg-white/20 text-white border border-white/30'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Events & Challenges
          </Button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'discussions' ? (
            <motion.div
              key="discussions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Upcoming Live Sessions */}
              {upcomingLiveSessions.length > 0 && (
                <div className="space-y-4">
                  {upcomingLiveSessions.map((session) => (
                    <UpcomingLiveCard key={session.id} session={session} compact={false} />
                  ))}
                </div>
              )}

              {/* Welcome Card */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="text-center py-16">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Welcome to {title}</h3>
                  <p className="text-gray-500 mb-4">You're at the {userLevel} level</p>
                  <p className="text-gray-500">Discussion features coming soon!</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="text-center py-16">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Events & Challenges</h3>
                  <p className="text-gray-500">Events and challenges coming soon!</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
    </>
  );
}
