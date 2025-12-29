import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Trophy,
  Heart,
  Sun,
  Moon,
  Cloud,
  Zap,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { toast } from 'sonner';

// Mood options with emojis and colors
const moodOptions = [
  { emoji: '😄', label: 'Ecstatic', value: 10, color: 'from-yellow-400 to-orange-500' },
  { emoji: '😊', label: 'Happy', value: 8, color: 'from-green-400 to-emerald-500' },
  { emoji: '🙂', label: 'Content', value: 7, color: 'from-blue-400 to-blue-500' },
  { emoji: '😐', label: 'Neutral', value: 5, color: 'from-gray-400 to-gray-500' },
  { emoji: '😕', label: 'Down', value: 4, color: 'from-yellow-600 to-orange-600' },
  { emoji: '😢', label: 'Sad', value: 3, color: 'from-blue-600 to-purple-600' },
  { emoji: '😰', label: 'Anxious', value: 2, color: 'from-red-400 to-red-500' },
];

// Context/cause options
const contextOptions = [
  { id: 'work', label: '💼 Work/School' },
  { id: 'relationships', label: '❤️ Relationships' },
  { id: 'health', label: '🏥 Health' },
  { id: 'sleep', label: '😴 Sleep' },
  { id: 'weather', label: '🌤️ Weather' },
  { id: 'exercise', label: '🏃 Exercise' },
  { id: 'social', label: '👥 Social' },
  { id: 'personal', label: '✨ Personal Growth' },
];

// AI prompts for journaling
const journalPrompts = [
  "What's one thing you're grateful for today?",
  "What emotion are you feeling most strongly right now, and where do you feel it in your body?",
  "Describe a small moment of peace or joy from your day.",
  "What's one thing that could improve your day tomorrow?",
  "How did you take care of yourself today?",
];

export default function GuidedMoodFlow({ existingEntry, onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    mood_score: existingEntry?.mood_score || 5,
    emotions: existingEntry?.emotions || [],
    activities: existingEntry?.activities || [],
    notes: existingEntry?.notes || '',
  });
  const [selectedMood, setSelectedMood] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (existingEntry) {
      const initialMood = moodOptions.find(m => m.value === existingEntry.mood_score) || moodOptions.find(m => m.value === 5);
      setSelectedMood(initialMood);
    }
    setCurrentPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
  }, [existingEntry]);

  const checkAchievements = async (user) => {
    const newAchievements = [];

    // Get all mood entries from localStorage
    const storedEntries = localStorage.getItem('mood_entries');
    const allEntries = storedEntries ? JSON.parse(storedEntries) : [];
    const userEntries = allEntries.filter(entry => entry.user_id === user.id);

    if (userEntries.length === 0) {
      newAchievements.push({ id: 'first_mood', title: 'First Steps', description: 'You logged your first mood!', icon: '🌱' });
    }
    if (formData.activities.length > 0 && !user?.has_logged_cause) {
      newAchievements.push({ id: 'first_cause', title: 'Insight Unlocked', description: 'You logged a cause for the first time!', icon: '💡'});
    }
    if (formData.notes.length > 20 && !user?.has_journaled) {
      newAchievements.push({ id: 'first_journal', title: 'Reflection Bonus', description: 'You wrote your first reflection!', icon: '✍️'});
    }
    setAchievements(newAchievements);
  };

  const nextStep = async () => {
    if (currentStep === 3) {
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        await checkAchievements(user);
      }
    }
    if (currentStep < 5) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setFormData(prev => ({ ...prev, mood_score: mood.value }));
  };

  const handleIntensityChange = (value) => {
    setFormData(prev => ({ ...prev, mood_score: value[0] }));
  };

  const toggleContext = (contextId) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(contextId)
        ? prev.activities.filter(id => id !== contextId)
        : [...prev.activities, contextId]
    }));
  };

  const handleComplete = async () => {
    try {
      // Get current user
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (!currentUserData) {
        toast.error("Please log in to save your mood entry.");
        return;
      }
      const user = JSON.parse(currentUserData);

      const today = format(new Date(), "yyyy-MM-dd");
      const entryData = {
        ...formData,
        emotions: selectedMood ? [selectedMood.label] : [],
        date: today,
        user_id: user.id,
        created_date: new Date().toISOString()
      };

      // Load existing mood entries
      const storedEntries = localStorage.getItem('mood_entries');
      const allEntries = storedEntries ? JSON.parse(storedEntries) : [];

      if (existingEntry) {
        // Update existing entry
        const updatedEntries = allEntries.map(entry =>
          entry.id === existingEntry.id ? { ...entry, ...entryData } : entry
        );
        localStorage.setItem('mood_entries', JSON.stringify(updatedEntries));
      } else {
        // Create new entry
        const newEntry = {
          ...entryData,
          id: `mood-${Date.now()}`
        };
        allEntries.push(newEntry);
        localStorage.setItem('mood_entries', JSON.stringify(allEntries));
      }

      // Calculate streak
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      let newStreak = (user.last_mood_date === yesterday) ? (user.mood_streak || 0) + 1 : 1;

      // Update user data
      const updatedUser = {
        ...user,
        last_mood_date: today,
        mood_streak: newStreak,
        has_logged_cause: user.has_logged_cause || formData.activities.length > 0,
        has_journaled: user.has_journaled || formData.notes.length > 0,
      };

      localStorage.setItem('aurawell_current_user', JSON.stringify(updatedUser));

      // Update users list
      const users = JSON.parse(localStorage.getItem('aurawell_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('aurawell_users', JSON.stringify(users));
      }

      if (newStreak > 1) toast.success(`${newStreak} day streak! 🔥`);

      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onComplete();
      }, 2500);

    } catch (error) {
      console.error("Error saving mood entry:", error);
      toast.error("Failed to save your mood entry.");
    }
  };

  const getIntensityIcon = () => {
    const score = formData.mood_score;
    if (score >= 8) return <Sun className="w-6 h-6 text-yellow-500" />;
    if (score >= 6) return <Cloud className="w-6 h-6 text-blue-400" />;
    return <Sparkles className="w-6 h-6 text-red-400" />;
  };

  const stepVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  };
  
  const celebrationVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 15 } }
  };

  const steps = [
    // Step 1: Mood Selection
    <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-6 text-center">
      <h3 className="text-lg font-semibold text-gray-800">How are you feeling right now?</h3>
      <div className="grid grid-cols-4 gap-3">
        {moodOptions.map(mood => (
          <motion.button key={mood.label} onClick={() => handleMoodSelect(mood)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-2xl border-2 transition-all ${selectedMood?.label === mood.label ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="text-3xl mb-1">{mood.emoji}</div>
            <div className="text-xs text-gray-600 font-medium">{mood.label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>,

    // Step 2: Intensity
    <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-6 text-center">
      <h3 className="text-lg font-semibold text-gray-800">How intense is this feeling?</h3>
      <div className="space-y-6">
        <motion.div animate={{ scale: [1, 1 + (formData.mood_score / 25), 1] }} className="mb-4">{getIntensityIcon()}</motion.div>
        <div className="text-3xl font-bold text-blue-600">{formData.mood_score}/10</div>
        <Slider value={[formData.mood_score]} onValueChange={handleIntensityChange} max={10} min={1} step={1} className="w-full px-4" />
      </div>
    </motion.div>,

    // Step 3: Context/Cause
    <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-6 text-center">
      <h3 className="text-lg font-semibold text-gray-800">What might be influencing this?</h3>
      <p className="text-gray-500 text-sm">Select all that apply. (This helps with insights!)</p>
      <div className="grid grid-cols-2 gap-3">
        {contextOptions.map(ctx => (
          <motion.button key={ctx.id} onClick={() => toggleContext(ctx.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-xl border text-left transition-all ${formData.activities.includes(ctx.id) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="text-sm font-medium">{ctx.label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>,

    // Step 4: Journaling
    <motion.div key="step4" variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-6 text-center">
      <h3 className="text-lg font-semibold text-gray-800">Care to reflect? (Optional)</h3>
      <div className="space-y-4 text-left">
        <div className="bg-blue-50 p-3 rounded-xl flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700 font-medium">💡 Prompt: {currentPrompt}</p>
        </div>
        <Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
          placeholder="A private space for your thoughts..." className="resize-none h-32 border-gray-200 rounded-xl" />
        {formData.notes.length > 20 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-600 text-sm"><Sparkles className="w-4 h-4" /><span>Great reflection! +5 bonus points</span></motion.div>
        )}
      </div>
    </motion.div>,

    // Step 5: Summary
    <motion.div key="step5" variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-6 text-center">
      <h3 className="text-lg font-semibold text-gray-800">Ready to save your check-in?</h3>
      <Card className="text-left bg-gray-50 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Mood & Intensity:</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedMood?.emoji || '😐'}</span>
            <span className="font-semibold">{formData.mood_score}/10</span>
          </div>
        </div>
        {formData.activities.length > 0 && (
          <div>
            <span className="text-gray-600 block mb-2">Influences:</span>
            <div className="flex flex-wrap gap-1">
              {formData.activities.map(id => {
                const ctx = contextOptions.find(c => c.id === id);
                return <Badge key={id} variant="secondary" className="text-xs">{ctx?.label.split(' ')[1] || id}</Badge>;
              })}
            </div>
          </div>
        )}
        {formData.notes && (
          <div>
            <span className="text-gray-600 block mb-1">Reflection:</span>
            <p className="text-sm text-gray-700 italic">"{formData.notes.slice(0, 100)}..."</p>
          </div>
        )}
      </Card>
      {achievements.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 text-left">
          <div className="flex items-center gap-2 mb-2"><Trophy className="w-5 h-5 text-yellow-600" /><span className="font-semibold text-yellow-800">Achievement Unlocked!</span></div>
          {achievements.map(a => <div key={a.id} className="text-sm text-yellow-700"><span className="mr-2">{a.icon}</span>{a.title}: {a.description}</div>)}
        </motion.div>
      )}
    </motion.div>
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {showCelebration ? (
        <motion.div variants={celebrationVariants} initial="initial" animate="animate" className="text-center p-8">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Wonderful!</h2>
            <p className="text-gray-600">Your mood has been logged ✨</p>
        </motion.div>
      ) : (
        <>
          <div className="p-1 min-h-[350px]">
            <AnimatePresence mode="wait">
              {steps[currentStep - 1]}
            </AnimatePresence>
          </div>

          <div className="p-1 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
               <div className="flex gap-1.5">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-6 h-1.5 rounded-full ${currentStep >= i ? 'bg-blue-500' : 'bg-gray-200'}`}/>
                ))}
               </div>
            </div>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} className="flex-1 rounded-xl">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              )}
              <Button onClick={currentStep === 5 ? handleComplete : nextStep} disabled={currentStep === 1 && !selectedMood}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold">
                {currentStep === 5 ? <><CheckCircle className="w-4 h-4 mr-2" />Save Entry</> : <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </div>
             {onCancel && <Button variant="ghost" onClick={onCancel} className="w-full mt-2 text-gray-500">Cancel</Button>}
          </div>
        </>
      )}
    </div>
  );
}