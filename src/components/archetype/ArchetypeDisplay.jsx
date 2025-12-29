import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Book, Lightbulb, Repeat, Calendar, Star, CheckCircle } from 'lucide-react';
import { differenceInDays, addDays, formatDistanceToNow } from 'date-fns';
import ArchetypePromptModal from './ArchetypePromptModal';

export default function ArchetypeDisplay({ user, archetypeData, onCycleEnd }) {
  const [activePrompt, setActivePrompt] = useState(null);

  const cycleProgress = useMemo(() => {
    if (!user.archetype_start_date) return 0;
    const startDate = new Date(user.archetype_start_date);
    const totalDuration = 30;
    const daysPassed = differenceInDays(new Date(), startDate) + 1; // +1 because day 1 is the start date
    return Math.min(100, (daysPassed / totalDuration) * 100);
  }, [user.archetype_start_date]);

  const currentDay = useMemo(() => {
    if (!user.archetype_start_date) return 1;
    return Math.min(30, differenceInDays(new Date(), new Date(user.archetype_start_date)) + 1);
  }, [user.archetype_start_date]);

  const daysRemaining = useMemo(() => {
    if (!user.archetype_start_date) return '30 days';
    const endDate = addDays(new Date(user.archetype_start_date), 30);
    return formatDistanceToNow(endDate, { addSuffix: true });
  }, [user.archetype_start_date]);

  const todaysExercise = useMemo(() => {
    return archetypeData.dailyExercises?.[currentDay] || null;
  }, [archetypeData, currentDay]);

  const completedExercises = useMemo(() => {
    const completed = [];
    Object.keys(archetypeData.dailyExercises || {}).forEach(day => {
      if (parseInt(day) <= currentDay) {
        completed.push(parseInt(day));
      }
    });
    return completed;
  }, [archetypeData, currentDay]);
  
  const showPrompt = (type) => {
    const contentArray = type === 'prompt' ? archetypeData.prompts : archetypeData.challenges;
    const content = contentArray[Math.floor(Math.random() * contentArray.length)];
    setActivePrompt({ type, content });
  };

  const showDailyExercise = () => {
    if (todaysExercise) {
      setActivePrompt({ 
        type: todaysExercise.type, 
        content: todaysExercise.content,
        title: todaysExercise.title,
        isDaily: true
      });
    }
  };
  
  const handleCompletePrompt = () => {
    // In a real app, you would save this completion to the user's data
    setActivePrompt(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <AnimatePresence>
        {activePrompt && (
          <ArchetypePromptModal
            title={activePrompt.title || (activePrompt.type === 'prompt' ? "Journal Prompt" : activePrompt.type === 'exercise' ? "Daily Exercise" : "Daily Challenge")}
            content={activePrompt.content}
            icon={activePrompt.type === 'prompt' ? Book : Award}
            color={archetypeData.color}
            onClose={() => setActivePrompt(null)}
            onComplete={handleCompletePrompt}
          />
        )}
      </AnimatePresence>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Your Archetype: {archetypeData.name}</h1>
        <p className="text-gray-600 mt-2">{archetypeData.description}</p>
        <Badge className="mt-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2">
          Day {currentDay} of 30
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Mirror Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative flex items-center justify-center p-8"
        >
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 80px 20px ${archetypeData.auraColor}` }}></div>
          <div className={`relative w-64 h-64 rounded-full bg-gradient-to-br ${archetypeData.color} flex items-center justify-center shadow-2xl overflow-hidden`}>
            {/* Progress fill overlay */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent transition-all duration-1000"
              style={{ height: `${100 - cycleProgress}%` }}
            />
            <archetypeData.symbol className="relative z-10 w-32 h-32 text-white/90" />
            {/* Completion indicator */}
            {cycleProgress >= 100 && (
              <div className="absolute top-4 right-4 z-20">
                <CheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Progress & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your 30-Day Journey</span>
                <span className="text-2xl font-bold text-purple-600">{currentDay}/30</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={cycleProgress} className="w-full h-3 mb-4" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Started your journey</span>
                <span>New archetype unlocked {daysRemaining}</span>
              </div>
              {cycleProgress >= 100 && (
                <Button onClick={onCycleEnd} className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Repeat className="w-4 h-4 mr-2" />
                  Complete Journey & Choose New Archetype
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Today's Special Exercise */}
          {todaysExercise && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-800">
                  <Star className="w-6 h-6" />
                  Today's Special {todaysExercise.type === 'exercise' ? 'Exercise' : 'Challenge'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-lg text-amber-900 mb-2">{todaysExercise.title}</h3>
                <p className="text-amber-800 mb-4">{todaysExercise.content}</p>
                <Button
                  onClick={showDailyExercise}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
                >
                  Begin Today's {todaysExercise.type === 'exercise' ? 'Exercise' : 'Challenge'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Daily Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                Daily Reflections
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Button onClick={() => showPrompt('prompt')} variant="outline" className="h-20 flex-col gap-1 border-purple-200 hover:bg-purple-50">
                <Book className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-purple-700">Journal Prompt</span>
              </Button>
              <Button onClick={() => showPrompt('challenge')} variant="outline" className="h-20 flex-col gap-1 border-teal-200 hover:bg-teal-50">
                <Award className="w-6 h-6 text-teal-600" />
                <span className="font-semibold text-teal-700">Daily Challenge</span>
              </Button>
            </CardContent>
          </Card>

          {/* Milestone Progress */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Key Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(archetypeData.dailyExercises || {}).map(([day, exercise]) => (
                  <div key={day} className={`p-3 rounded-xl text-center transition-all ${
                    parseInt(day) <= currentDay 
                      ? 'bg-green-100 border-2 border-green-300 text-green-800' 
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-500'
                  }`}>
                    <div className="font-bold text-lg">Day {day}</div>
                    <div className="text-xs mt-1">{exercise.title}</div>
                    {parseInt(day) <= currentDay && (
                      <CheckCircle className="w-4 h-4 mx-auto mt-2 text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}