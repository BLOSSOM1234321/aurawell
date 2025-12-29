
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import SacredSpaceBackground from './SacredSpaceBackground';

export default function SacredSpaceTimer({ theme, onSessionStart, onSessionComplete, activeSession }) {
  const [duration, setDuration] = useState(10); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('meditation');
  const intervalRef = useRef(null);

  const handleSessionComplete = useCallback(() => {
    setIsActive(false);
    onSessionComplete({
      duration_minutes: duration,
      session_type: sessionType,
      completedTime: new Date()
    });
  }, [duration, sessionType, onSessionComplete]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, handleSessionComplete]);

  const handleStart = () => {
    const totalSeconds = duration * 60;
    setTimeLeft(totalSeconds);
    setIsActive(true);
    onSessionStart({
      duration_minutes: duration,
      session_type: sessionType,
      startTime: new Date()
    });
  };

  const handlePause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft > 0 ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;

  return (
    <div className="relative min-h-[600px] rounded-3xl overflow-hidden">
      <SacredSpaceBackground theme={theme} isActive={isActive} progress={progress} />
      
      <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-white">
        
        {!isActive && timeLeft === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-8"
          >
            {/* Session Type Selection */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold">Prepare Your Sacred Space</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'meditation', label: 'Meditation', icon: '🧘' },
                  { id: 'journaling', label: 'Journaling', icon: '✍️' },
                  { id: 'reflection', label: 'Reflection', icon: '💭' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSessionType(type.id)}
                    className={`p-4 rounded-2xl transition-all ${
                      sessionType === type.id 
                        ? 'bg-white/30 ring-2 ring-white/50' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="text-center space-y-4">
              <h4 className="text-xl font-medium">Set Your Duration</h4>
              <div className="text-4xl font-light">{duration} min</div>
              <div className="px-4">
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={5}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm opacity-70">
                <span>5 min</span>
                <span>60 min</span>
              </div>
            </div>

            <Button
              onClick={handleStart}
              className="w-full h-16 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl text-xl font-semibold backdrop-blur-sm"
            >
              <Play className="w-6 h-6 mr-3" />
              Begin Sacred Session
            </Button>
          </motion.div>
        )}

        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            {/* Breathing Guide */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <div className="text-sm font-medium">Breathe</div>
            </motion.div>

            {/* Timer Display */}
            <div className="space-y-4">
              <div className="text-6xl font-light tracking-wider">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg opacity-80 capitalize">
                {sessionType} Session
              </div>
            </div>

            {/* Progress Ring */}
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="white/20"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  className="opacity-80"
                />
              </svg>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handlePause}
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-2xl p-4"
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button
                onClick={handleReset}
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-2xl p-4"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
