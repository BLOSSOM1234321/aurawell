import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, Sparkles, Wind, BookOpen, Headphones, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * MediumRiskBanner - Exercise suggestions for moderate distress
 *
 * Design principles:
 * - Private (only user sees it)
 * - Non-intrusive but supportive
 * - Easy to dismiss
 * - Offers practical exercises
 * - Warm, caring visual design
 */
export default function MediumRiskBanner({ onDismiss, onGrounding, onViewResources }) {
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

  const handleViewResources = () => {
    setIsVisible(false);
    if (onViewResources) onViewResources();
  };

  const exercises = [
    {
      icon: Wind,
      title: 'Deep Breathing',
      description: 'Calm your nervous system',
      color: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-300',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      path: '/Meditations'
    },
    {
      icon: Sparkles,
      title: 'Grounding Exercise',
      description: 'Reconnect with the present',
      color: 'from-rose-50 to-pink-50',
      borderColor: 'border-rose-300',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      path: '/Meditations'
    },
    {
      icon: BookOpen,
      title: 'Express Yourself',
      description: 'Write down your thoughts',
      color: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-300',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      path: '/Journal'
    },
    {
      icon: Headphones,
      title: 'Soothing Sounds',
      description: 'Listen to calming audio',
      color: 'from-indigo-50 to-blue-50',
      borderColor: 'border-indigo-300',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
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
          <Card className="bg-gradient-to-r from-orange-50 via-rose-50 to-purple-50 border-2 border-orange-300 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 p-3 bg-orange-100 rounded-full">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-orange-900 mb-1">
                        We're here for you
                      </h4>
                      <p className="text-sm text-orange-800">
                        Try one of these exercises to help you feel better
                      </p>
                    </div>

                    {/* Close button */}
                    <button
                      onClick={handleDismiss}
                      className="flex-shrink-0 p-1 text-orange-400 hover:text-orange-600 rounded transition-colors ml-2"
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

                  {/* Additional Support Option */}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={handleViewResources}
                      className="text-sm text-orange-700 hover:text-orange-800 font-medium underline"
                    >
                      <MessageCircle className="w-4 h-4 inline mr-1" />
                      Need more support?
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="text-sm text-gray-600 hover:text-gray-700"
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