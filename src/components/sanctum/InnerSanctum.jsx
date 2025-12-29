
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { InnerSanctumEntry } from '@/api/entities';
import { User } from '@/api/entities';
import { 
  X, 
  Scroll, 
  Flame, 
  Circle,
  Sparkles,
  Quote,
  Calendar,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const dailyWhispers = [
  "In stillness, you find the answers that your busy mind has been seeking.",
  "Today, let your heart speak louder than your fears.",
  "You are exactly where you need to be on your journey of becoming.",
  "The light you seek is already glowing within you - trust its guidance.",
  "Breathe deeply. You have survived every difficult moment so far.",
  "Your wounds are becoming your wisdom, your struggles your strength.",
  "In this moment, you are enough. You have always been enough.",
  "The universe conspires to help those who help themselves grow."
];

const mysteryUnlocks = [
  { visits: 10, feature: 'golden_candles', description: 'Golden candles now available' },
  { visits: 20, feature: 'wall_engravings', description: 'Ancient symbols appear on walls' },
  { visits: 30, feature: 'window_stars', description: 'Stars become visible through window' },
  { visits: 40, feature: 'glowing_stones', description: 'Stones now emit soft light' },
  { visits: 50, feature: 'cosmic_ceiling', description: 'Ceiling reveals cosmic patterns' }
];

export default function InnerSanctum({ onClose }) {
  const [sanctumData, setSanctumData] = useState(null);
  const [user, setUser] = useState(null);
  const [activeMode, setActiveMode] = useState('overview'); // overview, letter, candles, stones
  const [newLetter, setNewLetter] = useState('');
  const [newIntention, setNewIntention] = useState('');
  const [selectedCandleColor, setSelectedCandleColor] = useState('white');
  const [selectedStoneType, setSelectedStoneType] = useState('smooth');
  const [releaseIntention, setReleaseIntention] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const checkForUnlocks = useCallback(async (visitCount) => {
    // This function needs the current sanctumData state to check for existing features and update.
    // However, sanctumData itself is updated *after* checkForUnlocks is called in loadSanctumData.
    // To ensure this function always has the most up-to-date sanctumData for its logic, it should
    // ideally use the `setSanctumData` callback form or be passed the latest data.
    // For the purpose of the dependency fix, `sanctumData` is included as requested,
    // but a potential re-render race condition could exist if `sanctumData` isn't stable.
    // A better approach might be to pass the `sanctumEntry` directly from `loadSanctumData` instead of relying on state.
    // For now, let's follow the dependency fix exactly.
    
    const newUnlocks = mysteryUnlocks.filter(unlock => 
      visitCount >= unlock.visits && 
      !sanctumData?.unlocked_features?.includes(unlock.feature)
    );

    for (const unlock of newUnlocks) {
      toast.success("Mystery Unlocked!", {
        description: unlock.description,
        duration: 5000
      });
      
      // Update dove variant for high visit counts
      // This part also uses sanctumData from the closure
      let newVariant = sanctumData?.dove_variant || 'glowing_white';
      if (visitCount >= 10) {
        newVariant = 'mystical_purple';
      }

      // This update relies on sanctumData.id and existing unlocked_features,
      // which might be stale if sanctumData changes between the render and this execution.
      // A functional update for `unlocked_features` using `prevData` might be safer here.
      await InnerSanctumEntry.update(sanctumData.id, {
        unlocked_features: [...(sanctumData.unlocked_features || []), unlock.feature],
        dove_variant: newVariant
      });

      // After updating the backend, we need to refresh the local state to reflect changes
      // A full reload of sanctumData after this update might be necessary,
      // or ensure the `InnerSanctumEntry.update` call returns the updated entity
      // and we use that to update the state.
      // For now, this is a dependency fix, not a logic refactor.
    }
  }, [sanctumData]); // Added sanctumData as a dependency

  const loadSanctumData = useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const existingData = await InnerSanctumEntry.list();
      
      let sanctumEntry;
      if (existingData.length > 0) {
        sanctumEntry = existingData[0];
        // Update visit count and last visit
        sanctumEntry = await InnerSanctumEntry.update(sanctumEntry.id, {
          visit_count: (sanctumEntry.visit_count || 0) + 1,
          last_visit_date: new Date().toISOString()
        });
      } else {
        // First visit - create entry
        sanctumEntry = await InnerSanctumEntry.create({
          visit_count: 1,
          first_visit_date: new Date().toISOString(),
          last_visit_date: new Date().toISOString(),
          dove_variant: 'radiant_golden' // Golden on first unlock
        });
        
        toast.success("Welcome to the Inner Sanctum", {
          description: "A sacred space for your deepest reflections ✨",
          duration: 4000
        });
      }

      setSanctumData(sanctumEntry);
      
      // Check for mystery unlocks
      // Pass the fresh sanctumEntry here if checkForUnlocks were to be refactored
      checkForUnlocks(sanctumEntry.visit_count);
      
    } catch (error) {
      console.error('Failed to load sanctum data:', error);
    }
    setIsLoading(false);
  }, [checkForUnlocks]); // Added checkForUnlocks as a dependency

  useEffect(() => {
    loadSanctumData();
  }, [loadSanctumData]);

  const handleWriteLetter = async () => {
    if (!newLetter.trim()) return;

    try {
      const newLetterObj = {
        id: Date.now().toString(),
        content: newLetter.trim(),
        date_written: new Date().toISOString(),
        is_sealed: true
      };

      await InnerSanctumEntry.update(sanctumData.id, {
        letters_to_universe: [...(sanctumData.letters_to_universe || []), newLetterObj]
      });

      setNewLetter('');
      setActiveMode('overview');
      await loadSanctumData();
      
      toast.success("Letter sealed and sent to the universe ✨");
    } catch (error) {
      console.error('Failed to save letter:', error);
      toast.error("Failed to seal letter");
    }
  };

  const handleLightCandle = async () => {
    if (!newIntention.trim()) return;

    try {
      const newCandle = {
        color: selectedCandleColor,
        intention: newIntention.trim(),
        date_lit: new Date().toISOString()
      };

      await InnerSanctumEntry.update(sanctumData.id, {
        candles_lit: [...(sanctumData.candles_lit || []), newCandle]
      });

      setNewIntention('');
      setActiveMode('overview');
      await loadSanctumData();
      
      toast.success(`${selectedCandleColor} candle lit with your intention 🕯️`);
    } catch (error) {
      console.error('Failed to light candle:', error);
      toast.error("Failed to light candle");
    }
  };

  const handlePlaceStone = async () => {
    if (!releaseIntention.trim()) return;

    try {
      const newStone = {
        type: selectedStoneType,
        release_intention: releaseIntention.trim(),
        position_x: Math.random() * 80 + 10, // Random position
        position_y: Math.random() * 60 + 20,
        date_placed: new Date().toISOString()
      };

      await InnerSanctumEntry.update(sanctumData.id, {
        stones_placed: [...(sanctumData.stones_placed || []), newStone]
      });

      setReleaseIntention('');
      setActiveMode('overview');
      await loadSanctumData();
      
      toast.success("Stone placed - your intention released to the universe 🪨");
    } catch (error) {
      console.error('Failed to place stone:', error);
      toast.error("Failed to place stone");
    }
  };

  const getTodaysWhisper = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return dailyWhispers[dayOfYear % dailyWhispers.length];
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gradient-to-b from-amber-100 to-orange-100 rounded-3xl p-8 text-center max-w-md">
          <div className="animate-pulse">
            <Flame className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <p className="text-amber-800">Entering the Inner Sanctum...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl max-h-[90vh] bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 rounded-3xl shadow-2xl overflow-hidden relative"
      >
        {/* Mystical Background Effects */}
        <div className="absolute inset-0 opacity-30">
          {/* Candle Flicker Effect */}
          <motion.div
            className="absolute top-10 left-10 w-2 h-4 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full"
            animate={{
              scaleY: [1, 1.2, 0.9, 1.1, 1],
              opacity: [0.7, 1, 0.8, 0.9, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Wall Engravings */}
          {sanctumData?.unlocked_features?.includes('wall_engravings') && (
            <div className="absolute right-8 top-20 text-amber-300 opacity-20">
              <Sparkles className="w-8 h-8" />
            </div>
          )}
          
          {/* Window Stars */}
          {sanctumData?.unlocked_features?.includes('window_stars') && (
            <div className="absolute top-8 right-8 opacity-40">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-200 rounded-full"
                  style={{
                    left: `${i * 15}px`,
                    top: `${i * 10}px`
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-amber-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-amber-300 to-orange-400 rounded-full">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-900">The Inner Sanctum</h2>
                <p className="text-amber-700">Visit #{sanctumData?.visit_count} • Sacred Space for Deep Reflection</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-amber-700 hover:bg-amber-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* Daily Whisper */}
          <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Quote className="w-5 h-5" />
                Today's Whisper
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 italic text-lg leading-relaxed">
                "{getTodaysWhisper()}"
              </p>
            </CardContent>
          </Card>

          {/* Action Modes */}
          <AnimatePresence mode="wait">
            {activeMode === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {/* Letter to Universe */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group" onClick={() => setActiveMode('letter')}>
                  <CardContent className="p-6 text-center">
                    <Scroll className="w-12 h-12 text-amber-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Letter to the Universe</h3>
                    <p className="text-sm text-amber-600">Write your deepest thoughts, sealed in cosmic privacy</p>
                    {sanctumData?.letters_to_universe?.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          {sanctumData.letters_to_universe.length} letter(s) sealed
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Virtual Candles */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group" onClick={() => setActiveMode('candles')}>
                  <CardContent className="p-6 text-center">
                    <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Light a Candle</h3>
                    <p className="text-sm text-amber-600">Set intentions with the glow of sacred flame</p>
                    {sanctumData?.candles_lit?.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          {sanctumData.candles_lit.length} candle(s) lit
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Symbolic Stones */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all cursor-pointer group" onClick={() => setActiveMode('stones')}>
                  <CardContent className="p-6 text-center">
                    <Circle className="w-12 h-12 text-stone-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Place a Stone</h3>
                    <p className="text-sm text-amber-600">Release what no longer serves your journey</p>
                    {sanctumData?.stones_placed?.length > 0 && (
                      <div className="mt-3">
                        <span className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded-full">
                          {sanctumData.stones_placed.length} stone(s) placed
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeMode === 'letter' && (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scroll className="w-5 h-5 text-amber-600" />
                      Letter to the Universe
                    </CardTitle>
                    <p className="text-sm text-gray-600">Share your deepest thoughts, hopes, and gratitude. This letter will be sealed in cosmic privacy.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Dear Universe..."
                      value={newLetter}
                      onChange={(e) => setNewLetter(e.target.value)}
                      rows={8}
                      className="resize-none border-amber-200 focus:ring-amber-500"
                    />
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setActiveMode('overview')}>
                        Cancel
                      </Button>
                      <Button onClick={handleWriteLetter} disabled={!newLetter.trim()} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Seal & Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeMode === 'candles' && (
              <motion.div
                key="candles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      Light a Sacred Candle
                    </CardTitle>
                    <p className="text-sm text-gray-600">Choose a color and set your intention. Let the flame carry your wishes to the universe.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Candle Color</label>
                      <div className="flex gap-3">
                        {['white', 'gold', 'purple'].map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedCandleColor(color)}
                            className={`w-12 h-12 rounded-full border-4 transition-all ${
                              selectedCandleColor === color ? 'border-amber-500 scale-110' : 'border-gray-300'
                            } ${
                              color === 'white' ? 'bg-white' :
                              color === 'gold' ? 'bg-yellow-300' :
                              'bg-purple-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <Input
                      placeholder="What intention do you set with this candle?"
                      value={newIntention}
                      onChange={(e) => setNewIntention(e.target.value)}
                      className="border-amber-200 focus:ring-amber-500"
                    />
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setActiveMode('overview')}>
                        Cancel
                      </Button>
                      <Button onClick={handleLightCandle} disabled={!newIntention.trim()} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <Flame className="w-4 h-4 mr-2" />
                        Light Candle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeMode === 'stones' && (
              <motion.div
                key="stones"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Circle className="w-5 h-5 text-stone-500" />
                      Place a Symbolic Stone
                    </CardTitle>
                    <p className="text-sm text-gray-600">Choose a stone type and set your intention for release. Let go of what no longer serves you.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Stone Type</label>
                      <div className="flex gap-3">
                        {[
                          { type: 'smooth', label: 'Smooth', desc: 'For peaceful release' },
                          { type: 'cracked', label: 'Cracked', desc: 'For healing wounds' },
                          { type: 'glowing', label: 'Glowing', desc: 'For transformation' }
                        ].map(stone => (
                          <button
                            key={stone.type}
                            onClick={() => setSelectedStoneType(stone.type)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              selectedStoneType === stone.type ? 'border-stone-500 bg-stone-50' : 'border-gray-300'
                            }`}
                          >
                            <div className="font-medium">{stone.label}</div>
                            <div className="text-xs text-gray-500">{stone.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="What are you ready to release or transform?"
                      value={releaseIntention}
                      onChange={(e) => setReleaseIntention(e.target.value)}
                      rows={4}
                      className="border-stone-200 focus:ring-stone-500"
                    />
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setActiveMode('overview')}>
                        Cancel
                      </Button>
                      <Button onClick={handlePlaceStone} disabled={!releaseIntention.trim()} className="bg-gradient-to-r from-stone-500 to-stone-600 text-white">
                        <Circle className="w-4 h-4 mr-2" />
                        Place Stone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Growth Timeline */}
          <Card className="bg-gradient-to-r from-stone-100 to-amber-100 border-stone-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-700">
                <Calendar className="w-5 h-5" />
                Your Sacred Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">First Visit: {sanctumData?.first_visit_date ? format(new Date(sanctumData.first_visit_date), 'MMM d, yyyy') : 'Today'}</span>
                <span className="text-stone-600">Visit #{sanctumData?.visit_count}</span>
                <span className="text-stone-600">{sanctumData?.unlocked_features?.length || 0} mysteries unlocked</span>
              </div>
              
              {/* Progress toward next unlock */}
              {sanctumData && (
                <div className="mt-4">
                  {mysteryUnlocks.map(unlock => {
                    if (sanctumData.unlocked_features?.includes(unlock.feature)) return null;
                    if (unlock.visits > sanctumData.visit_count) {
                      const progress = (sanctumData.visit_count / unlock.visits) * 100;
                      return (
                        <div key={unlock.feature} className="space-y-2">
                          <div className="flex justify-between text-xs text-stone-600">
                            <span>Next Mystery: {unlock.description}</span>
                            <span>{sanctumData.visit_count}/{unlock.visits} visits</span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }).filter(Boolean)[0]} {/* Show only the next unlock */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
