import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, Wind, BookOpen, Sparkles, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * LowRiskExerciseSuggestion - Gentle exercise suggestions for mild distress
 *
 * Design principles:
 * - Encouraging, not alarming
 * - Helpful, not intrusive
 * - Easy to dismiss
 * - Offers practical exercises
 * - Calming visual design
 */
export default function LowRiskExerciseSuggestion({ onDismiss }) {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300);
  };

  const handleExerciseClick = (path) => {
    setIsVisible(false);
    navigate(path);
  };

  const exercises = [
    {
      icon: Wind,
      title: '5-Minute Breathing',
      description: 'Calm your mind with guided breathing',
      color: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      path: '/Meditations'
    },
    {
      icon: Sparkles,
      title: 'Grounding Exercise',
      description: 'Connect with the present moment',
      color: 'from-teal-50 to-emerald-50',
      borderColor: 'border-teal-300',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      path: '/Meditations'
    },
    {
      icon: BookOpen,
      title: 'Journal Your Feelings',
      description: 'Express what you\'re experiencing',
      color: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-300',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      path: '/Journal'
    },
    {
      icon: Headphones,
      title: 'Calming Audio',
      description: 'Listen to soothing sounds',
      color: 'from-violet-50 to-purple-50',
      borderColor: 'border-violet-300',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      path: '/Meditations'
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Card className="bg-gradient-to-r from-blue-50 via-teal-50 to-cyan-50 border-2 border-blue-200 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-900 mb-1">
                        Take a moment for yourself
                      </h4>
                      <p className="text-sm text-blue-800">
                        These exercises might help you feel better
                      </p>
                    </div>

                    {/* Close button */}
                    <button
                      onClick={handleDismiss}
                      className="flex-shrink-0 p-1 text-blue-400 hover:text-blue-600 rounded transition-colors ml-2"
                      aria-label="Dismiss"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Exercise Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {exercises.map((exercise, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleExerciseClick(exercise.path)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          text-left p-4 rounded-xl border-2 ${exercise.borderColor}
                          bg-gradient-to-br ${exercise.color}
                          hover:shadow-md transition-all
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${exercise.iconBg} rounded-lg flex-shrink-0`}>
                            <exercise.icon className={`w-5 h-5 ${exercise.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-sm mb-0.5">
                              {exercise.title}
                            </h5>
                            <p className="text-xs text-gray-700">
                              {exercise.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Optional: View All Link */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleDismiss}
                      className="text-sm text-blue-700 hover:text-blue-800 font-medium underline"
                    >
                      I'm okay, thanks
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}