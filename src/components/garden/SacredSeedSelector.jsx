import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Star, X } from 'lucide-react';
import { MindGardenPlant } from '@/api/entities';

const sacredSeedsData = {
  glowing_willow: { name: 'Glowing Willow', color: 'celestial_blue' },
  crystal_lotus: { name: 'Crystal Lotus', color: 'moonpetal_pink' },
  starfall_tree: { name: 'Starfall Tree', color: 'starlight' },
  golden_bonsai: { name: 'Golden Bonsai', color: 'sunfire_orange' },
};

export default function SacredSeedSelector({ sacredSeeds, onPlant, onCancel }) {
  const [selectedSeed, setSelectedSeed] = useState(sacredSeeds[0] || null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlantSeed = async () => {
    if (!selectedSeed) return;
    setIsLoading(true);
    try {
      const newPlant = {
        tree_type: selectedSeed,
        leaf_color: sacredSeedsData[selectedSeed]?.color || 'starlight',
        growth_stage: 0,
        activities_logged: 0,
        is_active: true,
        position_x: Math.random() * 80 + 10,
        position_y: Math.random() * 50 + 10,
        is_sacred: true,
      };
      await MindGardenPlant.create(newPlant);
      onPlant();
    } catch (error) {
      console.error("Failed to plant sacred seed:", error);
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className="absolute inset-0 bg-purple-900/30 backdrop-blur-sm z-30 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <Card className="bg-gradient-to-br from-indigo-800 via-purple-900 to-black text-white shadow-2xl rounded-3xl border-purple-500/50">
          <CardHeader>
            <button onClick={onCancel} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <CardTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Star className="text-yellow-300"/> Plant a Sacred Seed
            </CardTitle>
            <p className="text-center text-purple-300/80 text-sm">
              Choose a rare seed to grow in your grove.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-5">
            {sacredSeeds.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-purple-300 mb-3">Your Unlocked Seeds:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sacredSeeds.map(seedId => {
                    const seedInfo = sacredSeedsData[seedId] || { name: seedId, color: 'starlight' };
                    return (
                      <button
                        key={seedId}
                        onClick={() => setSelectedSeed(seedId)}
                        className={`p-3 text-center rounded-2xl border-2 transition-all duration-200 ${
                          selectedSeed === seedId
                            ? 'border-yellow-400 bg-white/20 scale-105 shadow-lg' 
                            : 'border-transparent bg-white/10 hover:bg-white/15'
                        }`}
                      >
                        <div className="font-bold">{seedInfo.name}</div>
                        <div className={`w-4 h-4 rounded-full mx-auto mt-2 bg-${seedInfo.color.split('_')[0]}-400`}></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-purple-300/80">
                <p>You haven't unlocked any Sacred Seeds yet.</p>
                <p className="text-sm">Complete streaks and challenges to earn them!</p>
              </div>
            )}
          </CardContent>
          
          <div className="p-4 border-t border-purple-500/30">
            <Button
              onClick={handlePlantSeed}
              disabled={isLoading || !selectedSeed}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Sprout className="w-5 h-5 mr-2" />
              {isLoading ? 'Planting...' : 'Plant Your Seed'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}