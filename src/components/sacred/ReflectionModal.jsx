import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Heart, Star, Sparkles } from 'lucide-react';

const moodOptions = [
  { id: 'peaceful', label: 'Peaceful', emoji: '😌', color: 'text-blue-600' },
  { id: 'grateful', label: 'Grateful', emoji: '🙏', color: 'text-emerald-600' },
  { id: 'calm', label: 'Calm', emoji: '😊', color: 'text-teal-600' },
  { id: 'centered', label: 'Centered', emoji: '🧘', color: 'text-purple-600' },
  { id: 'refreshed', label: 'Refreshed', emoji: '✨', color: 'text-indigo-600' },
  { id: 'loved', label: 'Loved', emoji: '💕', color: 'text-pink-600' },
];

export default function ReflectionModal({ session, streak, onClose }) {
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [reflection, setReflection] = useState('');
  const [showStreakCelebration, setShowStreakCelebration] = useState(streak >= 3);

  const handleMoodToggle = (moodId) => {
    setSelectedMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  const handleComplete = () => {
    // Save reflection data if needed
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Streak Celebration */}
        {showStreakCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-t-3xl text-white text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-4xl mb-2"
            >
              🕊️
            </motion.div>
            <h3 className="text-xl font-bold mb-1">Sacred Streak!</h3>
            <p className="text-yellow-100">{streak} sessions in a row - you've unlocked the Divine Dove!</p>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Sacred Session Complete</h2>
              <p className="text-gray-600">Take a moment to reflect</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Summary */}
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <div className="text-3xl mb-2">🧘‍♀️</div>
            <p className="text-lg font-medium text-gray-800">
              {session.duration_minutes} minute {session.session_type} session
            </p>
            <p className="text-gray-600">Well done on taking time for yourself</p>
          </div>

          {/* Mood Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">How do you feel now?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moodOptions.map(mood => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodToggle(mood.id)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedMoods.includes(mood.id)
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className={`text-sm font-medium ${
                    selectedMoods.includes(mood.id) ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {mood.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Reflection Input */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Any thoughts to capture?</h3>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What came up for you during this session? How was the experience?"
              className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24"
            />
          </div>

          {/* Dove Animation for Streaks */}
          {streak >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200"
            >
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-3"
              >
                🕊️
              </motion.div>
              <p className="text-yellow-800 font-medium">
                The Divine Dove blesses your sacred journey
              </p>
            </motion.div>
          )}

          {/* Complete Button */}
          <Button
            onClick={handleComplete}
            className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl text-lg font-semibold"
          >
            <Star className="w-5 h-5 mr-2" />
            Complete Reflection
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}