import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  X,
  AlertTriangle,
  Heart,
  Wind,
  SkipForward,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/**
 * RecordedSessionPlayer - Video player for recorded live sessions
 *
 * Safety Features:
 * - Trigger warnings displayed prominently
 * - Exit-to-grounding always visible
 * - Skip-ahead controls
 * - No live chat/comments
 * - Pause/resume controls
 */
export default function RecordedSessionPlayer({ session, onClose, onGrounding }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTriggerWarning, setShowTriggerWarning] = useState(
    session.triggerWarnings && session.triggerWarnings.length > 0
  );
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control actual video playback
    toast.info(isPlaying ? 'Paused' : 'Playing');
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleSkipAhead = (seconds) => {
    const newTime = Math.min(currentTime + seconds, session.duration * 60);
    setCurrentTime(newTime);
    toast.success(`Skipped ahead ${seconds} seconds`);
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * session.duration * 60;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return (currentTime / (session.duration * 60)) * 100;
  };

  const handleAcknowledgeWarning = () => {
    setShowTriggerWarning(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Trigger Warning Overlay */}
        <AnimatePresence>
          {showTriggerWarning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black bg-opacity-95 flex items-center justify-center z-10 p-6"
            >
              <Card className="max-w-md bg-orange-50 border-4 border-orange-400">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-orange-100 rounded-full">
                      <AlertTriangle className="w-12 h-12 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-orange-900">
                      Content Warning
                    </h2>
                    <p className="text-orange-800">
                      This recorded session contains discussion of:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {session.triggerWarnings.map((warning, index) => (
                        <Badge
                          key={index}
                          className="bg-orange-200 text-orange-900 text-sm px-3 py-1"
                        >
                          {warning}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-orange-700">
                      You can exit at any time or use grounding exercises if needed.
                    </p>
                    <div className="flex gap-3 w-full">
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 border-orange-400 text-orange-700 hover:bg-orange-100"
                      >
                        Go Back
                      </Button>
                      <Button
                        onClick={handleAcknowledgeWarning}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        I Understand, Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Player */}
        <Card className="bg-gray-900 border-0 overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-purple-600 text-white">REPLAY</Badge>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-200">
                    {session.type.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <h2 className="text-white font-semibold text-lg">{session.title}</h2>
                <p className="text-purple-200 text-sm">{session.hostName}</p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-white hover:bg-purple-800 rounded-full p-2"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Video Area (Placeholder) */}
            <div className="relative bg-black aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/30" />

              {/* Play/Pause Overlay */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                className="relative z-10 p-8 bg-purple-600 rounded-full shadow-2xl hover:bg-purple-700 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-16 h-16 text-white" />
                ) : (
                  <Play className="w-16 h-16 text-white ml-2" />
                )}
              </motion.button>

              {/* Session Info Overlay */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-60 rounded-lg p-3">
                <p className="text-white text-sm">
                  {session.description || 'Recorded live session'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-4 space-y-3">
              {/* Progress Bar */}
              <div
                onClick={handleProgressClick}
                className="w-full h-2 bg-gray-700 rounded-full cursor-pointer relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-purple-600"
                  style={{ width: `${getProgress()}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgress()}%` }}
                />
              </div>

              {/* Time */}
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(session.duration * 60)}</span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePlayPause}
                    variant="ghost"
                    className="text-white hover:bg-gray-700 p-2"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>

                  <Button
                    onClick={handleMuteToggle}
                    variant="ghost"
                    className="text-white hover:bg-gray-700 p-2"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>

                  {/* Skip Ahead */}
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      onClick={() => handleSkipAhead(10)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      +10s
                    </Button>
                    <Button
                      onClick={() => handleSkipAhead(30)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <SkipForward className="w-4 h-4 mr-1" />
                      +30s
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-700 p-2"
                >
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Safety Actions - Always Visible */}
            <div className="bg-gradient-to-r from-blue-900 to-teal-900 p-4">
              <p className="text-blue-100 text-xs mb-3 text-center">
                You can pause or exit anytime. Your wellbeing comes first.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onGrounding}
                  variant="outline"
                  className="border-2 border-teal-400 text-teal-100 hover:bg-teal-800 font-semibold"
                >
                  <Wind className="w-4 h-4 mr-2" />
                  Grounding Exercise
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-2 border-blue-400 text-blue-100 hover:bg-blue-800 font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Exit Session
                </Button>
              </div>
            </div>

            {/* No Comments Notice */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
              <p className="text-gray-400 text-sm text-center">
                <Heart className="w-4 h-4 inline mr-1" />
                Comments are disabled on replays to maintain a safe, supportive environment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}