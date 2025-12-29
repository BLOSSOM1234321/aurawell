import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Clock,
  User,
  AlertTriangle,
  Radio,
  Calendar,
  Heart,
  Shield,
  PlayCircle,
  Video,
  EyeOff,
  Film
} from "lucide-react";
import { toast } from "sonner";
import PreJoinModal from "../components/live/PreJoinModal";
import GroundingExerciseModal from "../components/live/GroundingExerciseModal";
import LiveSessionChat from "../components/live/LiveSessionChat";
import RecordedSessionCard from "../components/live/RecordedSessionCard";
import RecordedSessionPlayer from "../components/live/RecordedSessionPlayer";

export default function LiveSessions() {
  const [user, setUser] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedRecordedSession, setSelectedRecordedSession] = useState(null);
  const [showPreJoin, setShowPreJoin] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [showRecordedPlayer, setShowRecordedPlayer] = useState(false);
  const [joinedSession, setJoinedSession] = useState(null);
  const [notifyForSessions, setNotifyForSessions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Get current user
    const currentUserData = localStorage.getItem('aurawell_current_user');
    if (currentUserData) {
      setUser(JSON.parse(currentUserData));
    }

    // Load notification preferences
    const notifications = JSON.parse(localStorage.getItem('live_session_notifications') || '[]');
    setNotifyForSessions(notifications);

    // Load or create demo live sessions
    let sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');

    if (sessions.length === 0) {
      // Create some demo sessions
      sessions = [
        {
          id: 'live-1',
          title: 'Anxiety Support Circle',
          therapist_name: 'Dr. Sarah Thompson',
          therapist_id: 'therapist-001',
          description: 'A safe space to discuss anxiety management techniques and support each other.',
          status: 'live',
          participants: 12,
          max_participants: 20,
          start_time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // Started 15 mins ago
          duration: 60, // minutes
          category: 'anxiety',
          triggerWarnings: ['anxiety', 'panic_attacks', 'stress'],
          isLive: true,
          isEphemeral: false // This session WILL be recorded
        },
        {
          id: 'live-2',
          title: 'Safe Space: Trauma Check-In',
          therapist_name: 'Dr. Michael Chen',
          therapist_id: 'therapist-002',
          description: 'A confidential group check-in for trauma survivors. This session will NOT be recorded.',
          status: 'live',
          participants: 5,
          max_participants: 8, // Smaller cap for ephemeral
          start_time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          duration: 45,
          category: 'trauma',
          triggerWarnings: ['trauma', 'abuse', 'ptsd'],
          isLive: true,
          isEphemeral: true // EPHEMERAL - No recording
        },
        {
          id: 'live-3',
          title: 'Morning Mindfulness Practice',
          therapist_name: 'Dr. Lisa Park',
          therapist_id: 'therapist-004',
          description: 'Start your day with guided meditation and mindful breathing.',
          status: 'scheduled',
          participants: 0,
          max_participants: 15,
          start_time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // In 1 hour
          duration: 30,
          category: 'mindfulness',
          triggerWarnings: [],
          isLive: false,
          isEphemeral: false // Will be recorded
        },
        {
          id: 'live-4',
          title: 'Grief & Loss Support Circle',
          therapist_name: 'Dr. Emma Rodriguez',
          therapist_id: 'therapist-003',
          description: 'A compassionate, confidential space for those navigating grief. This session will NOT be recorded to protect your privacy.',
          status: 'scheduled',
          participants: 0,
          max_participants: 10, // Smaller cap
          start_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // In 3 hours
          duration: 60,
          category: 'grief',
          triggerWarnings: ['grief_loss', 'death', 'trauma'],
          isLive: false,
          isEphemeral: true // EPHEMERAL - No recording
        }
      ];

      localStorage.setItem('live_sessions', JSON.stringify(sessions));
    }

    setLiveSessions(sessions);

    // Load or create recorded sessions
    let recorded = JSON.parse(localStorage.getItem('recorded_sessions') || '[]');

    if (recorded.length === 0) {
      // Create demo recorded sessions
      recorded = [
        {
          id: 'recorded-1',
          title: 'Understanding Anxiety: A Psychoeducation Session',
          hostName: 'Dr. Sarah Thompson',
          type: 'psychoeducation',
          duration: 45,
          recordedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          description: 'Learn about the science of anxiety, common triggers, and evidence-based coping strategies.',
          triggerWarnings: ['anxiety', 'stress'],
          videoUrl: null // Placeholder
        },
        {
          id: 'recorded-2',
          title: 'Guided Breathwork for Calm',
          hostName: 'Dr. Michael Chen',
          type: 'breathwork',
          duration: 20,
          recordedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          description: 'A gentle guided breathwork session to help you find calm and center yourself.',
          triggerWarnings: [],
          videoUrl: null
        },
        {
          id: 'recorded-3',
          title: 'Navigating Grief: Support and Tools',
          hostName: 'Dr. Emma Rodriguez',
          type: 'educational',
          duration: 60,
          recordedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          description: 'Understanding the grief process and learning healthy ways to process loss.',
          triggerWarnings: ['grief', 'loss', 'death'],
          videoUrl: null
        },
        {
          id: 'recorded-4',
          title: 'Morning Meditation Practice',
          hostName: 'Dr. Michael Chen',
          type: 'guided-exercise',
          duration: 30,
          recordedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
          description: 'Start your day with intention through guided meditation and mindfulness practices.',
          triggerWarnings: [],
          videoUrl: null
        }
      ];

      localStorage.setItem('recorded_sessions', JSON.stringify(recorded));
    }

    setRecordedSessions(recorded);
  };

  const handleWatchRecorded = (session) => {
    setSelectedRecordedSession(session);
    setShowRecordedPlayer(true);
  };

  const handleJoinClick = (session) => {
    setSelectedSession(session);
    setShowPreJoin(true);
  };

  const handleJoinSession = () => {
    setShowPreJoin(false);
    setJoinedSession(selectedSession);
    toast.success(`Joined ${selectedSession.title}`);

    // Update participant count
    const sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
    const sessionIndex = sessions.findIndex(s => s.id === selectedSession.id);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].participants += 1;
      localStorage.setItem('live_sessions', JSON.stringify(sessions));
      loadData();
    }
  };

  const handleGroundingComplete = () => {
    setShowGrounding(false);
    setShowPreJoin(true);
  };

  const handleLeaveSession = () => {
    if (joinedSession) {
      // Update participant count
      const sessions = JSON.parse(localStorage.getItem('live_sessions') || '[]');
      const sessionIndex = sessions.findIndex(s => s.id === joinedSession.id);
      if (sessionIndex !== -1) {
        sessions[sessionIndex].participants = Math.max(0, sessions[sessionIndex].participants - 1);
        localStorage.setItem('live_sessions', JSON.stringify(sessions));
        loadData();
      }

      setJoinedSession(null);
      toast.info("Left the session");
    }
  };

  const handleNotifyMe = (sessionId) => {
    const notifications = JSON.parse(localStorage.getItem('live_session_notifications') || '[]');

    if (notifications.includes(sessionId)) {
      // Remove notification
      const updated = notifications.filter(id => id !== sessionId);
      localStorage.setItem('live_session_notifications', JSON.stringify(updated));
      setNotifyForSessions(updated);
      toast.info("Notification removed");
    } else {
      // Add notification
      const updated = [...notifications, sessionId];
      localStorage.setItem('live_session_notifications', JSON.stringify(updated));
      setNotifyForSessions(updated);
      toast.success("You'll be notified before this session starts");
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getTimeUntil = (isoString) => {
    const now = new Date();
    const start = new Date(isoString);
    const diff = start - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return "Live now";
    if (hours > 0) return `In ${hours}h ${minutes}m`;
    return `In ${minutes}m`;
  };

  // If user has joined a session, show the live session view
  if (joinedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Live Session Header */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-3 bg-red-600 rounded-full">
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{joinedSession.title}</h1>
                  <p className="text-sm text-gray-600">
                    Hosted by {joinedSession.therapist_name}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLeaveSession}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Leave Session
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{joinedSession.participants} participants</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{joinedSession.duration} minutes</span>
              </div>
            </div>
          </div>

          {/* Live Session Content */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              {/* Session Info Banner */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 mb-3">
                  {joinedSession.description}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>This is a safe, moderated space</span>
                </div>
              </div>

              {/* Live Session Chat with Crisis Detection */}
              <LiveSessionChat
                sessionId={joinedSession.id}
                userId={user?.id || 'user-demo'}
                userName={user?.name || 'Anonymous User'}
                onPauseSession={(reason) => {
                  // Minimize/pause the session when high risk is detected
                  console.log('Session paused for user due to:', reason);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-6">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-gray-900">Live Support Sessions</h1>
          <p className="text-gray-600">
            Join live sessions hosted by licensed therapists
          </p>
        </motion.div>

        {/* Live Now Sessions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h2 className="text-xl font-semibold text-gray-900">Live Now</h2>
          </div>

          <div className="grid gap-4">
            {liveSessions.filter(s => s.isLive).map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                            LIVE
                          </span>
                          {session.isEphemeral ? (
                            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              NOT RECORDED
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                              <Film className="w-3 h-3" />
                              WILL BE RECORDED
                            </span>
                          )}
                          <span className="text-sm text-gray-600">
                            {session.participants}/{session.max_participants} joined
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {session.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{session.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{session.therapist_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration} min</span>
                          </div>
                        </div>

                        {/* Trigger Warnings */}
                        {session.triggerWarnings && session.triggerWarnings.length > 0 && (
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-orange-700">Content advisory:</span>
                            {session.triggerWarnings.slice(0, 3).map((warning, i) => (
                              <span
                                key={i}
                                className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded"
                              >
                                {warning.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handleJoinClick(session)}
                        disabled={session.participants >= session.max_participants}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 ml-4"
                      >
                        {session.participants >= session.max_participants ? "Full" : "Join Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
          </div>

          <div className="grid gap-4">
            {liveSessions.filter(s => !s.isLive).map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                            {getTimeUntil(session.start_time)}
                          </span>
                          {session.isEphemeral ? (
                            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                              <EyeOff className="w-3 h-3" />
                              NOT RECORDED
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                              <Film className="w-3 h-3" />
                              WILL BE RECORDED
                            </span>
                          )}
                          <span className="text-sm text-gray-600">
                            {formatTime(session.start_time)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {session.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">{session.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{session.therapist_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{session.max_participants} spots</span>
                          </div>
                        </div>

                        {/* Trigger Warnings */}
                        {session.triggerWarnings && session.triggerWarnings.length > 0 && (
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-orange-700">Content advisory:</span>
                            {session.triggerWarnings.slice(0, 3).map((warning, i) => (
                              <span
                                key={i}
                                className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded"
                              >
                                {warning.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handleNotifyMe(session.id)}
                        className={`${
                          notifyForSessions.includes(session.id)
                            ? 'bg-purple-100 border-purple-400 text-purple-700'
                            : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                        } rounded-xl px-6 ml-4`}
                      >
                        {notifyForSessions.includes(session.id) ? 'Subscribed' : 'Notify Me'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recorded Sessions */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recorded Sessions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recordedSessions.slice(0, 4).map((session) => (
              <RecordedSessionCard
                key={session.id}
                session={session}
                onWatch={handleWatchRecorded}
              />
            ))}
          </div>

          {recordedSessions.length > 4 && (
            <div className="mt-4 text-center">
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <PlayCircle className="w-4 h-4 mr-2" />
                View All Recorded Sessions
              </Button>
            </div>
          )}
        </div>

        {/* Safety Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">Safe & Supportive Environment</h3>
                <p className="text-sm text-purple-800">
                  All live sessions are moderated by licensed therapists and follow strict community guidelines.
                  Before joining, you'll review the session goals and ground rules.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pre-Join Modal */}
      {showPreJoin && selectedSession && (
        <PreJoinModal
          session={selectedSession}
          onJoin={handleJoinSession}
          onCancel={() => setShowPreJoin(false)}
          onGrounding={() => {
            setShowPreJoin(false);
            setShowGrounding(true);
          }}
        />
      )}

      {/* Grounding Exercise Modal */}
      {showGrounding && (
        <GroundingExerciseModal
          onClose={() => setShowGrounding(false)}
          onComplete={handleGroundingComplete}
        />
      )}

      {/* Recorded Session Player */}
      {showRecordedPlayer && selectedRecordedSession && (
        <RecordedSessionPlayer
          session={selectedRecordedSession}
          onClose={() => {
            setShowRecordedPlayer(false);
            setSelectedRecordedSession(null);
          }}
          onGrounding={() => {
            setShowRecordedPlayer(false);
            setShowGrounding(true);
          }}
        />
      )}
    </div>
  );
}